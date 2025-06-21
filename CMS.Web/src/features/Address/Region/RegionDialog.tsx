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
  RegionDto,
  useCreateRegionMutation,
  useUpdateRegionMutation,
} from "../../../app/api";
import { useAlert } from "../../notification";
import * as Yup from "yup";

interface RegionDialogProps {
  initialRegion?: RegionDto;
  title: string;
  onClose: () => void;
}

const emptyRegionData: RegionDto = {
  id: undefined,
  name: "",
  description: "",
};

export const RegionDialog = ({
  onClose,
  initialRegion,
  title,
}: RegionDialogProps) => {
  const [regionData, setRegionData] = useState<RegionDto>(emptyRegionData);
  const [createRegion, { error: createRegionError, isLoading: isCreating }] =
    useCreateRegionMutation();
  const [updateRegion, { error: updateRegionError, isLoading: isUpdating }] =
    useUpdateRegionMutation();
  const { showSuccessAlert, showErrorAlert } = useAlert();
  const [notification, setNotification] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  useEffect(() => {
    setRegionData({
      ...emptyRegionData,
      ...initialRegion,
    });
    if (initialRegion?.id) {
      setNotification("This region is being edited.");
      setOpenSnackbar(true);
    }
  }, [initialRegion]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Region / City Admin  Name is required.")
      .max(100, "Region Name cannot be longer than 100 characters."),
    description: Yup.string().max(
      200,
      "Description cannot be longer than 200 characters."
    ),
  });

  const handleSubmit = useCallback(
    async (
      values: RegionDto,
      { setSubmitting, resetForm }: FormikHelpers<RegionDto>
    ) => {
      try {
        const action = initialRegion?.id
          ? updateRegion({
              updateRegionCommand: { ...values, id: initialRegion.id },
            })
          : createRegion({ createRegionCommand: values });

        await action.unwrap();
        showSuccessAlert(
          initialRegion?.id
            ? "Region updated successfully!"
            : "Region created successfully!"
        );
        resetForm();
        onClose();
      } catch (error: any) {
        showErrorAlert(error?.data?.detail || "Failed to save region.");
      } finally {
        setSubmitting(false);
      }
    },
    [createRegion, updateRegion, onClose, showErrorAlert, initialRegion?.id]
  );

  const errors =
    (createRegionError as any)?.data?.errors ||
    (updateRegionError as any)?.data?.errors;

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
      {!!regionData && (
        <Formik
          initialValues={regionData}
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
                      label="Region / City Admin Name"
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
