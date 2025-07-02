import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Paper,
  Typography,
} from "@mui/material";
import { useCallback, useRef, useState, useEffect } from "react";
import { useAddUserSignatureMutation, useAddUserPhotoMutation, UserDto } from "../../app/store";
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

  useEffect(() => {
    if (user && !user.signatureId && !showSignatureDialog) {
      setShowSignatureDialog(true);
    }
  }, [user, showSignatureDialog]);

  const handleOpenSignatureDialog = useCallback(() => {
    setShowSignatureDialog(true);
  }, []);

  const handleCloseSignatureDialog = useCallback(() => {
    setShowSignatureDialog(false);
    signatureCanvasRef.current?.clear();
  }, []);

  const handleSaveSignature = useCallback(async () => {
    const file = await signatureCanvasRef?.current?.getSignature();
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
      console.error("Failed to save signature:", error);
      showErrorAlert((error as any)?.data?.detail || "Failed to save signature. Please try again.");
    }
  }, [handleCloseSignatureDialog, saveSignature, savePhotoFromSignature, user?.id, user?.photoUrl, onSignatureSaved, showSuccessAlert, showErrorAlert]);

  const handleClearSignature = useCallback(() => {
    signatureCanvasRef?.current?.clear();
  }, []);

  const buttonText = !user?.signatureId ? "Add Signature" : "Change Signature";
  const totalLoading = isSavingSignature || isSavingPhotoFromSignature;

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
        <Paper variant="outlined" sx={{ p: 0.5, borderRadius: 2, maxWidth: '100%', overflow: 'hidden' }}>
          <Typography variant="subtitle2" sx={{mb: 1}}>Current Signature:</Typography>
          <Box
            component="img"
            src={getDocumentUrl(user.signatureId)}
            alt="user signature"
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
          >
            {buttonText}
          </Button>
      )}

      <Dialog
        scroll={"paper"}
        disableEscapeKeyDown={false}
        maxWidth={"xs"}
        fullWidth
        open={showSignatureDialog}
        onClose={handleCloseSignatureDialog}
      >
        <DialogHeader title={buttonText} onClose={handleCloseSignatureDialog} />
        <DialogContent dividers={true} sx={{ p: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{mb: 1, display: 'block'}}>
            Please sign below:
          </Typography>
          <Paper variant="outlined" sx={{ p: 0.5, borderRadius: 2 }}>
            <Signature ref={signatureCanvasRef} />
          </Paper>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseSignatureDialog}>Cancel</Button>
          <Button color="primary" variant="outlined" onClick={handleClearSignature} disabled={totalLoading}>
            Clear
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={handleSaveSignature}
            disabled={totalLoading}
          >
            {totalLoading ? "Saving..." : "Save Signature"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};