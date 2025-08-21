import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  CardContent,
  Card,
  Alert,
  Stack,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import { skipToken } from "@reduxjs/toolkit/query";

import {
  Gender,
  MartialStatus,
  ReemploymentType,
} from "../../../../app/api/enums";
import {
  useApproveReemploymentMutation,
  useGetAllBusinessUnitsQuery,
  useGetJobByBuIdQuery,
  useGetJobGradeOfJobRoleQuery,
  useGetReemploymentByIdQuery,
} from "../../../../app/api";
import { removeEmptyFields } from "../../../../utils";
import { DialogHeader } from "../../../../components/dialog/DialogHeader";
import { SelectOption } from "./types";
import { FormTextField } from "../../../../components/form-controls/form-text-field";
import { FormSelectField } from "../../../../components/form-controls/form-select";
import { JobGradeStepSalaryDialog } from "../../ActivityTab/SalaryIncrement/JobGradeStepSalaryDialog";
import { useAlert } from "../../../notification/useAlert";
import { useNavigateToDetailPage } from "../../useNavigateToDetailPage";

const Errors = ({ errors }: { errors: string[] }) => {
  if (!errors || errors.length === 0) return null;
  return (
    <Stack spacing={1}>
      {errors.map((err, idx) => (
        <Alert severity="error" key={idx}>
          {err}
        </Alert>
      ))}
    </Stack>
  );
};

export const ApproveReemploymentForm = ({
  reemploymentId,
  onClose,
}: {
  reemploymentId: number;
  onClose: () => void;
}) => {
  const { data: reemployment, isLoading } = useGetReemploymentByIdQuery({
    reemploymentId,
  });
  const [approve] = useApproveReemploymentMutation();
  const { data: businessUnitList } = useGetAllBusinessUnitsQuery();

  const isRehire = reemployment?.reemploymentType === ReemploymentType.Rehire;
  const [selectedSalaryType, setSelectedSalaryType] = useState<number | null>(
    0
  );
  const [isStepModalOpen, setIsStepModalOpen] = useState(false);
  const [backendErrors, setBackendErrors] = useState<string[]>([]);
  const setFieldValueRef = useRef<((field: string, value: any) => void) | null>(
    null
  );

  const { data: businessUnitJobList } = useGetJobByBuIdQuery(
    reemployment?.businessUnitId
      ? { id: reemployment.businessUnitId }
      : skipToken
  );

  const { data: GradeInfo } = useGetJobGradeOfJobRoleQuery(
    reemployment?.jobId ? { roleid: reemployment.jobId } : skipToken
  );

  const { showSuccessAlert, showErrorAlert } = useAlert();

  const initialValues = {
    Remark: "",
    FirstName: reemployment?.employeeFirstName ?? "",
    MiddleName: reemployment?.employeeMiddleName ?? "",
    LastName: reemployment?.employeeLastName ?? "",
    AmharicFirstName: reemployment?.amharicFirstName ?? "",
    AmharicMiddleName: reemployment?.amharicMiddleName ?? "",
    AmharicLastName: reemployment?.amharicLastName ?? "",
    Gender: reemployment?.gender ?? 0,
    MartialStatus: reemployment?.martialStatus ?? 0,
    BusinessUnitID: reemployment?.businessUnitId ?? 0,
    JobId: reemployment?.jobId ?? 0,
    BirthDate: reemployment?.birthDate ?? "",
    EmployementDate: "",
    SalaryOnGradeStepId: 0,
  };

  const validationSchema = Yup.object({
    Remark: Yup.string().required("Comment is required"),
    ...(isRehire && {
      FirstName: Yup.string().required("First Name is required"),
      MiddleName: Yup.string().required("Middle Name is required"),
      LastName: Yup.string().required("Last Name is required"),
      AmharicFirstName: Yup.string().required("Amharic First Name is required"),
      AmharicMiddleName: Yup.string().required(
        "Amharic Middle Name is required"
      ),
      AmharicLastName: Yup.string().required("Amharic Last Name is required"),
      Gender: Yup.string().required("Gender is required"),
      MartialStatus: Yup.string().required("Marital Status is required"),
      BusinessUnitID: Yup.number()
        .min(1, "Business Unit is required")
        .required(),
      JobId: Yup.number().min(1, "Job is required").required(),
      BirthDate: Yup.date().required("Birth Date is required"),
      EmployementDate: Yup.date().required("Employment Date is required"),
    }),
  });

  const handleStepConfirm = (step: {
    stepId: number;
    stepNumber: number;
    salary: number;
  }) => {
    const setFieldValue = setFieldValueRef.current;
    if (!setFieldValue) return;
    setFieldValue("SalaryOnGradeStepId", step.stepNumber);
    setSelectedSalaryType(3);
    showSuccessAlert(`Salary step ${step.stepNumber} selected successfully`);
  };

  const handleSalaryOptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selected = Number(event.target.value);
    setSelectedSalaryType(selected);
    const setFieldValue = setFieldValueRef.current;
    if (!setFieldValue) return;
    if (selected === 0 || selected === 10) {
      setFieldValue("SalaryOnGradeStepId", selected);
    } else if (selected === 3) {
      setIsStepModalOpen(true);
    }
  };
  const { navigateToDetailPage } = useNavigateToDetailPage();
  
  const handleSubmit = async (values: typeof initialValues) => {
    setBackendErrors([]); // reset errors

    if (isRehire && (!values.JobId || values.JobId === 0)) {
      showErrorAlert("Please select a valid Job before approving.");
      return;
    }

    const commandPayload: any = {
      ReemploymentId: reemploymentId,
      Remark: values.Remark,
      ...(isRehire && {
        NewEmployeeProfile: removeEmptyFields({
          FirstName: values.FirstName,
          MiddleName: values.MiddleName,
          LastName: values.LastName,
          AmharicFirstName: values.AmharicFirstName,
          AmharicMiddleName: values.AmharicMiddleName,
          AmharicLastName: values.AmharicLastName,
          Gender: values.Gender,
          MartialStatus: values.MartialStatus,
          BusinessUnitID: Number(values.BusinessUnitID),
          JobId: Number(values.JobId),
          BirthDate: dayjs(values.BirthDate).format("YYYY-MM-DD"),
          EmployementDate: dayjs(values.EmployementDate).format("YYYY-MM-DD"),
          SalaryOnGradeStepId: values.SalaryOnGradeStepId ?? null,
        }),
      }),
    };

    try {
      await approve({ approveReemploymentCommand: commandPayload }).unwrap();
      showSuccessAlert("Approved successfully!");
    onClose();
    } catch (err: any) {
      console.error("Approval error:", err);
      if (err?.data?.errors) {
        setBackendErrors(Object.values(err.data.errors).flat() as string[]);
      } else {
        showErrorAlert("Error approving reemployment.");
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;

  const filteredBusinessUnits = businessUnitList?.approved?.map((bu) => ({
    value: bu.id,
    label: bu.name,
  })) as SelectOption[];

  const filteredJobsDynamic = businessUnitJobList
    ?.filter(
      (job) =>
        job.businessUnitId === initialValues.BusinessUnitID && job.isVacant
    )
    .map((job) => ({ value: job.id, label: job.jobRole })) as SelectOption[];

  return (
    <Dialog scroll="paper" maxWidth="md" open={true}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => {
          setFieldValueRef.current = setFieldValue;

          return (
            <Form>
              <DialogHeader title="Approve Reemployment" onClose={onClose} />
              <DialogContent dividers>
                <Grid container spacing={2}>
                  {backendErrors.length > 0 && (
                    <Grid item xs={12}>
                      <Errors errors={backendErrors} />
                    </Grid>
                  )}

                  {isRehire && (
                    <>
                      <Grid item xs={12}>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <FormTextField name="FirstName" label="First Name" />
                          <FormTextField
                            name="MiddleName"
                            label="Middle Name"
                          />
                          <FormTextField name="LastName" label="Last Name" />
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <FormTextField
                            name="AmharicFirstName"
                            label="Amharic First Name"
                          />
                          <FormTextField
                            name="AmharicMiddleName"
                            label="Amharic Middle Name"
                          />
                          <FormTextField
                            name="AmharicLastName"
                            label="Amharic Last Name"
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <FormSelectField
                            name="Gender"
                            label="Gender"
                            options={Object.entries(Gender)
                              .filter(([key]) => isNaN(Number(key)))
                              .map(([label, value]) => ({
                                value: value as number,
                                label: label,
                              }))}
                            disabled
                          />

                          <FormSelectField
                            name="MartialStatus"
                            label="Marital Status"
                            options={Object.entries(MartialStatus)
                              .filter(([key]) => isNaN(Number(key)))
                              .map(([label, value]) => ({
                                value: value as number,
                                label: label,
                              }))}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Box sx={{ display: "flex", gap: 2 }}>
                          <FormSelectField
                            name="BusinessUnitID"
                            label="Business Unit"
                            options={filteredBusinessUnits}
                            onChange={(e: any) => {
                              const setFieldValue = setFieldValueRef.current;
                              if (!setFieldValue) return;
                              const selectedBuId = Number(e.target.value);
                              setFieldValue("BusinessUnitID", selectedBuId);
                              setFieldValue("JobId", 0);
                            }}
                          />

                          {values.BusinessUnitID > 0 && (
                            <FormSelectField
                              name="JobId"
                              label="Job"
                              options={
                                businessUnitJobList
                                  ?.filter(
                                    (job) =>
                                      job.businessUnitId ===
                                        values.BusinessUnitID && job.isVacant
                                  )
                                  .map((job) => ({
                                    value: job.id,
                                    label: job.jobRole,
                                  })) as SelectOption[]
                              }
                            />
                          )}
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <FormTextField
                            name="BirthDate"
                            label="Birth Date"
                            type="date"
                            sx={{ width: "25%" }}
                            disabled
                          />
                          <FormTextField
                            name="EmployementDate"
                            label="Remployment Date"
                            type="date"
                            sx={{ width: "25%" }}
                          />
                          <Box sx={{ width: "50%" }}>
                            <Typography>Salary Settled On</Typography>
                            <RadioGroup
                              row
                              name="SalaryOnGradeStepId"
                              value={selectedSalaryType}
                              onChange={handleSalaryOptionChange}
                            >
                              <FormControlLabel
                                value={0}
                                control={<Radio />}
                                label="Base Salary"
                              />
                              <FormControlLabel
                                value={10}
                                control={<Radio />}
                                label="Ceiling Salary"
                              />
                              <FormControlLabel
                                value={3}
                                control={<Radio />}
                                label="From Step"
                              />
                            </RadioGroup>
                          </Box>
                        </Box>
                      </Grid>
                    </>
                  )}

                  <Grid item xs={12}>
                    <Card
                      elevation={2}
                      sx={{
                        borderRadius: 1,
                        boxShadow: 2,
                        backgroundColor: "#fafafa",
                      }}
                    >
                      <CardContent>
                        <FormTextField
                          name="Remark"
                          label="Comment"
                          multiline
                          minRows={3}
                          fullWidth
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActions>
                <Button type="submit" variant="outlined" color="primary">
                  Save
                </Button>
                <Button onClick={onClose} color="primary" variant="outlined">
                  Cancel
                </Button>
              </DialogActions>

              <JobGradeStepSalaryDialog
                open={isStepModalOpen}
                onClose={() => setIsStepModalOpen(false)}
                steps={(GradeInfo?.jobGrade?.steps ?? []).map((step) => ({
                  id: step.id ?? 0,
                  stepNumber: step.stepNumber ?? 0,
                  salaryAmount: step.salaryAmount ?? 0,
                }))}
                onConfirm={handleStepConfirm}
              />
            </Form>
          );
        }}
      </Formik>
    </Dialog>
  );
};
