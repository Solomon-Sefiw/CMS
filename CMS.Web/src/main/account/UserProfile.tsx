import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
} from "@mui/material";
import { Form, Formik } from "formik";
import { useCallback } from "react";
import * as yup from "yup";
import { useChangePasswordMutation } from "../../app/api";
import { DialogHeader, Errors, FormTextField } from "../../components";
import { YupShape } from "../../utils";
import { useAlert } from "../../features/notification";
import { UserPhoto } from "./UserPhoto";
import { useAuth } from "../../hooks";
import { red } from "@mui/material/colors";

interface ChangePasswordFields {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}
const validationSchema = yup.object<YupShape<ChangePasswordFields>>({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup.string().required("New password is required"),
  confirmPassword: yup
    .string()
    .nullable()
    .oneOf([yup.ref("newPassword"), null], "Password must match"),
});

const emptyFormData: ChangePasswordFields = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export const UserProfileDialog = ({ onClose }: { onClose: () => void }) => {
  const [changePassword, { error: changePasswordError }] =
    useChangePasswordMutation();
    const { user } = useAuth();
  const { showSuccessAlert, showErrorAlert } = useAlert();

  const errors = (changePasswordError as any)?.data;

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      fullWidth
      maxWidth={"sm"}
      open={true}
    >
      <Formik
        initialValues={emptyFormData}
        enableReinitialize={true}
        onSubmit={async (values, actions) => {
          // You can implement password change logic here or call changePassword mutation
          try {
            await changePassword({ changePasswordPayload: values }).unwrap();
            showSuccessAlert("Password changed successfully.");
            onClose();
          } catch (e) {
            showErrorAlert("Failed to change password.");
          } finally {
            actions.setSubmitting(false);
          }
        }}
        validationSchema={validationSchema}
        validateOnChange={true}
      >
        <Form>
          <DialogHeader title={"Upload Signature"} onClose={onClose} />
          <DialogContent dividers={true}>
            <Grid container spacing={2}>
              {errors && (
                <Grid item xs={12}>
                  <Errors errors={errors as any} />
                </Grid>
              )}
            <UserPhoto user={user} />
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button variant="contained" color="error" onClick={onClose}>Close</Button>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};
