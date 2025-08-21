// ResignationDialog.tsx
import { Dialog, DialogActions, DialogContent, Grid, Button, Alert, Box } from "@mui/material";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useState, useEffect, useCallback } from "react";
import {
  ResignationDto,
  useCreateResignationMutation,
  useUpdateResignationMutation,
} from "../../../../app/store";
import { DialogHeader, FormTextField, FormSelectField, Errors } from "../../../../components";
import { useAlert } from "../../../notification";
import dayjs from "dayjs";
import { ResignationType } from "../../../../app/api/enums";
import { getEnumOptions } from "../../../../components/form-controls/get-enum-list";

interface ResignationDialogProps {
  initialResignation?: ResignationDto;
  title: string;
  employeeId: number;
  onClose: () => void;
}

type ResignationForm = {
  id: number;
  employeeId: number;
  salary: number;
  workUnit: string;
  resignationDate: string; // YYYY-MM-DD
  resignationType: ResignationType | number;
  reasonForResignation: string;
  finalSettlementDetails: string;
  isActive: boolean;
};

const emptyForm: ResignationForm = {
  id: 0,
  employeeId: 0,
  salary: 0,
  workUnit: "",
  resignationDate: "", // keep empty; input[type=date] handles it
  resignationType: ResignationType.Voluntary,
  reasonForResignation: "",
  finalSettlementDetails: "",
  isActive: true,
};

const validationSchema = Yup.object({
  resignationDate: Yup.date()
    .required("Resignation date is required")
    .max(new Date(), "Resignation date cannot be in the future"),

  salary: Yup.number()
    .typeError("Salary must be a number")
    .required("Salary is required")
    .min(0, "Salary must be a positive amount"),

  workUnit: Yup.string()
    .required("Work unit is required")
    .max(200, "Work unit cannot exceed 200 characters"),

  resignationType: Yup.number()
    .typeError("Resignation type is required")
    .required("Resignation type is required"),

  reasonForResignation: Yup.string()
    .max(500, "Reason for resignation cannot exceed 500 characters"),

  finalSettlementDetails: Yup.string()
    .max(500, "Final settlement details cannot exceed 500 characters"),
});


export const ResignationDialog = ({
  onClose,
  initialResignation,
  title,
  employeeId,
}: ResignationDialogProps) => {
  const [formData, setFormData] = useState<ResignationForm>(emptyForm);
  const [createResignation, { error: createError, isLoading: isCreating }] =
    useCreateResignationMutation();
  const [updateResignation, { error: updateError, isLoading: isUpdating }] =
    useUpdateResignationMutation();
  const { showSuccessAlert, showErrorAlert } = useAlert();
  const [notification, setNotification] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Normalize initial data -> camelCase + YYYY-MM-DD date string
  useEffect(() => {
    const normalized: ResignationForm = {
      ...emptyForm,
      ...(initialResignation || {}),
      id: initialResignation?.id ?? 0,
      employeeId: employeeId, // force from props
      resignationDate: initialResignation?.resignationDate
        ? dayjs(initialResignation.resignationDate).format("YYYY-MM-DD")
        : "",
      resignationType:
        typeof initialResignation?.resignationType === "number"
          ? initialResignation.resignationType
          : ResignationType.Voluntary,
      salary: initialResignation?.salary ?? 0,
      workUnit: initialResignation?.workUnit ?? "",
      reasonForResignation: initialResignation?.reasonForResignation ?? "",
      finalSettlementDetails: initialResignation?.finalSettlementDetails ?? "",
      isActive:
        typeof initialResignation?.isActive === "boolean"
          ? initialResignation.isActive
          : true,
    };

    setFormData(normalized);

    if (initialResignation?.id) {
      setNotification("This resignation is being edited.");
      setOpenSnackbar(true);
    }
  }, [initialResignation, employeeId]);

  const handleSubmit = useCallback(
    async (
      values: ResignationForm,
      { setSubmitting, resetForm }: FormikHelpers<ResignationForm>
    ) => {
      try {
        setSubmitting(true);

        // Ensure YYYY-MM-DD string for DateOnly on backend
        const payload = {
          ...values,
          employeeId, // ensure consistency
          resignationDate: values.resignationDate
            ? dayjs(values.resignationDate).format("YYYY-MM-DD")
            : "",
        };

        const action =
          values.id && values.id > 0
            ? updateResignation({ updateResignationCommand: payload as any })
            : createResignation({ createResignationCommand: payload as any });

        await action.unwrap();

        showSuccessAlert(
          values.id ? "Resignation updated successfully!" : "Resignation created successfully!"
        );
        resetForm();
        onClose();
      } catch (error: any) {
        // Prefer backend detail; fallback to generic
        showErrorAlert(error?.data?.detail || "Failed to save resignation.");
      } finally {
        setSubmitting(false);
      }
    },
    [createResignation, updateResignation, employeeId, onClose, showErrorAlert, showSuccessAlert]
  );

  const errors =
    (createError as any)?.data?.errors || (updateError as any)?.data?.errors;
  const isSaving = isCreating || isUpdating;

  return (
    <Dialog scroll="paper" disableEscapeKeyDown maxWidth="sm" open={true}>
      {openSnackbar && notification && (
        <Alert severity="warning" onClose={() => setOpenSnackbar(false)} sx={{ mb: 2 }}>
          {notification}
        </Alert>
      )}

      {!!formData && (
        <Formik
          initialValues={formData}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
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

                  {/* resignationDate */}
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                  <FormTextField
                       sx={{width: "100%"}} 
                      name="resignationDate"
                      label="Resignation Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                    <FormTextField name="salary" label="Salary" type="number"  />
                    </Box>
                  </Grid>


                  {/* workUnit */}
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                    <FormTextField name="workUnit" label="Approved By" fullWidth />
                                        <FormSelectField
                      name="resignationType"
                      label="Resignation Type"
                      options={getEnumOptions(ResignationType)}
                    />
                    </Box>
                  </Grid>


                  {/* reasonForResignation */}
                  <Grid item xs={12}>
                    <FormTextField
                      name="reasonForResignation"
                      label="Reason for Resignation"
                      multiline
                      fullWidth
                      rows={3}
                    />
                  </Grid>

                  {/* finalSettlementDetails */}
                  <Grid item xs={12}>
                    <FormTextField
                      name="finalSettlementDetails"
                      label="Final Settlement Details"
                      multiline
                      fullWidth
                      rows={3}
                    />
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} disabled={isSaving || isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" variant="outlined" disabled={isSaving || isSubmitting}>
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
