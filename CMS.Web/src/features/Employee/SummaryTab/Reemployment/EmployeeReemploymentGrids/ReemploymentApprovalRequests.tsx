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
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Fragment, useState } from "react";

import { ReemploymentDialog } from "../ReemploymentDialog";
import {
  ReemploymentDto,
  useGetReemploymentCountPerStatusQuery,
  useGetReemploymentListForPaginationQuery,
} from "../../../../../app/api";
import { ApprovalStatus } from "../../../../../app/api/enums";
import { Pagination } from "../../../../../components/Pagination";
import { ApproveOrRejectRequestButton } from "../ApproveOrRejectRequestButton";
import { RequestApprovalButton } from "../RequestApprovalButton";
import { useParams } from "react-router-dom";
import { usePermission } from "../../../../../hooks";

const reemploymentTypeLabels: Record<number, string> = {
  1: "Reinstate",
  2: "Rehire",
};

export const ReemploymentApprovalRequests = () => {
  const [pagination, setPagination] = useState<{
    pageNumber: number;
    pageSize?: number;
  }>({
    pageNumber: 0,
    pageSize: 10,
  });
const params=useParams();
  const { data: counts, isLoading: isCountsLoading } =
    useGetReemploymentCountPerStatusQuery({employeeId:params.id as any});
  const { data: items, isLoading: isListLoading } =
    useGetReemploymentListForPaginationQuery({
      pageNumber: pagination.pageNumber + 1,
      pageSize: pagination.pageSize,
      status: ApprovalStatus.Submitted,
      employeeId:params.id as any
    });
const permissions = usePermission();
  const [selectedReemployment, setSelectedReemployment] =
    useState<ReemploymentDto>();

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
                    Employee Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Business Unit
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Job Role</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Reemployment Type
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Reason</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(items?.items || []).map((item) => (
                  <Fragment key={item.id}>
                    <TableRow hover={false}>
                      <TableCell>{item.employeeName}</TableCell>
                      <TableCell>{item.businessUnitName}</TableCell>
                      <TableCell>{item.jobRoleName}</TableCell>
                      <TableCell>
                        {reemploymentTypeLabels[
                          item.reemploymentType as keyof typeof reemploymentTypeLabels
                        ] || "Unknown"}
                      </TableCell>
                      <TableCell>{item.reasonForReemployment}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                            alignItems: "center",
                          }}
                        >
                          {item.id && (
                            <>
                              {item.approvalStatus === ApprovalStatus.Draft && (
                                <RequestApprovalButton
                                  reemploymentId={item.id}
                                />
                              )}
                              {item.approvalStatus ===
                                ApprovalStatus.Submitted && (
                                <ApproveOrRejectRequestButton
                                  reemploymentId={item.id}
                                />
                              )}
                            </>
                          )}

                          {(item.approvalStatus === ApprovalStatus.Draft ||
                            item.approvalStatus ===
                              ApprovalStatus.Rejected) && (
                            <Button
                              size="small"
                              onClick={() => setSelectedReemployment(item)}
                              disabled={
                                !permissions.CanCreateUpdateEmployeeActivity
                              }
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
        totalRowsCount={counts?.approvalRequests || 0}
        rowsPerPageOptions={[10, 20, 50]}
      />
      {!isLoading && !counts?.approvalRequests && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Typography>No Data Available</Typography>
        </Box>
      )}
    </Box>
  );
};
