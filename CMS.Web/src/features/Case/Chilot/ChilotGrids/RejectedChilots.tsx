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
import { SubmitApprovalButton } from "../SubmitApprovalButton"; // Renamed
import { ApproveOrRejectRequestButton } from "../ApproveOrRejectRequestButton";
import { usePermission } from "../../../../hooks";
import { ChilotDto, useGetChilotCountPerStatusQuery, useGetChilotsForPaginationQuery } from "../../../../app/api/HCMSApi";
import { ApprovalStatus } from "../../../../app/api/enums";
import { Pagination } from "../../../../components/Pagination";
import { ChilotDialog } from "../ChilotDialog";

interface PaginationState {
  pageNumber: number;
  pageSize?: number;
}

export const RejectedChilots = () => {
  // Renamed component
  const permissions = usePermission();
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageNumber: 0,
    pageSize: 10,
  });
  const [selectedChilot, setSelectedChilot] = useState<ChilotDto>(); // Changed state name
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();

  const { data: statusCounts, isLoading: isCountsLoading } =
    useGetChilotCountPerStatusQuery(); // Fetch award counts

  const {
    data: chilotsData, // Changed data variable name
    isLoading: isListLoading,
    refetch: refetchChilots, // Changed refetch name
  } = useGetChilotsForPaginationQuery({
    // Fetch awards
    pageNumber: paginationState.pageNumber + 1,
    pageSize: paginationState.pageSize,
    status: ApprovalStatus.Rejected,
  });

  const isDataLoading = isCountsLoading || isListLoading;
  const draftChilots = chilotsData?.items || []; // Changed variable name

  // Filter awards based on searchQuery
  const filteredDraftChilots = searchQuery
    ? draftChilots.filter(
        (
          chilot // Changed variable name
        ) =>
          chilot.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chilot.roomNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : draftChilots; // Changed variable name

  // Show "No Matching Results" alert
  const showNoMatchingResultsAlert =
    searchQuery && filteredDraftChilots.length === 0; // Changed variable name

  const handlePaginationChange = useCallback(
    (newPaginationState: PaginationState) => {
      setPaginationState(newPaginationState);
    },
    [setPaginationState]
  );
  return (
    <Box>
      {!isDataLoading && !!statusCounts?.rejected && (
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
                {filteredDraftChilots.map(
                  (
                    item: ChilotDto // Changed variable name
                  ) => (
                    <Fragment key={item.id}>
                      <TableRow hover={false} key={item.id}>
                        <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                          {item.name}
                        </TableCell>
                        <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                          {item.roomNumber}
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
                                    onClick={() => setSelectedChilot(item)} // Changed state setter
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
          No matching Chilots found {/* Changed message */}
        </Alert>
      )}
      <Pagination
        pageNumber={paginationState.pageNumber}
        pageSize={paginationState.pageSize}
        onChange={handlePaginationChange}
        totalRowsCount={statusCounts?.rejected || 0}
        rowsPerPageOptions={[10, 20, 50]}
      />
      {selectedChilot && ( // Changed state variable
        <ChilotDialog // Renamed component
          initialChilot={selectedChilot} // Changed prop name
          onClose={() => {
            setSelectedChilot(undefined); // Changed state setter
          }}
          title="Update Chilot" // Changed title
        />
      )}
      {!isDataLoading && !statusCounts?.rejected && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Typography> No Data Available</Typography>
        </Box>
      )}
    </Box>
  );
};
