import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useEmployeeIdCardSubmitMutation } from "../../app/api/HCMSApi";
import { enums } from "../../app/api";
import { DialogHeader, Errors } from "../../components";

interface EmployeeIdSubmitProps {
  employeeId: number | null | undefined;
  onDialogClose: () => void;
}

export const SubmitEmployeeId = ({
  employeeId,
  onDialogClose,
}: EmployeeIdSubmitProps) => {
  const [remark, setRemark] = useState<string>("");
  const [hasError, setHasError] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState<
    "success" | "error" | "info" | null
  >(null);
  const [message, setMessage] = useState<string | null>(null);

  const [submitEmployeeID, { error: submitError, isLoading }] =
    useEmployeeIdCardSubmitMutation();

  useEffect(() => {
    if (hasError && remark.trim()) {
      setHasError(false);
    }
  }, [remark, hasError]);

  const handleSubmit = useCallback(async () => {
    if (!employeeId) return;

    const trimmedRemark = remark.trim();
    if (!trimmedRemark) {
      setHasError(true);
      return;
    }

    const payload = {
      employeeId,
      status: enums.EmployeeIDCardStatus.IDCardApprovalRequest,
      employeeIdCardStatusRemark: trimmedRemark,
    };

    try {
      await submitEmployeeID({
        employeeIdCardSubmitCommand: payload,
      }).unwrap();
      onDialogClose();
    } catch (err) {
      console.error("Employee ID approval error:", err);
      setAlertSeverity("error");
      setMessage("Submission failed. Please try again.");
    }
  }, [employeeId, remark, submitEmployeeID, onDialogClose]);

  const onCommentChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setRemark(event.target.value || "");
    },
    []
  );

  return (
    <Dialog scroll="paper" disableEscapeKeyDown maxWidth="md" open={true}>
      <DialogHeader title="Submit Employee ID" onClose={onDialogClose} />
      <DialogContent dividers sx={{ width: 600 }}>
        {submitError && (
          <Box>
            <Errors errors={(submitError as any)?.data?.errors} />
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

        <Typography sx={{ py: 1 }}>Please provide your remark</Typography>
        {hasError && (
          <Typography variant="subtitle2" color="error">
            Comment is required
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
        <Button onClick={onDialogClose} variant="outlined">
          Cancel
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={handleSubmit}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={16} /> : undefined}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
