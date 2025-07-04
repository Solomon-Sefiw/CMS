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
import { FormSelectField } from "../../../components/form-controls/form-select";
import { useBenefits } from "../../Jobs/JobRole/useBenefits";
import {
  AddBenefitValueCommand,
  BenefitValueDto,
  UpdateBenefitValueCommand,
  useAddBenefitValueMutation,
  useUpdateBenefitValueMutation,
} from "../../../app/api";
import { useAlert } from "../../notification";

interface BenefitValueDialogProps {
  benefitValue?: BenefitValueDto;
  title: string;
  onClose: () => void;
}

const emptyBenefitValueData: BenefitValueDto = {
  id: undefined,
  benefitId: undefined,
  value: undefined,
  description: "",
};

const validationSchema = Yup.object({
  benefitId: Yup.string().required("Benefit is required"),
  value: Yup.number()
    .typeError("Benefit value must be a number")
    .required("Benefit value is required")
    .min(0, "Benefit value cannot be negative")
    .max(1000000, "Benefit value is too large"),

  description: Yup.string()
    .required("Description is required")
    .max(200, "Description exceeds 200 characters"),
});

export const BenefitValueDialog = ({
  onClose,
  benefitValue,
  title,
}: BenefitValueDialogProps) => {
  const [benefitValueData, setBenefitValueData] = useState<BenefitValueDto>(
    emptyBenefitValueData
  );
  const [addBenefitValue, { error: addBenefitValueError }] =
    useAddBenefitValueMutation();
  const [updateBenefitValue, { error: updateBenefitValueError }] =
    useUpdateBenefitValueMutation();
  const [notification, setNotification] = useState<string>("");
  const [severity, setSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("info");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const { benefitLookups } = useBenefits();
  const { showSuccessAlert, showErrorAlert } = useAlert();

  useEffect(() => {
    setBenefitValueData({
      ...emptyBenefitValueData,
      ...benefitValue,
    });
  }, [benefitValue]);

  const handleSubmit = useCallback(
    async (values: BenefitValueDto) => {
      try {
        if (values.id) {
          const updateCommand: UpdateBenefitValueCommand = {
            id: values.id,
            benefitId: values.benefitId,
            value: values.value,
            description: values.description,
          };

          const response = await updateBenefitValue({
            updateBenefitValueCommand: updateCommand,
          }).unwrap();
          if (response) {
            showSuccessAlert("Benefit Value updated successfully!");
            setSeverity("info");
          }
        } else {
          const addCommand: AddBenefitValueCommand = {
            benefitId: values.benefitId,
            value: values.value,
            description: values.description,
          };

          const response = await addBenefitValue({
            addBenefitValueCommand: addCommand,
          }).unwrap();
          if (response) {
            showSuccessAlert("Benefit Value Saved successfully!");
            setSeverity("info");
          }
        }
         onClose();
       
      } catch (error) {
        setOpenSnackbar(true);
      }
    },
    [addBenefitValue, updateBenefitValue, onClose]
  );

  const errors =
    (addBenefitValueError as any)?.data?.errors ||
    (updateBenefitValueError as any)?.data?.errors;

  return (
    <Dialog
      scroll="paper"
      open={true}
      maxWidth="lg"
      fullWidth
      sx={{ "& .MuiDialog-paper": { width: "50%", maxHeight: "90vh" } }}
    >
      <Formik
        initialValues={benefitValueData}
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
                <Grid item xs={12} sm={12}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <FormSelectField
                      name="benefitId"
                      label="Benefit"
                      type="number"
                      options={benefitLookups}
                      fullWidth
                    />
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <FormikTextField name="value" label="Value" type="number" />
                </Grid>

                <Grid item xs={12}>
                  <FormikTextField
                    name="description"
                    label="Description"
                    multiline
                    minRows={3}
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
