import React, { useCallback, useEffect, useState } from "react";
import { Form, Formik, FormikHelpers } from "formik";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
} from "@mui/material";
import * as Yup from "yup";
import {
  FieldOfStudyDto,
  useCreateFieldOfStudyMutation,
  useUpdateFieldOfStudyMutation,
} from "../../../../../app/store";
import { useAlert } from "../../../../notification";
import { DialogHeader, Errors, FormTextField } from "../../../../../components";

const emptyFieldOfStudyData: FieldOfStudyDto = {
  id: undefined,
  name: "",
  description: "",
};

interface FieldOfStudyDialogProps {
  initialFieldOfStudy?: FieldOfStudyDto;
  title: string;
  onClose: () => void;
}

export const FieldOfStudyDialog: React.FC<FieldOfStudyDialogProps> = ({
  onClose,
  initialFieldOfStudy,
  title,
}) => {
  const [fieldOfStudyData, setFieldOfStudyData] = useState<FieldOfStudyDto>(
    emptyFieldOfStudyData
  );
  const [addFieldOfStudy, { error: createAwardError, isLoading: isCreating }] = // Changed error variable name to createAwardError
    useCreateFieldOfStudyMutation();
  const [
    updateFieldOfStudy,
    { error: updateAwardError, isLoading: isUpdating },
  ] = useUpdateFieldOfStudyMutation(); // Changed error variable name to updateAwardError
  const { showSuccessAlert, showErrorAlert } = useAlert();

  useEffect(() => {
    setFieldOfStudyData({
      ...emptyFieldOfStudyData,
      ...initialFieldOfStudy,
    });
  }, [initialFieldOfStudy]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Field of Study Name is required.")
      .max(100, "Field of Study Name cannot be longer than 100 characters.")
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
      values: FieldOfStudyDto,
      { setSubmitting, resetForm }: FormikHelpers<FieldOfStudyDto>
    ) => {
      try {
        const action = initialFieldOfStudy?.id
          ? updateFieldOfStudy({
              updateFieldOfStudyCommand: {
                ...values,
                id: initialFieldOfStudy.id,
              },
            })
          : addFieldOfStudy({ createFieldOfStudyCommand: values });

        await action.unwrap();
        showSuccessAlert(
          initialFieldOfStudy?.id
            ? "Field of Study updated successfully!"
            : "Field of Study added successfully!"
        );
        resetForm();
        onClose();
      } catch (error: any) {
        showErrorAlert(error?.data?.detail || "Failed to save field of study.");
        if (error?.data?.errors) {
          // Optionally handle specific field errors using setErrors
        }
      } finally {
        setSubmitting(false);
      }
    },
    [
      addFieldOfStudy,
      updateFieldOfStudy,
      showSuccessAlert,
      showErrorAlert,
      onClose,
      initialFieldOfStudy?.id,
    ]
  );

  const errors =
    (createAwardError as any)?.data?.errors ||
    (updateAwardError as any)?.data?.errors; // Changed to createAwardError and updateAwardError to align with AwardDialog
  const isSaving = isCreating || isUpdating;

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
    >
      {!!fieldOfStudyData && (
        <Formik
          initialValues={fieldOfStudyData}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          validateOnChange={true}
        >
          {({ handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <DialogHeader title={title} onClose={onClose} />
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
                      label="Field of Study Name"
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
