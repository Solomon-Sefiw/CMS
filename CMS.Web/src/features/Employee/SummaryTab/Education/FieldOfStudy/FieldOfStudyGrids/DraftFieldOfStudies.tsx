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

export const DraftFieldOfStudies = () => {
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
    status: ApprovalStatus.Draft,
  });

  const isDataLoading = isCountsLoading || isListLoading;
  const draftFieldOfStudies = fieldOfStudiesData?.items || [];

  const filteredDraftFieldOfStudies = searchQuery
    ? draftFieldOfStudies.filter(
        (fieldOfStudy) =>
          fieldOfStudy.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          fieldOfStudy.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    : draftFieldOfStudies;

  const showNoMatchingResultsAlert =
    searchQuery && filteredDraftFieldOfStudies.length === 0;

  const handlePaginationChange = useCallback(
    (newPaginationState: PaginationState) => {
      setPaginationState(newPaginationState);
    },
    [setPaginationState]
  );
  const errors = countError || listError;
  return (
    <Box>
      {!isDataLoading && !!statusCounts?.draft && (
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
                {filteredDraftFieldOfStudies.map(
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
                                    Edit
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
        totalRowsCount={statusCounts?.draft}
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
      {!isDataLoading && !statusCounts?.draft && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Typography> No Data Available</Typography>
        </Box>
      )}
    </Box>
  );
};
