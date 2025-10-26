// src/features/Letter/LetterDialog.tsx
import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  CircularProgress,
  Chip,
  TextField,
  Autocomplete,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Formik, Form } from "formik";
import {
  DialogHeader,
  FormSelectField,
  FormTextField,
} from "../../components";
import { LetterType, LetterStatus } from "../../app/api/enums";
import { useAlert } from "../notification";
import * as Yup from "yup";
import {
  LetterDto,
  useCreateLetterMutation,
  useUpdateLetterMutation,
  useUsersQuery,
  useUploadLetterDocumentMutation,
  useGetLetterDocumentQuery,
  useUpdateLetterDocumentMutation,
} from "../../app/api";
import { useAuth } from "../../hooks";
import { useBusinessUnit } from "../BusinessUnit";
import htmlDocx from "html-docx-js/dist/html-docx";
import { saveAs } from "file-saver";
import { FormRichLetterTextField } from "../../components/form-controls/form-letter";
import UploadIcon from "@mui/icons-material/Upload";
import { DocumentUploadCustom } from "../../components/DocumentUploadCustom";
import { LetterAttachmentPreviewModal } from "./LetterAttachmentPreviewModal";

interface SelectOption {
  label: string;
  value: string | number;
}

const useLetterTypesLookups = (): { letterTypeLookups: SelectOption[]; isLoading: boolean } => ({
  letterTypeLookups: [
    { value: LetterType.Incoming, label: "Incoming" },
    { value: LetterType.Outgoing, label: "Outgoing" },
    { value: LetterType.InternalMemo, label: "Internal Memo" },
  ],
  isLoading: false,
});

interface LetterDialogProps {
  initialLetter?: LetterDto;
  title: string;
  onClose: () => void;
}

const emptyLetterData: LetterDto = {
  id: undefined,
  referenceNumber: "",
  subject: "",
  content: "",
  letterType: undefined,
  status: LetterStatus.pending,
  senderId: undefined,
  recipientIds: [],
  ccUserIds: [],
  ccDepartmentIds: [],
  businessUnitId: undefined,
  letterDocument: undefined,
};

export const LetterDialog = ({ onClose, initialLetter, title }: LetterDialogProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<LetterDto>(emptyLetterData);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<{ id: string; name: string } | null>(null);

  const [createLetter] = useCreateLetterMutation();
  const [updateLetter] = useUpdateLetterMutation();
  const [uploadLetterDocument] = useUploadLetterDocumentMutation();
  const [updateLetterDocument] = useUpdateLetterDocumentMutation();

  const { showSuccessAlert, showErrorAlert } = useAlert();
  const { letterTypeLookups } = useLetterTypesLookups();
  const { data: users } = useUsersQuery();
  const { businessUnitLookups } = useBusinessUnit();

  const { data: existingFile, refetch: refetchFiles } = useGetLetterDocumentQuery(
    { letterId: initialLetter?.id ?? 0 },
    { skip: !initialLetter?.id }
  );

  useEffect(() => {
    setFormData({ ...emptyLetterData, ...initialLetter });
    if (existingFile) {
      setFormData((prev) => ({ ...prev, letterDocument: existingFile }));
      setUploadPreview({ id: (existingFile as any).id ?? "", name: (existingFile as any).fileName ?? "" });
    } else {
      setUploadPreview(null);
    }
  }, [initialLetter, existingFile]);

  const recipientOptions = (users || [])
    .filter((u) => u.id !== user?.id)
    .map((u) => ({
      label: `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Unknown",
      value: u.id!,
    }));

  const validationSchema = Yup.object({
    referenceNumber: Yup.string().required("Reference Number is required."),
    subject: Yup.string().required("Subject is required."),
    content: Yup.string().required("Content is required."),
    businessUnitId: Yup.number().min(1, "Business Unit is required."),
  });

  const handleFileUpload = async (letterId: number, file: File) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const form = new FormData();
      form.append("letterId", letterId.toString());
      form.append("file", file);
      form.append("remark", "Letter Attachment");

      const existingFileId = (existingFile as any)?.id;
      if (existingFileId) {
        form.append("documentId", existingFileId.toString());
        await updateLetterDocument(form as any).unwrap();
        showSuccessAlert("Attachment updated successfully.");
      } else {
        await uploadLetterDocument(form as any).unwrap();
        showSuccessAlert("Attachment uploaded successfully.");
      }
      await refetchFiles();
      setSelectedFile(null);
      setUploadPreview(null);
    } catch (err: any) {
      showErrorAlert(err?.data?.message || "Attachment upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = useCallback(
    async (values: LetterDto) => {
      values.senderId = user?.id || "";
      try {
        let letterId: number;

        if (initialLetter?.id) {
          await updateLetter({ id: initialLetter.id, updateLetterCommand: values }).unwrap();
          letterId = initialLetter.id;
          showSuccessAlert("Letter updated successfully!");
        } else {
          const result = await createLetter({ createLetterCommand: values }).unwrap();
          letterId = typeof result === "number" ? result : result;
          showSuccessAlert("Letter created successfully!");
        }

        if (selectedFile && letterId) {
          await handleFileUpload(letterId, selectedFile);
        }

        onClose();
      } catch (err: any) {
        showErrorAlert(err?.data?.detail || "Error saving letter");
      }
    },
    [createLetter, updateLetter, initialLetter, selectedFile, user, onClose, showErrorAlert, showSuccessAlert]
  );

  const handleDownloadDocx = () => {
    if (!formData.content) return;
    const html = `<html><body>${formData.content}</body></html>`;
    const blob = htmlDocx.asBlob(html);
    saveAs(blob, "letter.docx");
  };

  return (
    <Dialog open maxWidth="md" fullWidth scroll="paper" disableEscapeKeyDown>
      <Formik
        initialValues={formData}
        enableReinitialize
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ values, setFieldValue }) => {
          const recipientOptionsFiltered = (users || [])
            .filter((u) => u.branchId === values.businessUnitId && u.id !== user?.id)
            .map((u) => ({ label: `${u.firstName} ${u.lastName}`, value: u.id! }));

          const ccOptions = (users || []).map((u) => ({
            label: `${u.firstName} ${u.lastName}`,
            value: u.id!,
          }));

          const deptOptions = (businessUnitLookups || []).map((bu) => ({
            label: bu.label,
            value: Number(bu.value),
          }));

          return (
            <Form>
              <DialogHeader title={title} onClose={onClose} />
              <DialogContent dividers>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormTextField name="referenceNumber" label="Reference Number" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormSelectField name="letterType" label="Letter Type" options={letterTypeLookups} />
                  </Grid>

                  <Grid item xs={12}>
                    <FormTextField name="subject" label="Subject" />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormSelectField
                      name="businessUnitId"
                      label="Business Unit"
                      options={businessUnitLookups ?? []}
                      onChange={(e) => {
                        setFieldValue("businessUnitId", e.target.value);
                        setFieldValue("recipientIds", []);
                      }}
                    />
                  </Grid>

                  {values.businessUnitId && (
                    <Grid item xs={12} sm={6}>
                      <Autocomplete
                        multiple
                        options={recipientOptions}
                        getOptionLabel={(option: SelectOption) => option.label}
                        value={recipientOptions.filter((r: SelectOption) =>
                          values.recipientIds?.includes(r.value as string)
                        )}
                        onChange={(_, newValue) =>
                          setFieldValue(
                            "recipientIds",
                            newValue.map((v) => v.value)
                          )
                        }
                        renderTags={(tagValue, getTagProps) =>
                          tagValue.map((option, index) => (
                            <Chip
                              {...getTagProps({ index })}
                              key={option.value.toString()}
                              label={option.label}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Recipients"
                            placeholder="Select recipients"
                          />
                        )}
                        disabled={recipientOptions.length === 0}
                      />
                    </Grid>
                  )}

                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      multiple
                      options={ccOptions}
                      getOptionLabel={(o) => o.label}
                      value={ccOptions.filter((r) => values.ccUserIds?.includes(r.value as string))}
                      onChange={(_, v) => setFieldValue("ccUserIds", v.map((x) => x.value))}
                      renderInput={(params) => <TextField {...params} label="CC Users" />}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      multiple
                      options={deptOptions}
                      getOptionLabel={(o) => o.label}
                      value={deptOptions.filter((r) => values.ccDepartmentIds?.includes(r.value as number))}
                      onChange={(_, v) => setFieldValue("ccDepartmentIds", v.map((x) => x.value))}
                      renderInput={(params) => <TextField {...params} label="CC Departments" />}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <DocumentUploadCustom
                        label={existingFile ? "Change Attachment" : "Upload Attachment"}
                        onAdd={(files) => setSelectedFile(files ? files[0] : null)}
                        accepts={["PDF", "Image"]}
                        showIcon
                        startIcon={<UploadIcon />}
                        size="small"
                        disabled={isUploading}
                      />
                      {uploadPreview && (
                        <LetterAttachmentPreviewModal
                          documentId={uploadPreview.id}
                          fileName={uploadPreview.name}
                          onView={() => {}}
                        />
                      )}
                      {isUploading && <CircularProgress size={24} />}
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <FormRichLetterTextField name="content" />
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleDownloadDocx} color="secondary" variant="outlined">
                  Download DOCX
                </Button>
                <Button type="submit" variant="contained">
                  Save
                </Button>
              </DialogActions>
            </Form>
          );
        }}
      </Formik>
    </Dialog>
  );
};