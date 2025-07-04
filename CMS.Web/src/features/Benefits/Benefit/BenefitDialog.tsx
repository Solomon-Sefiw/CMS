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
  AddBenefitCommand,
  BenefitDto,
  UpdateBenefitCommand,
  useAddBenefitMutation,
  useUpdateBenefitMutation,
} from "../../../app/store";
import { FormSelectField } from "../../../components/form-controls/form-select";
import { useBenefitMeasurementUnits } from "./useBenefitMeasurementUnits";
import { useAlert } from "../../notification";

interface BenefitDialogProps {
  benefit?: BenefitDto;
  title: string;
  onClose: () => void;
}

const emptyBenefitData: BenefitDto = {
  id: undefined,
  name: "",
  unitOfMeasurementId: undefined,
  remark: "",
};

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .max(100, "Name exceeds 100 characters")
    .matches(/^[A-Za-z\s]+$/, "Name must contain letters and spaces only"),
  unitOfMeasurementId: Yup.string().required("Measurment Unit is required"),
});

export const BenefitDialog = ({
  onClose,
  benefit,
  title,
}: BenefitDialogProps) => {
  const [benefitData, setBenefitData] = useState<BenefitDto>(emptyBenefitData);
  const [addBenefit, { error: addBenefitError }] = useAddBenefitMutation();
  const [updateBenefit, { error: updateBenefitError }] =
    useUpdateBenefitMutation();
  const [notification, setNotification] = useState<string>("");
  const [severity, setSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("info");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const { benefitUnitOfMeasurementLookups } = useBenefitMeasurementUnits();
  const { showSuccessAlert, showErrorAlert } = useAlert();

  useEffect(() => {
    setBenefitData({
      ...emptyBenefitData,
      ...benefit,
    });
  }, [benefit]);

  const handleSubmit = useCallback(
    async (values: BenefitDto) => {
      try {
        if (values.id) {
          const updateCommand: UpdateBenefitCommand = {
            id: values.id,
            name: values.name,
            unitOfMeasurementId: values.unitOfMeasurementId,
          };

          const response = await updateBenefit({
            updateBenefitCommand: updateCommand,
          }).unwrap();
          if (response) {
            showSuccessAlert("Benefit updated successfully!");
            setSeverity("info");
          }
        } else {
          const addCommand: AddBenefitCommand = {
            name: values.name,
            unitOfMeasurementId: values.unitOfMeasurementId,
          };

          const response = await addBenefit({
            addBenefitCommand: addCommand,
          }).unwrap();
          if (response) {
            showSuccessAlert("Benefit Saved successfully!");
            setSeverity("info");
          }
        }
         onClose();
        
      } catch (error) {
        setOpenSnackbar(true);
      }
    },
    [addBenefit, updateBenefit, onClose]
  );

  const errors =
    (addBenefitError as any)?.data?.errors ||
    (updateBenefitError as any)?.data?.errors;

  return (
    <Dialog
      scroll="paper"
      open={true}
      maxWidth="lg"
      fullWidth
      sx={{ "& .MuiDialog-paper": { width: "50%", maxHeight: "90vh" } }}
    >
      <Formik
        initialValues={benefitData}
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
                  <FormikTextField name="name" label="Benefit Name" />
                </Grid>

                <Grid item xs={12} sm={12}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <FormSelectField
                      name="unitOfMeasurementId"
                      label="Measurement Unit"
                      type="number"
                      options={benefitUnitOfMeasurementLookups}
                      fullWidth
                    />
                  </Box>
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
