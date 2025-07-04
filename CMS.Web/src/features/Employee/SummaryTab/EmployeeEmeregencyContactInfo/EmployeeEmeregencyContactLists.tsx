import React, { useState } from "react";
import {
  Grid,
  Typography,
  Box,
  Divider,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import {
  EmployeeEmergencyContactDto,
  useGetEmployeeEmergencyContactsQuery,
} from "../../../../app/api";

import EmployeeAddressesList from "../EmployeeAddressInfo/EmployeeAddressesList";
import { AddressType, ContactCategory } from "../../../../app/api/enums";
import BusinessIcon from "@mui/icons-material/Business";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import EmployeeContactsList from "../EmployeeContactInfo/EmployeeContactsList";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { EmployeeEmergencyContactDialog } from "./EmployeeEmergencyContactDialog ";
import { usePermission } from "../../../../hooks";

interface EmployeeEmergencyContactListsProps {
  employeeId: number;
}

const EmployeeEmergencyContactLists: React.FC<
  EmployeeEmergencyContactListsProps
> = ({ employeeId }) => {
  const { data, isLoading, isError, refetch } =
    useGetEmployeeEmergencyContactsQuery({ employeeId });
  const permissions = usePermission();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState<
    EmployeeEmergencyContactDto | undefined
  >(undefined);
  const [expandedContactId, setExpandedContactId] = useState<number | null>(
    null
  );
  const [expanded, setExpanded] = useState(true);

  const handleOpenDialog = (contact?: EmployeeEmergencyContactDto) => {
    setSelectedContact(contact);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    refetch();
  };

  const handleToggleAccordion = (contactId: number | null) => {
    setExpandedContactId(expandedContactId === contactId ? null : contactId);
  };

  return (
    <Box>
      <Grid
        container
        justifyContent="flex-end"
        sx={{ marginBottom: 1, paddingRight: "16px" }}
      >
        <Button
          variant="contained"
          color="success"
          disabled={!permissions.CanCreateUpdateAddressAndContact}
          onClick={() => handleOpenDialog()}
          sx={{
            backgroundColor: "#008000",
            color: "white",
            "&:hover": { backgroundColor: "#1976d2" },
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            fontWeight: "bold",
          }}
          startIcon={<PersonAddIcon />}
        >
          Add
        </Button>
      </Grid>

      <Grid container spacing={0} alignItems="center" sx={{ paddingLeft: 1 }}>
        <Grid item xs={3.5} sx={{ maxWidth: "300px" }}>
          <Typography sx={{ fontWeight: "bold" }}>Name</Typography>
        </Grid>
        <Grid item xs={3.5} sx={{ maxWidth: "300px" }}>
          <Typography sx={{ fontWeight: "bold" }}>Working Firm</Typography>
        </Grid>
        <Grid item xs={3.5} sx={{ maxWidth: "300px" }}>
          <Typography sx={{ fontWeight: "bold" }}>Actions</Typography>
        </Grid>
      </Grid>

      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : isError ? (
        <Typography>Error</Typography>
      ) : !data?.length ? (
        <Typography>No emergency contacts</Typography>
      ) : (
        data.map((contact: EmployeeEmergencyContactDto) => (
          <Box key={contact.id} sx={{ paddingLeft: 1 }}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={3.5} sx={{ maxWidth: "200px" }}>
                <Typography variant="body1" noWrap>
                  {`${contact.name} ${contact.middleName} ${contact.lastName}`}
                </Typography>
              </Grid>
              <Grid item xs={3.5} sx={{ maxWidth: "200px" }}>
                <Typography variant="body2">
                  {contact.workingFirmName || "N/A"}
                </Typography>
              </Grid>
              <Grid
                item
                xs={3.5}
                container
                spacing={1}
                justifyContent="flex-end"
              >
                <Grid item>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    disabled={!permissions.CanCreateUpdateAddressAndContact}
                    onClick={() => handleOpenDialog(contact)}
                    startIcon={<EditIcon />}
                    sx={{ height: 30, width: 50, padding: 0 }}
                  >
                    Edit
                  </Button>
                </Grid>
                <Grid item>
                  <Tooltip title="See More...">
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={() => handleToggleAccordion(contact.id ?? null)}
                      startIcon={<ReadMoreIcon />}
                      sx={{ height: 30, width: 50, padding: 0 }}
                    />
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>

            {expandedContactId === contact.id && (
              <>
                <Accordion sx={{ marginTop: 1, width: 700 }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${contact.id}-content`}
                    id={`panel${contact.id}-header`}
                  >
                    <Typography variant="subtitle1">
                      <Box display="flex" alignItems="center">
                        <LocationOnIcon
                          sx={{ marginRight: 1 }}
                          color="primary"
                        />
                        Address Info
                      </Box>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${contact.id}-emergency-content`}
                        id={`panel${contact.id}-emergency-header`}
                      >
                        <Typography variant="subtitle2">
                          <Box display="flex" alignItems="center">
                            <DirectionsRunIcon
                              sx={{ marginRight: 1, color: "primary.main" }}
                            />
                            Emergency Contact Address
                          </Box>
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <EmployeeAddressesList
                          requestId={contact.id}
                          addressType={AddressType.EmergencyContactAddress}
                          expanded={expanded}
                        />
                      </AccordionDetails>
                    </Accordion>

                    <Accordion sx={{ marginTop: 1 }}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${contact.id}-working-content`}
                        id={`panel${contact.id}-working-header`}
                      >
                        <Typography variant="subtitle2">
                          <Box display="flex" alignItems="center">
                            <BusinessIcon
                              sx={{ marginRight: 1 }}
                              color="primary"
                            />
                            Working Firm Address
                          </Box>
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <EmployeeAddressesList
                          requestId={contact.id}
                          addressType={AddressType.WorkingFirmAddress}
                          expanded={expanded}
                        />
                      </AccordionDetails>
                    </Accordion>
                  </AccordionDetails>
                </Accordion>

                <Accordion sx={{ marginTop: 1, width: 700 }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${contact.id}-content`}
                    id={`panel${contact.id}-header`}
                  >
                    <Typography variant="subtitle1">
                      <Box display="flex" alignItems="center">
                        <PhoneIcon sx={{ marginRight: 1 }} color="primary" />
                        Contact Details
                      </Box>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <EmployeeContactsList
                      requestId={contact.id}
                      contactCategory={ContactCategory.EmergencyContact}
                    />
                  </AccordionDetails>
                </Accordion>
              </>
            )}
            <Divider sx={{ marginTop: 2 }} />
          </Box>
        ))
      )}

      <EmployeeEmergencyContactDialog
        open={openDialog}
        onClose={handleCloseDialog}
        title={
          selectedContact ? "Edit Emergency Contact" : "Add Emergency Contact"
        }
        employeeId={employeeId}
        contact={selectedContact}
      />
    </Box>
  );
};

export default EmployeeEmergencyContactLists;
