import { Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import {
  DialogHeader,
  FormSelectField,
  FormTextField,
  Errors,
} from "../../../components";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
} from "@mui/material";
import { JobRole, useAddJobRoleMutation } from "../../../app/api/HCMSApi";
import { useJobCategory } from "../JobCatagory/useJobCatagories";
import { useJobGrade } from "../JobGrade/useJobGrade";
import { useJobRoleCategories } from "./useJobRoleCatagories";
import { FormRichTextField } from "../../../components/form-controls/from-reach-text";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import * as Yup from "yup";
import { BenefitSelector } from "./BenefitSelector";
import { useAlert } from "../../notification";

const emptyjobRoleData = {
  roleName: "",
  description: "",
  jobCatagoryId: "",
  jobRoleCategoryId: "",
  jobGradeId: "",
  benefits: [],
} as any;

export const JobRoleDialog = ({ onClose }: { onClose: () => void }) => {
  const [jobRoleData, setJobRole] = useState<JobRole>();
  const [message, setMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<"success"|"info" | "error">();
  const { showSuccessAlert, showErrorAlert } = useAlert();
  const [addJobRole, { error: AddJobRoleError }] = useAddJobRoleMutation();
  const { jobCategoriesLookups } = useJobCategory();
  const { JobGradesLookups } = useJobGrade();
  const { jobRoleCatagoriesLookups } = useJobRoleCategories();

  useEffect(() => {
    setJobRole({
      ...emptyjobRoleData,
      ...jobRoleData,
    });
  }, [emptyjobRoleData, jobRoleData]);

  const validationSchema = Yup.object({
    roleName: Yup.string()
      .required("Job Role Name is Required")
      .max(100, "Job Role Name exceeds 100 characters"),
    jobCatagoryId: Yup.number().required("Job Role Catagory is Required"),
    jobRoleCategoryId: Yup.number().required("Job Role Role Catagory is Required"),
    jobGradeId: Yup.number().required("Job Role Grade is Required"),
    description: Yup.string()
                    .required("The Job Description is Required")
                    .max(200,"Job Role description exceeds 200 characters"),
    benefits: Yup.array().of(
      Yup.object().shape({
        benefitId: Yup.number().required(),
        benefitValueId: Yup.number().required("Select a value for the benefit"),
      })
    ),
  });

  const handleSubmit = useCallback(
    (values: JobRole) => {
      addJobRole({
        addJobRoleCommand: values,
      })
        .unwrap()
        .then(() => {
          setAlertSeverity("info");
          showSuccessAlert("JobRole Added successfully!");
           onClose();
          
        })
        .catch(() => {
          setAlertSeverity("error");
          showErrorAlert("Failed to add Job Role. Please try again.");
        });
    },
    [onClose, addJobRole]
  );

  const errors = (AddJobRoleError as any)?.data?.errors;

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
      fullWidth
    >
      {!!jobRoleData && (
        <Formik
          initialValues={jobRoleData}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          validateOnChange={true}
          validateOnBlur={true}
          validateOnSubmit={true}
        >
          <Form>
            <DialogHeader title="Add Job Role" onClose={onClose} />
            <DialogContent dividers={true}>
              <Grid container spacing={2}>

                {errors && (
                  <Grid item xs={12}>
                    <Errors errors={errors as any} />
                  </Grid>
                )}
                <Grid item xs={6}>
                  <FormTextField
                    name="roleName"
                    label="Job Role Name"
                    type="text"
                    alwaysShowError={true}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <FormSelectField
                      name="jobCatagoryId"
                      label="Job Catagory"
                      type="number"
                      options={jobCategoriesLookups}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <FormSelectField
                      name="jobRoleCategoryId"
                      label="Job Role Catagory"
                      type="number"
                      options={jobRoleCatagoriesLookups}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <FormSelectField
                      name="jobGradeId"
                      label="Job Grade"
                      type="number"
                      options={JobGradesLookups}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <BenefitSelector selectedBenefitsField="benefits" />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <FormRichTextField name="description" />
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
        </Formik>
      )}
    </Dialog>
  );
};
