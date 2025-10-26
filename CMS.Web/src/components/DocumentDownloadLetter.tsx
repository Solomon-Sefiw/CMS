import DownloadIcon from "@mui/icons-material/Download";
import { Button } from "@mui/material";
import { useCallback } from "react";
import { useLazyDownloadDocumentQuery, useLazyGetLetterDocumentQuery } from "../app/api";

interface Props {
  size?: "small" | "medium" | "large";
  documentId: number;
  label?: string;
  disabled?: boolean;
  showIcon?: boolean;
}
export const DocumentDownloadLetter = ({
  documentId,
  size = "small",
  label,
  disabled,
  showIcon = true,
}: Props) => {
  const [downloadReceipt] = useLazyGetLetterDocumentQuery();

  const downloadDocument = useCallback(async () => {
    documentId && downloadReceipt({ letterId: documentId });
  }, [documentId, downloadReceipt]);

  return (
    <Button
      variant="text"
      startIcon={showIcon ? <DownloadIcon /> : null}
      size={size}
      disabled={disabled}
      onClick={downloadDocument}
    >
      {label}
    </Button>
  );
};
