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
  Tabs,
  Tab,
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
  useCreateEditableLetterMutation,
  useCreateLetterMutation,
  useUpdateLetterMutation,
  useUsersQuery,
} from "../../app/api";
import { useAuth } from "../../hooks";
import { useBusinessUnit } from "../BusinessUnit";
import { DocumentDownload } from "../../components/DocumentDownload";
import DocumentEditor from "./DocumentEditor";

interface LetterTypeOption {
  value: number;
  label: string;
}

const useLetterTypesLookups = (): { letterTypeLookups: LetterTypeOption[]; isLoading: boolean } => {
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
  isEditableDocument: false,
  documentJsonContent: undefined,
};

export const LetterDialog = ({
  onClose,
  initialLetter,
  title,
}: LetterDialogProps) => {
  const { user } = useAuth();
  const [letterData, setLetterData] = useState<LetterDto>(emptyLetterData);
  const [createLetter, { error: createLetterError, isLoading: isCreating }] =
    useCreateLetterMutation();
  const [updateLetter, { error: updateLetterError, isLoading: isUpdating }] =
    useUpdateLetterMutation();
  const [createEditableLetter] = useCreateEditableLetterMutation();
  const [addLetterDocument] = useAddLetterDocumentMutation();

  const { showSuccessAlert, showErrorAlert } = useAlert();
  const [notification, setNotification] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedLetterAttachment, setSelectedLetterAttachment] =
    useState<File | null>(null);

  const { letterTypeLookups, isLoading: areLetterTypesLoading } =
    useLetterTypesLookups();
  const { data: users, isLoading: areUsersLoading } = useUsersQuery();
  const { businessUnitLookups } = useBusinessUnit();

  const areLookupsLoading = areLetterTypesLoading || areUsersLoading;

  useEffect(() => {
    setLetterData({
      ...emptyLetterData,
      ...initialLetter,
      receivedDate: initialLetter?.receivedDate
        ? new Date(initialLetter.receivedDate).toISOString().split("T")[0]
        : "",
      sentDate: initialLetter?.sentDate
        ? new Date(initialLetter.sentDate).toISOString().split("T")[0]
        : "",
    });

    if (initialLetter?.id) {
      setIsLocked(false);
      setNotification("This letter is being viewed/edited.");
      setOpenSnackbar(false);
      setActiveTab(initialLetter.isEditableDocument ? 1 : 0);
    } else {
      setIsLocked(false);
      setOpenSnackbar(false);
      setNotification("");
    }
    setSelectedLetterAttachment(null);
  }, [initialLetter]);

  const validationSchema = Yup.object({
    referenceNumber: Yup.string()
      .required("Reference Number is required.")
      .max(50, "Reference Number cannot be longer than 50 characters."),
    subject: Yup.string()
      .required("Subject is required.")
      .max(200, "Subject cannot be longer than 200 characters."),
    content: Yup.string()
      .required("Content is required.")
      .max(1000, "Content cannot be longer than 1000 characters."),
    recipientId: Yup.string().nullable().when("businessUnitId", {
      is: (val: number | null | undefined) => val && val > 0,
      then: (schema) =>
        schema.required("Recipient is required when a Business Unit is selected."),
      otherwise: (schema) => schema.notRequired(),
    }),
    businessUnitId: Yup.number()
      .required("Business Unit is required.")
      .nullable()
      .min(1, "Business Unit is required."),
  });

  const handleAddLetterAttachment = useCallback((files: File[]) => {
    if (files && files.length > 0) {
      setSelectedLetterAttachment(files[0]);
    } else {
      setSelectedLetterAttachment(null);
    }
  }, []);

  const handleCreateEditableDocument = async (content: string, jsonContent: string) => {
    try {
      const command = {
        referenceNumber: `ED-${Date.now()}`,
        subject: letterData.subject || "Editable Document",
        content: content,
        documentJson: jsonContent,
        letterType: letterData.letterType || LetterType.InternalMemo,
        senderId: user?.id,
        recipientId: letterData.recipientId,
        businessUnitId: letterData.businessUnitId || user?.branchId,
      };

      if (initialLetter?.id) {
        await updateLetter({
          ...initialLetter,
          ...command,
          updateLetterCommand: {
            id: undefined,
            referenceNumber: undefined,
            subject: undefined,
            content: undefined,
            letterType: undefined,
            status: undefined,
            senderId: undefined,
            recipientId: undefined,
            businessUnitId: undefined,
            isEditableDocument: undefined,
            documentJsonContent: undefined
          }
        }).unwrap();
      } else {
        await createEditableLetter({ createEditableLetterCommand: command }).unwrap();
      }

      showSuccessAlert(
        initialLetter?.id
          ? "Editable document updated successfully!"
          : "Editable document created successfully!"
      );
      onClose();
    } catch (error: any) {
      showErrorAlert(error?.data?.detail || "Failed to save editable document.");
    }
  };

  const handleSubmitTraditional = useCallback(
    async (
      values: LetterDto,
      { setSubmitting, resetForm }: FormikHelpers<LetterDto>
    ) => {
      const submitValues = {
        ...values,
        senderId: user?.id,
        isEditableDocument: false,
        documentJsonContent: null
      };

      try {
        let actualLetterId: number | undefined;

        if (initialLetter?.id) {
          await updateLetter({ updateLetterCommand: submitValues }).unwrap();
          actualLetterId = initialLetter.id;
        } else {
          const createdLetterResponse = await createLetter({
            createLetterCommand: submitValues,
          }).unwrap();

          actualLetterId =
            typeof createdLetterResponse === "number"
              ? createdLetterResponse
              : (createdLetterResponse as LetterDto)?.id;

          if (!actualLetterId) {
            throw new Error("Failed to retrieve ID for new letter.");
          }
        }

        if (selectedLetterAttachment && actualLetterId) {
          try {
            const uploadedDocMetadata = await addLetterDocument({
              id: actualLetterId,
              documentType: DocumentType.LetterDocument,
              body: { file: selectedLetterAttachment },
            }).unwrap();

            setLetterData((prevData) => ({
              ...prevData,
              letterDocuments: [
                ...(prevData.letterDocuments || []),
                uploadedDocMetadata as LetterDocument,
              ].filter(doc => !doc.isDeleted),
            }));

            showSuccessAlert("Letter and attachment saved successfully!");
          } catch (uploadError: any) {
            showErrorAlert(
              uploadError?.data?.detail || "Failed to upload letter attachment."
            );
          }
        } else {
          showSuccessAlert(
            initialLetter?.id
              ? "Letter updated successfully!"
              : "Letter created successfully!"
          );
        }

        resetForm();
        onClose();
      } catch (error: any) {
        showErrorAlert(error?.data?.detail || "Failed to save letter.");
      } finally {
        setSubmitting(false);
      }
    },
    [
      createLetter,
      updateLetter,
      onClose,
      showErrorAlert,
      showSuccessAlert,
      initialLetter?.id,
      user?.id,
      selectedLetterAttachment,
      addLetterDocument,
      setLetterData,
    ]
  );

  const errors =
    (createLetterError as any)?.data?.errors ||
    (updateLetterError as any)?.data?.errors;

  const isSaving = isCreating || isUpdating;

  const activeLetterAttachments = (letterData.letterDocuments || []).filter(
    (d) => d.documentType === DocumentType.LetterDocument && !d.isDeleted
  );

  return (
    <Dialog
      scroll="paper"
      disableEscapeKeyDown={true}
      maxWidth="md"
      fullWidth
      open={true}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          background: "linear-gradient(145deg, #f0f2f5, #e0e3e7)",
        },
      }}
    >
      {openSnackbar && notification && (
        <Alert
          severity="warning"
          onClose={() => setOpenSnackbar(false)}
          sx={{ mb: 2, borderRadius: "8px", mx: 2, mt: 2 }}
        >
          {notification}
        </Alert>
      )}

      {areLookupsLoading ? (
        <DialogContent
          sx={{
            minHeight: 200,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography>Loading form data...</Typography>
        </DialogContent>
      ) : (
        <>
          <DialogHeader title={title} onClose={onClose} />
          <Tabs 
            value={activeTab} 
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{ px: 3 }}
          >
            <Tab label="Traditional Letter" disabled={initialLetter?.isEditableDocument} />
            <Tab label="Editable Document" />
          </Tabs>
          
          {activeTab === 0 ? (
            <Formik
              initialValues={letterData}
              enableReinitialize={true}
              onSubmit={handleSubmitTraditional}
              validationSchema={validationSchema}
              validateOnChange={true}
            >
              {({ handleSubmit, isSubmitting, values, setFieldValue }) => {
                const filteredRecipientOptions = (users || [])
                  .filter(
                    (u) =>
                      values.businessUnitId &&
                      u.branchId === values.businessUnitId &&
                      u.id !== user?.id
                  )
                  .map((u) => ({
                    label:
                      u.firstName && u.lastName
                        ? `${u.firstName} ${u.lastName}`
                        : u.firstName || u.lastName || "Unknown User",
                    value: u.id ?? "", // Ensure value is never null
                  }));

                return (
                  <Form onSubmit={handleSubmit}>
                    <DialogContent dividers={true} sx={{ p: 3 }}>
                      <Grid container spacing={3}>
                        {errors && (
                          <Grid item xs={12}>
                            <Errors errors={errors as any} />
                          </Grid>
                        )}

                        <Grid item xs={12} sm={6}>
                          <FormTextField
                            name="referenceNumber"
                            label="Reference Number"
                            type="text"
                            fullWidth
                            error={!!errors?.referenceNumber}
                            helperText={errors?.referenceNumber}
                            disabled={isLocked}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <FormSelectField
                            name="letterType"
                            label="Letter Type"
                            type="number"
                            options={letterTypeLookups}
                            fullWidth
                            error={!!errors?.letterType}
                            helperText={errors?.letterType}
                            disabled={isLocked}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <FormTextField
                            name="subject"
                            label="Subject"
                            type="text"
                            fullWidth
                            error={!!errors?.subject}
                            helperText={errors?.subject}
                            disabled={isLocked}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <FormSelectField
                            name="businessUnitId"
                            label="Business Unit"
                            type="number"
                            options={businessUnitLookups}
                            fullWidth
                            error={!!errors?.businessUnitId}
                            helperText={errors?.businessUnitId}
                            disabled={isLocked}
                            onChange={(event) => {
                              setFieldValue("businessUnitId", event.target.value);
                              setFieldValue("recipientId", undefined);
                            }}
                          />
                        </Grid>

                        {values.businessUnitId && values.businessUnitId > 0 && (
                          <Grid item xs={12} sm={6}>
                            <FormSelectField
                              name="recipientId"
                              label="Recipient"
                              type="string"
                              options={filteredRecipientOptions}
                              fullWidth
                              error={!!errors?.recipientId}
                              helperText={errors?.recipientId}
                              disabled={
                                isLocked || filteredRecipientOptions.length === 0
                              }
                              sx={
                                filteredRecipientOptions.length === 0
                                  ? { "& .MuiInputBase-root": { backgroundColor: "#f0f0f0" } }
                                  : {}
                              }
                            />
                            {filteredRecipientOptions.length === 0 &&
                              values.businessUnitId && (
                                <Typography
                                  variant="caption"
                                  color="textSecondary"
                                  sx={{ ml: 1, mt: 0.5 }}
                                >
                                  No recipients found for this Business Unit
                                  (excluding yourself).
                                </Typography>
                              )}
                          </Grid>
                        )}

                        <Grid item xs={12}>
                          <FormTextField
                            name="content"
                            type="text"
                            placeholder="Letter Content"
                            label="Content"
                            fullWidth
                            multiline
                            minRows={2}
                            variant="outlined"
                            error={!!errors?.content}
                            helperText={errors?.content}
                            disabled={isLocked}
                          />
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 2 }}>
                          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                            <Typography variant="subtitle2">Letter Attachment</Typography>
                            <Box>
                              {selectedLetterAttachment ? (
                                <Typography
                                  variant="body2"
                                  sx={{ ml: 1, color: "text.secondary" }}
                                >
                                  Selected: {selectedLetterAttachment.name}
                                </Typography>
                              ) : (
                                activeLetterAttachments.map((d) => (
                                  <DocumentDownload
                                    key={d.id}
                                    documentId={d.documentId!}
                                    label={d.fileName || "Download Attachment"}
                                  />
                                ))
                              )}
                            </Box>
                            <DocumentUpload
                              onAdd={handleAddLetterAttachment}
                              label={
                                activeLetterAttachments.length || selectedLetterAttachment
                                  ? "Change Attachment"
                                  : "Upload Attachment"
                              }
                              showIcon={true}
                              size="medium"
                              disabled={isLocked}
                            />
                          </Box>
                          <Divider sx={{ my: 2 }} />
                        </Grid>
                      </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 2, justifyContent: "flex-end", gap: 1 }}>
                      <Button
                        onClick={onClose}
                        disabled={isSaving || isSubmitting}
                        variant="outlined"
                        color="secondary"
                        sx={{ borderRadius: "8px" }}
                      >
                        Cancel
                      </Button>
                      <Button
                        color="primary"
                        variant="contained"
                        type="submit"
                        disabled={isSaving || isSubmitting || isLocked}
                        sx={{ borderRadius: "8px" }}
                      >
                        {isSaving || isSubmitting ? "Saving..." : "Save"}
                      </Button>
                    </DialogActions>
                  </Form>
                );
              }}
            </Formik>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <DialogContent dividers sx={{ flex: 1 }}>
                <DocumentEditor
                  initialContent={initialLetter?.documentJsonContent ?? undefined}
                  onSave={handleCreateEditableDocument}
                  onCancel={onClose}
                  readOnly={!!initialLetter?.id && isLocked}
                />
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button
                  onClick={onClose}
                  variant="outlined"
                  color="secondary"
                  sx={{ borderRadius: "8px" }}
                >
                  Cancel
                </Button>
              </DialogActions>
            </Box>
          )}
        </>
      )}
    </Dialog>
  );
};