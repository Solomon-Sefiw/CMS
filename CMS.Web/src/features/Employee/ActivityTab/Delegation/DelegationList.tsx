import React, { useState, useCallback } from "react";
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
  Alert,
} from "@mui/material";
import { useDelegationContext } from "./DelegationProvider";
import { ApprovalStatus } from "../../../../app/api/enums";
import {
  DelegationDto,
  useGetPaginatedDelegationsQuery,
} from "../../../../app/store";
import { Pagination } from "../../../../components/Pagination";
import { DelegationApprovalButton } from "./DelegationGrids/DelegationApprovalButton";
import { ApproveOrRejectRequestDelegation } from "./DelegationGrids/ApproveOrRejectRequestDelegation";
import { usePermission } from "../../../../hooks";
import { DelegationDialog } from "./DelegationDialog";
import { Remove } from "@mui/icons-material";
import { DelegationRemoveButton } from "./DelegationGrids/DelegationRemoveButton";

interface PaginationState {
  pageNumber: number;
  pageSize: number;
}

export const DelegationList = ({ status }: { status: ApprovalStatus }) => {
  const { employeeId } = useDelegationContext();
  const [pagination, setPagination] = useState<PaginationState>({
    pageNumber: 0,
    pageSize: 10,
  });
  const [selectedDelegation, setSelectedDelegation] = useState<DelegationDto>();
  const permissions = usePermission();

  const { data, isLoading, isFetching, refetch } =
    useGetPaginatedDelegationsQuery({
      id: employeeId,
      status,
      pageNumber: pagination.pageNumber + 1,
      pageSize: pagination.pageSize,
    });

  const handlePaginationChange = useCallback(
    (newPagination: PaginationState) => {
      setPagination(newPagination);
    },
    []
  );

  const handleCloseDialog = () => {
    setSelectedDelegation(undefined);
    refetch();
  };

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
                  <TableCell>Job Role</TableCell>
                  <TableCell>Business Unit</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.items.map((delegation: DelegationDto) => (
                  <TableRow key={delegation.id}>
                    <TableCell>{delegation.jobRole?.roleName || "-"}</TableCell>
                    <TableCell>
                      {delegation.businessUnit?.name || "-"}
                    </TableCell>
                    <TableCell>{delegation.startDate}</TableCell>
                    <TableCell>{delegation.endDate || "N/A"}</TableCell>
                   <TableCell>{delegation.endDate ? "Removed" : ApprovalStatus[delegation.approvalStatus ? delegation.approvalStatus : 0]}</TableCell>
                    <TableCell align="center">
                      <Box display="flex" gap={1} justifyContent="center">
                        {delegation.approvalStatus === ApprovalStatus.Draft && (
                          <DelegationApprovalButton
                            id={delegation.id || 0}
                            //onSuccess={refetch}
                          />
                        )}
                        {delegation.approvalStatus ===
                          ApprovalStatus.Submitted && (
                          <ApproveOrRejectRequestDelegation
                            id={delegation.id || 0}
                            // onSuccess={refetch}
                          />
                        )}
                        {(delegation.approvalStatus === ApprovalStatus.Draft ||
                          delegation.approvalStatus ===
                            ApprovalStatus.Rejected) && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => setSelectedDelegation(delegation)}
                            disabled={!permissions.CanCreateUpdateEmployeeActivity}
                          >
                            Edit
                          </Button>
                        )}
                      {(delegation.approvalStatus === ApprovalStatus.Approved) && (
                         !delegation.endDate ? <DelegationRemoveButton
                            id={delegation.id || 0}
                            //onSuccess={refetch}
                          /> : ""
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
        <Alert severity="info">
          No {ApprovalStatus[status]} delegations found
        </Alert>
      )}

      {selectedDelegation && (
        <DelegationDialog
          initialDelegation={selectedDelegation}
          onClose={handleCloseDialog}
          title="Update Delegation"
          employeeId={employeeId}
        />
      )}
    </Box>
  );
};
