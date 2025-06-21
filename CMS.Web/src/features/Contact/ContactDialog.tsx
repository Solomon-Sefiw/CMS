import { Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { DialogHeader, Errors, FormTextField } from "../../components";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
} from "@mui/material";
import {
  ContactDto,
  useCreateContactMutation,
  useGetContactByRequestIdQuery,
  useUpdateContactByRequestIdMutation,
} from "../../app/api/HCMSApi";
import { enums } from "../../app/api";
import { useAlert } from "../notification";
import { ContactCategory } from "../../app/api/enums";

export const ContactDialog = ({
  onClose,
  title,
  requestId,
  contactType,
  contactCategory,
}: {
  onClose: () => void;
  title: string;
  requestId?: number;
  contactType?: enums.ContactType;
  contactCategory: ContactCategory;
}) => {
    const { showSuccessAlert, showErrorAlert } = useAlert();
  const [contactData, setContact] = useState<ContactDto | undefined>();

  const [addContact, { error: AddContactErr }] = useCreateContactMutation();
  const [updateContact, { error: UpdateContactErr }] =
    useUpdateContactByRequestIdMutation();
  const { data, isFetching, error, refetch } = useGetContactByRequestIdQuery(
    {
      requestId: requestId,
      contactCategory: contactCategory as any,
      type: contactType,
    },
    {
      skip: !requestId, // Skip the query if no business unit is selected
    }
  );
  data?.id ? (title = "Update Contact") : (title = "Add New Contact");

  useEffect(() => {
    setContact({
      ...contactData,
      ...data,
    });
  }, [data, contactData, requestId]);

  const handleSubmit = useCallback(
    (values: ContactDto) => {
      values.requestId = requestId;
      values.contactCategory = contactCategory as any;
      values.type = contactType;
      (data?.id
        ? updateContact({
            updateContactCommand: values,
          })
        : addContact({
            createContactCommand: values,
          })
      )
        .unwrap()
        .then(() => {
          data?.id ? showSuccessAlert("Contact updated successfully!") : showSuccessAlert("Contact created successfully!");
          refetch();
          onClose();
        })
        .catch((error) => {
           showErrorAlert(error?.data?.detail);
        });
    },
    [onClose, addContact, refetch]
  );
  const errors = ((data?.id ? UpdateContactErr : AddContactErr) as any)?.data
    ?.errors;
  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
    >
      {!!contactData && (
        <Formik
          initialValues={contactData as any}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          //validationSchema={validationSchema}
          validateOnChange={true}
        >
          <Form>
            <DialogHeader title={title} onClose={onClose} />
            <DialogContent dividers={true}>
              <Grid container spacing={2}>
                {errors && (
                  <Grid item xs={12}>
                    <Errors errors={errors as any} />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <FormTextField name="value" label="Value" type="text" />
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
