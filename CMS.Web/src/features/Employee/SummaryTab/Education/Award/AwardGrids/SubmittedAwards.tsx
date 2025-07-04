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
  AwardDto,
  useGetAwardCountPerStatusQuery,
  useGetAwardsForPaginationQuery,
} from "../../../../../../app/store";
import { ApprovalStatus } from "../../../../../../app/api/enums";
import { SubmitApprovalButton } from "../SubmitApprovalButton"; // Renamed
import { ApproveOrRejectRequestButton } from "../ApproveOrRejectRequestButton";
import { Pagination } from "../../../../../../components/Pagination";
import { AwardDialog } from "../AwardDialog"; // Renamed

interface PaginationState {
  pageNumber: number;
  pageSize?: number;
}

export const SubmittedAwards = () => {
  // Renamed component
  const permissions = usePermission();
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageNumber: 0,
    pageSize: 10,
  });
  const [selectedAward, setSelectedAward] = useState<AwardDto>(); // Changed state name
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();

  const { data: statusCounts, isLoading: isCountsLoading } =
    useGetAwardCountPerStatusQuery(); // Fetch award counts

  const {
    data: awardsData, // Changed data variable name
    isLoading: isListLoading,
    refetch: refetchAwards, // Changed refetch name
  } = useGetAwardsForPaginationQuery({
    // Fetch awards
    pageNumber: paginationState.pageNumber + 1,
    pageSize: paginationState.pageSize,
    status: ApprovalStatus.Submitted,
  });

  const isDataLoading = isCountsLoading || isListLoading;
  const submittedAwards = awardsData?.items || []; // Changed variable name

  // Filter awards based on searchQuery
  const filteredSubmittedAwards = searchQuery
    ? submittedAwards.filter(
        (
          award // Changed variable name
        ) =>
          award.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          award.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : submittedAwards; // Changed variable name

  // Show "No Matching Results" alert
  const showNoMatchingResultsAlert =
    searchQuery && filteredSubmittedAwards.length === 0; // Changed variable name

  const handlePaginationChange = useCallback(
    (newPaginationState: PaginationState) => {
      setPaginationState(newPaginationState);
    },
    [setPaginationState]
  );

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
                {filteredSubmittedAwards.map(
                  (
                    item: AwardDto // Changed variable name
                  ) => (
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
                                  <SubmitApprovalButton id={item.id} /> // Renamed component
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
                                    onClick={() => setSelectedAward(item)} // Changed state setter
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
      {showNoMatchingResultsAlert && ( // Changed variable name
        <Alert severity="info" sx={{ m: 2 }}>
          No matching awards found {/* Changed message */}
        </Alert>
      )}
      <Pagination
        pageNumber={paginationState.pageNumber}
        pageSize={paginationState.pageSize}
        onChange={handlePaginationChange}
        totalRowsCount={statusCounts?.submitted}
        rowsPerPageOptions={[10, 20, 50]}
      />
      {selectedAward && ( // Changed state variable
        <AwardDialog // Renamed component
          initialAward={selectedAward} // Changed prop name
          onClose={() => {
            setSelectedAward(undefined); // Changed state setter
          }}
          title="Update Award" // Changed title
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
