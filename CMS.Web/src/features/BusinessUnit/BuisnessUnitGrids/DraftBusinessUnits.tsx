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
import {
  AddressType,
  ApprovalStatus,
  ContactCategory,
} from "../../../app/api/enums";
import { BusinessUnitDialog } from "../BusinessUnitDialog";
import { RequestApprovalButton } from "../RequestApprovalButton";
import { ApproveOrRejectRequestButton } from "../ApproveOrRejectRequestButton";
import { Pagination } from "../../../components/Pagination";
import { AddressDialog } from "../../Address/AddressDialog";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import ContactEmergencyIcon from "@mui/icons-material/ContactEmergency";
import { ContactDialogNew } from "../../Contact/ContactDialogNew";
import { useOutletContext } from "react-router-dom"; // Import useOutletContext
import { usePermission } from "../../../hooks";

interface PaginationState {
  pageNumber: number;
  pageSize?: number;
}

interface DraftBusinessUnitsProps {}

export const DraftBusinessUnits: React.FC<DraftBusinessUnitsProps> = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageNumber: 0,
    pageSize: 10,
  });
  const permissions = usePermission();

  const [selectedBusinessUnit, setSelectedBusinessUnit] =
    useState<BusinessUnitDto>();
  const [selectedAddress, setSelectedAddress] = useState<number>();
  const [selectedContact, setSelectedContact] = useState<number>();
  const { searchQuery } = useOutletContext<{ searchQuery: string }>(); // Get searchQuery from context

  const { data: counts, isLoading: isCountsLoading } =
    useGetBusinessUnitCountPerApprovalStatusQuery();
  const {
    data: items,
    isLoading: isListLoading,
    refetch: refetchList,
  } = useGetAllBuisnessUnitListsQuery({
    pageNumber: pagination.pageNumber + 1,
    pageSize: pagination.pageSize,
    status: ApprovalStatus.Draft,
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

  // useCallback for stable dialog close handlers
  const handleCloseBusinessUnitDialog = useCallback(() => {
    setSelectedBusinessUnit(undefined);
    refetchList(); // Refetch data after closing the dialog
  }, [setSelectedBusinessUnit, refetchList]);

  const handleCloseAddressDialog = useCallback(() => {
    setSelectedAddress(undefined);
    refetchList(); // Refetch data after closing the dialog
  }, [setSelectedAddress, refetchList]);

  const handleCloseContactDialog = useCallback(() => {
    setSelectedContact(undefined);
    refetchList(); // Refetch data after closing the dialog
  }, [setSelectedContact, refetchList]);

  return (
    <Box>
      {!isLoading && !!counts?.drafts && (
        <Paper>
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Parent BusinessUnit
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    BusinessUnit ID
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Supervisor Name
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
                              {(item.approvalStatus === ApprovalStatus.Draft ||
                                item.approvalStatus ===
                                  ApprovalStatus.Rejected) && (
                                <>
                                  <Button
                                    size="small"
                                    onClick={() =>
                                      setSelectedBusinessUnit(item)
                                    }
                                    disabled={!permissions.canCreateUpdateSetup}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    size="small"
                                    onClick={() => setSelectedAddress(item.id)}
                                    disabled={!permissions.CanCreateUpdateAddressAndContact}
                                  >
                                    <AddLocationAltIcon /> Address
                                  </Button>
                                  <Button
                                    size="small"
                                    onClick={() => setSelectedContact(item.id)}
                                    disabled={!permissions.CanCreateUpdateAddressAndContact}
                                  >
                                    <ContactEmergencyIcon /> Contact
                                  </Button>
                                </>
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
      {showNoMatchingAlert && (
        <Alert severity="info" sx={{ m: 2 }}>
          No Draft Business Units found with the search criteria!!
        </Alert>
      )}
      <Pagination
        pageNumber={pagination.pageNumber}
        pageSize={pagination.pageSize}
        onChange={handlePaginationChange}
        totalRowsCount={counts?.drafts}
        rowsPerPageOptions={[10, 20, 50]}
      />
      {selectedBusinessUnit && (
        <BusinessUnitDialog
          businessUnit={selectedBusinessUnit}
          onClose={handleCloseBusinessUnitDialog}
          title="Edit BusinesUnit"
        />
      )}
      {!isLoading && !counts?.drafts && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Typography> No Data Available</Typography>
        </Box>
      )}

      {selectedAddress && (
        <AddressDialog
          requestId={selectedAddress}
          onClose={handleCloseAddressDialog}
          title="Edit Address"
          addressType={AddressType.BusinessUnitAddress}
        />
      )}
      {selectedContact && (
        <ContactDialogNew
          requestId={selectedContact}
          contactCategory={ContactCategory.BusinessUnitContact}
          onClose={handleCloseContactDialog}
          title=""
        />
      )}
    </Box>
  );
};
