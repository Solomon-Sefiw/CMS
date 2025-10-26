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
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  CaseDto,
  CreateCaseCommand,
  useCreateCaseMutation,
  useUpdateCaseMutation,
  useUsersQuery,
  useUploadCaseFileDocumentMutation,
  useGetCaseFileDocumentByCaseIdQuery,
  useUpdateCaseFileDocumentMutation,
} from "../../app/api";
import { removeEmptyFields } from "../../utils";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { getEnumOptions } from "../../components/form-controls/get-enum-list";
import { useAlert } from "../notification";
import { CaseStatus, CaseType, CaseDocumentType } from "../../app/api/enums";
import { useAuth } from "../../hooks";
import { useBusinessUnit } from "../BusinessUnit";
import { useChilot } from "./useChilots";
import { useNavigateToCaseDetailPage } from "./useNavigateToCaseDetailPage";
import {
  DialogHeader,
  FormSelectField,
  FormTextField,
  DocumentUpload,
} from "../../components";
import { DocumentUploadCustom } from "../../components/DocumentUploadCustom";

const emptyCaseData: CreateCaseCommand = {
  caseNumber: "",
  caseType: 1,
  status: 1,
  plaintiffName: "",
  accusedName: "",
  subject: "",
  filedAt: "",
  closedAt: "",
  filedById: "",
  assignedJudgeId: "",
  businessUnitId: 0,
  chilotId: 0,
};

export const CaseDialog = ({
  onClose,
  title,
  caseData,
}: {
  onClose: () => void;
  title: string;
  caseData?: CaseDto;
}) => {
  const { user } = useAuth();
  const { chilotLookups } = useChilot();
  const { businessUnitLookups } = useBusinessUnit();
  const { data: users } = useUsersQuery();
  const { navigateToDetailPage } = useNavigateToCaseDetailPage();
  const { showSuccessAlert, showErrorAlert } = useAlert();

  const [formData, setFormData] = useState<CreateCaseCommand>(emptyCaseData);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<{ id: string; name: string } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string>("");

  const [addCase] = useCreateCaseMutation();
  const [updateCase] = useUpdateCaseMutation();
  const [uploadCaseFile] = useUploadCaseFileDocumentMutation();
  const [updateCaseFile] = useUpdateCaseFileDocumentMutation();

  const { data: existingFiles, refetch: refetchFiles } = useGetCaseFileDocumentByCaseIdQuery(
    { caseId: caseData?.id ?? 0 },
    { skip: !caseData?.id }
  );

  useEffect(() => {
    setFormData({ ...emptyCaseData, ...caseData });
    if (existingFiles?.length) {
      setUploadPreview({ id: existingFiles[0].id ?? "", name: existingFiles[0].fileName ?? "" });
    } else {
      setUploadPreview(null);
    }
  }, [caseData, existingFiles]);

  const recipientOptions = (users || [])
    .filter((u) => u.id !== user?.id)
    .map((u) => ({
      label: `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Unknown User",
      value: u.id || "",
    }));

  const validationSchema = Yup.object({
    caseNumber: Yup.string().required("Case Number is required."),
    plaintiffName: Yup.string().required("Plaintiff Name is required."),
    accusedName: Yup.string().required("Accused Name is required."),
    caseType: Yup.number().required("Case Type is required."),
    status: Yup.number().required("Status is required."),
    filedAt: Yup.date().required("Filed date is required."),
    closedAt: Yup.date().nullable().min(Yup.ref("filedAt"), "Closed date cannot be before filed date."),
    businessUnitId: Yup.number().min(1, "Business Unit is required."),
  });

  const handleFileUpload = async (caseId: number, file: File) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const form = new FormData();
      form.append("caseId", caseId.toString());
      form.append("caseDocumentType", CaseDocumentType.Attachment.toString());
      form.append("file", file);
      form.append("remark", "Case Attachment");

      if (existingFiles?.length && existingFiles[0].id) {
        form.append("id", existingFiles[0].id);
        await updateCaseFile(form as any).unwrap();
        showSuccessAlert("Attachment updated successfully.");
      } else {
        await uploadCaseFile(form as any).unwrap();
        showSuccessAlert("Attachment uploaded successfully.");
      }

      await refetchFiles();
      setSelectedFile(null);
      setUploadPreview(null);
    } catch (err: any) {
      showErrorAlert(err?.data?.message || "Attachment upload/update failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewFile = async () => {
    if (!uploadPreview?.id || !caseData?.id) return;
    try {
      const response = await fetch(
        `/api/CaseFileDocuments/DownloadCaseFileDocument/${uploadPreview.id}?caseId=${caseData?.id}`,
        { headers: { Accept: "application/pdf, image/*" } }
      );
      if (!response.ok) throw new Error("Failed to fetch document");
      const blob = await response.blob();

      const fileType = blob.type || "application/octet-stream";
      const url = URL.createObjectURL(blob);

      if (fileType.includes("pdf") || fileType.startsWith("image/")) {
        setPreviewUrl(url);
        setPreviewName(uploadPreview.name);
      } else {
        const a = document.createElement("a");
        a.href = url;
        a.download = uploadPreview.name;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      showErrorAlert("Failed to load document preview.");
    }
  };

  const handleClosePreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleSubmit = useCallback(
    async (values: CreateCaseCommand) => {
      values.filedById = user?.id || "";
      const payload = removeEmptyFields(values);

      try {
        let caseId: number | undefined;
        let versionNumber: string | undefined;

        if (caseData?.id) {
          const result = await updateCase({ updateCaseCommand: payload }).unwrap();
          caseId = result;
          showSuccessAlert("Case updated successfully!");
        } else {
          const result = await addCase({ createCaseCommand: payload }).unwrap();
          caseId = result.id;
          versionNumber = result.versionNumber;
          showSuccessAlert("New case created successfully!");
        }

        if (selectedFile && caseId) {
          await handleFileUpload(caseId, selectedFile);
        }

        if (!caseData?.id && caseId && versionNumber) {
          navigateToDetailPage({ id: caseId, versionNumber })();
        }

        onClose();
      } catch (err: any) {
        showErrorAlert(err?.data?.detail || "Error saving case");
        console.error("Error saving case:", err);
      }
    },
    [addCase, updateCase, caseData, navigateToDetailPage, onClose, selectedFile]
  );

  return (
    <Dialog scroll="paper" disableEscapeKeyDown maxWidth="md" open>
      {!!formData && (
        <Formik
          initialValues={formData}
          enableReinitialize
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {() => (
            <Form>
              <DialogHeader title={title} onClose={onClose} />
              <DialogContent dividers>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormTextField name="caseNumber" label="Case Number" />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <FormTextField name="plaintiffName" label="Plaintiff Name" />
                      <FormTextField name="accusedName" label="Accused Name" />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <FormTextField name="subject" label="Subject" />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <FormSelectField name="caseType" label="Case Type" options={getEnumOptions(CaseType)} />
                      <FormSelectField name="status" label="Status" options={getEnumOptions(CaseStatus)} />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <FormTextField name="filedAt" label="Filed At" type="date" />
                      <FormTextField name="closedAt" label="Closed At" type="date" />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <FormSelectField name="assignedJudgeId" label="Assigned Judge" options={recipientOptions} />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <FormSelectField name="businessUnitId" label="Business Unit" options={businessUnitLookups ?? []} />
                      <FormSelectField name="chilotId" label="Chilot" options={chilotLookups ?? []} />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <DocumentUploadCustom
                        label={existingFiles?.length ? "Update Attachment" : "Upload Attachment"}
                        onAdd={(files) => setSelectedFile(files ? files[0] : null)}
                        accepts={["PDF", "Image"]}
                        disabled={isUploading}
                        showIcon
                        size="small"
                      />
                      {uploadPreview && (
                        <Button
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                          onClick={handleViewFile}
                          disabled={isUploading || !uploadPreview.id}
                          size="small"
                        >
                          View
                        </Button>
                      )}
                      {isUploading && <CircularProgress size={24} />}
                    </Box>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button color="primary" variant="outlined" type="submit">
                  Save
                </Button>
              </DialogActions>

              <Dialog open={!!previewUrl} onClose={handleClosePreview} maxWidth="md" fullWidth>
                <DialogTitle>Preview: {previewName}</DialogTitle>
                <DialogContent>
                  {previewUrl && previewName.toLowerCase().endsWith(".pdf") ? (
                    <iframe
                      src={previewUrl}
                      width="100%"
                      height={600}
                      title="PDF Preview"
                      style={{ border: "none" }}
                    />
                  ) : (
                    <img
                      src={previewUrl!}
                      alt="Preview"
                      style={{ width: "100%", maxHeight: 600, objectFit: "contain" }}
                    />
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClosePreview}>Close</Button>
                </DialogActions>
              </Dialog>
            </Form>
          )}
        </Formik>
      )}
    </Dialog>
  );
};