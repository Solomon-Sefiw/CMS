import { Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import {
  DialogHeader,
  Errors,
  FormSelectField,
  FormTextField,
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
  UpdateEmployeeExperienceCommand,
  useUpdateEmployeeExperienceMutation,
  useUpdateEmployeeFamilyMutation,
  useGetFamilyQuery,
  EmployeeFamily,
} from "../../../../app/api/HCMSApi";
import {
  UpdateEmployeeFamilyCommand,
  enums,
  AddEmployeeExperienceCommand,
  useGetEmployeeExperienceByIdQuery,
} from "../../../../app/api";
import dayjs from "dayjs";
import { removeEmptyFields } from "../../../../utils";
import { useParams } from "react-router-dom";
import { ExperienceType, FamilyType } from "../../../../app/api/enums";
import * as Yup from "yup";
import { useAlert } from "../../../notification";

const emptyEmployeeExperience: UpdateEmployeeExperienceCommand = {
  firmName: "",
  startDate: undefined, // ✅ valid
  endDate: undefined, // ✅ valid
  jobTitle: "",
  city: "",
  lastSalary: 0,
  reasonForResignation: "",
  employeeId: 0,
};

interface EmployeeExperienceUpdateProps {
  onClose: () => void;
  Id?: number;
  experienceType: ExperienceType;
}

export const EmployeeExperienceUpdate = ({
  onClose,
  Id,
  experienceType,
}: EmployeeExperienceUpdateProps) => {
  const { showSuccessAlert, showErrorAlert } = useAlert();

  const [EmployeeExpereince, setEmployeeExpereince] =
    useState<UpdateEmployeeExperienceCommand>(emptyEmployeeExperience);
  const [UpateEmployeeExperience, { error: UpdateExperienceError }] =
    useUpdateEmployeeExperienceMutation();
  const { id } = useParams<{ id: string }>();
  const employeeId = Id ? Number(Id) : NaN;
  const {
    data: EmployeeExperienceInfo,
    isLoading,
    error,
  } = useGetEmployeeExperienceByIdQuery({ id: employeeId });

  useEffect(() => {
    if (EmployeeExperienceInfo && typeof EmployeeExperienceInfo === "object") {
      const rawData = Array.isArray(EmployeeExperienceInfo)
        ? EmployeeExperienceInfo[0]
        : EmployeeExperienceInfo;

      setEmployeeExpereince({
        ...emptyEmployeeExperience,
        id: rawData.id,
        firmName: rawData.firmName ?? "",
        startDate: rawData.startDate ?? undefined,
        endDate: rawData.endDate ?? undefined,
        jobTitle: rawData.jobTitle ?? "",
        city: rawData.city ?? "",
        lastSalary: rawData.lastSalary ?? 0,
        reasonForResignation: rawData.reasonForResignation ?? "",
        employeeId: rawData.employeeId ?? 0,
      });
    }
  }, [EmployeeExperienceInfo]);

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

  const handleSubmit = useCallback(
    (values: UpdateEmployeeExperienceCommand) => {
      const startDate = dayjs(values.startDate).format("YYYY-MM-DD");
      const endDate = dayjs(values.endDate).format("YYYY-MM-DD");
      const payload = removeEmptyFields({
        ...values,
        startDate,
        endDate,
      });
      UpateEmployeeExperience({
        updateEmployeeExperienceCommand: payload,
      })
        .unwrap()
        .then((response: any) => {
          showSuccessAlert("Employee Experience Updated Successfully");
          setEmployeeExpereince(response);
          onClose();
        })
        .catch((error: any) => {
          // showErrorAlert("Failed to Update Employee Experience");
        });
    },
    [onClose, UpateEmployeeExperience]
  );
  const errors =
    (UpdateExperienceError as any)?.data?.errors ||
    (UpdateExperienceError as any)?.data?.errors;

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
    >
      {!!EmployeeExpereince && (
        <Formik
          initialValues={EmployeeExpereince || emptyEmployeeExperience}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validateOnChange={true}
          validationSchema={validationSchema}
        >
          {({ values, handleChange, handleBlur, setFieldValue }) => (
            <Form>
              <DialogHeader
                title="Update Employee Experience"
                onClose={onClose}
              />
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

                  {/* Reason for Resignation */}
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
