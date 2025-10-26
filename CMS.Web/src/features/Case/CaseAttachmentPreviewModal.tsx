// src/features/case/CaseAttachmentPreviewModal.tsx
import React, { useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

interface CaseAttachmentPreviewModalProps {
  open: boolean;
  fileUrl: string | null;
  fileName: string;
  onClose: () => void;
}

/**
 * ✅ Reusable attachment preview modal for PDF and image previews.
 * Automatically revokes object URLs on close to prevent memory leaks.
 */
export const CaseAttachmentPreviewModal: React.FC<CaseAttachmentPreviewModalProps> = ({
  open,
  fileUrl,
  fileName,
  onClose,
}) => {
  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

  if (!fileUrl) return null;

  const isPdf = fileName.toLowerCase().endsWith(".pdf");

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Preview: {fileName}</DialogTitle>
      <DialogContent>
        {isPdf ? (
          <iframe
            src={fileUrl}
            width="100%"
            height={600}
            title="PDF Preview"
            style={{ border: "none" }}
          />
        ) : (
          <img
            src={fileUrl}
            alt={fileName}
            style={{
              width: "100%",
              maxHeight: 600,
              objectFit: "contain",
            }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CaseAttachmentPreviewModal;
