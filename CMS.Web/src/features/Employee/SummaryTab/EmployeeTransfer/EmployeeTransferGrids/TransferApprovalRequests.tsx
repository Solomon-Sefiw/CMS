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
} from "@mui/material";
import { Fragment, useState } from "react";

import VisibilityIcon from "@mui/icons-material/Visibility";
import { RequestApprovalButton } from "../RequestApprovalButton";
import { ApproveOrRejectRequestButton } from "../ApproveOrRejectRequestButton";
import { TransferDialog } from "../TransferDialog";
import {
  EmployeeTransferDto,
  useGetTransferCountPerStatusQuery,
  useGetTransferListForPaginationQuery,
} from "../../../../../app/api";
import { ApprovalStatus } from "../../../../../app/api/enums";
import { Pagination } from "../../../../../components/Pagination";
import { TransferDetail } from "./TransferDetailDialog";
import { useParams } from "react-router-dom";
import { usePermission } from "../../../../../hooks";

// Transfer type labels map
const transferTypeLabels: Record<number, string> = {
  1: "Business Unit Change",
  2: "Job Role Change",
  3: "Business Unit & Job Role Change",
};

export const TransferApprovalRequests = () => {
  const permissions = usePermission();

  const [pagination, setPagination] = useState<{
    pageNumber: number;
    pageSize?: number;
  }>({
    pageNumber: 0,
    pageSize: 10,
  });
const params=useParams();
  const { data: counts, isLoading: isCountsLoading } =
    useGetTransferCountPerStatusQuery({employeeId:params.id as any});

  const { data: items, isLoading: isListLoading } =
    useGetTransferListForPaginationQuery({
      pageNumber: pagination.pageNumber + 1,
      pageSize: pagination.pageSize,
      status: ApprovalStatus.Submitted,
      employeeId:params.id as any
    });

  const [selectedTransfer, setSelectedTransfer] =
    useState<EmployeeTransferDto>();

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
                    Transfer Type
                  </TableCell>
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
                      <TableCell>{item.toBusinessUnitName}</TableCell>
                      <TableCell>{item.toJobRoleName}</TableCell>
                      <TableCell>
                        {transferTypeLabels[
                          item.transferType as keyof typeof transferTypeLabels
                        ] ?? "Unknown"}
                      </TableCell>
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
                                <RequestApprovalButton id={item.id} />
                              )}
                              {item.approvalStatus ===
                                ApprovalStatus.Submitted && (
                                <ApproveOrRejectRequestButton id={item.id} />
                              )}
                            </>
                          )}
                          <Button
                            size="small"
                            onClick={() => setSelectedTransfer(item)}
                            aria-label="view transfer details"
                          >
                            <VisibilityIcon />
                            View
                          </Button>

                          {(item.approvalStatus === ApprovalStatus.Draft ||
                            item.approvalStatus ===
                              ApprovalStatus.Rejected) && (
                            <Button
                              size="small"
                              onClick={() => setSelectedTransfer(item)}
                              disabled={!permissions.CanCreateUpdateEmployeeActivity}
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

      {selectedTransfer && (
        <TransferDetail
          transfer={selectedTransfer}
          onClose={() => setSelectedTransfer(undefined)}
        />
      )}

      {!isLoading && !counts?.approvalRequests && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Typography>No Transfer Requests Available</Typography>
        </Box>
      )}
    </Box>
  );
};
