import React, { useState, useCallback } from "react";
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert } from "@mui/material";
import { ApprovalStatus, SuspensionReason } from "../../../../app/api/enums";
import { Pagination } from "../../../../components/Pagination";
import { usePermission } from "../../../../hooks";
import { useSuspensionContext } from "./SuspensionProvider";
import { SuspensionDto, useGetPaginatedSuspensionsQuery } from "../../../../app/store";
import { SuspensionApprovalButton } from "./SuspensionGrid/SuspensionApprovalButton";
import { ApproveOrRejectSuspension } from "./SuspensionGrid/ApproveOrRejectSuspension";
import { SuspensionDialog } from "./SuspensionDialog";
import { SuspensionDocumentCell } from "./SuspensionGrid/SuspensionDocumentCell";
import { SuspentionRejectButton } from "./SuspensionGrid/SuspentionRejectButton";

interface PaginationState {
  pageNumber: number;
  pageSize: number;
}

export const SuspensionList = ({ status }: { status: ApprovalStatus }) => {
  const { employeeId } = useSuspensionContext();
  const [pagination, setPagination] = useState<PaginationState>({ pageNumber: 0, pageSize: 10 });
  const [selectedSuspension, setSelectedSuspension] = useState<SuspensionDto>();
  const permissions = usePermission();

  const { data, isLoading, isFetching, refetch } = useGetPaginatedSuspensionsQuery({
    employeeId,
    status,
    pageNumber: pagination.pageNumber + 1,
    pageSize: pagination.pageSize,
  });

  const handlePaginationChange = useCallback((newPagination: PaginationState) => setPagination(newPagination), []);
  const handleCloseDialog = () => { setSelectedSuspension(undefined); refetch(); };

  return (
    <Box>
      {isLoading || isFetching ? (
        <Alert severity="info">Loading...</Alert>
      ) : data?.items?.length ? (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Document</TableCell>

                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.items.map((s: SuspensionDto) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.employee?.amharicDisplayName || "-"}</TableCell>
                    <TableCell>{s.startDate || "-"}</TableCell>
                    <TableCell>{s.endDate || "-"}</TableCell>
                    <TableCell>{SuspensionReason[s.reason ?? 0]}</TableCell>
                    <TableCell>
                      <SuspensionDocumentCell
                        employeeId={s.employeeId || 0}
                        suspensionId={s.id || 0}
                        remark={s.reason ? SuspensionReason[s.reason].toString() : ""}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" gap={1} justifyContent="center">
                        {s.approvalStatus === ApprovalStatus.Draft && <SuspensionApprovalButton id={s.id || 0} />}
                        {s.approvalStatus === ApprovalStatus.Submitted && <ApproveOrRejectSuspension id={s.id || 0} />}
                        {(s.approvalStatus === ApprovalStatus.Draft || s.approvalStatus === ApprovalStatus.Rejected  ) && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => setSelectedSuspension(s)}
                            disabled={!permissions.CanCreateUpdateEmployeeActivity}
                          >
                            Edit
                          </Button>
                        )}
                      {(s.approvalStatus === ApprovalStatus.Approved) && (
                         <SuspentionRejectButton id={s.id || 0} />
                         )} 
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Pagination
            pageNumber={pagination.pageNumber}
            pageSize={pagination.pageSize}
            totalRowsCount={data.totalCount || 0}
            onChange={handlePaginationChange}
            rowsPerPageOptions={[10, 20, 50]}
          />
        </>
      ) : (
        <Alert severity="info">No {ApprovalStatus[status]} suspensions found</Alert>
      )}

      {selectedSuspension && (
        <SuspensionDialog
          initialSuspension={selectedSuspension}
          onClose={handleCloseDialog}
          title="Update Suspension"
          employeeId={employeeId}
        />
      )}
    </Box>
  );
};
