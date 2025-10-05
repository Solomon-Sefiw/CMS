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
import { ActingType, ApprovalStatus } from "../../../../app/api/enums";
import {
  ActingDto,
  useGetAllActiveActingQuery,
  useGetEmployeeByIdQuery,
  useGetPaginatedActingsQuery,
} from "../../../../app/store";
import { Pagination } from "../../../../components/Pagination";
import { usePermission } from "../../../../hooks";
import { useActingContext } from "./ActingProvider";
import { ActingApprovalButton } from "./ActingGrids/ActingApprovalButton";
import { ApproveOrRejectRequestActing } from "./ActingGrids/ApproveOrRejectRequestActing";
import { ActingDialog } from "./ActingDialog";
import { ReassignmentDialog } from "./ReassignmentDialog";

interface PaginationState {
  pageNumber: number;
  pageSize: number;
}

export const ActingList = ({ status }: { status: ApprovalStatus }) => {
  const { employeeId } = useActingContext();
  const [pagination, setPagination] = useState<PaginationState>({
    pageNumber: 0,
    pageSize: 10,
  });

  const { data: employeeData } = useGetEmployeeByIdQuery(
    { id: employeeId },
    { refetchOnMountOrArgChange: true }
  );

  const [selectedActing, setSelectedActing] = useState<ActingDto>();
  const [selectedReassignment, setSelectedReassignment] = useState<ActingDto>();
  const permissions = usePermission();
  const { data: activeActing } = useGetAllActiveActingQuery({ id: employeeId });

  const { data, isLoading, isFetching, refetch } = useGetPaginatedActingsQuery({
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
    setSelectedActing(undefined);
    setSelectedReassignment(undefined);
    refetch();
  };

  // 🔥 Get the latest eligible acting for reassignment
const latestReassignable = data?.items
  ?.filter(
    (a) =>
      a.approvalStatus === ApprovalStatus.Approved &&
      a.businessUnitId === employeeData?.businessUnitID &&
      a.jobRoleId === employeeData?.job?.jobRoleId &&
      a.startDate
  )
  ?.sort(
    (a, b) => new Date(b.startDate!).getTime() - new Date(a.startDate!).getTime()
  )?.[0];

console.log("Latest Reassignable Acting:", latestReassignable);
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
                  <TableCell>Acting Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.items.map((acting: ActingDto) => (
                  <TableRow key={acting.id}>
                    <TableCell>{acting.jobRole?.roleName || "-"}</TableCell>
                    <TableCell>{acting.businessUnit?.name || "-"}</TableCell>
                    <TableCell>{acting.startDate}</TableCell>
                    <TableCell>{acting.endDate || "N/A"}</TableCell>
                    <TableCell>{ActingType[acting.actingType ?? 0]}</TableCell>
                    <TableCell>
                      {ApprovalStatus[acting.approvalStatus ?? 0]}
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" gap={1} justifyContent="center">
                        {acting.approvalStatus === ApprovalStatus.Draft && (
                          <ActingApprovalButton id={acting.id ?? 0} />
                        )}
                        {acting.approvalStatus === ApprovalStatus.Submitted && (
                          <ApproveOrRejectRequestActing id={acting.id ?? 0} />
                        )}
                        {(acting.approvalStatus === ApprovalStatus.Draft ||
                          acting.approvalStatus ===
                            ApprovalStatus.Rejected) && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => setSelectedActing(acting)}
                            disabled={!permissions.CanCreateUpdateEmployeeActivity}
                          >
                            Edit
                          </Button>
                        )}

                        {acting.id === latestReassignable?.id && acting.actingType !== ActingType.Reassignment && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => setSelectedReassignment(acting)}
                            disabled={!permissions.CanCreateUpdateEmployeeActivity || activeActing?.isActive}
                          >
                            Reassign
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
        <Alert severity="info">No {ApprovalStatus[status]} Actings found</Alert>
      )}

      {selectedActing && (
        <ActingDialog
          initialActing={selectedActing}
          onClose={handleCloseDialog}
          title="Update Acting"
          employeeId={employeeId}
        />
      )}
      {selectedReassignment && (
        <ReassignmentDialog
          initialActing={selectedReassignment}
          onClose={handleCloseDialog}
          title="Reassignment Acting"
          employeeId={employeeId}
        />
      )}
    </Box>
  );
};
