import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";

export const DocumentsTab = () => {
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  return (
    <>
      <Box sx={{ pt: 2 }}>
        <Box sx={{ display: "flex" }}>
          <Typography
            variant="h5"
            sx={{ lineHeight: 2, flex: 1 }}
            color="textSecondary"
          >
            Documents
          </Typography>
          <Box>
            <Button
              startIcon={<FileUploadIcon />}
              variant="outlined"
              onClick={() => setShowUploadDialog(true)}
            >
              Upload Document
            </Button>
          </Box>
        </Box>
        <Box></Box>
      </Box>
    </>
  );
};
