import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
} from "@mui/material";
import { DialogHeader, FormSelectField, FormTextField } from "../../components";
import { useCallback } from "react";
import {
  EmployeeDto,
  useEmployeeIdCardReplaceMutation,
} from "../../app/api/HCMSApi";
import { getEnumOptions } from "../../components/form-controls/get-enum-list";
import { EmployeeIDCardReplaceReason } from "../../app/api/enums";
import { Form, Formik } from "formik";
import { usePermission } from "../../hooks";

interface WorkflowActionDialogProps {
  employee: EmployeeDto;
  onClose: () => void;
}

interface ReplaceIDFormValues {
  reason: EmployeeIDCardReplaceReason;
  remark: string;
}
export const EmployeeIDReplaceDialog = ({
  employee,
  onClose,
}: WorkflowActionDialogProps) => {
  const [IDReplace] = useEmployeeIdCardReplaceMutation();
  const initialValues: ReplaceIDFormValues = {
    reason: EmployeeIDCardReplaceReason.lost,
    remark: "",
  };
const permissions = usePermission();

  const handleSubmit = useCallback(
    async (values: ReplaceIDFormValues) => {
      try {
        const command = {
          employeeIdCardReplaceCommand: {
            employeeId: employee.id,
            reason: values.reason,
            employeeIdCardStatusRemark: values.remark,
          },
        };

        await IDReplace(command);
        onClose();
      } catch (error) {}
    },
    [employee.id, IDReplace, onClose]
  );

  return (
    <Dialog scroll="paper" disableEscapeKeyDown maxWidth="md" open={true}>
      <DialogHeader title="Replace Employee ID" onClose={onClose} />
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <DialogContent dividers sx={{ width: 600 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Employee ID"
                    value={employee.id}
                    disabled
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormSelectField
                    name="reason"
                    label="ID Replace Reason"
                    options={getEnumOptions(EmployeeIDCardReplaceReason)}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormTextField
                    name="remark"
                    label="Remark"
                    type="text"
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={onClose} variant="outlined">
                Cancel
              </Button>
              <Button
                color="primary"
                variant="contained"
                type="submit"
                        disabled={ isSubmitting || !permissions.CanReplaceEmployeeId}
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
