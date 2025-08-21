import { Dialog, DialogActions, DialogContent, Grid, Button, Alert, Box } from "@mui/material";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useState, useEffect, useCallback } from "react";
import { SuspensionDto, useCreateSuspensionMutation, useUpdateSuspensionMutation } from "../../../../app/store";
import { DialogHeader, FormTextField, FormSelectField, Errors } from "../../../../components";
import { useAlert } from "../../../notification";
import dayjs from "dayjs";
import { getEnumOptions } from "../../../../components/form-controls/get-enum-list";
import { SuspensionReason } from "../../../../app/api/enums";

interface SuspensionDialogProps {
  initialSuspension?: SuspensionDto;
  title: string;
  employeeId: number;
  onClose: () => void;
}

const emptyData: SuspensionDto = {
  id: undefined,
  employeeId: undefined,
  startDate: "",
  endDate: "",
  salary: 0,
  reason: undefined,
  description: "",
  conditionsForReinstatement: "",
};

export const SuspensionDialog = ({ onClose, initialSuspension, title, employeeId }: SuspensionDialogProps) => {
  const [suspensionData, setSuspensionData] = useState<SuspensionDto>(emptyData);
  const [createSuspension, { error: createError, isLoading: isCreating }] = useCreateSuspensionMutation();
  const [updateSuspension, { error: updateError, isLoading: isUpdating }] = useUpdateSuspensionMutation();
  const { showSuccessAlert, showErrorAlert } = useAlert();
  const [notification, setNotification] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    setSuspensionData({ ...emptyData, ...initialSuspension, startDate: initialSuspension?.startDate ?? "" });
    if (initialSuspension?.id) { setNotification("This suspension is being edited."); setOpenSnackbar(true); }
  }, [initialSuspension]);

const validationSchema = Yup.object({
  startDate: Yup.date()
    .required("Start date is required")
    .max(new Date(), "Start date cannot be in the future"),

  endDate: Yup.date()
    .nullable()
    .min(Yup.ref("startDate"), "End date cannot be before start date"),

  salary: Yup.number()
    .typeError("Salary must be a number")
    .required("Salary is required")
    .min(0, "Salary must be a positive amount"),

  reason: Yup.number()
    .typeError("Reason is required")
    .required("Reason is required"),

  description: Yup.string()
    .max(500, "Description cannot exceed 500 characters"),

  conditionsForReinstatement: Yup.string()
    .max(500, "Conditions for Reinstatement cannot exceed 500 characters"),
});


  const handleSubmit = useCallback(
    async (values: SuspensionDto, { setSubmitting, resetForm }: FormikHelpers<SuspensionDto>) => {
      try {
        values.employeeId = employeeId;
        values.startDate = dayjs(values.startDate).format("YYYY-MM-DD");
        values.endDate = values.endDate ? dayjs(values.endDate).format("YYYY-MM-DD") : undefined;

        setSubmitting(true);

        const action = values.id
          ? updateSuspension({ updateSuspensionCommand: { ...values } })
          : createSuspension({ createSuspensionCommand: { ...values } });

        await action.unwrap();
        showSuccessAlert(values.id ? "Suspension updated successfully!" : "Suspension created successfully!");
        resetForm();
        onClose();
      } catch (error: any) {
        showErrorAlert(error?.data?.detail || "Failed to save suspension.");
      } finally {
        setSubmitting(false);
      }
    },
    [createSuspension, updateSuspension, showSuccessAlert, showErrorAlert, employeeId, onClose]
  );

  const errors = (createError as any)?.data?.errors || (updateError as any)?.data?.errors;
  const isSaving = isCreating || isUpdating;

  return (
    <Dialog scroll="paper" disableEscapeKeyDown maxWidth="sm" open={true}>
      {openSnackbar && notification && (
        <Alert severity="warning" onClose={() => setOpenSnackbar(false)} sx={{ mb: 2 }}>{notification}</Alert>
      )}

      {!!suspensionData && (
        <Formik initialValues={suspensionData} enableReinitialize validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <DialogHeader title={title} onClose={onClose} />
              <DialogContent dividers>
                <Grid container spacing={2}>
                  {errors && <Grid item xs={12}><Errors errors={errors as any} /></Grid>}
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                    <FormTextField name="startDate" label="Start Date" type="date" fullWidth sx={{width: "100%"}} InputLabelProps={{ shrink: true }} />
                    <FormTextField name="endDate" label="End Date" type="date" fullWidth sx={{width: "100%"}} InputLabelProps={{ shrink: true }} />
                  </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                    <FormTextField name="salary" label="Salary" type="number" fullWidth />
                    <FormSelectField name="reason" label="Suspension Reason" options={getEnumOptions(SuspensionReason)} />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <FormTextField name="description" label="Description" multiline fullWidth rows={3} />
                  </Grid>
                  <Grid item xs={12}>
                    <FormTextField name="conditionsForReinstatement" label="Conditions for Reinstatement" multiline fullWidth rows={3} />
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} disabled={isSaving || isSubmitting}>Cancel</Button>
                <Button type="submit" variant="outlined" disabled={isSaving || isSubmitting}>{isSaving || isSubmitting ? "Saving..." : "Save"}</Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      )}
    </Dialog>
  );
};
