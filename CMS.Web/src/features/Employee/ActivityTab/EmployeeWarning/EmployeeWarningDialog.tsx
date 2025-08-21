import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Alert,
  Box,
} from "@mui/material";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import {
  useCreateEmployeeWarningMutation,
  useUpdateEmployeeWarningMutation,
  EmployeeWarningDto,
} from "../../../../app/store";
import { useAlert } from "../../../notification";
import {
  DialogHeader,
  Errors,
  FormSelectField,
  FormTextField,
} from "../../../../components";
import { useEffect, useState, useCallback } from "react";
import { ViolationType, WarningStatus } from "../../../../app/api/enums";
import { getEnumOptions } from "../../../../components/form-controls/get-enum-list";
import dayjs from "dayjs";

interface EmployeeWarningDialogProps {
  initialWarning?: EmployeeWarningDto;
  title: string;
  employeeId: number;
  onClose: () => void;
}

const emptyWarningData: EmployeeWarningDto = {
  id: undefined,
  employeeId: undefined,
  percentage: 0,
  warningDate: "",
  warningStatus: WarningStatus.FirstLevel,
  violationType: ViolationType.Other,
  remark: "",
};

export const EmployeeWarningDialog = ({
  onClose,
  initialWarning,
  title,
  employeeId,
}: EmployeeWarningDialogProps) => {
  const [warningData, setWarningData] = useState<EmployeeWarningDto>(
    emptyWarningData
  );
  const [createWarning, { error: createError, isLoading: isCreating }] =
    useCreateEmployeeWarningMutation();
  const [updateWarning, { error: updateError, isLoading: isUpdating }] =
    useUpdateEmployeeWarningMutation();
  const { showSuccessAlert, showErrorAlert } = useAlert();
  const [notification, setNotification] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  useEffect(() => {
    setWarningData({
      ...emptyWarningData,
      ...initialWarning,
      warningDate: initialWarning?.warningDate ?? "",
    });
    if (initialWarning?.id) {
      setNotification("This warning is being edited.");
      setOpenSnackbar(true);
    }
  }, [initialWarning]);

  // ✅ Fixed field name mismatch (violationType instead of ViolationType)
  const validationSchema = Yup.object({
    percentage: Yup.number()
      .min(0)
      .max(100)
      .required("Percentage is required."),
    warningDate: Yup.string().required("Warning date is required."),
    warningStatus: Yup.number().required("Warning level is required."),
    violationType: Yup.number().required("Violation Type is required."),
    remark: Yup.string().max(500, "Remark cannot exceed 500 characters."),
  });

  const handleSubmit = useCallback(
    async (
      values: EmployeeWarningDto,
      { setSubmitting, resetForm }: FormikHelpers<EmployeeWarningDto>
    ) => {
      try {
        console.log("Submitting warning data:", values);
        values.employeeId = employeeId;
        values.warningDate = dayjs(values.warningDate).format("YYYY-MM-DD");

        setSubmitting(true);

        const action = values.id
          ? updateWarning({
              updateEmployeeWarningCommand: { ...values },
            })
          : createWarning({
              createEmployeeWarningCommand: { ...values },
            });

        await action.unwrap();

        showSuccessAlert(
          values.id
            ? "Warning updated successfully!"
            : "Warning created successfully!"
        );
        resetForm();
        onClose();
      } catch (error: any) {
        showErrorAlert(error?.data?.detail || "Failed to save warning.");
      } finally {
        setSubmitting(false);
      }
    },
    [
      createWarning,
      updateWarning,
      showSuccessAlert,
      showErrorAlert,
      onClose,
      employeeId,
    ]
  );

  const errors =
    (createError as any)?.data?.errors || (updateError as any)?.data?.errors;
  const isSaving = isCreating || isUpdating;

  return (
    <Dialog scroll="paper" disableEscapeKeyDown maxWidth="sm" open={true}>
      {openSnackbar && notification && (
        <Alert
          severity="warning"
          onClose={() => setOpenSnackbar(false)}
          sx={{ mb: 2 }}
        >
          {notification}
        </Alert>
      )}

      {!!warningData && (
        <Formik
          initialValues={warningData}
          enableReinitialize
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
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

                  <Grid item xs={12}>
                    <FormSelectField
                      name="warningStatus"
                      label="Warning Level"
                      options={getEnumOptions(WarningStatus)}
                      error={!!errors?.warningStatus}
                      helperText={errors?.warningStatus}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormTextField
                      name="percentage"
                      label="Monetary Punishment(percentage of salary)"
                      type="number"
                      fullWidth
                      error={!!errors?.percentage}
                      helperText={errors?.percentage}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <FormSelectField
                        name="violationType"
                        label="Violation Type"
                        options={getEnumOptions(ViolationType)}
                        error={!!errors?.violationType} // ✅ fixed key
                        helperText={errors?.violationType} // ✅ fixed key
                      />
                      <FormTextField
                        sx={{ width: "100%" }}
                        name="warningDate"
                        label="Warning Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        error={!!errors?.warningDate}
                        helperText={errors?.warningDate}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <FormTextField
                      name="remark"
                      label="Remark"
                      multiline
                      fullWidth
                      rows={3}
                      error={!!errors?.remark}
                      helperText={errors?.remark}
                    />
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} disabled={isSaving || isSubmitting}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="outlined"
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
