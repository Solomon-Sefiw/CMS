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
  Tooltip,
  Typography,
} from "@mui/material";
import { Fragment, useState } from "react";
import { RequestApprovalButton } from "../RequestApprovalButton";
import { ApproveOrRejectRequestButton } from "../ApproveOrRejectRequestButton";
import {
  BranchGradeDto,
  useGetBranchGradeCountPerStatusQuery,
  useGetBranchGradeForPaginationQuery,
} from "../../../app/store";
import { ApprovalStatus } from "../../../app/api/enums";
import { Pagination } from "../../../components/Pagination";
import { BranchGradeDialog } from "../BranchGradeDialog";
export const BranchGradeApprovalRequests = () => {
  const [pagination, setPagination] = useState<{
    pageNumber: number;
    pageSize?: number;
  }>({
    pageNumber: 0,
    pageSize: 10,
  });

  const { data: counts, isLoading: isCountsLoading } =
    useGetBranchGradeCountPerStatusQuery();
  const { data: items, isLoading: isListLoading } =
    useGetBranchGradeForPaginationQuery({
      pageNumber: pagination.pageNumber + 1,
      pageSize: pagination.pageSize,
      status: ApprovalStatus.Submitted,
    });
  const [selectedBranchGrade, setSelectedBranchGrade] =
    useState<BranchGradeDto>();

  const isLoading = isCountsLoading || isListLoading;

  return (
    <Box>
      {!isLoading && !!counts?.approvalRequests && (
        <Paper>
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Branch Grade
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Staff Strength{" "}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(items?.items || []).map((item) => (
                  <Fragment key={item.id}>
                    <TableRow hover={false} key={item.id}>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.grade}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.staffLimit}
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
                          }}
                        >
                          {item.id && (
                            <>
                              {item.approvalStatus === ApprovalStatus.Draft && (
                                <RequestApprovalButton id={item.id} />
                              )}
                              {item.approvalStatus ===
                                ApprovalStatus.Submitted && (
                                <ApproveOrRejectRequestButton id={item.id} />
                              )}
                            </>
                          )}
                          {item.approvalStatus ===
                            (ApprovalStatus.Draft ||
                              ApprovalStatus.Rejected) && (
                            <Button
                              size="small"
                              onClick={() => setSelectedBranchGrade(item)}
                            >
                              Edit
                            </Button>
                          )}
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

      <Pagination
        pageNumber={pagination.pageNumber}
        pageSize={pagination.pageSize}
        onChange={setPagination}
        totalRowsCount={counts?.approvalRequests}
        rowsPerPageOptions={[10, 20, 50]}
      />

      {selectedBranchGrade && (
        <BranchGradeDialog
          branchGrade={selectedBranchGrade}
          onClose={() => {
            setSelectedBranchGrade(undefined);
          }}
          title="Submit Branch Grade "
        />
      )}

      {!isLoading && !counts?.approvalRequests && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Typography>No Data Available</Typography>
        </Box>
      )}
    </Box>
  );
};
