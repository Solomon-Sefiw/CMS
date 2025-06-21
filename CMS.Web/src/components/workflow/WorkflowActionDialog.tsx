import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
  Alert,
  AlertTitle,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Errors } from "../Errors";
import { DialogHeader } from "../dialog";

interface WorkflowActionDialogProps {
  title: string;
  textAreaTitle?: string;
  emptyTextAreaErrorMsg?: string;
  onClose: () => void;
  onSubmit: (comment: string) => void;
  errors: any;
  submitting?: boolean;
  actionType?: "approve" | "reject" | "submit" | "activate" | "deactivate"; // Added new action types
}

export const WorkflowActionDialog = ({
  onSubmit,
  onClose,
  title,
  textAreaTitle,
  emptyTextAreaErrorMsg,
  errors,
  submitting,
  actionType, // Added actionType to define the action
}: WorkflowActionDialogProps) => {
  const [comment, setComment] = useState<string>("");
  const [hasError, setHasError] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState<
    "success" | "error" | "info" | null
  >(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    hasError && comment?.trim() && setHasError(false);
  }, [comment, hasError]);

  const handleSubmit = useCallback(() => {
    const _comment = comment?.trim();
    if (!_comment) {
      setHasError(true);
      return;
    }
    try {
      // Call onSubmit to notify the parent component of the comment
      onSubmit(_comment);

      // After submission, set success alert based on action type
      if (actionType === "approve") {
        setAlertSeverity("success");
        setMessage("Approved successfully!");
      } else if (actionType === "reject") {
        setAlertSeverity("success");
        setMessage("Rejected successfully!");
      } else if (actionType === "activate") {
        setAlertSeverity("success");
        setMessage("Activated successfully!");
      } else if (actionType === "deactivate") {
        setAlertSeverity("success");
        setMessage("Deactivated successfully!");
      } else {
        setAlertSeverity("info");
        setMessage("Submitted successfully!");
      }

      setTimeout(() => {
        onClose(); // Close dialog after success
      }, 2000);
    } catch (error) {
      // If an error occurs during the submit process
      setAlertSeverity("error");
      setMessage("An error occurred. Please try again.");
    }
  }, [comment, onSubmit, actionType, onClose]);

  const onCommentChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setComment(event.target.value || "");
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

        <Typography sx={{ py: 1 }}>
          {textAreaTitle || "Please provide your comment"}
        </Typography>
        {hasError && (
          <Typography variant="subtitle2" color="error">
            {emptyTextAreaErrorMsg || "Comment is required"}
          </Typography>
        )}

        <TextField
          fullWidth
          multiline
          minRows={5}
          variant="outlined"
          required
          error={hasError}
          value={comment}
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
          {actionType === "approve" && "Approve"}
          {actionType === "reject" && "Reject"}
          {actionType === "activate" && "Activate"}
          {actionType === "deactivate" && "Deactivate"}
          {actionType !== "approve" &&
            actionType !== "reject" &&
            actionType !== "activate" &&
            actionType !== "deactivate" &&
            "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
