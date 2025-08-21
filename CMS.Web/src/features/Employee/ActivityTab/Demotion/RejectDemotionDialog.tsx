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
import { useRejectEmployeeDemotionMutation } from "../../../../app/api";
import { RejectEmployeeDemotion } from "../../../../app/api";
import { usePermission } from "../../../../hooks";
interface RejectPromotionDialogProps {
  Id: number | undefined;
  employeeId: number | undefined;
  onClose: () => void;
}

interface RejectFormValues {
  remark: string;
}

const validationSchema = Yup.object({
  remark: Yup.string()
    .required("Remark is required")
    .min(1, "Must be at least 5 characters"),
});

export const RejectDemotionDialog: React.FC<RejectPromotionDialogProps> = ({
  Id,
  employeeId,
  onClose,
}) => {
  const initialValues: RejectFormValues = {
    remark: "",
  };
  const [RejectingEmployeeDemotion, { error: rejectingEmployeeDemotionError }] =
    useRejectEmployeeDemotionMutation();
  const permissions = usePermission();
  const handleSubmit = async (
    values: RejectFormValues,
    { setSubmitting, setStatus, setErrors }: FormikHelpers<RejectFormValues>
  ) => {
    try {
      const payload = {
        rejectEmployeeDemotion: {
          id: Id!,
          employeeId: employeeId!,
          remark: values.remark,
        },
      };

      await RejectingEmployeeDemotion(payload).unwrap();
      onClose();
    } catch (error: any) {
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
            <DialogHeader title="Reject Employee Demotion" onClose={onClose} />
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
               disabled={isSubmitting || !permissions.CanApproveRejectEmployeeActivity}
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
