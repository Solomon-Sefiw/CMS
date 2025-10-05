import { Box, Button, Typography, Tabs, Tab } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useState } from "react";
import { EmployeeFileDocumentsDialog } from "./EmployeeFileDocumentsDialog";
import { EmployeeFileList } from "./EmployeeDocuments/EmployeeFileList";
import { EmployeeFileAuditLogList } from "./EmployeeDocuments/EmployeeFileAuditLogList";

export const DocumentsTab = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const handleTabChange = (_: any, newValue: number) => {
    setTabIndex(newValue);
  };
  return (
    <>
      <Box sx={{ pt: 2 }}>
        <Box sx={{ display: "flex", mb: 2 }}>
          <Typography variant="h5" sx={{ flex: 1 }} color="textSecondary">
            Documents
          </Typography>
        </Box>

        {/* Tabs for Upload / Manage */}
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="Upload Document" />
          <Tab label="View / Manage Documents" />
          <Tab label="Logs" />
        </Tabs>

        {/* Upload Document Tab */}
        {tabIndex === 0 && (
          <Box sx={{ mt: 2 }}>
            <Button
              startIcon={<FileUploadIcon />}
              variant="outlined"
              onClick={() => setShowUploadDialog(true)}
            >
              Upload Document
            </Button>
          </Box>
        )}

        {/* View / Manage Documents Tab */}
        {tabIndex === 1 && (
          <Box sx={{ mt: 2 }}>
            <EmployeeFileList />
          </Box>
        )}
        {tabIndex === 2 && (
          <Box sx={{ mt: 2 }}>
            <EmployeeFileAuditLogList />
          </Box>
        )}
      </Box>

      {/* Upload Dialog */}
      {showUploadDialog && (
        <EmployeeFileDocumentsDialog
          onClose={() => setShowUploadDialog(false)}
        />
      )}
    </>
  );
};
