import React, { useState, useCallback, useEffect } from "react";
import {
  DialogHeader,
  Errors,
  FormSelectField,
  FormTextField,
  SelectOption,
} from "../../components";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
} from "@mui/material";
import { CaseDto, CreateCaseCommand, useCreateCaseMutation, useGetAllBusinessUnitsQuery, useUpdateCaseMutation, useUsersQuery } from "../../app/api";
import { removeEmptyFields } from "../../utils";
import * as Yup from "yup";
import { useAlert } from "../notification";
import { getEnumOptions } from "../../components/form-controls/get-enum-list";
import { Form, Formik } from "formik";
import { useNavigateToCaseDetailPage } from "./useNavigateToCaseDetailPage";
import { CaseStatus, CaseType } from "../../app/api/enums";
import { useAuth } from "../../hooks";
import { useBusinessUnit } from "../BusinessUnit";

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
  const [formData, setFormData] = useState<CreateCaseCommand>();
  const { user } = useAuth();
  const [addCase, { error: addCaseErr }] = useCreateCaseMutation();
  const [updateCase, { error: updateCaseErr }] = useUpdateCaseMutation();
  const { data: users, isLoading: areUsersLoading } = useUsersQuery();
  const { navigateToDetailPage } = useNavigateToCaseDetailPage();
  const { showSuccessAlert, showErrorAlert } = useAlert();
 const { businessUnitLookups } = useBusinessUnit();
  const recipientOptions = (users || []).filter((u) => u.id !== user?.id).map((u) => ({
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
    closedAt: Yup.date().nullable().min(
      Yup.ref("filedAt"),
      "Closed date cannot be before filed date."
    ),
    businessUnitId: Yup.number().min(1, "Business Unit is required."),
  });

  useEffect(() => {
    setFormData({
      ...emptyCaseData,
      ...caseData,
    });
  }, [caseData]);

  const handleSubmit = useCallback(
    async (values: CreateCaseCommand) => {
      values.filedById = user?.id || '';
      const payload = removeEmptyFields(values);

      try {
        if (caseData?.id) {
          await updateCase({ updateCaseCommand: payload }).unwrap();
          showSuccessAlert("Case updated successfully!");
          onClose();
        } else {
          const result = await addCase({ createCaseCommand: payload }).unwrap();
          if (result.id && result.versionNumber !== undefined) {
            navigateToDetailPage({
              id: result.id,
              versionNumber: result.versionNumber,
            })();
            showSuccessAlert("New case created successfully!");
          }
          onClose();
        }
      } catch (error: any) {
        const errorMessage = error?.data?.detail || "Error saving case";
        showErrorAlert(errorMessage);
        console.error("Error saving case:", error);
      }
    },
    [onClose, addCase, updateCase, caseData, navigateToDetailPage, showErrorAlert, showSuccessAlert]
  );

  const errors = (caseData?.id ? updateCaseErr : (addCaseErr as any))
    ?.data?.errors;
  return (
    <Dialog scroll="paper" disableEscapeKeyDown={true} maxWidth="md" open={true}>
      {!!formData && (
        <Formik
          initialValues={formData}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {() => (
            <Form>
              <DialogHeader title={title} onClose={onClose} />
              <DialogContent dividers={true}>
                <Grid container spacing={2}>
                  {errors && (
                    <Grid item xs={12}>
                      <Errors errors={errors as any} />
                    </Grid>
                  )}
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
                      <FormSelectField
                        name="caseType"
                        label="Case Type"
                        options={getEnumOptions(CaseType)}
                      />
                      <FormSelectField
                        name="status"
                        label="Status"
                        options={getEnumOptions(CaseStatus)}
                      />
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
                    <FormSelectField
                      name="businessUnitId"
                      label="Business Unit"
                      type="number"
                      options={businessUnitLookups ?? []}
                    />
                    <FormTextField name="chilotId" label="Chilot ID" type="number" />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button color="primary" variant="outlined" type="submit">
                  Save
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      )}
    </Dialog>
  );
};
