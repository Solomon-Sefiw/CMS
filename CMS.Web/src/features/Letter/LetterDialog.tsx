// ✅ Production-Ready Cleaned LetterDialog (No Judge Signature Upload)

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Alert,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { Formik, Form, FormikHelpers } from "formik";
import {
  DialogHeader,
  DocumentUpload,
  FormSelectField,
  FormTextField,
} from "../../components";
import { DocumentType, LetterType, LetterStatus } from "../../app/api/enums";
import { useCallback, useEffect, useState } from "react";
import { Errors } from "../../components";
import { useAlert } from "../notification";
import * as Yup from "yup";
import {
  LetterDocument,
  LetterDto,
  useAddLetterDocumentMutation,
  useCreateLetterMutation,
  useUpdateLetterMutation,
  useUsersQuery,
} from "../../app/api";
import { useAuth } from "../../hooks";
import { useBusinessUnit } from "../BusinessUnit";

import htmlDocx from "html-docx-js/dist/html-docx";
import { saveAs } from "file-saver";
import { FormRichLetterTextField } from "../../components/form-controls/form-letter";
import { DocumentDownload } from "../../components/DocumentDownload";

interface LetterTypeOption {
  value: number;
  label: string;
}

const useLetterTypesLookups = (): {
  letterTypeLookups: LetterTypeOption[];
  isLoading: boolean;
} => {
  return {
    letterTypeLookups: [
      { value: LetterType.Incoming, label: "Incoming" },
      { value: LetterType.Outgoing, label: "Outgoing" },
      { value: LetterType.InternalMemo, label: "Internal Memo" },
    ],
    isLoading: false,
  };
};

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
  recipientId: undefined,
  businessUnitId: undefined,
  letterDocuments: [],
};

export const LetterDialog = ({ onClose, initialLetter, title }: LetterDialogProps) => {
  const { user } = useAuth();
  const [letterData, setLetterData] = useState<LetterDto>(emptyLetterData);
  const [createLetter, { error: createLetterError, isLoading: isCreating }] = useCreateLetterMutation();
  const [updateLetter, { error: updateLetterError, isLoading: isUpdating }] = useUpdateLetterMutation();
  const [addLetterDocument] = useAddLetterDocumentMutation();
  const { showSuccessAlert, showErrorAlert } = useAlert();
  const [notification, setNotification] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState(false);
  const [selectedLetterAttachment, setSelectedLetterAttachment] = useState<File | null>(null);

  const { letterTypeLookups, isLoading: areLetterTypesLoading } = useLetterTypesLookups();
  const { data: users, isLoading: areUsersLoading } = useUsersQuery();
  const { businessUnitLookups } = useBusinessUnit();
  const areLookupsLoading = areLetterTypesLoading || areUsersLoading;

  useEffect(() => {
    setLetterData({
      ...emptyLetterData,
      ...initialLetter,
      receivedDate: initialLetter?.receivedDate ? new Date(initialLetter.receivedDate).toISOString().split("T")[0] : "",
      sentDate: initialLetter?.sentDate ? new Date(initialLetter.sentDate).toISOString().split("T")[0] : "",
    });
    setIsLocked(false);
    setOpenSnackbar(false);
    setNotification(initialLetter?.id ? "This letter is being viewed/edited." : "");
    setSelectedLetterAttachment(null);
  }, [initialLetter]);

  const validationSchema = Yup.object({
    referenceNumber: Yup.string().required("Reference Number is required.").max(50),
    subject: Yup.string().required("Subject is required.").max(200),
    content: Yup.string().required("Content is required."),
    recipientId: Yup.string().nullable().when("businessUnitId", {
      is: (val : number) => val && val > 0,
      then: (schema) => schema.required("Recipient is required when a Business Unit is selected."),
      otherwise: (schema) => schema.notRequired(),
    }),
    businessUnitId: Yup.number().required("Business Unit is required.").nullable().min(1),
  });

  const handleAddLetterAttachment = useCallback((files: File[]) => {
    setSelectedLetterAttachment(files?.[0] || null);
  }, []);

  const handleSubmit = useCallback(async (values: LetterDto, { setSubmitting, resetForm }: FormikHelpers<LetterDto>) => {
    const submitValues = { ...values, senderId: user?.id };
    try {
      let actualLetterId: number | undefined;
      if (initialLetter?.id) {
        await updateLetter({ updateLetterCommand: submitValues }).unwrap();
        actualLetterId = initialLetter.id;
      } else {
        const created = await createLetter({ createLetterCommand: submitValues }).unwrap();
        actualLetterId = typeof created === "number" ? created : (created as LetterDto)?.id;
        if (!actualLetterId) throw new Error("Failed to retrieve ID for new letter.");
      }

      if (selectedLetterAttachment && actualLetterId) {
        const uploaded = await addLetterDocument({
          id: actualLetterId,
          documentType: DocumentType.LetterDocument,
          body: { file: selectedLetterAttachment },
        }).unwrap();
        setLetterData((prev) => ({
          ...prev,
          letterDocuments: [...(prev.letterDocuments || []), uploaded as LetterDocument].filter((d) => !d.isDeleted),
        }));
      }

      showSuccessAlert(initialLetter?.id ? "Letter updated successfully!" : "Letter created successfully!");
      resetForm();
      onClose();
    } catch (err: any) {
      console.log(err?.data?.detail)
    } finally {
      setSubmitting(false);
    }
  }, [createLetter, updateLetter, addLetterDocument, initialLetter?.id, selectedLetterAttachment, showSuccessAlert, showErrorAlert, user?.id, onClose]);

  const handleDownloadDocx = () => {
    if (!letterData.content) return;
    const contentHtml = `<html><head><meta charset='utf-8'></head><body>${letterData.content}</body></html>`;
    const converted = htmlDocx.asBlob(contentHtml);
    saveAs(converted, "letter.docx");
  };

  const errors = (createLetterError as any)?.data?.errors || (updateLetterError as any)?.data?.errors;
  const isSaving = isCreating || isUpdating;
  const activeAttachments = (letterData.letterDocuments || []).filter((d) => d.documentType === DocumentType.LetterDocument && !d.isDeleted);

  return (
    <Dialog scroll="paper" disableEscapeKeyDown open maxWidth="md" fullWidth onClose={onClose}>
      {openSnackbar && notification && <Alert severity="warning" onClose={() => setOpenSnackbar(false)}>{notification}</Alert>}
      {areLookupsLoading ? (
        <DialogContent><Typography>Loading form data...</Typography></DialogContent>
      ) : (
        <>
          <DialogHeader title={title} onClose={onClose} />
          <Formik initialValues={letterData} enableReinitialize onSubmit={handleSubmit} validationSchema={validationSchema}>
            {({ handleSubmit, isSubmitting, values, setFieldValue }) => {
              const recipientOptions = (users || []).filter((u) => values.businessUnitId && u.branchId === values.businessUnitId && u.id !== user?.id).map((u) => ({
                label: `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Unknown User",
                value: u.id || "",
              }));
              return (
                <Form onSubmit={handleSubmit}>
                  <DialogContent dividers>
                    <Grid container spacing={3}>
                      {errors && <Grid item xs={12}><Errors errors={errors} /></Grid>}
                      <Grid item xs={12} sm={6}><FormTextField name="referenceNumber" label="Reference Number" fullWidth disabled={isLocked} /></Grid>
                      <Grid item xs={12} sm={6}><FormSelectField name="letterType" label="Letter Type" options={letterTypeLookups} fullWidth disabled={isLocked} /></Grid>
                      <Grid item xs={12}><FormTextField name="subject" label="Subject" fullWidth disabled={isLocked} /></Grid>
                      <Grid item xs={12} sm={6}><FormSelectField name="businessUnitId" label="Business Unit" options={businessUnitLookups} fullWidth disabled={isLocked} onChange={(e) => {
                        setFieldValue("businessUnitId", e.target.value);
                        setFieldValue("recipientId", undefined);
                      }} /></Grid>
                      {values.businessUnitId && <Grid item xs={12} sm={6}><FormSelectField name="recipientId" label="Recipient" options={recipientOptions} fullWidth disabled={isLocked || recipientOptions.length === 0} /></Grid>}
                      <Grid item xs={12}><Box display="flex" alignItems="center" gap={2}><Typography variant="subtitle2">Letter Attachment</Typography><Box>{selectedLetterAttachment ? (<Typography variant="body2">Selected: {selectedLetterAttachment.name}</Typography>) : activeAttachments.map((d) => (<DocumentDownload key={d.id} documentId={d.documentId!} label={d.fileName || "Download"} />))}</Box><DocumentUpload onAdd={handleAddLetterAttachment} label={selectedLetterAttachment ? "Change Attachment" : "Upload Attachment"} /></Box><Divider sx={{ mt: 2 }} /></Grid>

                      <Grid item xs={12}><FormRichLetterTextField name="content" /></Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={onClose} variant="outlined" disabled={isSaving || isSubmitting}>Cancel</Button>
                    <Button onClick={handleDownloadDocx} variant="contained" color="secondary" disabled={!letterData.content || values.senderId != (user?.id ?? "")}>Download DOCX</Button>
                    <Button type="submit" variant="contained" disabled={isSaving || isSubmitting || isLocked}>{isSaving || isSubmitting ? "Saving..." : "Save"}</Button>
                  </DialogActions>
                </Form>
              );
            }}
          </Formik>
        </>
      )}
    </Dialog>
  );
};
