import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Box,
  Typography,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";
import { Close, Download, OpenInNew } from "@mui/icons-material";
import { useGetCaseFileDocumentByCaseIdQuery } from "../../app/api/HCMSApi";

interface Props {
  open: boolean;
  onClose: () => void;
  caseId: number;
}

export const CaseAttachmentPreviewModal: React.FC<Props> = ({
  open,
  onClose,
  caseId,
}) => {
  const { data: attachments, isLoading } = useGetCaseFileDocumentByCaseIdQuery(
    { caseId },
    { skip: !caseId || !open }
  ) as any;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  useEffect(() => {
    if (attachments && attachments.length > 0) {
      setSelectedIndex(0);
      setSelectedFile(attachments[0]);
    }
  }, [attachments]);

  const handleTabChange = (_: any, newValue: number) => {
    setSelectedIndex(newValue);
    setSelectedFile(attachments[newValue]);
  };

  const fileUrl = selectedFile
    ? `/api/CaseFileDocuments/DownloadCaseFileDocument/${selectedFile.id}?caseId=${caseId}`
    : null;

  const extension = selectedFile?.fileName?.split(".").pop()?.toLowerCase();
  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "");
  const isPDF = extension === "pdf";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" fontWeight={600}>
          Case Attachments
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ minHeight: 400 }}>
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {!isLoading && attachments?.length > 0 && (
          <>
            <Tabs
              value={selectedIndex}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              {attachments.map((file: any, i: number) => (
                <Tab key={i} label={file.fileName} />
              ))}
            </Tabs>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 2,
                borderRadius: 2,
              }}
            >
              {isImage ? (
                <Box
                  component="img"
                  src={fileUrl as string}
                  alt={selectedFile.fileName}
                  sx={{ maxHeight: 500, maxWidth: "100%", borderRadius: 2 }}
                />
              ) : isPDF ? (
                <iframe
                  src={fileUrl as string}
                  width="100%"
                  height="500px"
                  style={{ border: "none", borderRadius: "8px" }}
                />
              ) : (
                <Typography>No preview available.</Typography>
              )}
            </Box>
          </>
        )}

        {!isLoading && attachments?.length === 0 && (
          <Typography textAlign="center" mt={8}>
            No attachments found.
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
        <Button
          startIcon={<OpenInNew />}
          onClick={() => window.open(fileUrl || "", "_blank")}
          disabled={!fileUrl}
        >
          Open in New Tab
        </Button>
        <Button
          startIcon={<Download />}
          color="primary"
          variant="contained"
          onClick={() => window.open(fileUrl || "", "_blank")}
          disabled={!fileUrl}
        >
          Download
        </Button>
      </DialogActions>
    </Dialog>
  );
};
