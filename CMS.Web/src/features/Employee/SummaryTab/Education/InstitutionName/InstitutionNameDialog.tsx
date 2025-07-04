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
  InstitutionNameDto,
  useCreateInstitutionNameMutation,
  useUpdateInstitutionNameMutation,
} from "../../../../../app/store";
import { useAlert } from "../../../../notification";
import { DialogHeader, Errors, FormTextField } from "../../../../../components";

const emptyInstitutionNameData: InstitutionNameDto = {
  id: undefined,
  name: "",
  description: "",
};

interface InstitutionNameDialogProps {
  initialInstitutionName?: InstitutionNameDto;
  title: string;
  onClose: () => void;
}

export const InstitutionNameDialog: React.FC<InstitutionNameDialogProps> = ({
  onClose,
  initialInstitutionName,
  title,
}) => {
  const [institutionNameData, setInstitutionNameData] =
    useState<InstitutionNameDto>(emptyInstitutionNameData);
  const [
    createInstitutionName,
    { error: createInstitutionNameError, isLoading: isCreating },
  ] = useCreateInstitutionNameMutation();
  const [
    updateInstitutionName,
    { error: updateInstitutionNameError, isLoading: isUpdating },
  ] = useUpdateInstitutionNameMutation();
  const { showSuccessAlert, showErrorAlert } = useAlert();
  const [notification, setNotification] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    setInstitutionNameData({
      ...emptyInstitutionNameData,
      ...initialInstitutionName,
    });
    if (initialInstitutionName?.id) {
      setIsLocked(true);
      setNotification("This institution name is being edited.");
      setOpenSnackbar(true);
    } else {
      setIsLocked(false);
    }
  }, [initialInstitutionName]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Institution Name is required.")
      .max(100, "Institution Name cannot be longer than 100 characters.")
      .matches(/^[a-zA-Z0-9\s-_]+$/, "Only letters, numbers, spaces, hyphens, and underscores are allowed."),
    description: Yup.string().max(
      200,
      "Description cannot be longer than 200 characters."
    ),
  });

  const handleSubmit = useCallback(
    async (
      values: InstitutionNameDto,
      { setSubmitting, resetForm }: FormikHelpers<InstitutionNameDto>
    ) => {
      try {
        const action = initialInstitutionName?.id
          ? updateInstitutionName({
              updateInstitutionNameCommand: {
                ...values,
                id: initialInstitutionName.id,
              },
            })
          : createInstitutionName({ createInstitutionNameCommand: values });

        await action.unwrap();
        showSuccessAlert(
          initialInstitutionName?.id
            ? "Institution name updated successfully!"
            : "Institution name created successfully!"
        );
        resetForm();
        onClose();
      } catch (error: any) {
        showErrorAlert(
          error?.data?.detail || "Failed to save institution name."
        );
        if (error?.data?.errors) {
          // Optionally handle specific field errors using setErrors
        }
      } finally {
        setSubmitting(false);
      }
    },
    [
      createInstitutionName,
      updateInstitutionName,
      onClose,
      showErrorAlert,
      initialInstitutionName?.id,
    ]
  );

  const errors =
    (createInstitutionNameError as any)?.data?.errors ||
    (updateInstitutionNameError as any)?.data?.errors;

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
      {!!institutionNameData && (
        <Formik
          initialValues={institutionNameData}
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
                      label="Institution Name"
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
