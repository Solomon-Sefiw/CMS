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
  Alert,
  TextField,
} from "@mui/material";
import { Fragment, useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { usePermission } from "../../../../../../hooks";
import {
  FieldOfStudyDto,
  useGetFieldOfStudyCountPerStatusQuery,
  useGetFieldOfStudiesForPaginationQuery,
} from "../../../../../../app/store";
import { ApprovalStatus } from "../../../../../../app/api/enums";
import { SubmitApprovalButton } from "../SubmitApprovalButton";
import { ApproveOrRejectRequestButton } from "../ApproveOrRejectRequestButton";
import { Pagination } from "../../../../../../components/Pagination";
import { FieldOfStudyDialog } from "../FieldOfStudyDialog";

interface PaginationState {
  pageNumber: number;
  pageSize?: number;
}

export const SubmittedFieldOfStudies = () => {
  const permissions = usePermission();
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageNumber: 0,
    pageSize: 10,
  });
  const [selectedFieldOfStudy, setSelectedFieldOfStudy] =
    useState<FieldOfStudyDto>();
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();

  const {
    data: statusCounts,
    isLoading: isCountsLoading,
    error: countError,
  } = useGetFieldOfStudyCountPerStatusQuery();

  const {
    data: fieldOfStudiesData,
    isLoading: isListLoading,
    refetch: refetchFieldOfStudies,
    error: listError,
  } = useGetFieldOfStudiesForPaginationQuery({
    pageNumber: paginationState.pageNumber + 1,
    pageSize: paginationState.pageSize,
    status: ApprovalStatus.Submitted,
  });

  const isDataLoading = isCountsLoading || isListLoading;
  const submittedFieldOfStudies = fieldOfStudiesData?.items || [];

  const filteredSubmittedFieldOfStudies = searchQuery
    ? submittedFieldOfStudies.filter(
        (fieldOfStudy) =>
          fieldOfStudy.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          fieldOfStudy.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    : submittedFieldOfStudies;

  const showNoMatchingResultsAlert =
    searchQuery && filteredSubmittedFieldOfStudies.length === 0;

  const handlePaginationChange = useCallback(
    (newPaginationState: PaginationState) => {
      setPaginationState(newPaginationState);
    },
    [setPaginationState]
  );
  const errors = countError || listError;
  return (
    <Box>
      {!isDataLoading && !!statusCounts?.submitted && (
        <Paper>
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSubmittedFieldOfStudies.map(
                  (fieldOfStudy: FieldOfStudyDto) => (
                    <Fragment key={fieldOfStudy.id}>
                      <TableRow hover={false} key={fieldOfStudy.id}>
                        <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                          {fieldOfStudy.name}
                        </TableCell>
                        <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                          {fieldOfStudy.description}
                        </TableCell>
                        <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                          {fieldOfStudy.approvalStatus &&
                            ApprovalStatus[fieldOfStudy.approvalStatus]}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              gap: 1,
                            }}
                          >
                            {fieldOfStudy.id && (
                              <>
                                {fieldOfStudy.approvalStatus ===
                                  ApprovalStatus.Draft && (
                                  <SubmitApprovalButton id={fieldOfStudy.id} />
                                )}
                                {fieldOfStudy.approvalStatus ===
                                  ApprovalStatus.Submitted && (
                                  <ApproveOrRejectRequestButton
                                    id={fieldOfStudy.id}
                                  />
                                )}
                                {(fieldOfStudy.approvalStatus ===
                                  ApprovalStatus.Draft ||
                                  fieldOfStudy.approvalStatus ===
                                    ApprovalStatus.Rejected) && (
                                  <Button
                                    size="small"
                                    onClick={() =>
                                      setSelectedFieldOfStudy(fieldOfStudy)
                                    }
                                    disabled={!permissions.canCreateUpdateSetup}
                                  >
                                    Edit Field Of Study
                                  </Button>
                                )}
                              </>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    </Fragment>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      {showNoMatchingResultsAlert && (
        <Alert severity="info" sx={{ m: 2 }}>
          No matching field of studies found
        </Alert>
      )}
      <Pagination
        pageNumber={paginationState.pageNumber}
        pageSize={paginationState.pageSize}
        onChange={handlePaginationChange}
        totalRowsCount={statusCounts?.submitted}
        rowsPerPageOptions={[10, 20, 50]}
      />
      {selectedFieldOfStudy && (
        <FieldOfStudyDialog
          initialFieldOfStudy={selectedFieldOfStudy}
          onClose={() => {
            setSelectedFieldOfStudy(undefined);
          }}
          title="Update Field Of Study"
        />
      )}
      {!isDataLoading && !statusCounts?.submitted && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Typography> No Data Available</Typography>
        </Box>
      )}
    </Box>
  );
};
