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
  Alert, // Import Alert for displaying no results
} from "@mui/material";
import { Fragment, useState, useCallback } from "react";
import {
  BusinessUnitDto,
  useGetAllBuisnessUnitListsQuery,
  useGetBusinessUnitCountPerApprovalStatusQuery,
} from "../../../app/api";
import { ApprovalStatus } from "../../../app/api/enums";
import { BusinessUnitDialog } from "../BusinessUnitDialog";
import { RequestApprovalButton } from "../RequestApprovalButton";
import { ApproveOrRejectRequestButton } from "../ApproveOrRejectRequestButton";
import { Pagination } from "../../../components/Pagination";
import { RemoveRedEye } from "@mui/icons-material";
import { SelectedBusinessUnitDetail } from "../SelectedBusinessUnitDetail/SelectedBusinessUnitDetail";
import { useOutletContext } from "react-router-dom";

interface PaginationState {
  pageNumber: number;
  pageSize?: number;
}

export const ApprovalRequests = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageNumber: 0,
    pageSize: 10,
  });
  const [selectedBusinessUnit, setSelectedBusinessUnit] =
    useState<BusinessUnitDto>();

  const { searchQuery } = useOutletContext<{ searchQuery: string }>(); // Get searchQuery from context

  const { data: counts, isLoading: isCountsLoading } =
    useGetBusinessUnitCountPerApprovalStatusQuery();
  //Fetch business unit list with pagenumber and pagesize your desire from backend and with specified status
  const {
    data: items,
    isLoading: isListLoading,
    refetch: refetchList,
  } = useGetAllBuisnessUnitListsQuery({
    pageNumber: pagination.pageNumber + 1,
    pageSize: pagination.pageSize,
    status: ApprovalStatus.Submitted,
  });

  const isLoading = isCountsLoading || isListLoading;

  // Filter business units based on searchQuery
  const filteredBusinessUnits = searchQuery
    ? (items?.items || []).filter(
        (option) =>
          option.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          option.businessUnitID
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          option.parentBusinessUnitName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    : items?.items || [];

  // Show "No Matching Results" alert
  const showNoMatchingAlert = searchQuery && filteredBusinessUnits.length === 0;

  // useCallback for stable pagination handler
  const handlePaginationChange = useCallback(
    (newPagination: PaginationState) => {
      setPagination(newPagination);
    },
    [setPagination]
  );

  const handleCloseBusinessUnitDialog = useCallback(() => {
    setSelectedBusinessUnit(undefined);
    refetchList();
  }, [setSelectedBusinessUnit, refetchList]);

  return (
    <Box>
      {!isLoading && !!counts?.approvalRequests && (
        <Paper>
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Parent BusinessUnit
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold",pr: 4 }}>
                    BusinessUnit_ID_Schema_Pattern
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Location
                  </TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(filteredBusinessUnits || []).map((item) => (
                  <Fragment key={item.id}>
                    <TableRow hover={false} key={item.id}>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.name}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.parentBusinessUnitName}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.businessUnitID}
                      </TableCell>
                            <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.address?.city}
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
                                <RequestApprovalButton id={item.id} />
                              )}
                              {item.approvalStatus ===
                                ApprovalStatus.Submitted && (
                                <ApproveOrRejectRequestButton id={item.id} />
                              )}
                              <Button
                                size="small"
                                onClick={() => setSelectedBusinessUnit(item)}
                              >
                                <RemoveRedEye /> View Detail
                              </Button>
                            </>
                          )}
                          {item.approvalStatus ===
                            (ApprovalStatus.Draft ||
                              ApprovalStatus.Rejected) && (
                            <>
                              {/* <Button
                                size="small"
                                onClick={() => setSelectedBusinessUnit(item)}
                              >
                                Edit
                              </Button> */}
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
      {showNoMatchingAlert && (
        <Alert severity="info" sx={{ m: 2 }}>
          No Approval Requests found with the search criteria!!
        </Alert>
      )}
      <Pagination
        pageNumber={pagination.pageNumber}
        pageSize={pagination.pageSize}
        onChange={handlePaginationChange}
        totalRowsCount={counts?.approvalRequests}
        rowsPerPageOptions={[10, 20, 50]}
      />

      {selectedBusinessUnit && (
        <SelectedBusinessUnitDetail
          businessUnit={selectedBusinessUnit}
          onClose={() => {
            setSelectedBusinessUnit(undefined);
          }}
          title={selectedBusinessUnit.name || "Untitled"}
        />
      )}

      {/* This is for if the page has no data to show the message below */}
      {!isLoading && !counts?.approvalRequests && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Typography> No Data Available</Typography>
        </Box>
      )}
    </Box>
  );
};
