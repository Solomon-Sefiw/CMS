import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Alert,
} from "@mui/material";
import { Formik, Form, FormikHelpers } from "formik";
import {
  DialogHeader,
  FormSelectField,
  FormTextField,
} from "../../../components";
import { useCallback, useEffect, useState } from "react";
import { Errors } from "../../../components";
import {
  SubCityDto,
  useCreateSubCityMutation,
  useUpdateSubCityMutation,
} from "../../../app/api";
import { useAlert } from "../../notification";
import * as Yup from "yup";
import { useRegion } from "../useRegion";

interface SubCityDialogProps {
  initialSubCity?: SubCityDto;
  title: string;
  onClose: () => void;
}

const emptySubCityData: SubCityDto = {
  id: undefined,
  name: "",
  description: "",
  regionId: undefined,
};

export const SubCityDialog = ({
  onClose,
  initialSubCity,
  title,
}: SubCityDialogProps) => {
  const [subCityData, setSubCityData] = useState<SubCityDto>(emptySubCityData);
  const [createSubCity, { error: createSubCityError, isLoading: isCreating }] =
    useCreateSubCityMutation();
  const [updateSubCity, { error: updateSubCityError, isLoading: isUpdating }] =
    useUpdateSubCityMutation();
  const { showSuccessAlert, showErrorAlert } = useAlert();
  const [notification, setNotification] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState(false);
  const { regionLookups } = useRegion();

  useEffect(() => {
    setSubCityData({
      ...emptySubCityData,
      ...initialSubCity,
    });
    if (initialSubCity?.id) {
      setIsLocked(true);
      setNotification("This sub-city is being edited.");
      setOpenSnackbar(true);
    } else {
      setIsLocked(false);
    }
  }, [initialSubCity]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Sub-City / Zone Name is required.")
      .max(100, "Sub-City Name cannot be longer than 100 characters."),
    description: Yup.string().max(
      200,
      "Description cannot be longer than 200 characters."
    ),
    regionId: Yup.number().required("Region / City-Admin is required."),
  });

  const handleSubmit = useCallback(
    async (
      values: SubCityDto,
      { setSubmitting, resetForm }: FormikHelpers<SubCityDto>
    ) => {
      try {
        const action = initialSubCity?.id
          ? updateSubCity({
              updateSubCityCommand: { ...values, id: initialSubCity.id },
            })
          : createSubCity({ createSubCityCommand: values });

        await action.unwrap();
        showSuccessAlert(
          initialSubCity?.id
            ? "Sub-City updated successfully!"
            : "Sub-City created successfully!"
        );
        resetForm();
        onClose();
      } catch (error: any) {
        showErrorAlert(error?.data?.detail || "Failed to save sub-city.");
      } finally {
        setSubmitting(false);
      }
    },
    [createSubCity, updateSubCity, onClose, showErrorAlert, initialSubCity?.id]
  );

  const errors =
    (createSubCityError as any)?.data?.errors ||
    (updateSubCityError as any)?.data?.errors;

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
      {!!subCityData && (
        <Formik
          initialValues={subCityData}
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
                      label="Sub-City / Zone Name"
                      type="text"
                      fullWidth
                      error={!!errors?.name}
                      helperText={errors?.name}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormSelectField
                      name="regionId"
                      label="Region / City-Admin"
                      type="number"
                      options={regionLookups}
                      error={!!errors?.regionId}
                      helperText={errors?.regionId}
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
