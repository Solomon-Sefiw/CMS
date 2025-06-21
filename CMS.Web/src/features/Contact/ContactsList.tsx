import React from "react";
import { Box, Typography, Grid, useTheme } from "@mui/material";
import {
  ContactDto,
  useGetContactsByIdQuery,
  ContactCategoryEnum,
} from "../../app/api";
import { ContactCategory, ContactType } from "../../app/api/enums";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import FaxIcon from "@mui/icons-material/Fax";
import HomeIcon from "@mui/icons-material/Home";
import CellTowerIcon from "@mui/icons-material/CellTower";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LanguageIcon from "@mui/icons-material/Language"; // For Website

interface Props {
  requestId?: number;
  contactCategory: ContactCategory;
}

const contactIconMap: Record<ContactType, React.ReactElement> = {
  [ContactType.Email]: <MailOutlineIcon />,
  [ContactType.CellPhone]: <CellTowerIcon />,
  [ContactType.HomePhone]: <HomeIcon />,
  [ContactType.WorkPhone]: <PhoneIcon />,
  [ContactType.Fax]: <FaxIcon />,
  [ContactType.PoBox]: <PersonIcon />,
  // Add other ContactType mappings as needed
};

const getContactTypeLabel = (contactType: ContactType): string => {
  switch (contactType) {
    case ContactType.WorkPhone:
      return "Work Phone";
    case ContactType.Email:
      return "Email Address";
    case ContactType.CellPhone:
      return "Mobile Phone";
    case ContactType.HomePhone:
      return "Home Phone";
    case ContactType.Fax:
      return "Fax Number";
    case ContactType.PoBox:
      return "PO Box";
    default:
      return String(contactType);
  }
};

const ContactList: React.FC<Props> = ({ requestId, contactCategory }) => {
  const { data, isLoading, error } = useGetContactsByIdQuery(
    { requestId: requestId, contactCategory: contactCategory as any },
    { skip: !requestId }
  );
  const theme = useTheme();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={2}>
        <Typography color="textSecondary">Loading Contacts...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" py={2}>
        Error loading contacts
      </Typography>
    );
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <Typography py={2} color="textSecondary">
        No contacts available for this Business Unit.
      </Typography>
    );
  }

  // Combine contacts of the same type into a single string
  const combinedContacts: Record<
    string,
    { value: string; type: ContactType }[]
  > = {};

  Object.entries(data).forEach(([contactType, contacts]) => {
    contacts.forEach((contact: { value: string; type: ContactType }) => {
      if (!combinedContacts[contactType]) {
        combinedContacts[contactType] = [];
      }
      combinedContacts[contactType].push({
        value: contact.value,
        type: contact.type,
      });
    });
  });

  return (
    <Grid container spacing={2}>
      {Object.entries(combinedContacts).map(([, contacts]) => {
        const contact = contacts[0];
        const displayValue = contacts.map((c) => c.value).join(", ");
        return (
          <Grid item xs={12} sm={6} key={contact.type}>
            <Box>
              <Box display="flex" alignItems="center" gap={1}>
                {contactIconMap[contact.type] || <PersonIcon />}
                <Typography variant="body2" color="textSecondary" noWrap>
                  {getContactTypeLabel(contact.type)}:
                </Typography>
              </Box>
              <Typography
                variant="body1"
                fontWeight="bold"
                noWrap
                sx={{ wordBreak: "break-all" }}
              >
                {displayValue}
              </Typography>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default ContactList;
