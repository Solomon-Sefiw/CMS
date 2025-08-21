import { useState, useCallback } from "react";
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
import { ApprovalStatus, ViolationType, WarningStatus } from "../../../../app/api/enums";
import { Pagination } from "../../../../components/Pagination";
import { usePermission } from "../../../../hooks";
import { EmployeeWarningDialog } from "./EmployeeWarningDialog";
import {
  EmployeeWarningDto,
  useGetPaginatedEmployeeWarningsQuery,
} from "../../../../app/store";
import { EmployeeWarningApprovalButton } from "./EmployeeWarningGrid/EmployeeWarningApprovalButton";
import { ApproveOrRejectRequestEmployeeWarning } from "./EmployeeWarningGrid/ApproveOrRejectRequestEmployeeWarning";
import { useEmployeeWarningContext } from "./EmployeeWarningProvider";

interface PaginationState {
  pageNumber: number;
  pageSize: number;
}

export const EmployeeWarningList = ({ status }: { status: ApprovalStatus }) => {
  const { employeeId } = useEmployeeWarningContext();

  const [pagination, setPagination] = useState<PaginationState>({
    pageNumber: 0,
    pageSize: 10,
  });

  const [selectedWarning, setSelectedWarning] = useState<EmployeeWarningDto>();
  const permissions = usePermission();

  const { data, isLoading, isFetching, refetch } =
    useGetPaginatedEmployeeWarningsQuery({
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
    setSelectedWarning(undefined);
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
                  <TableCell>Employee</TableCell>
                  <TableCell>Warning Date</TableCell>
                  <TableCell>Monetary Punishment(%)</TableCell>
                  <TableCell>Warning Level</TableCell>
                  <TableCell>Violation Type</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.items.map((warning: EmployeeWarningDto) => (
                  <TableRow key={warning.id}>
                    <TableCell>
                      {warning.employee?.amharicDisplayName || "-"}
                    </TableCell>
                    <TableCell>{warning.warningDate || "-"}</TableCell>
                    <TableCell>{warning.percentage}%</TableCell>
                    <TableCell>
                      {warning.warningStatus !== undefined
                        ? WarningStatus[warning.warningStatus]
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {ViolationType[warning.violationType ?? 0]}
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" gap={1} justifyContent="center">
                        {warning.approvalStatus === ApprovalStatus.Draft && (
                          <EmployeeWarningApprovalButton id={warning.id || 0} />
                        )}
                        {warning.approvalStatus ===
                          ApprovalStatus.Submitted && (
                          <ApproveOrRejectRequestEmployeeWarning
                            id={warning.id || 0}
                          />
                        )}
                        {(warning.approvalStatus === ApprovalStatus.Draft ||
                          warning.approvalStatus ===
                            ApprovalStatus.Rejected) && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => setSelectedWarning(warning)}
                            disabled={!permissions.CanCreateUpdateEmployeeActivity}
                          >
                            Edit
                          </Button>
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
          No {ApprovalStatus[status]} warnings found
        </Alert>
      )}

      {selectedWarning && (
        <EmployeeWarningDialog
          initialWarning={selectedWarning}
          onClose={handleCloseDialog}
          title="Update Employee Warning"
          employeeId={employeeId}
        />
      )}
    </Box>
  );
};
