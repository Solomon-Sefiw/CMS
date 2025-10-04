import {
  Alert,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Fragment, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  JobGradeDto,
  useGetJobGradesListQuery,
  useGetJobGradesCountPerApprovalStatusQuery,
} from "../../../../app/api/HCMSApi";
import { ApprovalStatus, JobGradeRomanId } from "../../../../app/api/enums";
import { Pagination } from "../../../../components/Pagination";
import { JobGradeRequestApprovalButton } from "../JobGradeRequestApprovalButton";
import { JobGradeDetail } from "../JobGradeDetail";
import { JobGradeDialog } from "../JobGradeDialog";
import { usePermission } from "../../../../hooks";
import { UpdateJobGradeDialog } from "../UpdateJobGradeDialog";
export const DraftJobGrade = () => {
  const permissions = usePermission();
  const [pagination, setPagination] = useState<{
    pageNumber: number;
    pageSize?: number;
  }>({
    pageNumber: 0,
    pageSize: 10,
  });
  const { data: counts, isLoading: isCountsLoading } =
    useGetJobGradesCountPerApprovalStatusQuery();
  const {
    data: items,
    isLoading: isListLoading,
    error: Error,
  } = useGetJobGradesListQuery({
    pageNumber: pagination.pageNumber + 1,
    pageSize: pagination.pageSize,
    status: ApprovalStatus.Draft,
  });
  const [OpenDialog, setOpenDialog] = useState<boolean>(false);

  const [updatedJobGrade, setUpdatedJobGrade] = useState<
    JobGradeDto | undefined
  >(undefined);
  const [ViewDetailJobGrade, setViewDetailJobGrade] = useState<
    JobGradeDto | undefined
  >(undefined);
  const [OpenViewDetail, setOpenViewDetail] = useState<boolean>(false);

  const [selectedJobGrade, setSelectedJobGrade] = useState<
    number | undefined
  >();
  const [OpenSubmitDialog, setOpenSubmitDialog] = useState<boolean>(false);
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();
  const filteredJobGrades = searchQuery
    ? (items?.items || []).filter((option) =>
        option.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items?.items || [];
  const showNoMatchingAlert = searchQuery && filteredJobGrades.length === 0;

  const ViewDetail = (jobGrade: JobGradeDto | undefined) => {
    setOpenViewDetail(true);
    setViewDetailJobGrade(jobGrade);
  };
  const UpdateJobGrade = (jobGrade: JobGradeDto | undefined) => {
    setOpenDialog(true);
    setUpdatedJobGrade(jobGrade);
  };
  const SubmitJobGrade = (Id: number | undefined) => {
    setSelectedJobGrade(Id);
    setOpenSubmitDialog(true);
  };
  const isLoading = isCountsLoading || isListLoading;

  return (
    <Box>
      {!isLoading && !!counts?.drafts && (
        <Paper>
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    JobGrade Roman ID
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Base Salary</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Step Coefficient
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    CeilingSalary
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      verticalAlign: "middle",
                      whiteSpace: "nowrap", // Prevents header text from wrapping
                      padding: "16px", // Optional: match other columns’ padding
                    }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(filteredJobGrades || []).map((item: JobGradeDto) => (
                  <Fragment key={item.jobGradeId}>
                    <TableRow hover={false} key={item.jobGradeId}>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.jobGradeRomanId !== undefined
                          ? JobGradeRomanId[item.jobGradeRomanId]
                          : "N/A"}{" "}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.name}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.baseSalary}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.stepCoefficient}
                        {"%"}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.ceilingSalary}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.description}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                            alignItems: "flex-start",
                          }}
                        >
                          {item.jobGradeId &&
                            item.approvalStatus === ApprovalStatus.Draft && (
                              <JobGradeRequestApprovalButton
                                id={item.jobGradeId}
                              />
                            )}

                          {(item.approvalStatus === ApprovalStatus.Draft ||
                            item.approvalStatus ===
                              ApprovalStatus.Rejected) && (
                            <Button
                              size="small"
                              onClick={() => UpdateJobGrade(item)}
                              disabled={!permissions.canCreateUpdateSetup}
                            >
                              Edit
                            </Button>
                          )}

                          <Button size="small" onClick={() => ViewDetail(item)}>
                            View Detail
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      {showNoMatchingAlert && (
        <Alert severity="info" sx={{ m: 2 }}>
          No Draft Job Grade found with name {searchQuery}!!
        </Alert>
      )}
      <Pagination
        pageNumber={pagination.pageNumber}
        pageSize={pagination.pageSize}
        onChange={setPagination}
        totalRowsCount={counts?.drafts}
        rowsPerPageOptions={[10, 20, 50]}
      />

      {!isLoading && !counts?.drafts && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Typography> No Data Available</Typography>
        </Box>
      )}
      {OpenViewDetail && ViewDetailJobGrade && (
        <JobGradeDetail
          onClose={() => {
            setOpenViewDetail(false);
          }}
          JobGrades={ViewDetailJobGrade}
        />
      )}
      {OpenDialog && updatedJobGrade && (
        <UpdateJobGradeDialog
          onClose={() => {
            setOpenDialog(false);
          }}
          JobGrade={updatedJobGrade}
        />
      )}
      {OpenSubmitDialog && (
        <JobGradeRequestApprovalButton id={selectedJobGrade} />
      )}
    </Box>
  );
};
