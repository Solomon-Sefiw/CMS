import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Alert,
} from "@mui/material";
import { Formik, Form, FormikHelpers } from "formik";
import { DialogHeader, FormTextField } from "../../../components";
import { useCallback, useEffect, useState } from "react";
import { Errors } from "../../../components";
import {
  JobRoleCatagoryDto,
  useCreateJobRoleCategoryMutation,
  useUpdateJobRoleCategoryMutation,
} from "../../../app/api";
import { useAlert } from "../../notification";
import * as Yup from "yup";

interface JobRoleCategoryDialogProps {
  initialJobRoleCategory?: JobRoleCatagoryDto;
  title: string;
  onClose: () => void;
}

const emptyJobRoleCategoryData: JobRoleCatagoryDto = {
  id: undefined,
  name: "",
  description: "",
};

export const JobRoleCategoryDialog = ({
  onClose,
  initialJobRoleCategory,
  title,
}: JobRoleCategoryDialogProps) => {
  const [jobRoleCategoryData, setJobRoleCategoryData] =
    useState<JobRoleCatagoryDto>(emptyJobRoleCategoryData);
  const [
    createJobRoleCategory,
    { error: createJobRoleCategoryError, isLoading: isCreating },
  ] = useCreateJobRoleCategoryMutation();
  const [
    updateJobRoleCategory,
    { error: updateJobRoleCategoryError, isLoading: isUpdating },
  ] = useUpdateJobRoleCategoryMutation();
  const { showSuccessAlert, showErrorAlert } = useAlert();
  const [notificationMessage, setNotificationMessage] = useState<string>("");
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [isItemLocked, setIsItemLocked] = useState(false);

  useEffect(() => {
    setJobRoleCategoryData({
      ...emptyJobRoleCategoryData,
      ...initialJobRoleCategory,
    });
    if (initialJobRoleCategory?.id) {
      setIsItemLocked(true);
      setNotificationMessage("This job role category is being edited.");
      setIsSnackbarOpen(true);
    } else {
      setIsItemLocked(false);
    }
  }, [initialJobRoleCategory]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Job Role Category Name is required.")
      .max(100, "Job Role Category Name cannot be longer than 100 characters."),
    description: Yup.string().max(
      200,
      "Description cannot be longer than 200 characters."
    ),
    code: Yup.string().max(50, "Code cannot be longer than 50 characters."), // Added validation for code
  });

  const handleSubmit = useCallback(
    async (
      values: JobRoleCatagoryDto,
      { setSubmitting, resetForm }: FormikHelpers<JobRoleCatagoryDto>
    ) => {
      try {
        const action = initialJobRoleCategory?.id
          ? updateJobRoleCategory({
              updateJobRoleCatagoryCommand: {
                ...values,
                id: initialJobRoleCategory.id,
              },
            })
          : createJobRoleCategory({ createJobRoleCatagoryCommand: values });

        await action.unwrap();
        showSuccessAlert(
          initialJobRoleCategory?.id
            ? "Job role category updated successfully!"
            : "Job role category created successfully!"
        );
        resetForm();
        onClose();
      } catch (error: any) {
        showErrorAlert(
          error?.data?.detail || "Failed to save job role category."
        );
      } finally {
        setSubmitting(false);
      }
    },
    [
      createJobRoleCategory,
      updateJobRoleCategory,
      onClose,
      showErrorAlert,
      initialJobRoleCategory?.id,
    ]
  );

  const errors =
    (createJobRoleCategoryError as any)?.data?.errors ||
    (updateJobRoleCategoryError as any)?.data?.errors;

  const isSaving = isCreating || isUpdating;

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
    >
      {isSnackbarOpen && notificationMessage && (
        <Alert
          severity="warning"
          onClose={() => setIsSnackbarOpen(false)}
          sx={{ mb: 2 }}
        >
          {notificationMessage}
        </Alert>
      )}
      {!!jobRoleCategoryData && (
        <Formik
          initialValues={jobRoleCategoryData}
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
                      label="Job Role Category Name"
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
