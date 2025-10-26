import React, { useCallback, useMemo, useState } from "react";
import { Button, Chip, Box } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import ClearIcon from "@mui/icons-material/Clear";
import { useDropzone } from "react-dropzone";

export type FileTypes = "Image" | "PDF";

interface Props {
  label?: string;
  multiple?: boolean;
  showIcon?: boolean;
  size?: "small" | "medium" | "large";
  onAdd: (files: File[] | null) => void;
  accepts?: FileTypes[];
  disabled?: boolean;
  startIcon?: JSX.Element;
}

export const DocumentUploadCustom = ({
  label,
  showIcon = true,
  multiple = false,
  size,
  onAdd,
  accepts = ["Image", "PDF"],
  disabled,
  startIcon,
}: Props) => {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setSelectedFileName(acceptedFiles[0].name);
        onAdd(acceptedFiles);
      } else {
        setSelectedFileName(null);
        onAdd(null);
      }
    },
    [onAdd]
  );

  const fileTypes = useMemo(() => {
    if (!accepts?.length) return;

    const fileTypes: { [key: string]: string[] } = {};
    if (accepts.some((x) => x === "Image")) {
      fileTypes["image/*"] = [".png", ".jpeg", ".jpg"];
    }
    if (accepts.some((x) => x === "PDF")) {
      fileTypes["application/pdf"] = [".pdf"];
    }
    return fileTypes;
  }, [accepts]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple,
    accept: fileTypes,
  });

  const handleClear = () => {
    setSelectedFileName(null);
    onAdd(null);
  };

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      <Button
        variant="text"
        startIcon={showIcon ? startIcon || <UploadIcon /> : null}
        {...getRootProps()}
        size={size}
        disabled={disabled}
      >
        <input {...getInputProps()} />
        {label || "Upload"}
      </Button>
      {selectedFileName && (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Chip label={selectedFileName} size="small" />
          <Button
            variant="text"
            size="small"
            onClick={handleClear}
            disabled={disabled}
            sx={{ minWidth: "auto", padding: 0 }}
          >
            <ClearIcon fontSize="small" />
          </Button>
        </Box>
      )}
    </Box>
  );
};