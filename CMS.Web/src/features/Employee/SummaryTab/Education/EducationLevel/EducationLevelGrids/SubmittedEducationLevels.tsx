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
import { usePermission } from "../../../../../../hooks";
import {
  EducationLevelDto,
  useGetEducationLevelCountPerStatusQuery,
  useGetEducationLevelsForPaginationQuery,
} from "../../../../../../app/store";
import { ApprovalStatus } from "../../../../../../app/api/enums";
import { SubmitApprovalButton } from "../SubmitApprovalButton";
import { ApproveOrRejectRequestButton } from "../ApproveOrRejectRequestButton";
import { Pagination } from "../../../../../../components/Pagination";
import { EducationLevelDialog } from "../EducationLevelDialog";

interface PaginationState {
  pageNumber: number;
  pageSize?: number;
}

export const SubmittedEducationLevels = () => {
  const permissions = usePermission();
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageNumber: 0,
    pageSize: 10,
  });
  const [selectedEducationLevel, setSelectedEducationLevel] =
    useState<EducationLevelDto>();
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();

  const { data: statusCounts, isLoading: isCountsLoading } =
    useGetEducationLevelCountPerStatusQuery();

  const {
    data: educationLevelsData,
    isLoading: isListLoading,
    refetch: refetchEducationLevels,
  } = useGetEducationLevelsForPaginationQuery({
    pageNumber: paginationState.pageNumber + 1,
    pageSize: paginationState.pageSize,
    status: ApprovalStatus.Submitted,
  });

  const isDataLoading = isCountsLoading || isListLoading;
  const submittedEducationLevels = educationLevelsData?.items || [];

  // Filter education levels based on searchQuery
  const filteredSubmittedEducationLevels = searchQuery
    ? submittedEducationLevels.filter(
        (educationLevel) =>
          educationLevel.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          educationLevel.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    : submittedEducationLevels;

  // Show "No Matching Results" alert
  const showNoMatchingResultsAlert =
    searchQuery && filteredSubmittedEducationLevels.length === 0;

  const handlePaginationChange = useCallback(
    (newPaginationState: PaginationState) => {
      setPaginationState(newPaginationState);
    },
    [setPaginationState]
  );
  console.log(filteredSubmittedEducationLevels);
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
                {filteredSubmittedEducationLevels.map(
                  (item: EducationLevelDto) => (
                    <Fragment key={item.id}>
                      <TableRow hover={false} key={item.id}>
                        <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                          {item.name}
                        </TableCell>
                        <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                          {item.description}
                        </TableCell>
                        <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                          {item.approvalStatus &&
                            ApprovalStatus[item.approvalStatus]}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              gap: 1,
                            }}
                          >
                            {item.id && (
                              <>
                                {item.approvalStatus ===
                                  ApprovalStatus.Draft && (
                                  <SubmitApprovalButton id={item.id} />
                                )}
                                {item.approvalStatus ===
                                  ApprovalStatus.Submitted && (
                                  <ApproveOrRejectRequestButton id={item.id} />
                                )}
                                {(item.approvalStatus ===
                                  ApprovalStatus.Draft ||
                                  item.approvalStatus ===
                                    ApprovalStatus.Rejected) && (
                                  <Button
                                    size="small"
                                    onClick={() =>
                                      setSelectedEducationLevel(item)
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
          No matching education levels found
        </Alert>
      )}
      <Pagination
        pageNumber={paginationState.pageNumber}
        pageSize={paginationState.pageSize}
        onChange={handlePaginationChange}
        totalRowsCount={statusCounts?.submitted}
        rowsPerPageOptions={[10, 20, 50]}
      />
      {selectedEducationLevel && (
        <EducationLevelDialog
          initialEducationLevel={selectedEducationLevel}
          onClose={() => {
            setSelectedEducationLevel(undefined);
          }}
          title="Update Education Level"
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
