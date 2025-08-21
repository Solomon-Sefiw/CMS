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
import {
  JobRoleDto,
  useUpdateJobRoleMutation,
  useGetJobRoleByIdQuery,
  JobRole,
} from "../../../app/api/HCMSApi";
import { useJobCategory } from "../JobCatagory/useJobCatagories";
import { useJobGrade } from "../JobGrade/useJobGrade";
import { useJobRoleCategories } from "./useJobRoleCatagories";
import { FormRichTextField } from "../../../components/form-controls/from-reach-text";
import { useAlert } from "../../notification";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import * as Yup from "yup";
import { BenefitSelector } from "./BenefitSelector";
import { FormAutocompleteField } from "./FormAutocompleteField";
const emptyjobRoleData = {
  roleName: "",
  jobCatagoryId: "",
  jobRoleCategoryId: "",
  jobGradeId: "",
  description: "",
  benefits: [],
} as any;
interface JobRoleUpdateDialogProps {
  onClose: () => void;
  Id?: number;
}
export const JobRoleUpdateDialog = ({
  onClose,
  Id,
}: JobRoleUpdateDialogProps) => {
  const [message, setMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<
    "success" | "info" | "error"
  >();
  const [jobRoleData, setJobRoleData] = useState<JobRole>();
  const { showSuccessAlert, showErrorAlert } = useAlert();
  const {
    data: jobRole,
    isLoading,
    error,
  } = useGetJobRoleByIdQuery({ id: Id });

  const stripHtml = (html: string) => {
  const temp = document.createElement("div");
               temp.innerHTML = html;
               return temp.textContent || temp.innerText || "";
               };

  useEffect(() => {
    if (jobRole && typeof jobRole === "object") {
      setJobRoleData({
        ...emptyjobRoleData,
        ...(jobRole as JobRole),
        description: stripHtml((jobRole as JobRole).description ?? ""),
      });
    };
     
  }, [jobRole]);

  const { jobCategoriesLookups } = useJobCategory();
  const { JobGradesLookups } = useJobGrade();
  const { jobRoleCatagoriesLookups } = useJobRoleCategories();
  const [
    updateJobRole,
    { isLoading: updateJobRoleLoading, error: updateJobRoleError },
  ] = useUpdateJobRoleMutation();

  const validationSchema = Yup.object({
    roleName: Yup.string()
      .required("Role Name is Required")
      .max(100, "Job Role Name exceeds 100 characters"),
    jobCatagoryId: Yup.number().required("Job Role Catagory is Must"),
    jobRoleCategoryId: Yup.number().required(
      "Job Role ,Role Catagory is needed"
    ),
    jobGradeId: Yup.number().required("Job Role Grade is Required"),
    description: Yup.string().required("The Job Description is Required"),
    benefits: Yup.array().of(
      Yup.object().shape({
        benefitId: Yup.number().required("Benefit is required"),
        benefitValueId: Yup.number().required("Select a value for the benefit"),
      })
    ),
  });

  const handleSubmit = useCallback(
    (values: JobRole) => {
      updateJobRole({
        updateJobRoleCommand: values,
      })
        .unwrap()
        .then(() => {
          setAlertSeverity("info");
          showSuccessAlert("JobRole updated successfully!");
          onClose();
        })
        .catch((error) => {});
    },
    [onClose, updateJobRole]
  );
  const errors = (updateJobRoleError as any)?.data?.errors;
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
        >
          <Form>
            <DialogHeader title="Update Job Role" onClose={onClose} />
            <DialogContent dividers={true}>
              <Grid container spacing={2}>
                {message && (
                  <Stack sx={{ width: "100%", marginBottom: 2 }} spacing={2}>
                    <Alert
                      severity={alertSeverity}
                      onClose={() => setMessage(null)}
                    >
                      <AlertTitle>
                        {alertSeverity === "success" ? "Success" : "Error"}
                      </AlertTitle>
                      {message}
                    </Alert>
                  </Stack>
                )}
                {errors && (
                  <Grid item xs={6}>
                    <Errors errors={errors as any} />
                  </Grid>
                )}
                <Grid item xs={6}>
                  <FormTextField
                    name="roleName"
                    label="Job Role Name"
                    type="text"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                   
                     <FormAutocompleteField
                    name="jobCatagoryId"
                    label="Job Catagory"
                    options={jobCategoriesLookups
                      .map((c) => ({
                        id: Number(c.value), 
                        name: String(c.label),
                      }))
                      .filter((c) => !isNaN(c.id))} 
                      sx={{ width: "100%" }}
                      
                  />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: "flex", gap: 2, width:"100%" }}>
                    
                   <FormAutocompleteField
                    name="jobRoleCategoryId"
                    label="Job Role Category"
                    options={jobRoleCatagoriesLookups
                      .map((c) => ({
                        id: Number(c.value), 
                        name: String(c.label),
                      }))
                      .filter((c) => !isNaN(c.id))} 
                      sx={{ width: "100%" }}
                      
                  />
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                   
                     <FormAutocompleteField
                    name="jobGradeId"
                    label="Job Grade"
                    options={JobGradesLookups
                      .map((c) => ({
                        id: Number(c.value), 
                        name: String(c.label),
                      }))
                      .filter((c) => !isNaN(c.id))} 
                      sx={{ width: "100%" }}
                      
                  />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <BenefitSelector selectedBenefitsField="benefits" />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <FormTextField
                       name="description"
                       label="Description"
                       multiline
                       minRows={4}
                       fullWidth
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
        </Formik>
      )}
    </Dialog>
  );
};
