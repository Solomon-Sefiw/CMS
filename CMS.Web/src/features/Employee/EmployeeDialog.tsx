import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  DialogHeader,
  Errors,
  FormSelectField,
  FormTextField,
  SelectOption,
} from "../../components";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import {
  CreateEmployeeProfileCommand,
  useCreateEmployeeProfileMutation,
  useGetJobByBuIdQuery,
  useGetJobGradeOfJobRoleQuery,
} from "../../app/api/HCMSApi";
import {
  EmployeeDto,
  useGetAllBusinessUnitsQuery,
  useUpdateEmployeeMutation,
} from "../../app/api";
import dayjs from "dayjs";
import { removeEmptyFields } from "../../utils";
import * as Yup from "yup";
import { useAlert } from "../notification";
import { ApprovalStatus, Gender, MartialStatus } from "../../app/api/enums";
import { getEnumOptions } from "../../components/form-controls/get-enum-list";
import { useNavigateToDetailPage } from "./useNavigateToDetailPage";
import { Form, Formik } from "formik";
import { skipToken } from "@reduxjs/toolkit/query";
import { JobGradeStepSalaryDialog } from "./JobGradeStepSalaryDialog";
import { EmploymentType } from "../../app/api/enums";
const emptyEmployeeData = {
  firstName: "",
  middleName: "",
  lastName: "",
  amharicFirstName: "",
  amharicMiddleName: "",
  amharicLastName: "",
  businessUnitID: 0,
  jobId: 0,
  birthDate: "",
  employementDate: "",
  gender: 1,
  martialStatus: 1,
  salaryOnGradeStepId: 0,
  pensionID:'',
  tinNumber:'',
  employmentType:1,
} as any;

export const EmployeeDialog = ({
  onClose, // This onClose now also triggers refetch in parent
  title,
  employee,
  businessUnitId,
}: {
  onClose: () => void;
  title: string;
  employee?: EmployeeDto;
  businessUnitId?: number;
}) => {
  const [employeeData, setEmployeeData] =
    useState<CreateEmployeeProfileCommand>();

  //   const [selectedBu, setSelectedBu] =
  // useState<CreateEmployeeProfileCommand>();

  const [addEmployee, { error: addEmployeeErr }] =
    useCreateEmployeeProfileMutation();
  const { navigateToDetailPage } = useNavigateToDetailPage();
  const [updateEmployee, { error: updateEmployeeErr }] =
    useUpdateEmployeeMutation();

  const { showSuccessAlert, showErrorAlert } = useAlert();
  const { data: businessUnitList } = useGetAllBusinessUnitsQuery();

  const { data: businessUnitJobList } = useGetJobByBuIdQuery({
    id: businessUnitId,
    employeeId: employee?.id,
  });
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("First Name is required.")
      .matches(/^[a-zA-Z]+$/, "First name must contain only letters.")
      .max(50, "First Name cannot exceed 50 characters."),

    middleName: Yup.string()
      .required("Middle Name is required.")
      .matches(/^[a-zA-Z]+$/, "Middle name must contain only letters.")
      .max(50, "Middle Name cannot exceed 50 characters."),

    lastName: Yup.string()
      .required("Last Name is required.")
      .matches(/^[a-zA-Z]+$/, "Last name must contain only letters.")
      .max(50, "Last Name cannot exceed 50 characters."),

    amharicFirstName: Yup.string()
      .required("Amharic First Name is required.")
      .matches(
        /^[\u1200-\u137F]+$/,
        "Amharic First Name must contain only Amharic characters."
      )
      .max(50, "Amharic First Name cannot exceed 50 characters."),

    amharicMiddleName: Yup.string()
      .required("Amharic Middle Name is required.")
      .matches(
        /^[\u1200-\u137F]+$/,
        "Amharic Middle Name must contain only Amharic characters."
      )
      .max(50, "Amharic Middle Name cannot exceed 50 characters."),

    amharicLastName: Yup.string()
      .required("Amharic Last Name is required.")
      .matches(
        /^[\u1200-\u137F]+$/,
        "Amharic Last Name must contain only Amharic characters."
      )
      .max(50, "Amharic Last Name cannot exceed 50 characters."),

    gender: Yup.string().required("Gender is required."),

    martialStatus: Yup.string().required("Marital Status is required."),

    businessUnitID: Yup.number()
      .required("Business Unit is required.")
      .min(1, " Business Unit is Required."),

    jobId: Yup.number()
      .typeError("Invalid Job selection.")
      .min(1, " Job is Required."),

    birthDate: Yup.date()
      .required("Birth Date is required.")
      .max(new Date(), "Birth Date cannot be in the future."),

    employementDate: Yup.date()
      .required("Employment Date is required.")
      .min(Yup.ref("birthDate"), "Employment Date cannot be before Birth Date.")
      .max(new Date(), "Employment Date cannot be in the future."),
  });

  useEffect(() => {
    setEmployeeData({
      ...emptyEmployeeData,
      ...employee,
      jobId: employee?.jobId || 0,
      businessUnitID: businessUnitId || employee?.businessUnitID || 0,
      employmentType: employee?.employmentType || 1, 
    });
  }, [employee, businessUnitId]);

  const handleSubmit = useCallback(
    async (values: any) => {
      const birthDate = dayjs(values.birthDate).format("YYYY-MM-DD");
      const employementDate =
        values.employementDate &&
        dayjs(values.employementDate).format("YYYY-MM-DD");

      const payload = removeEmptyFields({
        ...values,
        birthDate,
        employementDate,
      });

      try {
        if (employee?.id) {
          // Create a comparable original payload from the employee prop
          const originalPayload = removeEmptyFields({
            ...employee,
            birthDate: employee.birthDate
              ? dayjs(employee.birthDate).format("YYYY-MM-DD")
              : "",
            employementDate: employee.employementDate
              ? dayjs(employee.employementDate).format("YYYY-MM-DD")
              : "",
          });

          // Perform a deep comparison to check for changes
          const hasChanges = Object.keys(payload).some((key) => {
            const originalValue = (originalPayload as any)[key];
            const currentValue = payload[key];

            if (
              key === "gender" ||
              key === "martialStatus" ||
              key === "businessUnitID" ||
              key === "jobId"
            ) {
              return Number(currentValue) !== Number(originalValue);
            }
            return currentValue !== originalValue;
          });

          if (!hasChanges) {
            showSuccessAlert(
              "No changes detected. Employee information was not updated."
            );
            onClose(); // Just close, no API call needed
            return;
          }

          await updateEmployee({ updateEmployeeCommand: payload }).unwrap();
          showSuccessAlert("Employee Info updated successfully!");
          onClose(); // Call onClose here, which now triggers parent refetch
        } else {
          const result = await addEmployee({
            createEmployeeProfileCommand: payload,
          }).unwrap();
          if (result.id && result.versionNumber !== undefined) {
            navigateToDetailPage({
              id: result.id as any,
              versionNumber: result.versionNumber as any,
            })();
            showSuccessAlert("New employee created successfully!");
          } else {
            console.warn(
              "New employee creation successful, but id or versionNumber missing from result:",
              result
            );
          }
          onClose(); // Call onClose here, which now triggers parent refetch (if it leads to this page)
        }
      } catch (error: any) {
        const errorMessage = error?.data?.detail || "Error saving employee";
        showErrorAlert(errorMessage);
      }
    },
    [
      onClose, // Dependency for useCallback
      addEmployee,
      updateEmployee,
      employee, // employee is needed for comparing original data
      navigateToDetailPage,
      showErrorAlert,
      showSuccessAlert, // Added this dependency for showSuccessAlert
    ]
  );

  const errors = (employee?.id ? updateEmployeeErr : (addEmployeeErr as any))
    ?.data?.errors;
  const [isStepModalOpen, setIsStepModalOpen] = useState(false);
  const [SelecteSalaryType, setSelecteSalaryType] = useState<number | null>(
    null
  );
  const [step, setStep] = useState<number>(0);
  const [jobRoleId, setJobRoleId] = useState<number | undefined>();
  const valuesRef = useRef<any>(null);
  const setFieldValueRef = useRef<((field: string, value: any) => void) | null>(
    null
  );
  //
  const [selectedJobIdFromForm, setSelectedJobIdFromForm] = useState<number>(0);
  useEffect(() => {
    const jobIdFromFormik = valuesRef.current?.jobId;
    if (jobIdFromFormik && jobIdFromFormik !== selectedJobIdFromForm) {
      setSelectedJobIdFromForm(jobIdFromFormik);
    }
  }, [valuesRef.current?.jobId]);
  useEffect(() => {
    if (!selectedJobIdFromForm || !businessUnitJobList?.length) return;

    const selectedJob = businessUnitJobList.find(
      (job) => job.id === selectedJobIdFromForm
    );
    if (selectedJob?.jobRoleId) {
      setJobRoleId(selectedJob.jobRoleId);
    }
  }, [selectedJobIdFromForm, businessUnitJobList]);
  const { data: GradeInfo } = useGetJobGradeOfJobRoleQuery(
    jobRoleId ? { roleid: jobRoleId } : skipToken
  );

  useEffect(() => {
    if (employeeData) {
      const salaryId = employeeData.salaryOnGradeStepId ?? 0;
      if (salaryId === 0) setSelecteSalaryType(0);
      else if (salaryId === 10) setSelecteSalaryType(10);
      else if (salaryId > 0) setSelecteSalaryType(3);
      else setSelecteSalaryType(0);
    }
  }, [employeeData]);

  // --- Handle Salary Option Change ---
  const handleSalaryOptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selected = Number(event.target.value);
    setSelecteSalaryType(selected);
    //
    const setFieldValue = setFieldValueRef.current;
    if (!setFieldValue) return;

    if (selected === 0) {
      setFieldValue("salaryOnGradeStepId", 0); // insert 0
    } else if (selected === 10) {
      setFieldValue("salaryOnGradeStepId", 10); // insert 10
    } else if (selected === 3) {
      setIsStepModalOpen(true);
    }
  };

  // --- Handle Step Selection ---
  const handleStepConfirm = (step: {
    stepId: number;
    stepNumber: number;
    salary: number;
  }) => {
    setStep(step.stepNumber);
    const setFieldValue = setFieldValueRef.current;
    if (!setFieldValue) return;
    setFieldValue("salaryOnGradeStepId", step.stepNumber); // Set actual step ID
    setSelecteSalaryType(3);
  };
  //
  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
    >
      {!!employeeData && (
        <Formik
          initialValues={employeeData as any}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          validateOnChange={true}
        >
          {({ values, setFieldValue }) => {
            valuesRef.current = values;
            setFieldValueRef.current = setFieldValue;

            const filteredBusinessUnits = businessUnitList?.approved
              ?.filter((bu) =>
                businessUnitId ? bu.id === businessUnitId : true
              )
              .map((bu) => ({
                value: bu.id,
                label: bu.name,
              })) as SelectOption[];

            const filteredJobs = businessUnitJobList
              ?.filter((job) => {
                const belongsToSelectedBusinessUnit =
                  job.businessUnitId === values.businessUnitID;
                const isAvailableForSelection = employee?.id
                  ? job.id === employee.jobId || job.isVacant === true
                  : job.isVacant === true;
                 const statusApproval= job.approvalStatus===ApprovalStatus.Approved;
                return belongsToSelectedBusinessUnit && isAvailableForSelection && statusApproval;
              })
              .map((job) => ({
                value: job.id,
                label: job.jobRole,
              })) as SelectOption[];

            return (
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
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <FormTextField
                          name="firstName"
                          label="Employee First Name"
                          type="text"
                        />
                        <FormTextField
                          name="middleName"
                          label="Employee Middle Name"
                          type="text"
                        />
                        <FormTextField
                          name="lastName"
                          label="Employee Last Name"
                          type="text"
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <FormTextField
                          name="amharicFirstName"
                          label="Amharic First Name"
                          type="text"
                        />
                        <FormTextField
                          name="amharicMiddleName"
                          label="Amharic Middle Name"
                          type="text"
                        />
                        <FormTextField
                          name="amharicLastName"
                          label="Amharic Last Name"
                          type="text"
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <FormSelectField
                          name="gender"
                          label="Gender"
                          options={getEnumOptions(Gender)}
                        />

                        <FormSelectField
                          name="martialStatus"
                          label="Marital Status"
                          options={getEnumOptions(MartialStatus)}
                        />
                      </Box>
                    </Grid>
                    {/* {/* new created */}
                        <Grid item xs={12}>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <FormTextField
                          name="tinNumber"
                          label="Tin Number"
                          type="text"
                        />

                        <FormTextField
                          name="pensionID"
                          label="Pension ID"
                          type="text"
                        />
                        <FormSelectField
                          name="employmentType"
                          label="Employment Type"
                          options={getEnumOptions(EmploymentType)}
                        />
                      </Box>
                    </Grid> 
                    {/*  */}
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormSelectField
                      name="businessUnitID"
                      label="Business Unit"
                      type="number"
                      options={filteredBusinessUnits}
                      disabled={!!businessUnitId}
                      fullWidth
                    />
                  </Grid>
              
                     {values.businessUnitID > 0 && (
                      <Grid item xs={6}>
                         <Autocomplete
                          options={filteredJobs || []}
                          getOptionLabel={(option) => option.label}
                          isOptionEqualToValue={(option, value) => option.value === value?.value}
                          value={(filteredJobs || []).find(job => job.value === values.jobId) || null}
                          onChange={(event, newValue) => {
                            setFieldValue('jobId', newValue?.value || 0);
                          }}
                          renderInput={(params) => (
                            <FormTextField {...params} label="Job" name="jobId" fullWidth />
                          )}
                          filterOptions={(options, params) => {
                            const input = params.inputValue.toLowerCase();
                        
                            if (input.length < 3) return [];
                        
                            return options.filter((option) =>
                              option.label.toLowerCase().includes(input)
                            );
                          }}
                        />
                       </Grid>
                     )}
                   </Grid>
                 </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <FormTextField
                          name="birthDate"
                          label="Birth Date"
                          type="date"
                          sx={{ width: "25%" }}
                        />
                        <FormTextField
                          name="employementDate"
                          label="Employment Date"
                          type="date"
                          sx={{ width: "25%" }}
                        />
                        <Box sx={{ width: "50%" }}>
                          <Typography> Salary Setteled On </Typography>

                          <RadioGroup
                            row
                            name="SalaryOnGradeStepId"
                            value={SelecteSalaryType}
                            onChange={(e) => {
                              handleSalaryOptionChange(e);
                            }}
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
                  </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                  <Button onClick={onClose}>Cancel</Button>
                  <Button color="primary" variant="outlined" type="submit">
                    Save
                  </Button>
                </DialogActions>
              </Form>
            );
          }}
        </Formik>
      )}
      <JobGradeStepSalaryDialog
        open={isStepModalOpen}
        onClose={() => setIsStepModalOpen(false)}
        steps={(GradeInfo?.jobGrade?.steps ?? []).map((step) => ({
          id: step.id ?? 0,
          stepNumber: step.stepNumber ?? 0, // default to 0 if undefined
          salaryAmount: step.salaryAmount ?? 0, // default to 0 if undefined  handleStepConfirmBefore
        }))}
        onConfirm={handleStepConfirm}
      />
    </Dialog>
  );
};
