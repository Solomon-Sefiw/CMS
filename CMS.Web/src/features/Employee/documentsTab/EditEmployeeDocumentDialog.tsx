import React, { useRef } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { DocumentUpload, FormSelectField } from "../../../components";
import { DocumentType,DocumentTypeLabels } from "../../../app/api/enums";
import { useAlert } from "../../notification";
import { useUpdateEmployeeFileDocumentMutation } from "../../../app/store";
interface EditProps {
  open: boolean;
  onClose: () => void;
  document: {
    id: string;
    fileName: string;
    documentType: DocumentType;
    remark: string;
  };
  onUpdated?: () => void;
}

interface EditFormValues {
  documentType: DocumentType;
  file: File | null;
  remark: string;
}

export const EditEmployeeFileDocumentsDialog = ({
  open,
  onClose,
  document,
}: EditProps) => {
  const [update] = useUpdateEmployeeFileDocumentMutation();
  const { showErrorAlert, showSuccessAlert } = useAlert();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const initialValues: EditFormValues = {
    documentType: document.documentType,
    file: null,
    remark: document.remark || "",
  };

  const validationSchema = Yup.object({
    documentType: Yup.mixed<DocumentType>().required(
      "Document type is required."
    ),
    remark: Yup.string()
      .required("Remark is required")
      .max(200, "Remark should not be exceeds 200 characters"),
  });

  const handleSubmit = async (
    values: EditFormValues,
    { setSubmitting }: FormikHelpers<EditFormValues>
  ) => {
    try {
      const formData = new FormData();
      formData.append("id", document.id);
      formData.append("documentType", values.documentType.toString());
      if (values.file) {
        formData.append("file", values.file);
      }
      formData.append("remark", values.remark);

      await update(formData as any).unwrap();
      await new Promise((resolve) => setTimeout(resolve, 300));

      showSuccessAlert("File document updated.");
      onClose();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.data?.detail ||
        error?.error ||
        "Update failed.";
      showErrorAlert(message);
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Employee File Document</DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          isSubmitting,
          setFieldValue,
          setFieldTouched,
          values,
          errors,
          touched,
        }) => (
          <Form>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Current File Name"
                    value={document.fileName}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormSelectField
                    name="documentType"
                    label="Document Type"
                    // options={getEnumOptions(DocumentType)}
                    options={Object.values(DocumentType)
                         .filter((v) => typeof v === "number") 
                         .map((v) => ({
                           value: v,
                           label: DocumentTypeLabels[v as DocumentType],
                         }))}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <DocumentUpload
                    label="Choose File"
                    multiple={false}
                    onAdd={(files) => {
                      const file = files[0] || null;
                      setFieldValue("file", file);
                      setFieldTouched("file", true);
                    }}
                    disabled={isSubmitting}
                    accepts={["Image", "PDF"]}
                    showIcon
                  />
                  {values.file && (
                    <Typography variant="caption" color="textSecondary">
                      Selected file: {values.file.name}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="remark"
                    label="Remark"
                    value={values.remark}
                    onChange={(e) => setFieldValue("remark", e.target.value)}
                    onBlur={() => setFieldTouched("remark", true)}
                    fullWidth
                    multiline
                    rows={3}
                  />
                  {errors.remark && touched.remark && (
                    <Typography color="error" variant="body2" sx={{ mt: 0.5 }}>
                      {errors.remark}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
