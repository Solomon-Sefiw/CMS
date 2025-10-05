import React, { useEffect, useMemo } from "react";
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
} from "@mui/material";
import { Formik, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";
import {
  ContactDto,
  useCreateContactMutation,
  useGetContactsByIdQuery,
  useUpdateContactByRequestIdMutation,
} from "../../../../app/api";
import { ContactCategory, ContactType } from "../../../../app/api/enums";
import { useAlert } from "../../../notification";
import { DialogHeader, Errors, FormTextField } from "../../../../components";

const emptyContactData: ContactDto = {
  type: ContactType.Email,
  value: "",
  requestId: 0,
  employeeId: null,
} as ContactDto;

export const EmployeeContactDialog = ({
  onClose,
  title,
  requestId,
  open,
  contactData,
  contactCategory,
  existingContactTypes = [],
}: {
  onClose: () => void;
  title: string;
  requestId?: number;
  open: boolean;
  contactData?: ContactDto;
  contactCategory?: ContactCategory;
  existingContactTypes: ContactType[];
}) => {
  const { showSuccessAlert, showErrorAlert } = useAlert();
  const [addContact, { error: addContactError }] = useCreateContactMutation();
  const [updateContact, { error: updateContactError }] =
    useUpdateContactByRequestIdMutation();

  const { data: employeeContact, refetch } = useGetContactsByIdQuery(
    { requestId: requestId },
    { skip: !requestId }
  );

  const initialContact: ContactDto = useMemo(() => {
    return {
      ...emptyContactData,
      ...contactData,
      requestId: requestId ?? 0,
      type: contactData?.type ?? ContactType.Email,
    };
  }, [contactData, requestId]);

  const contactTypeOptions =
    contactCategory === ContactCategory.EmergencyContact
      ? [ContactType.CellPhone, ContactType.PoBox]
      : Object.keys(ContactType)
          .filter((key) => isNaN(Number(key)))
          .map((key) => ContactType[key as keyof typeof ContactType]);

  const validationSchema = Yup.object().shape({
    type: Yup.mixed<ContactType>()
      .oneOf(
        Object.values(ContactType).filter(
          (v) => typeof v === "number"
        ) as ContactType[]
      )
      .required("Contact type is required"),
    value: Yup.string()
      .required("Value is required")
      .max(70, "Value exceeds 70 characters")
      .test("value-format", function (value) {
        const contactType: ContactType = this.parent.type;
        if (!value || contactType === undefined)
          return this.createError({ message: "Value is required" });

        let valid = true;
        let hint = "";

        switch (contactType) {
          case ContactType.CellPhone:
          case ContactType.HomePhone:
          case ContactType.WorkPhone:
          case ContactType.Fax:
            valid = /^(?:\+251|0)?9\d{8}$/.test(value);
            hint =
              "must be a valid Ethiopian phone number (e.g., +2519XXXXXXXX or 09XXXXXXXX)";
            break;

          case ContactType.Email:
            valid = valid =
              /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && // basic email pattern
              /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value); // your custom stricter pattern
            hint =
              "must be a valid email address. Allowed characters before '@': letters, numbers, '.', '_', '-'. Example: user@example.com";

            break;

          case ContactType.PoBox:
            valid = /^\d{5,10}$/.test(value);
            hint = "must be 5 to 10 digits";
            break;

          default:
            valid = true;
        }

        if (!valid) {
          return this.createError({
            message: `Invalid format for selected contact type: ${hint}`,
          });
        }

        return true;
      }),
  });

  const handleSubmit = (values: ContactDto) => {
    values.requestId = requestId ?? 0;
    if (contactCategory !== undefined) {
      values.contactCategory = contactCategory;
    }

    const mutation = contactData?.id
      ? updateContact({ updateContactCommand: values })
      : addContact({ createContactCommand: values });

    mutation
      .unwrap()
      .then(() => {
        contactData?.id
          ? showSuccessAlert("Contact updated successfully!")
          : showSuccessAlert("Contact created successfully!");
        refetch();
        onClose();
      })
      .catch((error) => {
        showErrorAlert(error?.data?.detail);
      });
  };

  const errors =
    (addContactError as any)?.data?.errors ||
    (updateContactError as any)?.data?.errors;

  return (
    <Dialog scroll="paper" disableEscapeKeyDown maxWidth="md" open={open}>
      <Formik
        initialValues={initialContact}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <DialogHeader title={title} onClose={onClose} />
          <DialogContent dividers>
            <Grid container spacing={2}>
              {errors && (
                <Grid item xs={12}>
                  <Errors errors={errors as any} />
                </Grid>
              )}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="contact-type-label">Contact Type</InputLabel>
                  <Field name="type">
                    {({ field, form }: FieldProps) => (
                      <Select
                        {...field}
                        labelId="contact-type-label"
                        label="Contact Type"
                        value={field.value}
                        onChange={(e) =>
                          form.setFieldValue("type", Number(e.target.value))
                        }
                      >
                        {contactTypeOptions.map((type) => {
                          const label = Object.keys(ContactType).find(
                            (key) =>
                              ContactType[key as keyof typeof ContactType] ===
                              type
                          );
                          return (
                            <MenuItem
                              key={type}
                              value={type}
                              disabled={existingContactTypes.includes(type)}
                            >
                              {label}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    )}
                  </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormTextField name="value" label="Value" type="text" />
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" color="primary" variant="outlined">
              Save
            </Button>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};
