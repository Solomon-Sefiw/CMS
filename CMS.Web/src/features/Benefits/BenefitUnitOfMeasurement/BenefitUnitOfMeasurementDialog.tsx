import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Typography,
  Snackbar,
  Alert,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Formik, Form, useField, Field } from "formik";
import { useCallback, useEffect, useState } from "react";
import * as Yup from "yup";
import { Errors } from "../../../components/Errors";
import { DialogHeader } from "../../../components/dialog/DialogHeader";
import {
  AddBenefitUnitOfMeasurementCommand,
  BenefitUnitOfMeasurementDto,
  UpdateBenefitUnitOfMeasurementCommand,
  useAddBenefitUnitOfMeasurementMutation,
  useUpdateBenefitUnitOfMeasurementMutation,
} from "../../../app/api";
import { useAlert } from "../../notification";

interface BenefitUnitOfMeasurementDialogProps {
  benefitUnitOfMeasurement?: BenefitUnitOfMeasurementDto;
  title: string;
  onClose: () => void;
}

const emptyBenefitUnitOfMeasurementData: BenefitUnitOfMeasurementDto = {
  id: undefined,
  name: "",
  description: "",
  remark: "",
  isUnitPriced: false,
};

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Name  is required")
    .max(100, "Name exceeds 100 characters"),
  description: Yup.string()
    .required("Description is required")
    .max(200, "Description exceeds 200 characters"),
});

export const BenefitUnitOfMeasurementDialog = ({
  onClose,
  benefitUnitOfMeasurement,
  title,
}: BenefitUnitOfMeasurementDialogProps) => {
  const [benefitUnitOfMeasurementData, setBenefitUnitOfMeasurementData] =
    useState<BenefitUnitOfMeasurementDto>(emptyBenefitUnitOfMeasurementData);
  const [
    addBenefitUnitOfMeasurement,
    { error: addBenefitUnitOfMeasurementError },
  ] = useAddBenefitUnitOfMeasurementMutation();
  const [
    updateBenefitUnitOfMeasurement,
    { error: updateBenefitUnitOfMeasurementError },
  ] = useUpdateBenefitUnitOfMeasurementMutation();
  const [notification, setNotification] = useState<string>("");
  const [severity, setSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("info");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const { showSuccessAlert, showErrorAlert } = useAlert();

  useEffect(() => {
    setBenefitUnitOfMeasurementData({
      ...emptyBenefitUnitOfMeasurementData,
      ...benefitUnitOfMeasurement,
    });
  }, [benefitUnitOfMeasurement]);

  const handleSubmit = useCallback(
    async (values: BenefitUnitOfMeasurementDto) => {
      try {
        if (values.id) {
          const updateCommand: UpdateBenefitUnitOfMeasurementCommand = {
            id: values.id,
            name: values.name,
            isUnitPriced: values.isUnitPriced,
            description: values.description,
          };

          const response = await updateBenefitUnitOfMeasurement({
            updateBenefitUnitOfMeasurementCommand: updateCommand,
          }).unwrap();
          if (response) {
            showSuccessAlert("Benefit Measurement Unit updated successfully!");
            setSeverity("info");
          }
        } else {
          const addCommand: AddBenefitUnitOfMeasurementCommand = {
            name: values.name,
            isUnitPriced: values.isUnitPriced,
            description: values.description,
          };

          const response = await addBenefitUnitOfMeasurement({
            addBenefitUnitOfMeasurementCommand: addCommand,
          }).unwrap();
          if (response) {
            showSuccessAlert("Benefit Measurement Unit Saved successfully!");
            setSeverity("info");
          }
        }
          onClose();
        
      } catch (error) {
        setOpenSnackbar(true);
        
      }
    },
    [addBenefitUnitOfMeasurement, updateBenefitUnitOfMeasurement, onClose]
  );

  const errors =
    (addBenefitUnitOfMeasurementError as any)?.data?.errors ||
    (updateBenefitUnitOfMeasurementError as any)?.data?.errors;

  return (
    <Dialog
      scroll="paper"
      open={true}
      maxWidth="lg"
      fullWidth
      sx={{ "& .MuiDialog-paper": { width: "50%", maxHeight: "90vh" } }}
    >
      <Formik
        initialValues={benefitUnitOfMeasurementData}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        enableReinitialize
      >
        {() => (
          <Form>
            <DialogHeader title={title} onClose={onClose} />

            {notification && (
              <Box sx={{ p: 2 }}>
                <Alert severity={severity}>{notification}</Alert>
              </Box>
            )}

            <DialogContent dividers={true}>
              <Grid container spacing={2}>
                {errors && (
                  <Grid item xs={12}>
                    <Errors errors={errors as any} />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <FormikTextField name="name" label="Measurement Unit Name" />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Field name="isUnitPriced">
                    {({ field, form }: any) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...field}
                            checked={field.value || false}
                            onChange={(e) =>
                              form.setFieldValue(
                                "isUnitPriced",
                                e.target.checked
                              )
                            }
                            color="primary"
                          />
                        }
                        label="Is Unit Priced"
                      />
                    )}
                  </Field>
                </Grid>

                <Grid item xs={12}>
                  <FormikTextField
                    name="description"
                    label="Description"
                    multiline
                    rows={3}
                  />
                </Grid>
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

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity={severity}>{notification}</Alert>
      </Snackbar>
    </Dialog>
  );
};
const FormikTextField = ({ name, label, ...props }: any) => {
  const [field, meta] = useField(name);
  return (
    <TextField
      fullWidth
      label={label}
      {...field}
      {...props}
      error={Boolean(meta.touched && meta.error)}
      helperText={meta.touched && meta.error}
    />
  );
};
