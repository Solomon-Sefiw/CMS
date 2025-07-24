import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useCallback, useRef, useState, useEffect } from "react";
import {
  useAddUserSignatureMutation,
  useAddUserPhotoMutation,
  UserDto,
} from "../../app/store";
import { DialogHeader } from "../../components";
import { Signature, SignatureHandle } from "../../components/signature";
import { useAlert } from "../../features/notification/useAlert";
import { getDocumentUrl } from "../../features/common";

interface UserSignaturePadProps {
  user: UserDto;
  onSignatureSaved?: () => void;
}

export const UserSignaturePad = ({ user, onSignatureSaved }: UserSignaturePadProps) => {
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);

  const [saveSignature, { isLoading: isSavingSignature }] = useAddUserSignatureMutation();
  const [savePhotoFromSignature, { isLoading: isSavingPhotoFromSignature }] = useAddUserPhotoMutation();

  const signatureCanvasRef = useRef<SignatureHandle>(null);
  const { showSuccessAlert, showErrorAlert } = useAlert();

  const totalLoading = isSavingSignature || isSavingPhotoFromSignature;

  useEffect(() => {
    if (user && !user.signatureId && !showSignatureDialog) {
      setShowSignatureDialog(true);
    }
  }, [user, showSignatureDialog]);

  const handleOpenSignatureDialog = useCallback(() => {
    setShowSignatureDialog(true);
  }, []);

  const handleCloseSignatureDialog = useCallback(() => {
    if (!totalLoading) {
      setShowSignatureDialog(false);
      signatureCanvasRef.current?.clear();
    }
  }, [totalLoading]);

  const handleDialogClose = useCallback(
    (_: any, reason: "backdropClick" | "escapeKeyDown") => {
      if (!totalLoading && (reason === "backdropClick" || reason === "escapeKeyDown")) {
        handleCloseSignatureDialog();
      }
    },
    [handleCloseSignatureDialog, totalLoading]
  );

  const handleClearSignature = useCallback(() => {
    signatureCanvasRef.current?.clear();
  }, []);

  const handleSaveSignature = useCallback(async () => {
    const file = await signatureCanvasRef.current?.getSignature();
    if (!file || !user?.id) {
      showErrorAlert("No signature drawn or user ID missing.");
      return;
    }

    try {
      await saveSignature({
        id: user.id,
        body: { file },
      }).unwrap();

      showSuccessAlert("Signature saved successfully!");

      if (!user.photoUrl) {
        try {
          await savePhotoFromSignature({
            id: user.id,
            body: { file },
          }).unwrap();
          showSuccessAlert("Signature also set as profile photo!");
        } catch (photoError) {
          console.error("Failed to set signature as photo:", photoError);
          showErrorAlert("Failed to set signature as profile photo.");
        }
      }

      handleCloseSignatureDialog();
      onSignatureSaved?.();
    } catch (error) {
      console.error("Signature save error:", error);
      showErrorAlert((error as any)?.data?.detail || "Failed to save signature.");
    }
  }, [
    user?.id,
    user?.photoUrl,
    saveSignature,
    savePhotoFromSignature,
    showSuccessAlert,
    showErrorAlert,
    handleCloseSignatureDialog,
    onSignatureSaved,
  ]);

  const buttonText = !user?.signatureId ? "Add Signature" : "Change Signature";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        mt: 2,
      }}
    >
      {user?.signatureId && (
        <Paper variant="outlined" sx={{ p: 0.5, borderRadius: 2, maxWidth: "100%" }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Current Signature:
          </Typography>
          <Box
            component="img"
            src={getDocumentUrl(user.signatureId)}
            alt="User signature"
            onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
            sx={{
              width: "auto",
              maxWidth: "100%",
              height: "100px",
              objectFit: "contain",
              display: "block",
              margin: "0 auto",
            }}
          />
        </Paper>
      )}

      {!showSignatureDialog && (
        <Button
          variant="outlined"
          onClick={handleOpenSignatureDialog}
          disabled={totalLoading}
          aria-label="Open signature pad"
        >
          {buttonText}
        </Button>
      )}

      <Dialog
        open={showSignatureDialog}
        onClose={handleDialogClose}
        maxWidth="xs"
        fullWidth
        scroll="paper"
      >
        <DialogHeader title={buttonText} onClose={handleCloseSignatureDialog} />

        <DialogContent dividers sx={{ p: 2 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mb: 1, display: "block" }}
          >
            Please sign below:
          </Typography>
          <Paper variant="outlined" sx={{ p: 0.5, borderRadius: 2 }}>
            <Signature ref={signatureCanvasRef} />
          </Paper>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseSignatureDialog} disabled={totalLoading}>
            Cancel
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleClearSignature}
            disabled={totalLoading}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveSignature}
            disabled={totalLoading}
          >
            {totalLoading ? <CircularProgress size={20} color="inherit" /> : "Save Signature"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
