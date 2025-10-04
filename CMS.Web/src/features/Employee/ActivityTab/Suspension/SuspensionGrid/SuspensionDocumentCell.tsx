import React, { useState } from "react";
import { Box, Button, Dialog, DialogContent, DialogTitle, DialogActions } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  useGetEmployeeFileDocumentByEmployeeIdQuery,
  useUploadEmployeeFileDocumentMutation,
  useUpdateEmployeeFileDocumentMutation,
} from "../../../../../app/store";
import { DocumentType } from "../../../../../app/api/enums";
import { useAlert } from "../../../../notification";
import { DocumentUpload } from "../../../../../components";

interface SuspensionDocumentCellProps {
  employeeId: number;
  suspensionId: number;
  remark: string;
}

interface Document {
  id: string;
  fileName: string;
  documentType: number;
  remark: string;
  createdAt: string;
}

export const SuspensionDocumentCell = ({ employeeId, suspensionId, remark }: SuspensionDocumentCellProps) => {
  const { data: documents = [], refetch } = useGetEmployeeFileDocumentByEmployeeIdQuery({ employeeId, suspensionId }) as unknown as {
    data: Document[];
    refetch: () => void;
  };

  const suspensionDoc = documents.find(d => d.documentType === DocumentType.Suspension);

  const [upload] = useUploadEmployeeFileDocumentMutation();
  const [update] = useUpdateEmployeeFileDocumentMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string>("");
  const { showErrorAlert, showSuccessAlert } = useAlert();

  const handleFileChange = async (selectedFile: File) => {
    if (!selectedFile) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("employeeId", employeeId.toString());
      formData.append("suspensionId", suspensionId.toString());
      formData.append("documentType", DocumentType.Suspension.toString());
      formData.append("remark", remark);
      formData.append("file", selectedFile);

      if (suspensionDoc) {
        formData.append("id", suspensionDoc.id);
        await update(formData as any).unwrap();
        showSuccessAlert("Document updated successfully.");
      } else {
        await upload(formData as any).unwrap();
        showSuccessAlert("Document uploaded successfully.");
      }

      await refetch();
    } catch (err: any) {
      showErrorAlert(err?.data?.message || "Upload failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleView = async (doc: Document) => {
    try {
      const response = await fetch(`/api/EmployeeFileDocuments/DownloadEmployeeFileDocument/${doc.id}?suspensionId=${suspensionId}`);
      if (!response.ok) throw new Error("Failed to fetch document");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setPreviewName(doc.fileName);
    } catch {
      showErrorAlert("Failed to load document.");
    }
  };

  const handleClosePreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  return (
    <Box display="flex" alignItems="center" gap={1}>
      {suspensionDoc && (
        <Button
          size="small"
          variant="outlined"
          startIcon={<VisibilityIcon />}
          onClick={() => handleView(suspensionDoc)}
          disabled={isSubmitting}
        >
          View
        </Button>
      )}

      <DocumentUpload
        label={suspensionDoc ? "Change" : "Upload"}
        multiple={false}
        onAdd={(files) => handleFileChange(files[0])}
        disabled={isSubmitting}
        accepts={["PDF", "Image"]}
        showIcon
      />

      <Dialog open={!!previewUrl} onClose={handleClosePreview} maxWidth="md" fullWidth>
        <DialogTitle>Document Preview: {previewName}</DialogTitle>
        <DialogContent>
          {previewName.toLowerCase().endsWith(".pdf") ? (
            <iframe src={previewUrl!} width="100%" height={600} title="PDF Preview" />
          ) : (
            <img src={previewUrl!} alt="Preview" style={{ width: "100%", maxHeight: 600, objectFit: "contain" }} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
