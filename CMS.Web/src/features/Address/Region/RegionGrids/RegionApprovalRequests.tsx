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
import { usePermission } from "../../../../hooks";
import {
  RegionDto,
  useGetRegionCountPerStatusQuery,
  useGetRegionsForPaginationQuery,
} from "../../../../app/api";
import { ApprovalStatus } from "../../../../app/api/enums";
import { RegionApprovalButton } from "../RegionApprovalButton";
import { ApproveOrRejectRequestButton } from "../ApproveOrRejectRequestButton";
import { Pagination } from "../../../../components/Pagination";
import { RegionDialog } from "../RegionDialog";

interface PaginationState {
  pageNumber: number;
  pageSize?: number;
}

export const RegionApprovalRequests = () => {
  const permissions = usePermission();
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageNumber: 0,
    pageSize: 10,
  });
  const [selectedRegion, setSelectedRegion] = useState<RegionDto>();
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();

  const { data: counts, isLoading: isCountsLoading } =
    useGetRegionCountPerStatusQuery();

  const {
    data: paginatedRegionsData,
    isLoading: isListLoading,
    refetch: refetchRegions,
  } = useGetRegionsForPaginationQuery({
    pageNumber: paginationState.pageNumber + 1,
    pageSize: paginationState.pageSize,
    status: ApprovalStatus.Submitted,
  });

  const isLoading = isCountsLoading || isListLoading;
  const submittedRegions = paginatedRegionsData?.items || [];

  // Filter regions based on searchQuery
  const filteredSubmittedRegions = searchQuery
    ? submittedRegions.filter(
        (region) =>
          region.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          region.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : submittedRegions;

  const showNoMatchingResultsAlert =
    searchQuery && filteredSubmittedRegions.length === 0;

  const handlePaginationChange = useCallback(
    (newPaginationState: PaginationState) => {
      setPaginationState(newPaginationState);
    },
    [setPaginationState]
  );

  return (
    <Box>
      {!isLoading && !!counts?.submitted && (
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
                {filteredSubmittedRegions.map((item: RegionDto) => (
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
                              {item.approvalStatus === ApprovalStatus.Draft && (
                                <RegionApprovalButton id={item.id} />
                              )}
                              {item.approvalStatus ===
                                ApprovalStatus.Submitted && (
                                <ApproveOrRejectRequestButton id={item.id} />
                              )}
                              {(item.approvalStatus === ApprovalStatus.Draft ||
                                item.approvalStatus ===
                                  ApprovalStatus.Rejected) && (
                                <Button
                                  size="small"
                                  onClick={() => setSelectedRegion(item)}
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
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      {showNoMatchingResultsAlert && (
        <Alert severity="info" sx={{ m: 2 }}>
          No matching Rejected regions found
        </Alert>
      )}
      <Pagination
        pageNumber={paginationState.pageNumber}
        pageSize={paginationState.pageSize}
        onChange={handlePaginationChange}
        totalRowsCount={counts?.submitted}
        rowsPerPageOptions={[10, 20, 50]}
      />
      {selectedRegion && (
        <RegionDialog
          initialRegion={selectedRegion}
          onClose={() => {
            setSelectedRegion(undefined);
            refetchRegions();
          }}
          title="Update Region"
        />
      )}

      {!isLoading && !counts?.submitted && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Typography> No Rejected Regions Available</Typography>
        </Box>
      )}
    </Box>
  );
};
