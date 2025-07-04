// DeleteConfirmationDialog.tsx
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { Warning } from "@mui/icons-material"; // Import the Warning icon
import { useDeleteLanguageSkillMutation } from "../../../../app/api";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  languageSkillId?: number;
  onSuccess?: () => void; // Optional callback for successful deletion
}

export const DeleteConfirmationDialog: React.FC<
  DeleteConfirmationDialogProps
> = ({ open, onClose, languageSkillId, onSuccess }) => {
  const [
    trigger,
    { isLoading: isDeleting, isError: deleteError, error: deleteErrorMessage },
  ] = useDeleteLanguageSkillMutation();

  const handleDeleteConfirm = async () => {
    if (languageSkillId !== undefined) {
      await trigger({ deleteLanguageSkillCommand: { id: languageSkillId } }); // Ensure the payload matches your mutation definition
      if (!deleteError) {
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        console.error("Error deleting language skill:", deleteErrorMessage);
        // Optionally display an error message to the user
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{ display: "flex", alignItems: "center", color: "warning.main" }}
      >
        <ListItemIcon sx={{ minWidth: "auto", mr: 1 }}>
          <Warning color="warning" />
        </ListItemIcon>
        <ListItemText primary="Delete Warning" />
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this language skill? This action
          cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleDeleteConfirm}
          color="error"
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
