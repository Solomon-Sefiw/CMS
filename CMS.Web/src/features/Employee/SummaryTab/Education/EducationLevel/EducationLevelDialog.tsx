import React, { useCallback, useEffect, useState } from "react";
import { Form, Formik, FormikHelpers } from "formik";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
} from "@mui/material";
import * as Yup from "yup";
import {
  EducationLevelDto,
  useCreateEducationLevelMutation,
  useUpdateEducationLevelMutation, // Import the update mutation
} from "../../../../../app/store";
import { useAlert } from "../../../../notification";
import { DialogHeader, Errors, FormTextField } from "../../../../../components";

const emptyEducationLevelData: EducationLevelDto = {
  id: undefined, // Add id to the empty data
  name: "",
  description: "",
};

interface EducationLevelDialogProps {
  initialEducationLevel?: EducationLevelDto; // Make initialEducationLevel optional
  title: string;
  onClose: () => void;
}

export const EducationLevelDialog: React.FC<EducationLevelDialogProps> = ({
  onClose,
  initialEducationLevel,
  title, // Add title prop
}) => {
  const [educationLevelData, setEducationLevelData] =
    useState<EducationLevelDto>(emptyEducationLevelData);
  const [
    addEducationLevel,
    { error: addEducationLevelError, isLoading: isCreating },
  ] = useCreateEducationLevelMutation();
  const [
    updateEducationLevel,
    { error: updateEducationLevelError, isLoading: isUpdating },
  ] = useUpdateEducationLevelMutation(); // Add the update mutation
  const { showSuccessAlert, showErrorAlert } = useAlert();

  useEffect(() => {
    setEducationLevelData({
      ...emptyEducationLevelData,
      ...initialEducationLevel,
    });
  }, [initialEducationLevel]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Education Level Name is required.")
      .max(100, "Education Level Name cannot be longer than 100 characters.")
      .matches(
        /^[a-zA-Z0-9\s-_]+$/,
        "Only letters, numbers, spaces, hyphens, and underscores are allowed."
      ),
    description: Yup.string().max(
      200,
      "Description cannot be longer than 200 characters."
    ),
  });

  const handleSubmit = useCallback(
    async (
      values: EducationLevelDto,
      { setSubmitting, resetForm }: FormikHelpers<EducationLevelDto>
    ) => {
      try {
        const action = initialEducationLevel?.id // Determine create or update
          ? updateEducationLevel({
              updateEducationLevelCommand: {
                ...values,
                id: initialEducationLevel.id,
              },
            })
          : addEducationLevel({
              createEducationLevelCommand: values,
            });

        await action.unwrap();
        showSuccessAlert(
          initialEducationLevel?.id
            ? "Education Level updated successfully!"
            : "Education Level added successfully!"
        );
        resetForm();
        onClose();
      } catch (error: any) {
        showErrorAlert(
          error?.data?.detail || "Failed to save education level."
        );
        if (error?.data?.errors) {
          // Optionally handle specific field errors using setErrors
        }
      } finally {
        setSubmitting(false);
      }
    },
    [
      addEducationLevel,
      updateEducationLevel,
      showSuccessAlert,
      showErrorAlert,
      onClose,
      initialEducationLevel?.id,
    ] //add updateEducationLevel
  );

  const errors =
    (addEducationLevelError as any)?.data?.errors ||
    (updateEducationLevelError as any)?.data?.errors; //combine errors
  const isSaving = isCreating || isUpdating;

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
    >
      {!!educationLevelData && (
        <Formik
          initialValues={educationLevelData}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          validateOnChange={true}
        >
          {({ handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <DialogHeader title={title} onClose={onClose} />{" "}
              {/* Use the title prop */}
              <DialogContent dividers={true}>
                <Grid container spacing={2}>
                  {errors && (
                    <Grid item xs={12}>
                      <Errors errors={errors as any} />
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <FormTextField
                      name="name"
                      label="Education Level Name"
                      type="text"
                      fullWidth
                      error={!!errors?.name}
                      helperText={errors?.name}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormTextField
                      name="description"
                      type="text"
                      placeholder="Description"
                      label="Description"
                      fullWidth
                      multiline
                      minRows={5}
                      variant="outlined"
                      error={!!errors?.description}
                      helperText={errors?.description}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} disabled={isSaving || isSubmitting}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  variant="outlined"
                  type="submit"
                  disabled={isSaving || isSubmitting}
                >
                  {isSaving || isSubmitting ? "Saving..." : "Save"}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      )}
    </Dialog>
  );
};
