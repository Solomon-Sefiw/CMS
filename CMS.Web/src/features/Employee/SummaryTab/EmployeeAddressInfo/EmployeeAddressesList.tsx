import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  CircularProgress,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
} from "@mui/material";
import { AddressType, Country } from "../../../../app/api/enums";
import { AddressDto, useGetAddressByRequestIdQuery } from "../../../../app/api";
import Add from "@mui/icons-material/Add";
import Home from "@mui/icons-material/Home";
import { EmployeeAddressDialog } from "./EmployeeAddressDialog";
import { Edit } from "@mui/icons-material";
import { usePermission } from "../../../../hooks";

interface Props {
  requestId?: number;
  addressType: AddressType;
  expanded: boolean;
}

const EmployeeAddressesList: React.FC<Props> = ({
  requestId,
  addressType,
  expanded,
}) => {
  const { data, isLoading, error, refetch } = useGetAddressByRequestIdQuery(
    { requestId, addressType },
    { skip: !requestId || !expanded }
  );
  const permissions = usePermission();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<AddressDto | undefined>(
    undefined
  );

  useEffect(() => {
    if (expanded) {
      refetch();
    }
  }, [expanded, refetch]);

  const handleAddAddressClick = () => {
    setAddressToEdit(undefined);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const addresses = data ? (Array.isArray(data) ? data : [data]) : [];

  return (
    <>
      <Grid container spacing={2}>
        {/* Add Address Button */}

        {isLoading ? (
          <Grid item xs={12}>
            <CircularProgress />
          </Grid>
        ) : error ? (
          <Grid item xs={12}>
            <Typography color="error">Error loading addresses</Typography>
          </Grid>
        ) : addresses.length === 0 ? (
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Typography sx={{ paddingLeft: 4, color: "orange" }}>
                No addresses available
              </Typography>
              <TableCell sx={{ padding: 0 }}>
                <Button
                  variant="contained"
                  disabled={!permissions.CanCreateUpdateAddressAndContact}
                  startIcon={addresses.length > 0 ? <Edit /> : <Add />}
                  endIcon={
                    addresses.length > 0 ? null : (
                      <Home sx={{ color: "green" }} />
                    )
                  }
                  size="small"
                  sx={{
                    backgroundColor: addresses.length > 0 ? "" : "",
                    color: "white",
                    "&:hover": {
                      backgroundColor: addresses.length > 0 ? "" : "",
                    },
                    fontWeight: "bold",
                  }}
                  onClick={handleAddAddressClick}
                >
                  {addresses.length > 0 ? "" : ""}
                </Button>
              </TableCell>
            </Box>
          </Grid>
        ) : (
          addresses.map((address: AddressDto) => (
            <Grid item xs={12} key={address.id}>
              <Paper
                elevation={2}
                sx={{
                  borderRadius: 1,
                  padding: 2,
                }}
              >
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="address table">
                    <TableBody sx={{ backgroundColor: "#f4f6f8" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Country
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Region
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>City</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          SubCity
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Woreda
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold", color: "primary.dark" }}
                        >
                          Action
                        </TableCell>

                        {/* Add button column at the end */}
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          {address.country && Country[address.country]}
                        </TableCell>
                        <TableCell>
                          {address.regionId && address.regionName}
                        </TableCell>
                        <TableCell>{address.city}</TableCell>
                        <TableCell>
                          {address.subCityId && address.subCityName}
                        </TableCell>
                        <TableCell>{address.woreda}</TableCell>
                        {/* Align the button in the last cell */}
                        <TableCell sx={{ textAlign: "center" }}>
                          <Button
                            variant="contained"
                            disabled={!permissions.CanCreateUpdateAddressAndContact}
                            startIcon={
                              addresses.length > 0 ? <Edit /> : <Add />
                            }
                            endIcon={
                              addresses.length > 0 ? null : (
                                <Home sx={{ color: "green" }} />
                              )
                            }
                            size="small"
                            sx={{
                              backgroundColor: addresses.length > 0 ? "" : "",
                              color: "white",
                              "&:hover": {
                                backgroundColor: addresses.length > 0 ? "" : "",
                              },
                              fontWeight: "bold",
                            }}
                            onClick={handleAddAddressClick}
                          >
                            {addresses.length > 0 ? "" : ""}
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          ))
        )}
      </Grid>

      <EmployeeAddressDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        title={addressToEdit ? "Edit Address" : "Add Address"}
        requestId={requestId}
        addressType={addressType}
        address={addressToEdit}
      />
    </>
  );
};

export default EmployeeAddressesList;
