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
} from "@mui/material";
import { Fragment, useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import {
  JobRoleCatagoryDto,
  useGetJobRoleCategoriesForPaginationQuery,
  useGetJobRoleCategoryCountPerStatusQuery,
} from "../../../../app/store";
import { ApprovalStatus } from "../../../../app/api/enums";
import { JobRoleCategoryApprovalRequestButton } from "../JobRoleCategoryApprovalRequestButton";
import { ApproveOrRejectJobRoleCategoryButton } from "../ApproveOrRejectJobRoleCategoryButton";
import { JobRoleCategoryDialog } from "../JobRoleCategoryDialog";
import { Pagination } from "../../../../components/Pagination";

interface PaginationState {
  pageNumber: number;
  pageSize?: number;
}

export const ApprovedJobRoleCategories = () => {
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageNumber: 0,
    pageSize: 10,
  });
  const [selectedJobRoleCategory, setSelectedJobRoleCategory] =
    useState<JobRoleCatagoryDto>();
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();

  const { data: statusCounts, isLoading: isCountsLoading } =
    useGetJobRoleCategoryCountPerStatusQuery();
  const {
    data: jobRoleCategoriesData,
    isLoading: isListLoading,
    refetch: refetchJobRoleCategories,
  } = useGetJobRoleCategoriesForPaginationQuery({
    pageNumber: paginationState.pageNumber + 1,
    pageSize: paginationState.pageSize,
    status: ApprovalStatus.Approved,
  });

  const isDataLoading = isCountsLoading || isListLoading;
  const approvedJobRoleCategories = jobRoleCategoriesData?.items || [];

  // Filter job role categories based on searchQuery
  const filteredApprovedJobRoleCategories = searchQuery
    ? approvedJobRoleCategories.filter(
        (jobRoleCategory) =>
          jobRoleCategory.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          jobRoleCategory.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    : approvedJobRoleCategories;

  // Show "No Matching Results" alert
  const showNoMatchingResultsAlert =
    searchQuery && filteredApprovedJobRoleCategories.length === 0;

  // useCallback for stable pagination handler
  const handlePaginationChange = useCallback(
    (newPaginationState: PaginationState) => {
      setPaginationState(newPaginationState);
    },
    [setPaginationState]
  );

  // useCallback for stable dialog close handler
  const handleCloseDialog = useCallback(() => {
    setSelectedJobRoleCategory(undefined);
    refetchJobRoleCategories();
  }, [setSelectedJobRoleCategory, refetchJobRoleCategories]);

  return (
    <Box>
      {!isDataLoading && !!statusCounts?.approved && (
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
                {filteredApprovedJobRoleCategories.map(
                  (jobRoleCategory: JobRoleCatagoryDto) => (
                    <Fragment key={jobRoleCategory.id}>
                      <TableRow hover={false}>
                        <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                          {jobRoleCategory.name}
                        </TableCell>
                        <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                          {jobRoleCategory.description || "—"}
                        </TableCell>
                        <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                          {jobRoleCategory.approvalStatus &&
                            ApprovalStatus[jobRoleCategory.approvalStatus]}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              gap: 1,
                            }}
                          >
                            {jobRoleCategory.id && (
                              <>
                                {jobRoleCategory.approvalStatus ===
                                  ApprovalStatus.Draft && (
                                  <JobRoleCategoryApprovalRequestButton
                                    id={jobRoleCategory.id}
                                  />
                                )}
                                {jobRoleCategory.approvalStatus ===
                                  ApprovalStatus.Submitted && (
                                  <ApproveOrRejectJobRoleCategoryButton
                                    id={jobRoleCategory.id}
                                  />
                                )}
                                {(jobRoleCategory.approvalStatus ===
                                  ApprovalStatus.Draft ||
                                  jobRoleCategory.approvalStatus ===
                                    ApprovalStatus.Rejected) && (
                                  <Button
                                    size="small"
                                    onClick={() =>
                                      setSelectedJobRoleCategory(
                                        jobRoleCategory
                                      )
                                    }
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
          No matching job role categories found
        </Alert>
      )}

      <Pagination
        pageNumber={paginationState.pageNumber}
        pageSize={paginationState.pageSize}
        onChange={handlePaginationChange}
        totalRowsCount={statusCounts?.approved}
        rowsPerPageOptions={[10, 20, 50]}
      />

      {selectedJobRoleCategory && (
        <JobRoleCategoryDialog
          initialJobRoleCategory={selectedJobRoleCategory}
          onClose={handleCloseDialog}
          title="Update Job Role Category"
        />
      )}

      {!isDataLoading && !statusCounts?.approved && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Typography>No approved job role categories available</Typography>
        </Box>
      )}
    </Box>
  );
};
