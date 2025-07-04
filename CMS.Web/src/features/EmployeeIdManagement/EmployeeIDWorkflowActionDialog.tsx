import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import {
  DialogHeader,
  Errors,
  FormSelectField,
  FormTextField,
  SelectOption,
} from "../../components";

import CircularProgress from "@mui/material/CircularProgress";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import {
  EmployeeDto,
  useGetAllBusinessUnitsQuery,
  useGetAllJobListQuery,
} from "../../app/api/HCMSApi";
import { enums } from "../../app/api";
import { getEnumOptions } from "../../components/form-controls/get-enum-list";
import { ProbationResult } from "../../app/api/enums";
import { Form, Formik } from "formik";
interface WorkflowActionDialogProps {
  title: string;
  action: "approve" | "reject" | undefined; // <-- new prop
  onClose: () => void;
  onSubmit: (remark: string) => void; // <-- send only remark here
  errors: any;
  submitting?: boolean;
  employeeId?: number;
}

export const EmployeeIDWorkflowActionDialog = ({
  title,
  action,
  onClose,
  onSubmit,
  errors,
  submitting,
}: WorkflowActionDialogProps) => {
  const [remark, setremark] = useState<string>("");
  const [hasError, setHasError] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState<
    "success" | "error" | "info" | null
  >(null);
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    hasError && remark?.trim() && setHasError(false);
  }, [remark, hasError]);

  const handleSubmit = useCallback(() => {
    const trimmedRemark = remark.trim();
    if (!trimmedRemark) {
      setHasError(true);
      return;
    }

    try {
      onSubmit(remark.trim());
      onClose();
    } catch (error) {
      setAlertSeverity("error");
      setMessage("An error occurred. Please try again.");
    }
  }, [remark, action, onSubmit, onClose]);

  const onCommentChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setremark(event.target.value || "");
    },
    []
  );

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
    >
      <DialogHeader title={title} onClose={onClose} />
      <DialogContent dividers={true} sx={{ width: 600 }}>
        {errors && (
          <Box>
            <Errors errors={errors as any} />
          </Box>
        )}

        {alertSeverity && message && (
          <Box sx={{ width: "100%", mb: 2 }}>
            <Alert severity={alertSeverity} onClose={() => setMessage(null)}>
              <AlertTitle>
                {alertSeverity === "success" ? "Success" : "Error"}
              </AlertTitle>
              {message}
            </Alert>
          </Box>
        )}

        <Typography sx={{ py: 1 }}>{"Please provide your remark"}</Typography>
        {hasError && (
          <Typography variant="subtitle2" color="error">
            {remark || "Comment is required"}
          </Typography>
        )}

        <TextField
          fullWidth
          multiline
          minRows={5}
          variant="outlined"
          required
          error={hasError}
          value={remark}
          onChange={onCommentChange}
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
          onClick={() => handleSubmit()}
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={16} /> : undefined}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
