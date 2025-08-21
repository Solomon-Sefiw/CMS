import React, { useCallback, useRef } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useAlert } from "../../notification";
import {
  DialogHeader,
  DocumentUpload,
  FormSelectField,
} from "../../../components";
import { DocumentType,DocumentTypeLabels } from "../../../app/api/enums";
import { getEnumOptions } from "../../../components/form-controls/get-enum-list";
import {
  EmployeeFileDocumentDto,
  useGetEmployeeFileDocumentByEmployeeIdQuery,
  useUploadEmployeeFileDocumentMutation,
} from "../../../app/store";
import { useParams } from "react-router-dom";
interface UploadDialogProps {
  // employeeId: number;
  onClose: () => void;
}

interface UploadFormValues {
  employeeId: number;
  documentType: DocumentType | undefined;
  file: File | null;
  remark: string;
}
interface UploadedDoc {
  id: string;
  fileName: string;
  documentType: DocumentType;
  remark: string;
  createdAt: string;
}

export const EmployeeFileDocumentsDialog = ({ onClose }: UploadDialogProps) => {
  const [uploadEmployeeFileDocument] = useUploadEmployeeFileDocumentMutation();
  const { showErrorAlert, showSuccessAlert } = useAlert();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { id } = useParams<{ id: string }>();
  const employeeId = Number(id);

  const { data: uploadedDocs = [], refetch } =
    useGetEmployeeFileDocumentByEmployeeIdQuery({ employeeId }) as {
      data: EmployeeFileDocumentDto[];
      refetch: () => Promise<any>;
    };

  const uploadedDocumentTypes = uploadedDocs.map((doc) => doc.documentType);

  const initialValues: UploadFormValues = {
    employeeId,
    documentType: undefined,
    file: null,
    remark: "",
  };

  const validationSchema = Yup.object().shape({
    employeeId: Yup.number()
      .required("Employee ID is required.")
      .moreThan(0, "Employee ID must be greater than 0"),
    documentType: Yup.mixed<DocumentType>().required(
      "Document type is required."
    ),
    remark: Yup.string()
      .required("Remark is required")
      .max(200, "Remark cannot exceed 200 characters"),
  });

  const handleSubmit = useCallback(
    async (
      values: UploadFormValues,
      { setSubmitting, resetForm }: FormikHelpers<UploadFormValues>
    ) => {
      if (!values.file) {
        showErrorAlert("Please select a file.");
        setSubmitting(false);
        return;
      }

      try {
        const formData = new FormData();
        formData.append("employeeId", values.employeeId.toString());
        formData.append("documentType", values.documentType?.toString() ?? "");
        formData.append("file", values.file);
        formData.append("remark", values.remark);
        await uploadEmployeeFileDocument(formData as any).unwrap();

        await refetch(); // only if this is passed
        await new Promise((resolve) => setTimeout(resolve, 300));

        showSuccessAlert("File uploaded successfully.");
        resetForm();
        if (fileInputRef.current) fileInputRef.current.value = "";
        onClose();
      } catch (error: any) {
        const message =
          error?.data?.message ||
          error?.data?.detail ||
          error?.error ||
          "Upload failed.";
        showErrorAlert(message);
      } finally {
        setSubmitting(false);
      }
    },
    [
      uploadEmployeeFileDocument,
      showErrorAlert,
      showSuccessAlert,
      onClose,
      refetch,
    ]
  );

  return (
    <Dialog scroll="paper" disableEscapeKeyDown maxWidth="md" open>
      <DialogHeader title="Upload Employee File" onClose={onClose} />
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
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
            <DialogContent dividers sx={{ width: 600 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <input
                    type="hidden"
                    name="employeeId"
                    value={values.employeeId}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormSelectField
                    name="documentType"
                    label="Document Type"
                    // options={DocumentTypeLabels(getEnumOptions(DocumentType))}
                  options={Object.values(DocumentType)
                   .filter((v) => typeof v === "number") 
                   .map((v) => ({
                   value: v,
                   label: DocumentTypeLabels[v as DocumentType],
                 })).filter( option => option.value !== DocumentType.Suspension 
                  && option.value !== DocumentType.Resignation 
                  && option.value !== DocumentType.Other 
                  && option.value !== DocumentType.UserPhoto 
                  && option.value !== DocumentType.LetterDocument 
                  && option.value !== DocumentType.DepartmentBluePrint 
                  && option.value !== DocumentType.EmployeePicture 
                )}
                    fullWidth
                  />
                  {errors.documentType && touched.documentType && (
                    <Typography color="error" variant="body2" sx={{ mt: 0.5 }}>
                      {errors.documentType}
                    </Typography>
                  )}
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
                  />
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={onClose}
                variant="outlined"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                variant="contained"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Uploading..." : "Upload"}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
