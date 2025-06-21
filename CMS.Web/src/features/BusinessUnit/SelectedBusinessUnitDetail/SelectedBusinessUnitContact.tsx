import {
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import {
  BusinessUnitDto,
  useGetContactByRequestIdQuery,
} from "../../../app/api";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person"; // Generic contact icon
import FaxIcon from "@mui/icons-material/Fax";
import HomeIcon from "@mui/icons-material/Home";
import CellTowerIcon from "@mui/icons-material/CellTower";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { ContactCategory, ContactType } from "../../../app/api/enums";

interface SelectedBusinessUnitContactsProps {
  businessUnit: BusinessUnitDto;
}

const contactIconMap: Record<ContactType, React.ReactElement> = {
  [ContactType.Email]: <MailOutlineIcon color="action" />,
  [ContactType.CellPhone]: <CellTowerIcon color="action" />,
  [ContactType.HomePhone]: <HomeIcon color="action" />,
  [ContactType.WorkPhone]: <PhoneIcon color="action" />,
  [ContactType.Fax]: <FaxIcon color="action" />,
  [ContactType.PoBox]: <PersonIcon color="action" />, // Using generic person for PoBox
};

const getContactTypeLabel = (contactType: ContactType): string => {
  switch (contactType) {
    case ContactType.WorkPhone:
      return "Work Phone";
    case ContactType.Email:
      return "Email";
    case ContactType.CellPhone:
      return "Cell Phone";
    case ContactType.HomePhone:
      return "Home Phone";
    case ContactType.Fax:
      return "Fax";
    case ContactType.PoBox:
      return "PO Box";
    default:
      return String(contactType);
  }
};

export const SelectedBusinessUnitContacts: React.FC<
  SelectedBusinessUnitContactsProps
> = ({ businessUnit }) => {
  const { data: contactsByType } = useGetContactByRequestIdQuery(
    {
      requestId: businessUnit.id!,
      contactCategory: ContactCategory.BusinessUnitContact,
    },
    { skip: !businessUnit?.id }
  );
  const theme = useTheme();

  if (!businessUnit?.id) {
    return null; // Or a message indicating no Business Unit selected
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography
        variant="h6"
        fontWeight="bold"
        color={theme.palette.primary.main}
        gutterBottom
      >
        <PersonIcon sx={{ mr: 1, color: theme.palette.primary.dark }} />
        {businessUnit.name} Contact Information
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {contactsByType && Object.keys(contactsByType).length > 0 ? (
        (
          Object.entries(contactsByType) as unknown as [
            string,
            { id: string; type: ContactType; value: string }[]
          ][]
        ).map(([contactTypeName, contactList]) => (
          <Box key={contactTypeName} sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {contactTypeName} Contacts
            </Typography>
            <List dense>
              {contactList?.map(
                (contact: { id: string; type: ContactType; value: string }) => (
                  <ListItem key={contact.id} sx={{ pl: 0 }}>
                    {contactIconMap[contact.type] || (
                      <PersonIcon color="action" />
                    )}
                    <ListItemText
                      primary={contact.value}
                      secondary={getContactTypeLabel(contact.type)}
                    />
                  </ListItem>
                )
              )}
            </List>
          </Box>
        ))
      ) : (
        <Typography variant="body2" color="textSecondary">
          No contact information available for this business unit.
        </Typography>
      )}
    </Box>
  );
};
