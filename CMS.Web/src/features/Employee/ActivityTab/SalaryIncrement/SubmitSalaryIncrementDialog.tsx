import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Alert,
  AlertTitle,
  Box,
} from "@mui/material";
import React from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { DialogHeader } from "../../../../components/dialog";
import {
  useSubmitSalaryIncrementMutation,
  SubmitSalaryIncrementCommand,
} from "../../../../app/api";
import { usePermission } from "../../../../hooks";
interface SubmitReSalaryIncrementProps {
  Id: number | undefined;
  employeeId: number | undefined;
  onClose: () => void;
}

interface SubmitFormValues {
  remark: string;
}

const validationSchema = Yup.object({
  remark: Yup.string()
    .required("Remark is required")
    .min(1, "Must be at least 5 characters"),
});

export const SubmitSalaryIncrementDialog: React.FC<
  SubmitReSalaryIncrementProps
> = ({ Id, employeeId, onClose }) => {
  const initialValues: SubmitFormValues = {
    remark: "",
  };
  const permissions = usePermission();
  const [
    SubmittingEmployeeSalaryIncrement,
    { error: submitEmployeeSalaryIncrementerror },
  ] = useSubmitSalaryIncrementMutation();
  const handleSubmit = async (
    values: SubmitFormValues,
    { setSubmitting, setStatus, setErrors }: FormikHelpers<SubmitFormValues>
  ) => {
    try {
      const payload = {
        submitSalaryIncrementCommand: {
          id: Id!,
          employeeId: employeeId!,
          remark: values.remark,
        },
      };
      await SubmittingEmployeeSalaryIncrement(payload).unwrap();
      onClose();
    } catch (error: any) {
      console.error("Error Submition SalaryIncrement:", error);
      setStatus({
        success: false,
        error: "Submission failed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog scroll="paper" disableEscapeKeyDown maxWidth="md" open>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, touched, errors, isSubmitting, status }) => (
          <Form>
            <DialogHeader title="Submit Salary Increment" onClose={onClose} />
            <DialogContent dividers sx={{ width: 600 }}>
              {status?.error && (
                <Alert severity="error">
                  <AlertTitle>Error</AlertTitle>
                  {status.error}
                </Alert>
              )}

              <TextField
                label="Remark"
                name="remark"
                fullWidth
                multiline
                minRows={5}
                variant="outlined"
                required
                value={values.remark}
                onChange={handleChange}
                error={touched.remark && Boolean(errors.remark)}
                helperText={touched.remark && errors.remark}
              />
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={onClose} variant="outlined">
                Cancel
              </Button>
              <Button
                color="primary"
                variant="contained"
                type="submit"
                disabled={isSubmitting || !permissions.CanSubmitEmployeeActivity}
                startIcon={
                  isSubmitting ? <CircularProgress size={16} /> : undefined
                }
              >
                Submit
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
