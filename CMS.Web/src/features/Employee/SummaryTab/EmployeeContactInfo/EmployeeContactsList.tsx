import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  CircularProgress,
  Typography,
  Paper,
  Tooltip,
} from "@mui/material";
import { ContactCategory, ContactType } from "../../../../app/api/enums";
import { ContactDto, useGetContactsByIdQuery } from "../../../../app/api";
import Add from "@mui/icons-material/Add";
import ContactMail from "@mui/icons-material/ContactMail";
import Edit from "@mui/icons-material/Edit";
import { EmployeeContactDialog } from "./EmployeeContactDialog";
import { usePermission } from "../../../../hooks";

interface Props {
  requestId?: number;
  contactCategory: ContactCategory;
}

const EmployeeContactsList: React.FC<Props> = ({
  requestId,
  contactCategory,
}) => {
  const { data, isLoading, error, refetch } = useGetContactsByIdQuery(
    { requestId: requestId, contactCategory: contactCategory },
    { skip: !requestId }
  );
  const permissions = usePermission();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState<ContactDto | undefined>(
    undefined
  );

  const handleAddContactClick = () => {
    setContactToEdit(undefined);
    setDialogOpen(true);
  };

  const handleEditContactClick = (contact: ContactDto) => {
    setContactToEdit(contact);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    refetch();
  };

  const existingContactTypes = data
    ? Object.values(data)
        .flat()
        .map((contact) => contact.type)
    : [];

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error loading contacts</Typography>;
  }

  const hasContacts = data && Object.keys(data).length > 0;

  return (
    <>
      <Grid container spacing={0}>
        <Grid item xs={10.5}>
          <Box display="flex" justifyContent="flex-end" mb={0}>
            {/* Add Contact Button (always visible) */}
            <Tooltip title="Add Contact">
              <Button
                variant="contained"
                disabled={!permissions.CanCreateUpdateAddressAndContact}
                startIcon={<Add />}
                endIcon={<ContactMail />}
                size="small"
                sx={{
                  backgroundColor: "#008000",
                  color: "white",
                  "&:hover": { backgroundColor: "#1976d2" },
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  fontWeight: "bold",
                }}
                onClick={handleAddContactClick}
              ></Button>
            </Tooltip>
          </Box>
        </Grid>

        {hasContacts ? (
          Object.entries(data).map(([contactType, contacts]) =>
            contacts.map((contact: ContactDto) => (
              <Grid item xs={10.5} key={contact.id}>
                <Paper
                  elevation={1}
                  sx={{
                    padding: 1,
                    borderRadius: 1,
                    backgroundColor: "#f9f9f9",
                    transition: "0.3s",
                    "&:hover": { backgroundColor: "" },
                  }}
                >
                  <Grid container alignItems="center">
                    <Grid item xs={9}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: "1rem",
                          color: "primary.dark",
                        }}
                      >
                        {`${contactType} : ${contact.value}`}
                      </Typography>
                    </Grid>
                    <Grid item xs={3} paddingRight={12}>
                      <Box display="flex" justifyContent="flex-end">
                        <Tooltip title="Edit Contact">
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            disabled={
                              !permissions.CanCreateUpdateAddressAndContact
                            }
                            onClick={() => handleEditContactClick(contact)}
                            startIcon={<Edit />}
                            sx={{
                              fontWeight: "bold",
                              textTransform: "none",
                              "&:hover": { backgroundColor: "#e3f2fd" },
                            }}
                          ></Button>
                        </Tooltip>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))
          )
        ) : (
          <Grid item xs={10.5}>
            <Typography>No contacts available.</Typography>
          </Grid>
        )}
      </Grid>

      <EmployeeContactDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        title={contactToEdit ? "Edit Contact" : "Add Contact"}
        requestId={requestId}
        contactCategory={contactCategory}
        contactData={contactToEdit}
        existingContactTypes={existingContactTypes}
      />
    </>
  );
};

export default EmployeeContactsList;
