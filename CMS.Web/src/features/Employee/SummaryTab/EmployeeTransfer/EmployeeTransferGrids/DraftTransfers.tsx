import React, { Fragment, useState } from "react";
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
import { useAuth, usePermission } from "../../../../../hooks";
import { useParams } from "react-router-dom";
import { permission } from "process";

// Transfer type labels map
const transferTypeLabels: Record<number, string> = {
  1: "Business Unit Change",
  2: "Job Role Change",
  3: "Business Unit & Job Role Change",
};

export const DraftTransfers: React.FC = () => {
  const [pagination, setPagination] = useState({ pageNumber: 0, pageSize: 10 });
 const params = useParams();
const permissions = usePermission();
 console.log(params)
  const [selectedTransferForEdit, setSelectedTransferForEdit] =
    useState<EmployeeTransferDto>();
  const [selectedTransferForView, setSelectedTransferForView] =
    useState<EmployeeTransferDto>();

  const { data: counts, isLoading: isCountsLoading } =
    useGetTransferCountPerStatusQuery({employeeId:params.id as any});
  const { data: items, isLoading: isListLoading } =
    useGetTransferListForPaginationQuery({
      pageNumber: pagination.pageNumber + 1,
      pageSize: pagination.pageSize,
      status: ApprovalStatus.Draft,
      employeeId:params.id as any
    });

  const isLoading = isCountsLoading || isListLoading;
  const hasDrafts = !!counts?.drafts;

  return (
    <Box>
      {!isLoading && hasDrafts ? (
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
                    <TableRow>
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
                          {item.id &&
                            item.approvalStatus === ApprovalStatus.Draft && (
                              <>
                                <RequestApprovalButton id={item.id} />
                                <Button
                                  size="small"
                                  onClick={() =>
                                    setSelectedTransferForEdit(item)
                                  }
                                  disabled={!permissions.CanCreateUpdateEmployeeActivity}
                                >
                                  Edit
                                </Button>
                              </>
                            )}
                          {item.id &&
                            item.approvalStatus ===
                              ApprovalStatus.Submitted && (
                              <ApproveOrRejectRequestButton id={item.id} />
                            )}

                          <IconButton
                            size="small"
                            aria-label="view transfer details"
                            onClick={() => setSelectedTransferForView(item)}
                            sx={{
                              color: "darkblue",
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <VisibilityIcon />
                            <Typography
                              variant="body2"
                              sx={{ color: "darkblue", fontWeight: 500 }}
                            >
                              View
                            </Typography>
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
      ) : (
        !isLoading && (
          <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
            <Typography>No Draft Transfer Requests Available</Typography>
          </Box>
        )
      )}

      <Pagination
        pageNumber={pagination.pageNumber}
        pageSize={pagination.pageSize}
        onChange={setPagination}
        totalRowsCount={counts?.drafts || 0}
        rowsPerPageOptions={[10, 20, 50]}
      />

      {/* Edit dialog */}
      {selectedTransferForEdit && (
        <TransferDialog
          transfer={selectedTransferForEdit}
          onClose={() => setSelectedTransferForEdit(undefined)}
          title="Edit Transfer"
        />
      )}

      {/* View details */}
      {selectedTransferForView && (
        <TransferDetail
          transfer={selectedTransferForView}
          onClose={() => setSelectedTransferForView(undefined)}
        />
      )}
    </Box>
  );
};
