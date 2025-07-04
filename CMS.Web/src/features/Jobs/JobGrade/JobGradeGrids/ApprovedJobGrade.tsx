import {
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
  Alert,
} from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { Fragment, useState } from "react";
import {
  JobGradeDto,
  useGetJobGradesListQuery,
  useGetJobGradesCountPerApprovalStatusQuery,
} from "../../../../app/api/HCMSApi";
import { ApprovalStatus, JobGradeRomanId } from "../../../../app/api/enums";
import { Pagination } from "../../../../components/Pagination";
import { JobGradeDetail } from "../JobGradeDetail";
export const ApprovedJobGrade = () => {
  const [pagination, setPagination] = useState<{
    pageNumber: number;
    pageSize?: number;
  }>({
    pageNumber: 0,
    pageSize: 10,
  });

  const { data: counts, isLoading: isCountsLoading } =
    useGetJobGradesCountPerApprovalStatusQuery();

  const { data: items, isLoading: isListLoading } = useGetJobGradesListQuery({
    pageNumber: pagination.pageNumber + 1,
    pageSize: pagination.pageSize,
    status: ApprovalStatus.Approved,
  });

  const { searchQuery } = useOutletContext<{ searchQuery: string }>();

  const filteredJobGrades = searchQuery
    ? (items?.items || []).filter((option) =>
        option.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items?.items || [];

  const showNoMatchingAlert = searchQuery && filteredJobGrades.length === 0;

  const [dialogOpened, setDialogOpened] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [ViewDetailJobGrade, setViewDetailJobGrade] = useState<
    JobGradeDto | undefined
  >(undefined);
  const [OpenViewDetail, setOpenViewDetail] = useState<boolean>(false);

  const handleDialogClose = () => {
    setDialogOpened(false);
    setSelectedId(null);
  };

  const handleDialogOpen = (id: number) => {
    setDialogOpened(true);
    setSelectedId(id);
  };
  const ViewDetail = (jobGrade: JobGradeDto | undefined) => {
    setOpenViewDetail(true);
    setViewDetailJobGrade(jobGrade);
  };
  const isLoading = isCountsLoading || isListLoading;

  return (
    <Box>
      {!isLoading && !!counts?.approved && (
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
                        <Button onClick={() => ViewDetail(item)}>
                          View Detail
                        </Button>
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
          No Approved Job Grade found with name {searchQuery}!!
        </Alert>
      )}

      <Pagination
        pageNumber={pagination.pageNumber}
        pageSize={pagination.pageSize}
        onChange={setPagination}
        totalRowsCount={counts?.approved}
        rowsPerPageOptions={[10, 20, 50]}
      />

      {!isLoading && !counts?.approved && (
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
    </Box>
  );
};
