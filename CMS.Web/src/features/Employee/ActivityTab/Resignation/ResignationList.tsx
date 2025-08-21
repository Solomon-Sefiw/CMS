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
  Alert
} from "@mui/material";
import { ApprovalStatus, ResignationType } from "../../../../app/api/enums";
import { Pagination } from "../../../../components/Pagination";
import { usePermission } from "../../../../hooks";
import { useResignationContext } from "./ResignationProvider";
import {
  ResignationDto,
  useGetPaginatedResignationsQuery
} from "../../../../app/store";
import { ResignationApprovalButton } from "./ResignationGrid/ResignationApprovalButton";
import { ApproveOrRejectResignation } from "./ResignationGrid/ApproveOrRejectResignation";
import { ResignationDialog } from "./ResignationDialog";
import { ResignationDocumentCell } from "./ResignationGrid/ResignationDocumentCell";
import { ResignationRejectButton } from "./ResignationGrid/ResignationRejectButton";

interface PaginationState {
  pageNumber: number;
  pageSize: number;
}

export const ResignationList = ({ status }: { status: ApprovalStatus }) => {
  const { employeeId } = useResignationContext();
  const [pagination, setPagination] = useState<PaginationState>({
    pageNumber: 0,
    pageSize: 10
  });
  const [selectedResignation, setSelectedResignation] =
    useState<ResignationDto>();
  const permissions = usePermission();

  const { data, isLoading, isFetching, refetch } =
    useGetPaginatedResignationsQuery({
      employeeId: employeeId,
      status,
      pageNumber: pagination.pageNumber + 1,
      pageSize: pagination.pageSize
    });

  const handlePaginationChange = useCallback(
    (newPagination: PaginationState) => setPagination(newPagination),
    []
  );

  const handleCloseDialog = () => {
    setSelectedResignation(undefined);
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
                  <TableCell>Resignation Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Final Settlement</TableCell>
                  <TableCell>Approved By</TableCell>
                  <TableCell>Document</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.items.map((r: ResignationDto) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      {r.employee?.amharicDisplayName || "-"}
                    </TableCell>
                    <TableCell>{r.resignationDate || "-"}</TableCell>
                    <TableCell>{ResignationType[r.resignationType || 0]}</TableCell>
                    <TableCell>{r.reasonForResignation || "-"}</TableCell>
                    <TableCell>{r.finalSettlementDetails || "-"}</TableCell>
                    <TableCell>{r.workUnit || "-"}</TableCell>
                    <TableCell>
                      <ResignationDocumentCell
                        employeeId={r.employeeId || 0}
                        resignationId={r.id || 0}
                        remark={r.reasonForResignation || ""}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" gap={1} justifyContent="center">
                        {r.approvalStatus === ApprovalStatus.Draft && (
                          <ResignationApprovalButton id={r.id || 0} />
                        )}
                        {r.approvalStatus === ApprovalStatus.Submitted && (
                          <ApproveOrRejectResignation id={r.id || 0} />
                        )}
                        {(r.approvalStatus === ApprovalStatus.Draft || r.approvalStatus === ApprovalStatus.Rejected) && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => setSelectedResignation(r)}
                            disabled={!permissions.CanCreateUpdateEmployeeActivity}
                          >
                            Edit
                          </Button>
                        )}
                {/* {(r.approvalStatus === ApprovalStatus.Approved) && (
                       <ResignationRejectButton id={r.id || 0} />
                        )} */}
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
          No {ApprovalStatus[status]} resignations found
        </Alert>
      )}

      {selectedResignation && (
        <ResignationDialog
          initialResignation={selectedResignation}
          onClose={handleCloseDialog}
          title="Update Resignation"
          employeeId={employeeId}
        />
      )}
    </Box>
  );
};
