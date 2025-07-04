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
import {
  CreateEmployeeProfileCommand,
  useCreateEmployeeProfileMutation,
  useGetJobByBuIdQuery,
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
import { Gender, MartialStatus } from "../../app/api/enums";
import { getEnumOptions } from "../../components/form-controls/get-enum-list";
import { useNavigateToDetailPage } from "./useNavigateToDetailPage";
import { Form, Formik } from "formik";

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

  const {data:businessUnitJobList}=useGetJobByBuIdQuery({
    id:businessUnitId,
    employeeId:employee?.employeeId
  })
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
          {({ values }) => {
            const filteredBusinessUnits = businessUnitList?.approved
              ?.filter((bu) => (businessUnitId ? bu.id === businessUnitId : true))
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
                return belongsToSelectedBusinessUnit && isAvailableForSelection;
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
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <FormSelectField
                          name="businessUnitID"
                          label="Business Unit"
                          type="number"
                          options={filteredBusinessUnits}
                          disabled={!!businessUnitId}
                        />
                        {values.businessUnitID > 0 && (
                          <FormSelectField
                            name="jobId"
                            label="Job "
                            type="number"
                            options={filteredJobs}
                          />
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <FormTextField
                          name="birthDate"
                          label="Birth Date"
                          type="date"
                        />
                        <FormTextField
                          name="employementDate"
                          label="Employment Date"
                          type="date"
                        />
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
    </Dialog>
  );
};