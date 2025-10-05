import { Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import {
  DialogHeader,
  FormSelectField,
  FormTextField,
  Errors,
} from "../../../../components";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
} from "@mui/material";
import {
  useAddEmployeeExperienceMutation,
  AddEmployeeExperienceCommand,
} from "../../../../app/api/HCMSApi";
import dayjs from "dayjs";
import { removeEmptyFields } from "../../../../utils";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { useAlert } from "../../../notification";
import { ExperienceType } from "../../../../app/api/enums";
const emptyEmployeeExperience = {
  firmName: "",
  startDate: dayjs().format("YYYY-MM-DD"), // Initialize with formatted date
  endDate: dayjs().format("YYYY-MM-DD"),
  jobTitle: "",
  city: "",
  lastSalary: 0,
  reasonForResignation: "",
  employeeId: 0,
};

export const EmployeeExperience = ({
  onClose,
  experienceType,
}: {
  onClose: () => void;
  experienceType: ExperienceType;
}) => {
  const { showSuccessAlert, showErrorAlert } = useAlert();
  const [EmployeeExpereinceData, setEmployeeExpereinceData] =
    useState<AddEmployeeExperienceCommand>();
  const [addEmployeeExperience, { error: AddingExpereinceError }] =
    useAddEmployeeExperienceMutation();
  const { id } = useParams<{ id: string }>();
  const employeeId = id ? Number(id) : NaN;

  //
  useEffect(
    () =>
      setEmployeeExpereinceData({
        ...emptyEmployeeExperience,
        ...EmployeeExpereinceData,
      }),
    [emptyEmployeeExperience, EmployeeExpereinceData]
  );

  const validationSchema = Yup.object({
    firmName: Yup.string()
      .required("Firm Name is required")
      .max(100, "Firm Name exceeds 100 characters"),

    startDate: Yup.date().required("Start Date is required").nullable(),

    endDate: Yup.date()
      .required("End Date is required")
      .nullable()
      .test(
        "isAfterStartDate",
        "End Date must be after Start Date",
        function (value) {
          const { startDate } = this.parent;
          return !startDate || !value || new Date(value) >= new Date(startDate);
        }
      )
      .test(
        "minFiveMonths",
        "Experience duration must be at least 6 months",
        function (value) {
          const { startDate } = this.parent;
          if (!startDate || !value) return true;

          const start = new Date(startDate);
          const end = new Date(value);

          const yearDiff = end.getFullYear() - start.getFullYear();
          const monthDiff = end.getMonth() - start.getMonth();
          const totalMonths = yearDiff * 12 + monthDiff;

          return totalMonths >= 6;
        }
      ),

    jobTitle: Yup.string()
      .required("Job Title is required")
      .max(50, "Job Title exceeds 50 characters"),

    city: Yup.string()
      .required("City is required")
      .max(50, "City exceeds 50 characters"),

    lastSalary: Yup.number()
      .typeError("Last Salary must be a number")
      .required("Last Salary is required")
      .positive("Salary must be a positive number"),

    reasonForResignation: Yup.string()
      .required("Reason for Resignation is required")
      .max(150, "Reason for Resignation exceeds 150 characters"),
  });

  //
  const handleSubmit = useCallback(
    (values: AddEmployeeExperienceCommand) => {
      const startDate = dayjs(values.startDate).format("YYYY-MM-DD");
      const endDate = dayjs(values.endDate).format("YYYY-MM-DD");
      const payload = removeEmptyFields({
        ...values,
        startDate,
        endDate,
        employeeId,
        experienceType,
      });
      addEmployeeExperience({
        addEmployeeExperienceCommand: payload,
      })
        .unwrap()
        .then((response: any) => {
          showSuccessAlert("Employee Experience Added Successfully");
          setEmployeeExpereinceData(response);
          onClose();
        })
        .catch((error: any) => {
          // showErrorAlert("Failed to Add Employee Experience");
          //onClose();
        });
    },
    [onClose, addEmployeeExperience]
  );
  const errors =
    (AddingExpereinceError as any)?.data?.errors ||
    (AddingExpereinceError as any)?.data?.errors;

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
    >
      {!!EmployeeExperience && (
        <Formik
          initialValues={EmployeeExpereinceData || emptyEmployeeExperience}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validateOnChange={true}
          validationSchema={validationSchema}
        >
          {({ values, handleChange, handleBlur, setFieldValue }) => (
            <Form>
              <DialogHeader title="Add Employee Experience" onClose={onClose} />
              <DialogContent dividers>
                <Grid container spacing={2}>
                  {/* Employee Experience Details */}
                  {errors && (
                    <Grid item xs={12}>
                      <Errors errors={errors as any} />
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <FormTextField
                        name="firmName"
                        label="Firm Name"
                        type="text"
                        value={values.firmName || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <FormTextField
                        name="startDate"
                        label="Start Date"
                        type="date"
                        value={values.startDate || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        sx={{ width: "40%" }}
                      />
                      <FormTextField
                        name="endDate"
                        label="End Date"
                        type="date"
                        value={values.endDate || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        sx={{ width: "40%" }}
                      />
                    </Box>
                  </Grid>

                  {/* Job Title, City, Last Salary */}
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <FormTextField
                        name="jobTitle"
                        label="Job Title"
                        type="text"
                        value={values.jobTitle || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <FormTextField
                        name="city"
                        label="City"
                        type="text"
                        value={values.city || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <FormTextField
                        name="lastSalary"
                        label="Last Salary"
                        type="number"
                        value={values.lastSalary || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <FormTextField
                        name="reasonForResignation"
                        label="Reason for Resignation"
                        type="text"
                        value={values.reasonForResignation || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </DialogContent>

              {/* Dialog Actions */}
              <DialogActions>
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
