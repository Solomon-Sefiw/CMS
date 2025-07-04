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
import { useAlert } from "../../notification";
import { Pagination } from "../../../components/Pagination";
import { BranchGradeDialog } from "../BranchGradeDialog";
import { usePermission } from "../../../hooks";

export const BranchGradeRejectedApprovalRequest = () => {
  const permissions = usePermission();
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
      status: ApprovalStatus.Rejected,
    });
  const [selectedBranchGrade, setSelectedBranchGrade] =
    useState<BranchGradeDto>();
  const { showInfoAlert } = useAlert();

  const isLoading = isCountsLoading || isListLoading;

  return (
    <Box>
      {!isLoading && !!counts?.rejected && (
        <Paper>
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Branch Grade{" "}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Staff Strength
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Description{" "}
                  </TableCell>
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
                          {
                            <Button
                              size="small"
                              onClick={() => setSelectedBranchGrade(item)}
                              disabled={!permissions.canCreateUpdateSetup}
                            >
                              Edit
                            </Button>
                          }
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
        totalRowsCount={counts?.rejected}
        rowsPerPageOptions={[10, 20, 50]}
      />

      {selectedBranchGrade && (
        <BranchGradeDialog
          branchGrade={selectedBranchGrade}
          onClose={() => {
            setSelectedBranchGrade(undefined);
          }}
          title="Reject Branch Grade "
        />
      )}

      {!isLoading && !counts?.rejected && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Typography>No Data Available</Typography>
        </Box>
      )}
    </Box>
  );
};
