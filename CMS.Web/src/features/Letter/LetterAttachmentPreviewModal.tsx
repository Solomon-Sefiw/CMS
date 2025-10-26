// src/components/LetterAttachmentPreviewModal.tsx
import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { useAlert } from "../notification";
import VisibilityIcon from "@mui/icons-material/Visibility";
interface LetterAttachmentPreviewModalProps {
  documentId: string | null;
  fileName: string;
  onView: () => void; // Callback to trigger fetch from parent
}

export const LetterAttachmentPreviewModal = ({
  documentId,
  fileName,
  onView,
}: LetterAttachmentPreviewModalProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string>("");
  const { showErrorAlert } = useAlert();

  // Fetch document (called by parent via onView)
  const handleViewFile = useCallback(async () => {
    if (!documentId) return;
    try {
      const response = await fetch(
        `/api/Letter/DownloadLetterDocument/${documentId}`,
        { headers: { Accept: "application/pdf, image/*" } }
      );
      if (!response.ok) throw new Error("Failed to fetch document");
      const blob = await response.blob();

      const fileType = blob.type || "application/octet-stream";
      const url = URL.createObjectURL(blob);

      if (fileType.includes("pdf") || fileType.startsWith("image/")) {
        setPreviewUrl(url);
        setPreviewName(fileName);
      } else {
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      showErrorAlert("Failed to load document preview.");
    }
  }, [documentId, fileName, showErrorAlert]);

  // Close preview dialog and clean up
  const handleClosePreview = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setPreviewName("");
    }
  }, [previewUrl]);

  // Trigger fetch when parent calls onView
  const handleView = useCallback(() => {
    handleViewFile();
    onView(); // Notify parent if needed (optional)
  }, [onView, handleViewFile]);

  return (
    <>
      {/* Render the View button */}
      <Button
        variant="outlined"
        startIcon={<VisibilityIcon />}
        onClick={handleView}
        size="small"
        disabled={!documentId}
      >
        View
      </Button>

      {/* Preview Dialog (same as LetterDialog) */}
      <Dialog
        open={!!previewUrl}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Preview: {previewName}</DialogTitle>
        <DialogContent>
          {previewUrl ? (
            previewName.toLowerCase().endsWith(".pdf") ? (
              <iframe
                src={previewUrl}
                width="100%"
                height={600}
                title="PDF Preview"
                style={{ border: "none" }}
              />
            ) : (
              <img
                src={previewUrl}
                alt="Preview"
                style={{ width: "100%", maxHeight: 600, objectFit: "contain" }}
              />
            )
          ) : (
            <Typography color="error" align="center">
              Unable to load document preview.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};