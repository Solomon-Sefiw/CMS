import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AddressType, ContactCategory } from "../../../app/api/enums";
import EmployeeContactsList from "./EmployeeContactInfo/EmployeeContactsList";
import EmployeeAddressesList from "./EmployeeAddressInfo/EmployeeAddressesList";
import { JobCatagory } from "../../../app/api";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ContactEmergencyIcon from "@mui/icons-material/ContactEmergency";
import HomeIcon from "@mui/icons-material/Home";
import EmployeeEmeregencyContactLists from "./EmployeeEmeregencyContactInfo/EmployeeEmeregencyContactLists";

interface JobCatagoryListProps {
  items?: JobCatagory[];
  employeeId?: number;
  hideWorkflowComment?: boolean;
  suppressActionColumn?: boolean;
}

export const JobCatagoryListTest = ({ employeeId }: JobCatagoryListProps) => {
  const [expandedParent, setExpandedParent] = useState<string | false>(false);
  const [expandedBirthPlace, setExpandedBirthPlace] = useState<boolean>(false);
  const [expandedCurrentAddress, setExpandedCurrentAddress] =
    useState<boolean>(false);
  const [expandedContact, setExpandedContact] = useState<boolean>(false);
  const [expandedEmergencyContact, setExpandedEmergencyContact] =
    useState<boolean>(false);

  const handleParentAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedParent(isExpanded ? panel : false);
    };

  return (
    <Box>
      {/* Parent Accordion */}
      <Accordion
        expanded={expandedParent === "main"}
        onChange={handleParentAccordionChange("main")}
        sx={{
          backgroundColor: "#ffffff",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "#3f51b5" }} />}
          sx={{
            color: "#3f51b5",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Employee Address Information
          </Typography>
        </AccordionSummary>

        <AccordionDetails sx={{ backgroundColor: "#f5f5f5" }}>
          {/* Address Accordion (Contains Birth Place and Current Address) */}
          <Accordion
            expanded={expandedBirthPlace || expandedCurrentAddress}
            onChange={(event, isExpanded) => setExpandedBirthPlace(isExpanded)}
            sx={{ boxShadow: 0, marginBottom: 1 }} // Reduced margin
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon sx={{ color: "#3f51b5", fontSize: "1.5rem" }} />
              } // Adjusted icon size
            >
              <Typography
                variant="subtitle2"
                color="primary"
                sx={{ fontSize: "0.875rem", fontWeight: 600 }} // Reduced font size
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <LocationOnIcon
                    sx={{
                      marginRight: 0.5,
                      color: "#3f51b5",
                      fontSize: "1.25rem",
                    }}
                  />{" "}
                  {/* Adjusted icon size */}
                  Address
                </Box>
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0 }}>
              {" "}
              {/* Reduced padding */}
              {/* Birth Place Accordion */}
              <Accordion sx={{ marginBottom: 1, boxShadow: 0, paddingLeft: 1 }}>
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon
                      sx={{ color: "#3f51b5", fontSize: "1.5rem" }}
                    />
                  }
                >
                  <Typography variant="subtitle2" sx={{ fontSize: "0.875rem" }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-start"
                    >
                      <HomeIcon
                        sx={{
                          marginRight: 0.5,
                          color: "#3f51b5",
                          fontSize: "1.25rem",
                          paddingBottom: 0.5,
                        }}
                      />
                      Birth Place Address
                    </Box>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: 0 }}>
                  <EmployeeAddressesList
                    requestId={employeeId}
                    addressType={AddressType.BirthPlaceAddress}
                    expanded={expandedBirthPlace}
                  />
                </AccordionDetails>
              </Accordion>
              {/* Current Address Accordion */}
              <Accordion
                expanded={expandedCurrentAddress}
                onChange={(event, isExpanded) =>
                  setExpandedCurrentAddress(isExpanded)
                }
                sx={{ marginBottom: 1, boxShadow: 0, paddingLeft: 1 }}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon
                      sx={{ color: "#3f51b5", fontSize: "1.5rem" }}
                    />
                  }
                >
                  <Typography variant="subtitle2" sx={{ fontSize: "0.875rem" }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-start"
                    >
                      <HomeIcon
                        sx={{
                          marginRight: 0.5,
                          color: "#3f51b5",
                          fontSize: "1.25rem",
                          paddingBottom: 0.5,
                        }}
                      />
                      Current Address
                    </Box>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: 0 }}>
                  <EmployeeAddressesList
                    requestId={employeeId}
                    addressType={AddressType.CurrentAddress}
                    expanded={expandedCurrentAddress}
                  />
                </AccordionDetails>
              </Accordion>
            </AccordionDetails>
          </Accordion>

          {/* Contact Accordion */}
          <Accordion
            expanded={expandedContact}
            onChange={(event, isExpanded) => setExpandedContact(isExpanded)}
            sx={{ boxShadow: 0, marginBottom: 1 }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon sx={{ color: "#3f51b5", fontSize: "1.5rem" }} />
              }
            >
              <Typography
                variant="subtitle2"
                color="primary"
                sx={{ fontSize: "0.875rem", fontWeight: 600 }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <MailOutlineIcon
                    sx={{
                      marginRight: 0.5,
                      color: "#3f51b5",
                      fontSize: "1.25rem",
                    }}
                  />
                  Contact
                </Box>
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ paddingBottom: 1 }}>
              <EmployeeContactsList
                requestId={employeeId}
                contactCategory={ContactCategory.EmployeeContact}
              />
            </AccordionDetails>
          </Accordion>

          {/* Emergency Contact Accordion */}
          <Accordion
            expanded={expandedEmergencyContact}
            onChange={(event, isExpanded) =>
              setExpandedEmergencyContact(isExpanded)
            }
            sx={{ boxShadow: 0, marginBottom: 1 }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon sx={{ color: "#3f51b5", fontSize: "1.5rem" }} />
              }
            >
              <Typography
                variant="subtitle2"
                color="primary"
                sx={{ fontSize: "0.875rem", fontWeight: 600 }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <ContactEmergencyIcon
                    sx={{ marginRight: 0.5, fontSize: "1.25rem" }}
                  />
                  Emergency Contact
                </Box>
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0 }}>
              {employeeId !== undefined && (
                <EmployeeEmeregencyContactLists employeeId={employeeId} />
              )}
            </AccordionDetails>
          </Accordion>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
