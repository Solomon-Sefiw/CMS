import { Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ContactDto,
  useCreateContactMutation,
  useGetContactByRequestIdQuery,
  useGetContactsByIdQuery,
  useUpdateContactByRequestIdMutation,
} from "../../app/api/HCMSApi";
import { ContactCategory, ContactType } from "../../app/api/enums";
import { useAlert } from "../notification";
import * as Yup from "yup";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import FaxIcon from "@mui/icons-material/Fax";
import HomeIcon from "@mui/icons-material/Home";
import CellTowerIcon from "@mui/icons-material/CellTower";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { DialogHeader, Errors, FormTextField } from "../../components";

const emptyContactData: ContactDto = {
  type: ContactType.Email,
  value: "",
  requestId: 0,
};

interface ContactDialogNewProps {
  onClose: () => void;
  title: string;
  requestId?: number;
  contactCategory: ContactCategory;
}

const contactIconMap: Record<ContactType, React.ReactElement> = {
  [ContactType.Email]: <MailOutlineIcon color="primary" />,
  [ContactType.CellPhone]: <CellTowerIcon color="primary" />,
  [ContactType.HomePhone]: <HomeIcon color="primary" />,
  [ContactType.WorkPhone]: <PhoneIcon color="primary" />,
  [ContactType.Fax]: <FaxIcon color="primary" />,
  [ContactType.PoBox]: <PersonIcon color="primary" />,
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

const getValidationSchema = (contactType: ContactType) =>
  Yup.object({
    value: (() => {
      let schema = Yup.string().required("Value is required");

      switch (contactType) {
        case ContactType.Email:
          schema = Yup.string()
            .required("Email is required")
            .email("Invalid email address. Example: user@example.com")
            .matches(
              /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              "Enter a valid email address. Allowed characters before '@': letters, numbers, '.', '_', '-'"
            );
          break;
        case ContactType.CellPhone:
        case ContactType.WorkPhone:
        case ContactType.HomePhone:
        case ContactType.Fax:
          schema = schema.matches(
            /^\d{10,15}$/,
            "Invalid phone/fax number. Must be 10 to 15 digits, numbers only."
          );
          break;

        case ContactType.PoBox:
          schema = Yup.string()
            .required("PO Box is required")
            .matches(
              /^\d{5,10}$/,
              "Enter a valid PO Box number consisting of 5 to 10 digits (e.g., 12345)."
            );
          break;
      }

      return schema;
    })(),
  });

export const ContactDialogNew: React.FC<ContactDialogNewProps> = ({
  onClose,
  title: propTitle,
  requestId,
  contactCategory,
}) => {
  const { showSuccessAlert, showErrorAlert } = useAlert();
  const theme = useTheme();

  const [contactType, setContactType] = useState<ContactType>(
    ContactType.Email
  );
  const [contactData, setContact] = useState<ContactDto | undefined>();
  const [isExistingContact, setIsExistingContact] = useState(false);

  const [addContact, { error: addContactError, isLoading: isAdding }] =
    useCreateContactMutation();
  const [updateContact, { error: updateContactError, isLoading: isUpdating }] =
    useUpdateContactByRequestIdMutation();

  const {
    data: existingContact,
    isFetching: isCheckingExistence,
    refetch: refetchExistingContact,
  } = useGetContactByRequestIdQuery(
    {
      requestId,
      contactCategory: contactCategory as any,
      type: contactType,
    },
    { skip: !requestId }
  );

  const { refetch: refetchContacts } = useGetContactsByIdQuery(
    { requestId, contactCategory },
    {
      skip: !requestId,
    }
  );

  const isUpdateMode = isExistingContact;
  const title = isUpdateMode
    ? `Update ${getContactTypeLabel(contactType)} Contact`
    : `Add New ${getContactTypeLabel(contactType)} Contact`;

  useEffect(() => {
    if (existingContact?.id) {
      setIsExistingContact(true);
      setContact({ ...emptyContactData, ...existingContact });
    } else {
      setIsExistingContact(false);
      setContact(emptyContactData);
    }
  }, [existingContact]);

  useEffect(() => {
    if (requestId) {
      refetchExistingContact();
    }
  }, [contactType, requestId, refetchExistingContact]);

  const handleTypeChange = (event: SelectChangeEvent<ContactType>) => {
    const selectedValue = event.target.value as ContactType;
    setContactType(selectedValue);
  };

  const handleSubmit = useCallback(
    async (values: ContactDto) => {
      try {
        values.type = contactType;
        values.requestId = requestId!;
        values.contactCategory = contactCategory as any;

        const result = await (isUpdateMode
          ? updateContact({ updateContactCommand: values }).unwrap()
          : addContact({ createContactCommand: values }).unwrap());
          isUpdateMode
            ? showSuccessAlert("Contact updated successfully!")
            : showSuccessAlert("Contact created successfully!");
        refetchContacts();
        onClose();
      } catch (error: any) {
        showErrorAlert(error?.data?.detail || "Failed to save contact.");
      }
    },
    [
      onClose,
      addContact,
      updateContact,
      requestId,
      contactCategory,
      contactType,
      refetchContacts,
      isUpdateMode,
      showErrorAlert,
    ]
  );

  const errors = ((isUpdateMode ? updateContactError : addContactError) as any)
    ?.data?.errors;
  const loading = isAdding || isUpdating || isCheckingExistence;

  return (
    <Dialog
      scroll="paper"
      disableEscapeKeyDown
      maxWidth="sm"
      fullWidth
      open={true}
    >
      {!!contactData && (
        <Formik
          initialValues={contactData}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validationSchema={getValidationSchema(contactType)}
          validateOnChange
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <DialogHeader title={title} onClose={onClose} />
              <DialogContent dividers>
                <Grid container spacing={2}>
                  {errors && (
                    <Grid item xs={12}>
                      <Errors errors={errors} />
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="contact-type-label">
                        Contact Type
                      </InputLabel>
                      <Select
                        labelId="contact-type-label"
                        id="contact-type"
                        name="type"
                        value={contactType}
                        onChange={handleTypeChange}
                        label="Contact Type"
                      >
                        {Object.keys(ContactType)
                          .filter((key) => isNaN(Number(key)))
                          .map((key) => {
                            const value =
                              ContactType[key as keyof typeof ContactType];
                            return (
                              <MenuItem key={value} value={value}>
                                <Box display="flex" alignItems="center" gap={1}>
                                  {contactIconMap[value]}
                                  <Typography>
                                    {getContactTypeLabel(value)}
                                  </Typography>
                                </Box>
                              </MenuItem>
                            );
                          })}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormTextField
                      name="value"
                      label={getContactTypeLabel(contactType)}
                      type="text"
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} disabled={loading}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  variant="outlined"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      )}
    </Dialog>
  );
};
