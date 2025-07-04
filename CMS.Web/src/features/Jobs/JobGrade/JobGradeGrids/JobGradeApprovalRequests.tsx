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
import { useOutletContext } from "react-router-dom";

import { Fragment, useState } from "react";
import {
  JobRoleDto,
  useGetJobGradesListQuery,
  useGetJobGradesCountPerApprovalStatusQuery,
  JobGradeDto,
} from "../../../../app/api/HCMSApi";
import { ApprovalStatus, JobGradeRomanId } from "../../../../app/api/enums";
import { Pagination } from "../../../../components/Pagination";
import { JobGradeRequestApprovalButton } from "../JobGradeRequestApprovalButton";
import { JobGradeApproveOrRejectRequestButton } from "../JobGradeApproveOrRejectRequestButton";
import { JobGradeDetail } from "../JobGradeDetail";
import { usePermission } from "../../../../hooks";

export const JobGradeApprovalRequests = () => {
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
  const [dialogOpened, setDialogOpened] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [selectedIdforDetail, setSelectedIdforDetail] = useState<number | null>(
    null
  );
  const [JobRoleDetailVew, setJobRoleDetailView] = useState<JobGradeDto>();
  const { data: items, isLoading: isListLoading } = useGetJobGradesListQuery({
    pageNumber: pagination.pageNumber + 1,
    pageSize: pagination.pageSize,
    status: ApprovalStatus.Submitted,
  });

  const [ViewDetailJobGrade, setViewDetailJobGrade] = useState<
    JobGradeDto | undefined
  >(undefined);
  const [OpenViewDetail, setOpenViewDetail] = useState<boolean>(false);

  const { searchQuery } = useOutletContext<{ searchQuery: string }>();

  const filteredJobGrade = searchQuery
    ? (items?.items || []).filter((option) =>
        option.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items?.items || [];
  const isLoading = isCountsLoading || isListLoading;
  const showNoMatchingAlert = searchQuery && filteredJobGrade.length === 0;

  const handleDialogOpen = (id: number) => {
    setDialogOpened(true);
    setSelectedId(id);
  };
  const handleViewDetailDialog = (item: JobRoleDto) => {
    setOpenViewDetail(true);
    setJobRoleDetailView(item);
  };
  const handleDialogClose = () => {
    setDialogOpened(false);
    setSelectedId(null);
  };
  const handleDetailViewClose = () => {
    setOpenViewDetail(false);
    setSelectedIdforDetail(null);
  };
  const ViewDetail = (jobGrade: JobGradeDto | undefined) => {
    setOpenViewDetail(true);
    setViewDetailJobGrade(jobGrade);
  };
  return (
    <Box>
      {!isLoading && !!counts?.approvalRequests && (
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
                  <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(filteredJobGrade || []).map((item) => (
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
                          {item.jobGradeId && (
                            <>
                              {item.approvalStatus === ApprovalStatus.Draft && (
                                <JobGradeRequestApprovalButton
                                  id={item.jobGradeId}
                                />
                              )}
                              {item.approvalStatus ===
                                ApprovalStatus.Submitted && (
                                <JobGradeApproveOrRejectRequestButton
                                  id={item.jobGradeId}
                                />
                              )}
                            </>
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
          No Requested Job Grade found with name {searchQuery}!!
        </Alert>
      )}
      <Pagination
        pageNumber={pagination.pageNumber}
        pageSize={pagination.pageSize}
        onChange={setPagination}
        totalRowsCount={counts?.approvalRequests}
        rowsPerPageOptions={[10, 20, 50]}
      />
      {OpenViewDetail && ViewDetailJobGrade && (
        <JobGradeDetail
          onClose={() => {
            setOpenViewDetail(false);
          }}
          JobGrades={ViewDetailJobGrade}
        />
      )}
      {!isLoading && !counts?.approvalRequests && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Typography> No Data Available</Typography>
        </Box>
      )}
    </Box>
  );
};
