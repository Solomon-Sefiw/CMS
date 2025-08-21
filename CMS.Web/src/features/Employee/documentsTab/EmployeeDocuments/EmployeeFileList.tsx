import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { useGetEmployeeFileDocumentByEmployeeIdQuery } from "../../../../app/store";
import { EditEmployeeFileDocumentsDialog } from "../EditEmployeeDocumentDialog";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { DocumentType } from "../../../../app/api/enums";
interface Document {
  id: string;
  fileName: string;
  documentType: number;
  remark: string;
  createdAt: string;
}

function getDocumentTypeName(value: number): string {
  return DocumentType[value] || "Unknown";
}

function groupByDocumentType(
  documents: Document[]
): Record<string, Document[]> {
  return documents.reduce((acc, doc) => {
    const key = getDocumentTypeName(doc.documentType);
    if (!acc[key]) acc[key] = [];
    acc[key].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);
}

function replaceTypeNumberWithName(
  fileName: string,
  docTypeNum: number
): string {
  const typeName = DocumentType[docTypeNum] ?? "Unknown";
  return fileName.replace(
    new RegExp(`-${docTypeNum}(\\.|-)`),
    `-${typeName}$1`
  );
}

export const EmployeeFileList = () => {
  const { id } = useParams<{ id: string }>();
  const employeeId = Number(id);
  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useGetEmployeeFileDocumentByEmployeeIdQuery({
    employeeId,
  }) as unknown as {
    data: Document[];
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
  };

  const [expandedType, setExpandedType] = useState<string | false>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFileName, setPreviewFileName] = useState<string>("");
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedType(isExpanded ? panel : false);
      setPreviewUrl(null); // close preview on accordion change
    };

  const handleView = async (
    id: string,
    fileName: string,
    documentType: number
  ) => {
    try {
      const response = await fetch(
        `/api/EmployeeFileDocuments/DownloadEmployeeFileDocument/${id}`
      );
      if (!response) throw new Error("Download failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      const previewName = replaceTypeNumberWithName(fileName, documentType);
      setPreviewFileName(previewName);
    } catch {
      alert("Failed to view file.");
    }
  };

  if (isLoading) return <CircularProgress />;
  if (isError)
    return <Typography color="error">Failed to load documents.</Typography>;
  if (data.length === 0) return <Typography>No documents uploaded.</Typography>;

  const groupedDocuments = groupByDocumentType(data);

  return (
    <Box>
      {Object.entries(groupedDocuments).map(([typeName, docs]) => (
        <Accordion
          key={typeName}
          expanded={expandedType === typeName}
          onChange={handleAccordionChange(typeName)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{typeName}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>File Name</TableCell>
                  <TableCell>Remark</TableCell>
                  <TableCell>Uploaded At</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {docs.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      {replaceTypeNumberWithName(
                        doc.fileName,
                        doc.documentType
                      )}
                    </TableCell>
                    <TableCell>{doc.remark}</TableCell>
                    <TableCell>
                      {dayjs(doc.createdAt).format("DD MMM YYYY HH:mm")}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <Button
                          startIcon={<EditIcon />}
                          size="small"
                          variant="outlined"
                          onClick={() => setEditingDoc(doc)}
                          sx={{ mr: 1 }}
                        >
                          Edit
                        </Button>
                      </Tooltip>
                      <Tooltip title="View">
                        <Button
                          startIcon={<VisibilityIcon />}
                          size="small"
                          variant="outlined"
                          onClick={() =>
                            handleView(doc.id, doc.fileName, doc.documentType)
                          }
                        >
                          View
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
      ))}

      {previewUrl && (
        <Paper elevation={2} sx={{ mt: 6, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Previewing: {previewFileName}
          </Typography>
          <Box
            sx={{
              height: 600,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {previewFileName.toLowerCase().endsWith(".pdf") ? (
              <iframe
                src={previewUrl}
                title="File Preview"
                width="80%"
                height="80%"
                style={{ border: "10px solid #ccc" }}
              />
            ) : (
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "contain",
                  border: "1px solid #ccc",
                  width: "80%",
                  height: "80%",
                  padding: "1%",
                }}
              />
            )}
          </Box>
        </Paper>
      )}

      {editingDoc && (
        <EditEmployeeFileDocumentsDialog
          open={true}
          onClose={() => setEditingDoc(null)}
          document={editingDoc}
          onUpdated={() => {
            refetch();
            setEditingDoc(null);
          }}
        />
      )}
    </Box>
  );
};
