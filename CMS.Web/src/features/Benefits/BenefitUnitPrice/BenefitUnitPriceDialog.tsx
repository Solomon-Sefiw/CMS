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
import { useUnitPricedBenefits } from "./useUnitPricedBenefits";
import {
  AddBenefitUnitPriceCommand,
  BenefitUnitPriceDto,
  UpdateBenefitUnitPriceCommand,
  useAddBenefitUnitPriceMutation,
  useUpdateBenefitUnitPriceMutation,
} from "../../../app/api";
import dayjs from "dayjs";
import { useAlert } from "../../notification";

interface BenefitUnitPriceDialogProps {
  benefitUnitPrice?: BenefitUnitPriceDto;
  title: string;
  onClose: () => void;
}

const emptyBenefitUnitPriceData: BenefitUnitPriceDto = {
  id: undefined,
  benefitId: undefined,
  price: undefined,
  effectiveDate: undefined,
  remark: "",
};

const validationSchema = Yup.object({
  benefitId: Yup.string().required("Benefit is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .required("Price is required")
    .positive("Price must be greater than 0")
    .max(1000000, "Price seems too large"),
  effectiveDate: Yup.date()
    .required("Date is required")
    .max(new Date(), "Date cannot be in the future"),
});

export const BenefitUnitPriceDialog = ({
  onClose,
  benefitUnitPrice,
  title,
}: BenefitUnitPriceDialogProps) => {
  const [benefitUnitPriceData, setBenefitUnitPriceData] =
    useState<BenefitUnitPriceDto>(emptyBenefitUnitPriceData);
  const [addBenefitUnitPrice, { error: addBenefitUnitPriceError }] =
    useAddBenefitUnitPriceMutation();
  const [updateBenefitUnitPrice, { error: updateBenefitUnitPriceError }] =
    useUpdateBenefitUnitPriceMutation();
  const [notification, setNotification] = useState<string>("");
  const [severity, setSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("info");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const { unitPricedBenefitLookups } = useUnitPricedBenefits();
  const { showSuccessAlert, showErrorAlert } = useAlert();

  useEffect(() => {
    setBenefitUnitPriceData({
      ...emptyBenefitUnitPriceData,
      ...benefitUnitPrice,
      // added for picking the date
      effectiveDate: benefitUnitPrice?.effectiveDate
        ? dayjs(benefitUnitPrice.effectiveDate).format("YYYY-MM-DD")
        : "",
    });
  }, [benefitUnitPrice]);

  const handleSubmit = useCallback(
    async (values: BenefitUnitPriceDto) => {
      try {
        if (values.id) {
          const updateCommand: UpdateBenefitUnitPriceCommand = {
            id: values.id,
            benefitId: values.benefitId,
            price: values.price,
            effectiveDate: values.effectiveDate,
          };

          const response = await updateBenefitUnitPrice({
            updateBenefitUnitPriceCommand: updateCommand,
          }).unwrap();
          if (response) {
            showSuccessAlert("Unit price updated successfully!");
            setSeverity("info");
          }
        } else {
          const addCommand: AddBenefitUnitPriceCommand = {
            benefitId: values.benefitId,
            price: values.price,
            effectiveDate: values.effectiveDate,
          };

          const response = await addBenefitUnitPrice({
            addBenefitUnitPriceCommand: addCommand,
          }).unwrap();
          if (response) {
            showSuccessAlert("Unit Price Saved successfully!");
            setSeverity("info");
          }
        }
        
          onClose();
       
      } catch (error) {
        setOpenSnackbar(true);
      }
    },
    [addBenefitUnitPrice, updateBenefitUnitPrice, onClose]
  );

  const errors =
    (addBenefitUnitPriceError as any)?.data?.errors ||
    (updateBenefitUnitPriceError as any)?.data?.errors;

  return (
    <Dialog
      scroll="paper"
      open={true}
      maxWidth="lg"
      fullWidth
      sx={{ "& .MuiDialog-paper": { width: "50%", maxHeight: "90vh" } }}
    >
      <Formik
        initialValues={benefitUnitPriceData}
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
                      options={unitPricedBenefitLookups}
                      fullWidth
                    />
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <FormikTextField name="price" label="Price" type="number" />
                </Grid>

                <Grid item xs={6}>
                  <FormikTextField
                    name="effectiveDate"
                    label="Effective Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
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
