import { Form, Formik, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import {
  DialogHeader,
  Errors,
  FormSelectField,
  FormTextField,
} from "../../../components";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  InputAdornment,
} from "@mui/material";
import {
  JobGradeDto,
  useUpdateJobGradeMutation,
} from "../../../app/api/HCMSApi";
import { useAlert } from "../../notification";
import { getEnumOptions } from "../../../components/form-controls/get-enum-list";
import { JobGradeRomanId } from "../../../app/api/enums";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Name of the JobGrade is required")
    .max(50, "Name exceeds 50 characters"),
  description: Yup.string()
    .required("Description is required")
    .max(200, "Description exceeds 200 characters"),
  baseSalary: Yup.number()
    .typeError("Base Salary must be a number")
    .required("Base Salary is required")
    .positive("Base Salary must be greater than zero"),
  stepCoefficient: Yup.number()
    .typeError("Step Coefficient must be a number")
    .required("Step Coefficient is required")
    .min(0, "Step Coefficient must be at least 0")
    .max(100, "Step Coefficient must be less than or equal to 100"),
  jobGradeRomanId: Yup.number().required("Job Grade Roman ID is required"),
});



export const UpdateJobGradeDialog = ({
  onClose,
  JobGrade,
}: {
  onClose: () => void;
  JobGrade: JobGradeDto;
}) => {
  const [updateJobGrade, { error }] = useUpdateJobGradeMutation();
  const { showSuccessAlert, showErrorAlert } = useAlert();
  const handleSubmit = async (values: JobGradeDto) => {
    const Payload={
      jobGradeId:values.jobGradeId,
      jobGradeRomanId: values.jobGradeRomanId,
      name: values.name,
      baseSalary: values.baseSalary,
      stepCoefficient: values.stepCoefficient,
      description: values.description,
    };
    try {
      await updateJobGrade({ updateJobGradeCommand: Payload }).unwrap();
      showSuccessAlert("Job Grade updated successfully");
      onClose();
    } catch (err: any) {
      const message =
        err?.data?.detail ||
        err?.message ||
        "An error occurred while updating the job grade.";
      showErrorAlert(message);
    }
  };

  const CeilingCalculator = () => {
    const { values, setFieldValue } = useFormikContext<JobGradeDto>();
  
    useEffect(() => {
      if (values.baseSalary && values.stepCoefficient !== undefined) {
        const coefficient = values.stepCoefficient / 100;
        let salary = values.baseSalary;
        let stepNumber = 0;
  
        while (stepNumber < 10) {
          salary += salary * coefficient;
          stepNumber++;
        }
  
        const finalCeiling = parseFloat(salary.toFixed(2));
        setFieldValue("ceilingSalary", finalCeiling);
      }
    }, [values.baseSalary, values.stepCoefficient, setFieldValue]);
  
    return null;
  };
  
  const fieldErrors = (error as any)?.data?.errors;

  return (
    <Dialog scroll="paper" disableEscapeKeyDown maxWidth="md" open={true}>
      <Formik
        initialValues={{ ...JobGrade }}
        enableReinitialize
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        validateOnChange
      >
        <Form>
          <DialogHeader title="Update Job Grade" onClose={onClose} />
          <DialogContent dividers>
            <Grid container spacing={2}>
              {fieldErrors && (
                <Grid item xs={12}>
                  <Errors errors={fieldErrors} />
                </Grid>
              )}
              <Grid item xs={12}>
                <FormSelectField
                  name="jobGradeRomanId"
                  label="Job Grade Roman ID"
                  options={getEnumOptions(JobGradeRomanId)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormTextField name="name" label="Job Grade Name" />
              </Grid>
              <Grid item xs={12}>
                <FormTextField
                  name="baseSalary"
                  label="Base Salary"
                  type="number"
                  inputMode="decimal"
                />
              </Grid>
              <Grid item xs={12}>
                <FormTextField
                  name="stepCoefficient"
                  label="Step Coefficient (%)"
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormTextField
                  name="ceilingSalary"
                  label="Ceiling Salary"
                  type="number"
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <FormTextField
                  name="description"
                  label="Description"
                  multiline
                  minRows={4}
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" color="primary" variant="outlined">
              Update
            </Button>
          </DialogActions>
          <CeilingCalculator />
        </Form>
      </Formik>
    </Dialog>
  );
};
