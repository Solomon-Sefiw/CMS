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
import { DialogHeader } from "../../../../../components/dialog";
import { useApproveEmployeePromotionMutation } from "../../../../../app/api";
import { ApproveEmployeePromotion } from "../../../../../app/api";
import { usePermission } from "../../../../../hooks";
interface ApprovePromotionDialogProps {
  Id: number | undefined;
  employeeId: number | undefined;
  onClose: () => void;
}

interface ApproveFormValues {
  remark: string;
}

const validationSchema = Yup.object({
  remark: Yup.string()
    .required("Remark is required")
    .min(1, "Must be at least 5 characters"),
});

export const ApprovePromotionDialog: React.FC<ApprovePromotionDialogProps> = ({
  Id,
  employeeId,
  onClose,
}) => {
  const initialValues: ApproveFormValues = {
    remark: "",
  };
  const permissions = usePermission();
  const [ApprovingEmployeePromotion, { error: approveEmployeePromotionerror }] =
    useApproveEmployeePromotionMutation();
  const handleSubmit = async (
    values: ApproveFormValues,
    { setSubmitting, setStatus, setErrors }: FormikHelpers<ApproveFormValues>
  ) => {
    try {
      const payload = {
        approveEmployeePromotion: {
          id: Id!,
          employeeId: employeeId!,
          remark: values.remark,
        },
      };

      await ApprovingEmployeePromotion(payload).unwrap();
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
            <DialogHeader
              title="Approve Employee Promotion"
              onClose={onClose}
            />
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
