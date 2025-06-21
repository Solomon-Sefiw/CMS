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
import { Fragment, useState, useCallback, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  SubCityDto,
  useGetSubCityCountPerStatusQuery,
  useGetSubCitiesForPaginationQuery,
} from "../../../../app/api";
import { ApprovalStatus } from "../../../../app/api/enums";
import { ApproveOrRejectRequestButton } from "../ApproveOrRejectRequestButton";
import { Pagination } from "../../../../components/Pagination";
import { SubCityDialog } from "../SubCityDialog";
import { SubCityApprovalButton } from "../SubCityApprovalButton";
import { usePermission } from "../../../../hooks";

interface PaginationState {
  pageNumber: number;
  pageSize?: number;
}

export const DraftSubCities = () => {
  const permissions = usePermission();
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageNumber: 0,
    pageSize: 10,
  });
  const [selectedSubCity, setSelectedSubCity] = useState<SubCityDto>();
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();

  const { data: statusCounts, isLoading: isCountsLoading } =
    useGetSubCityCountPerStatusQuery(); // Fetch all counts

  const {
    data: subCitiesData,
    isLoading: isListLoading,
    refetch: refetchSubCities,
  } = useGetSubCitiesForPaginationQuery({
    pageNumber: paginationState.pageNumber + 1,
    pageSize: paginationState.pageSize,
    status: ApprovalStatus.Draft,
  });

  const isDataLoading = isCountsLoading || isListLoading;
  const draftSubCities = subCitiesData?.items || [];

  // Filter sub-cities based on searchQuery
  const filteredDraftSubCities = searchQuery
    ? draftSubCities.filter(
        (subCity) =>
          subCity.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          subCity.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          subCity.regionName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : draftSubCities;

  // Show "No Matching Results" alert
  const showNoMatchingResultsAlert =
    searchQuery && filteredDraftSubCities.length === 0;

  const handlePaginationChange = useCallback(
    (newPaginationState: PaginationState) => {
      setPaginationState(newPaginationState);
    },
    [setPaginationState]
  );

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
                  <TableCell sx={{ fontWeight: "bold" }}>Region</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDraftSubCities.map((item: SubCityDto) => (
                  <Fragment key={item.id}>
                    <TableRow hover={false} key={item.id}>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.name}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.description}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.regionName}
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
                                <SubCityApprovalButton id={item.id} />
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
                                  onClick={() => setSelectedSubCity(item)}
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
          No matching sub-cities found
        </Alert>
      )}
      <Pagination
        pageNumber={paginationState.pageNumber}
        pageSize={paginationState.pageSize}
        onChange={handlePaginationChange}
        totalRowsCount={statusCounts?.draft}
        rowsPerPageOptions={[10, 20, 50]}
      />
      {selectedSubCity && (
        <SubCityDialog
          initialSubCity={selectedSubCity}
          onClose={() => {
            setSelectedSubCity(undefined);
          }}
          title="Update Sub-City"
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
