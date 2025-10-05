import { Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
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
} from "@mui/material";
import {
  AddJobGradeCommand,
  JobGrade,
  JobGradeDto,
  JobGradeStep,
  useAddJobGradeMutation,
  useUpdateJobGradeMutation,
} from "../../../app/api/HCMSApi";
import { useAlert } from "../../notification";
import { getEnumOptions } from "../../../components/form-controls/get-enum-list";
import { JobGradeRomanId } from "../../../app/api/enums";
import * as Yup from "yup";
import InputAdornment from "@mui/material/InputAdornment";

const emptyjobGradeData = {
  jobGradeRomanId: undefined,
  jobGradeId: undefined,
  name: "",
  baseSalary: 0.0,
  stepCoefficient: 0,
  ceilingSalary: null,
  description: "",
} as any;

export const JobGradeDialog = ({
  onClose,
  JobGrade,
}: {
  onClose: () => void;
  JobGrade?: JobGradeDto;
}) => {
  const [jobGradeData, setJobGrade] = useState<JobGradeDto>();

  const [addJobGrade, { error: AddJobGradeError }] = useAddJobGradeMutation();
  const [updateJobGrade, { error: UpdateJobGradeError }] =
    useUpdateJobGradeMutation();
  const { showSuccessAlert, showErrorAlert } = useAlert();

  useEffect(() => {
    setJobGrade({
      ...emptyjobGradeData,
      ...JobGrade,
      jobGradeRomanId: JobGrade?.jobGradeRomanId as unknown as JobGradeRomanId,
    });
  }, [emptyjobGradeData, JobGrade?.jobGradeId]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name of the JobGrade  is Required")
      .max(50, "Name exceeds 50 characters"),
    description: Yup.string()
      .required("Last Name is required")
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
  const handleSubmit = useCallback(
    async (values: JobGradeDto) => {
      const payload = {
        ...values,
      };

      try {
        if (JobGrade?.jobGradeId) {
          await updateJobGrade({ updateJobGradeCommand: payload }).unwrap();
          showSuccessAlert("JobGrade Updated Successfully");
          onClose();
        } else {
          await addJobGrade({ addJobGradeCommand: payload }).unwrap();
          showSuccessAlert("JobGrade Added Successfully");
          onClose();
        }
      } catch (error: any) {
        let errorMessage = "";
        if (error?.data?.detail) {
          errorMessage += `${error.data.detail}`;
        }
        if (error?.message) {
          errorMessage += ` ${error.message}`;
        }
        // if (error?.status === 400) {
        //   errorMessage +=
        //     "CeilingSalary is invalid,please not set value if you want to calculate by system";
        // }
        // showErrorAlert(errorMessage);
      }
    },
    [JobGrade?.jobGradeId, addJobGrade, updateJobGrade, onClose]
  );
  const errors = (
    JobGrade?.jobGradeId ? UpdateJobGradeError : (AddJobGradeError as any)
  )?.data?.errors;
  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
    >
      {!!jobGradeData && (
        <Formik
          initialValues={jobGradeData}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          validateOnChange={true}
        >
          <Form>
            {JobGrade?.jobGradeId ? (
              <DialogHeader title="Update Job Grade" onClose={onClose} />
            ) : (
              <DialogHeader title="Add Job Grade" onClose={onClose} />
            )}
            <DialogContent dividers={true}>
              <Grid container spacing={2}>
                {errors && (
                  <Grid item xs={12}>
                    <Errors errors={errors as any} />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <FormSelectField
                    name="jobGradeRomanId"
                    label="JobGradeRomanId"
                    options={getEnumOptions(JobGradeRomanId)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormTextField
                    name="name"
                    label="Job Grade Name"
                    type="text"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormTextField
                    name="baseSalary"
                    label="JobGrade Base Salary"
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

                {/* <Grid item xs={12}>
                  <FormTextField
                    name="ceilingSalary"
                    label="Ceiling Salary"
                    type="number"
                  />
                </Grid> */}

                <Grid item xs={12}>
                  <FormTextField
                    name="description"
                    type="text"
                    placeholder="Description"
                    label="Description"
                    fullWidth
                    multiline
                    minRows={5}
                    variant="outlined"
                  />
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
        </Formik>
      )}
    </Dialog>
  );
};
