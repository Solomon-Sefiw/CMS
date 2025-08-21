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
  ReemploymentDto,
  useGetReemploymentCountPerStatusQuery,
  useGetReemploymentListForPaginationQuery,
} from "../../../../../app/api";
import { Pagination } from "../../../../../components/Pagination";
import { RequestApprovalButton } from "../RequestApprovalButton";
import { ApproveOrRejectRequestButton } from "../ApproveOrRejectRequestButton";
import { ReemploymentDialog } from "../ReemploymentDialog";
import { ApprovalStatus } from "../../../../../app/api/enums";
import { useParams } from "react-router-dom";
import { usePermission } from "../../../../../hooks";

const reemploymentTypeLabels: Record<number, string> = {
  1: "Reinstate",
  2: "Rehire",
};

export const DraftReemployments: React.FC = () => {
  const [pagination, setPagination] = useState({ pageNumber: 0, pageSize: 10 });
  const [selectedReemploymentForEdit, setSelectedReemploymentForEdit] =
    useState<ReemploymentDto>();
  const [selectedReemploymentForView, setSelectedReemploymentForView] =
    useState<ReemploymentDto>();
const params=useParams();
  const { data: counts, isLoading: isCountsLoading } =
    useGetReemploymentCountPerStatusQuery({employeeId:params.id as any});
  const { data: items, isLoading: isListLoading } =
    useGetReemploymentListForPaginationQuery({
      pageNumber: pagination.pageNumber + 1,
      pageSize: pagination.pageSize,
      status: ApprovalStatus.Draft,
      employeeId:params.id as any
    });
const permissions = usePermission();
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
                    Previous Business Unit
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Previous Job Role
                  </TableCell>
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
                    <TableRow>
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
                          {item.id &&
                            item.approvalStatus === ApprovalStatus.Draft && (
                              <>
                                <RequestApprovalButton
                                  reemploymentId={item.id}
                                />
                                <Button
                                  size="small"
                                  onClick={() =>
                                    setSelectedReemploymentForEdit(item)
                                  }
                                  disabled={
                                    !permissions.CanCreateUpdateEmployeeActivity
                                  }
                                >
                                  Edit
                                </Button>
                              </>
                            )}
                          {item.id &&
                            item.approvalStatus ===
                              ApprovalStatus.Submitted && (
                              <ApproveOrRejectRequestButton
                                reemploymentId={item.id}
                              />
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
      ) : (
        !isLoading && (
          <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
            <Typography>No Draft Requests Available</Typography>
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
      {selectedReemploymentForEdit && (
        <ReemploymentDialog
          reemployment={selectedReemploymentForEdit}
          onClose={() => setSelectedReemploymentForEdit(undefined)}
          title="Edit Reemployment"
        />
      )}
    </Box>
  );
};
