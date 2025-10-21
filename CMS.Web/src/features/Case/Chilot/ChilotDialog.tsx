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
  MenuItem,
} from "@mui/material";
import * as Yup from "yup";
import { ChilotDto, useCreateChilotMutation, useUpdateChilotMutation } from "../../../app/api/HCMSApi";
import { ChilotType } from "../../../app/api/enums";
import { useAlert } from "../../notification";
import { DialogHeader, Errors, FormSelectField, FormTextField } from "../../../components";
import { getEnumOptions } from "../../../components/form-controls/get-enum-list";
import { FormAutocomplete } from "../../../components/form-controls/form-auto-complete";
import { useBusinessUnit } from "../../BusinessUnit";

const emptyChilotData: ChilotDto = {
  id: undefined,
  name: "",
  chilotType: ChilotType.Wonjel, // Default value as in your command
  roomNumber: "",
  businessUnitId: 0,
};

interface ChilotDialogProps {
  initialChilot?: ChilotDto;
  title: string;
  onClose: () => void;
}

export const ChilotDialog: React.FC<ChilotDialogProps> = ({
  onClose,
  initialChilot,
  title,
}) => {
    const { businessUnitLookups } = useBusinessUnit();
  const [chilotData, setChilotData] = useState<ChilotDto>(emptyChilotData);
  const [createChilot, { error: createError, isLoading: isCreating }] =
    useCreateChilotMutation();
  const [updateChilot, { error: updateError, isLoading: isUpdating }] =
    useUpdateChilotMutation();
  const { showSuccessAlert, showErrorAlert } = useAlert();
  const [notification, setNotification] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    setChilotData({
      ...emptyChilotData,
      ...initialChilot,
    });
    if (initialChilot?.id) {
      setIsLocked(true);
      setNotification("This Chilot is being edited.");
      setOpenSnackbar(true);
    } else {
      setIsLocked(false);
    }
  }, [initialChilot]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Chilot Name is required.")
      .max(100, "Name cannot be longer than 100 characters.")
      .matches(
        /^[a-zA-Z0-9\s-_]+$/,
        "Only letters, numbers, spaces, hyphens, and underscores are allowed."
      ),
    chilotType: Yup.string().required("Chilot Type is required."),
    roomNumber: Yup.string().max(
      50,
      "Room Number cannot be longer than 50 characters."
    ),
    businessUnitId: Yup.number()
      .required("Business Unit is required.")
      .min(1, "Business Unit must be selected."),
  });

  const handleSubmit = useCallback(
    async (
      values: ChilotDto,
      { setSubmitting, resetForm }: FormikHelpers<ChilotDto>
    ) => {
      try {
        const action = initialChilot?.id
          ? updateChilot({
              updateChilotCommand: { ...values, id: initialChilot.id },
            })
          : createChilot({ createChilotCommand: values });

        await action.unwrap();
        showSuccessAlert(
          initialChilot?.id
            ? "Chilot updated successfully!"
            : "Chilot created successfully!"
        );
        resetForm();
        onClose();
      } catch (error: any) {
        showErrorAlert(error?.data?.detail || "Failed to save Chilot.");
      } finally {
        setSubmitting(false);
      }
    },
    [createChilot, updateChilot, onClose, showErrorAlert, initialChilot?.id]
  );

  const errors =
    (createError as any)?.data?.errors || (updateError as any)?.data?.errors;

  const isSaving = isCreating || isUpdating;

  return (
    <Dialog
      scroll="paper"
      disableEscapeKeyDown
      maxWidth="md"
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

      {!!chilotData && (
        <Formik
          initialValues={chilotData}
          enableReinitialize
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          validateOnChange
        >
          {({ handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <DialogHeader title={title} onClose={onClose} />
              <DialogContent dividers>
                <Grid container spacing={2}>
                  {errors && (
                    <Grid item xs={12}>
                      <Errors errors={errors as any} />
                    </Grid>
                  )}

                  <Grid item xs={12} sm={6}>
                    <FormTextField
                      name="name"
                      label="Chilot Name"
                      type="text"
                      fullWidth
                      error={!!errors?.name}
                      helperText={errors?.name}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                      <FormSelectField
                        name="caseType"
                        label="Case Type"
                        options={getEnumOptions(ChilotType)}
                      />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormTextField
                      name="roomNumber"
                      label="Room Number"
                      type="text"
                      fullWidth
                      error={!!errors?.roomNumber}
                      helperText={errors?.roomNumber}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                   <FormAutocomplete
                      name="businessUnitId"
                      label="Business Unit"
                      options={businessUnitLookups.filter(bu => bu.value !== 1)}
                    
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
