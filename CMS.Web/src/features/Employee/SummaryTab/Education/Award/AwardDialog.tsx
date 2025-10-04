import { Form, Formik, FormikHelpers } from "formik";
import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Alert,
} from "@mui/material";
import * as Yup from "yup";
import {
  AwardDto,
  useCreateAwardMutation,
  useUpdateAwardMutation,
} from "../../../../../app/store";
import { useAlert } from "../../../../notification";
import { DialogHeader, Errors, FormTextField } from "../../../../../components";

const emptyAwardData: AwardDto = {
  id: undefined,
  name: "",
  description: "",
};

interface AwardDialogProps {
  initialAward?: AwardDto;
  title: string;
  onClose: () => void;
}

export const AwardDialog: React.FC<AwardDialogProps> = ({
  onClose,
  initialAward,
  title,
}) => {
  const [awardData, setAwardData] = useState<AwardDto>(emptyAwardData);
  const [createAward, { error: createAwardError, isLoading: isCreating }] =
    useCreateAwardMutation();
  const [updateAward, { error: updateAwardError, isLoading: isUpdating }] =
    useUpdateAwardMutation();
  const { showSuccessAlert, showErrorAlert } = useAlert();
  const [notification, setNotification] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    setAwardData({
      ...emptyAwardData,
      ...initialAward,
    });
    if (initialAward?.id) {
      setIsLocked(true);
      setNotification("This award is being edited.");
      setOpenSnackbar(true);
    } else {
      setIsLocked(false);
    }
  }, [initialAward]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Award Name is required.")
      .max(100, "Award Name cannot be longer than 100 characters.")
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
      values: AwardDto,
      { setSubmitting, resetForm }: FormikHelpers<AwardDto>
    ) => {
      try {
        const action = initialAward?.id
          ? updateAward({
              updateAwardCommand: { ...values, id: initialAward.id },
            })
          : createAward({ createAwardCommand: values });

        await action.unwrap();
        showSuccessAlert(
          initialAward?.id
            ? "Award updated successfully!"
            : "Award created successfully!"
        );
        resetForm();
        onClose();
      } catch (error: any) {
        showErrorAlert(error?.data?.detail || "Failed to save award.");
        if (error?.data?.errors) {
          // Optionally handle specific field errors using setErrors
        }
      } finally {
        setSubmitting(false);
      }
    },
    [createAward, updateAward, onClose, showErrorAlert, initialAward?.id]
  );

  const errors =
    (createAwardError as any)?.data?.errors ||
    (updateAwardError as any)?.data?.errors;

  const isSaving = isCreating || isUpdating;

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
    >
      {openSnackbar && notification && (
        <Alert
          severity="warning"
          onClose={() => setOpenSnackbar(false)}
          sx={{ mb: 2 }}
        >
          {notification}
        </Alert>
      )}
      {!!awardData && (
        <Formik
          initialValues={awardData}
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
                      label="Award Name"
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
