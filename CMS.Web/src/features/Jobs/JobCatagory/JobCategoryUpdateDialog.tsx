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
  Alert,
  AlertTitle,
  Stack,
} from "@mui/material";
import {
  JobCatagory,
  useUpdateJobCategoryMutation,
  useGetJobCategoryByIdQuery,
} from "../../../app/api/HCMSApi";
import { FormRichTextField } from "../../../components/form-controls/from-reach-text";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useAlert } from "../../notification";

const emptyJobCategoryData = {
  id: 0,
  jobCategoryName: "",
  probationPeriodInDays: "",
  createdAt: "",
  modifiedAt: "",
} as unknown as JobCatagory;

interface JobCategoryUpdateDialogProps {
  onClose: () => void;
  Id?: number;
}

export const JobCategoryUpdateDialog = ({
  onClose,
  Id,
}: JobCategoryUpdateDialogProps) => {
  const [message, setMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<"info" | "error">();
  const [jobCategoryData, setJobCategoryData] =
    useState<JobCatagory>(emptyJobCategoryData);
  const { showSuccessAlert, showErrorAlert } = useAlert();
  const {
    data: jobCategory,
    isLoading,
    error,
  } = useGetJobCategoryByIdQuery({ id: Id ?? 0 }, { skip: Id === undefined });

  useEffect(() => {
    if (jobCategory && typeof jobCategory === "object") {
      setJobCategoryData(jobCategory);
    }
  }, [jobCategory]);

  const [updateJobCategory, { isLoading: updateLoading, error: updateError }] =
    useUpdateJobCategoryMutation();

  const handleSubmit = useCallback(
    (values: JobCatagory) => {
      // Wrap the values in the updateJobCategoryCommand property
      const command = {
        updateJobCategoryCommand: {
          id: values.id,
          jobCategoryName: values.jobCategoryName,
          probationPeriodInDays: values.probationPeriodInDays,
        },
      };

      updateJobCategory(command)
        .unwrap()
        .then(() => {
          setAlertSeverity("info");
          showSuccessAlert("Job Category updated successfully!");
          onClose();
        })
        .catch((err) => {
          setAlertSeverity("error");
          showErrorAlert("Update failed. Please try again.");
          // console.error(err); // Log the error for debugging
        });
    },
    [onClose, updateJobCategory]
  );

  // Handling form errors
  const errors = (updateError as any)?.data?.errors;

  // Validation schema for the form
  const validationSchema = Yup.object({
    jobCategoryName: Yup.string()
      .trim()
      .matches(
        /^[A-Za-z]+$/,
        "Job Category name must contain only letters with no spaces."
      )
      .max(20, "Job Category name cannot be longer than 20 characters.")
      .required("Job Category name is required."),
    probationPeriodInDays: Yup.number()
      .required("Probation period is required")
      .positive("Must be a positive number")
      .integer("Must be an integer")
      .min(30, "Probation Date should be greater than or equal to 30 days"),
  });

  return (
    <Dialog scroll="paper" disableEscapeKeyDown maxWidth="md" open fullWidth>
      {jobCategoryData && (
        <Formik
          initialValues={jobCategoryData}
          enableReinitialize // Ensure it reinitializes the form values when `jobCategoryData` changes
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          validateOnChange
        >
          <Form>
            <DialogHeader title="Update Job Category" onClose={onClose} />
            <DialogContent dividers>
              <Grid container spacing={2}>
                {message && (
                  <Grid item xs={12}>
                    <Stack sx={{ width: "100%" }} spacing={2}>
                      <Alert
                        severity={alertSeverity}
                        onClose={() => setMessage(null)}
                      >
                        <AlertTitle>
                          {alertSeverity === "info" ? "info" : "Error"}
                        </AlertTitle>
                        {message}
                      </Alert>
                    </Stack>
                  </Grid>
                )}

                {errors && (
                  <Grid item xs={12}>
                    <Errors errors={errors} />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <FormTextField
                    name="jobCategoryName"
                    label="Job Category Name"
                    type="text"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <FormTextField
                      name="probationPeriodInDays"
                      label="Probation Period (in days)"
                      type="number"
                    />
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                color="primary"
                variant="outlined"
                type="submit"
                disabled={updateLoading}
              >
                {updateLoading ? "Updating..." : "Update"}
              </Button>
            </DialogActions>
          </Form>
        </Formik>
      )}
    </Dialog>
  );
};
