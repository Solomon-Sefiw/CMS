import { Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { DialogHeader, Errors, FormTextField } from "../../components";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import {
  ContactDto,
  useCreateContactMutation,
  useGetEmployeeFamilyContactByIdQuery,
  useUpdateContactByRequestIdMutation,
  CreateContactCommand,
} from "../../app/api/HCMSApi";
import { ContactType, ContactCategory } from "../../app/api/enums";
import * as Yup from "yup";

const getValidationSchema = (contactType: ContactType) =>
  Yup.object({
    value: (() => {
      let schema = Yup.string().required("Value is required");

      switch (contactType) {
        case ContactType.Email:
          schema = schema
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
            "Invalid phone/fax number. It must be 10 to 15 digits."
          );
          break;

        case ContactType.PoBox:
          schema = schema.matches(
            /^\d{5,10}$/,
            "Enter a valid PO Box number. It must be 5 to 10 digits."
          );
          break;
      }

      return schema;
    })(),
  });

export const ContactUpdateDialogNew = ({
  onClose,
  title,
  requestId,
  contactCategory,
}: {
  onClose: () => void;
  title: string;
  requestId?: number;
  contactCategory: ContactCategory | undefined;
}) => {
  const [contactType, setContactType] = useState<ContactType>(
    ContactType.Email
  );
  const [contactData, setContact] = useState<ContactDto | undefined>();

  const { data: EmployeeFamilyContact } = useGetEmployeeFamilyContactByIdQuery({
    contactId: requestId,
    contactCategory: contactCategory,
  });

  const [updateContact, { error: UpdateContactErr }] =
    useUpdateContactByRequestIdMutation();

  useEffect(() => {
    if (EmployeeFamilyContact) {
      setContact(EmployeeFamilyContact);
      setContactType(EmployeeFamilyContact.type ?? ContactType.Email);
    }
  }, [EmployeeFamilyContact]);

  const handleTypeChange = (event: SelectChangeEvent<ContactType>) => {
    const selectedValue = event.target.value as ContactType;
    setContactType(selectedValue);
  };

  const handleSubmit = useCallback(
    (values: CreateContactCommand) => {
      values.type = contactType;
      updateContact({ updateContactCommand: values })
        .unwrap()
        .then(() => {
          onClose();
        })
        .catch(() => {
          // handle error if needed
        });
    },
    [contactType, onClose, updateContact]
  );

  const errors = (UpdateContactErr as any)?.data?.errors;

  return (
    <Dialog scroll="paper" disableEscapeKeyDown maxWidth="md" open={true}>
      {!!contactData && (
        <Formik
          initialValues={contactData}
          enableReinitialize
          onSubmit={handleSubmit}
          validationSchema={getValidationSchema(contactType)}
          validateOnChange
        >
          <Form>
            <DialogHeader title={title} onClose={onClose} />
            <DialogContent dividers>
              <Grid container spacing={2}>
                {errors && (
                  <Grid item xs={12}>
                    <Errors errors={errors} />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <FormControl fullWidth>
                      <Select
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
                                {key}
                              </MenuItem>
                            );
                          })}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <FormControl fullWidth>
                      <FormTextField name="value" label="Value" type="text" />
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button onClick={onClose}>Cancel</Button>
              <Button color="primary" variant="outlined" type="submit">
                Save
              </Button>
            </DialogActions>
          </Form>
        </Formik>
      )}
    </Dialog>
  );
};
