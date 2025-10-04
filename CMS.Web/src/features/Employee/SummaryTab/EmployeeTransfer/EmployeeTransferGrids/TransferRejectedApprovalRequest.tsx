import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Fragment, useState } from "react";

import {
  EmployeeTransferDto,
  useGetTransferCountPerStatusQuery,
  useGetTransferListForPaginationQuery,
} from "../../../../../app/api";
import { Pagination } from "../../../../../components/Pagination";
import { RequestApprovalButton } from "../RequestApprovalButton";
import { ApproveOrRejectRequestButton } from "../ApproveOrRejectRequestButton";
import { TransferDialog } from "../TransferDialog";
import { ApprovalStatus } from "../../../../../app/api/enums";
import { TransferDetail } from "./TransferDetailDialog";
import { useParams } from "react-router-dom";
import { AnyARecord } from "node:dns";
import { usePermission } from "../../../../../hooks";

// Transfer type labels map
const transferTypeLabels: Record<number, string> = {
  1: "Business Unit Change",
  2: "Job Role Change",
  3: "Business Unit & Job Role Change",
};

export const TransferRejectedApprovalRequest = () => {
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
      status: ApprovalStatus.Rejected,
      employeeId:params.id as any
    });
  const permissions = usePermission();
  const [selectedTransferForEdit, setSelectedTransferForEdit] =
    useState<EmployeeTransferDto>();
  const [selectedTransferForView, setSelectedTransferForView] =
    useState<EmployeeTransferDto>();

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
                    Employee Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    New Business Unit
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    New Job Role
                  </TableCell>
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
                            onClick={() => setSelectedTransferForEdit(item)}
                            disabled ={!permissions.CanCreateUpdateEmployeeActivity}
                          >
                            Edit
                          </Button>
                          <IconButton
                            size="small"
                            aria-label="view transfer details"
                            onClick={() => setSelectedTransferForView(item)}
                            sx={{ color: "#0D47A1" }}
                            disabled={!permissions.CanViewEmployeeActivity}
                          >
                            <VisibilityIcon />
                            View
                          </IconButton>
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
        totalRowsCount={counts?.rejected || 0}
        rowsPerPageOptions={[10, 20, 50]}
      />

      {/* Edit Dialog */}
      {selectedTransferForEdit && (
        <TransferDialog
          transfer={selectedTransferForEdit}
          onClose={() => setSelectedTransferForEdit(undefined)}
          title="Rejected Transfer"
        />
      )}

      {/* View Dialog */}
      {selectedTransferForView && (
        <TransferDetail
          transfer={selectedTransferForView}
          onClose={() => setSelectedTransferForView(undefined)}
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
