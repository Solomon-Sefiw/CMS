import React, { useCallback, useEffect, useState } from "react";
import { Form, Formik } from "formik";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert,
} from "@mui/material";
import * as Yup from "yup";
import {
  CreateEmployeeEmergencyContactCommand,
  UpdateEmployeeEmergencyContactCommand,
  useCreateEmployeeEmergencyContactMutation,
  useUpdateEmployeeEmergencyContactCommandMutation,
} from "../../../../app/api";
import { DialogHeader, Errors, FormTextField } from "../../../../components";
import { useAlert } from "../../../notification";

const emptyContactData = {
  id: 0,
  name: "",
  middleName: "",
  lastName: "",
  isWorking: false,
  workingFirmName: "",
  employeeId: 0,
} as CreateEmployeeEmergencyContactCommand;

export const EmployeeEmergencyContactDialog = ({
  open,
  onClose,
  title,
  employeeId,
  contact,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  employeeId: number;
  contact?: UpdateEmployeeEmergencyContactCommand;
}) => {
  const [contactData, setContact] = useState<
    | CreateEmployeeEmergencyContactCommand
    | UpdateEmployeeEmergencyContactCommand
  >(contact || emptyContactData);
  const { showSuccessAlert, showErrorAlert } = useAlert();

  const [addContact, { error: addContactError }] =
    useCreateEmployeeEmergencyContactMutation();
  const [updateContact, { error: updateContactError }] =
    useUpdateEmployeeEmergencyContactCommandMutation();

  const [notification, setNotification] = useState<string>("");
  const [severity, setSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("info");
  const nameRegex = /^[A-Za-z\s\-']+$/;
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .matches(nameRegex, "Name should contain only letters")
      .max(30, "Name exceeds 30 characters"),
    middleName: Yup.string()
      .required("Middle name is required")
      .matches(nameRegex, "Middle name should contain only letters")
      .max(30, "Middle Name exceeds 30 characters"),
    lastName: Yup.string()
      .required("Last name is required")
      .matches(nameRegex, "Last name should contain only letters")
      .max(30, "Last Name exceeds 30 characters"),
    isWorking: Yup.boolean().required(),
    workingFirmName: Yup.string().when("isWorking", {
      is: true,
      then: (schema) =>
        schema
          .required("Working firm name is required")
          .max(100, "Firm Name exceeds 100 characters"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  useEffect(() => {
    if (!open) {
      setNotification("");
      setSeverity("info");
    }
  }, [open]);

  useEffect(() => {
    if (contact) {
      setContact(contact);
    } else {
      setContact(emptyContactData);
    }
  }, [contact]);
  const handleSubmit = useCallback(
    async (
      values:
        | CreateEmployeeEmergencyContactCommand
        | UpdateEmployeeEmergencyContactCommand
    ) => {
      values.employeeId = employeeId!;

      try {
        if (contact) {
          const updateCommand: UpdateEmployeeEmergencyContactCommand = {
            id: contact.id,
            name: values.name,
            middleName: values.middleName,
            lastName: values.lastName,
            isWorking: values.isWorking,
            workingFirmName: values.workingFirmName,
            employeeId: values.employeeId,
          };
          await updateContact({
            updateEmployeeEmergencyContactCommand: updateCommand,
          }).unwrap();
               showSuccessAlert("Operation completed successfully!");
        } else {
          const addCommand: CreateEmployeeEmergencyContactCommand = {
            name: values.name,
            middleName: values.middleName,
            lastName: values.lastName,
            isWorking: values.isWorking,
            workingFirmName: values.workingFirmName,
            employeeId: values.employeeId,
          };
          await addContact({
            createEmployeeEmergencyContactCommand: addCommand,
          }).unwrap();
        showSuccessAlert("Emergency Contact Added successfully!");
        }
          onClose();
      } catch (error) {
        showErrorAlert("An error occurred while saving contact.");
      }
    },
    [addContact, updateContact, contact, employeeId, onClose, showErrorAlert, showSuccessAlert]
  );

  const errors =
    (addContactError as any)?.data?.errors ||
    (updateContactError as any)?.data?.errors;
  return (
    <Dialog
      scroll="paper"
      disableEscapeKeyDown
      maxWidth="md"
      open={open}
      onClose={onClose}
    >
      <Formik
        initialValues={contactData}
        enableReinitialize
        onSubmit={handleSubmit}
        validateOnChange
        validationSchema={validationSchema}
      >
        {({ setFieldValue, values }) => (
          <Form>
            <DialogHeader title={title} onClose={onClose} />
            {notification && (
              <Box sx={{ p: 2 }}>
                <Alert severity={severity}>{notification}</Alert>
              </Box>
            )}
            <DialogContent dividers>
              <Grid container spacing={2}>
                {errors && (
                  <Grid item xs={12}>
                    <Errors errors={errors as any} />
                  </Grid>
                )}

                <Grid item xs={6}>
                  <FormTextField name="name" label="Name" type="text" />
                </Grid>
                <Grid item xs={6}>
                  <FormTextField
                    name="middleName"
                    label="Middle Name"
                    type="text"
                  />
                </Grid>

                <Grid item xs={6}>
                  <FormTextField
                    name="lastName"
                    label="Last Name"
                    type="text"
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id="isWorking-label">IsWorking</InputLabel>
                    <Select
                      labelId="isWorking-label"
                      id="isWorking"
                      name="isWorking"
                      value={values.isWorking ? "yes" : "no"}
                      onChange={(e) =>
                        setFieldValue("isWorking", e.target.value === "yes")
                      }
                    >
                      <MenuItem value="yes">Yes</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {values.isWorking && (
                  <Grid item xs={12}>
                    <FormTextField
                      name="workingFirmName"
                      label="Working Firm Name"
                      type="text"
                    />
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button color="primary" variant="outlined" type="submit">
                Save
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
