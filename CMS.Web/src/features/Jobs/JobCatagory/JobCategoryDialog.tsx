import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Alert,
} from "@mui/material";
import { Formik, Form } from "formik";
import { DialogHeader, FormTextField, Errors } from "../../../components";
import {
  JobCategoryDto,
  CreateJobCategoryCommand,
  useCreateJobCategoyMutation,
} from "../../../app/api";
import { useState, useCallback } from "react";
import { ApprovalStatus, JobCatagoryEnum } from "../../../app/api/enums";
import * as Yup from "yup";
import { useAlert } from "../../notification";

interface JobCategoryDialogProps {
  onClose: () => void;
}

const emptyJobCategoryData: JobCategoryDto = {
  id: undefined,
  jobCategoryName: "",
  approvalStatus: ApprovalStatus.Draft,
  isActive: true,
  probationPeriodInDays: 0,
};

export const JobCategoryDialog = ({ onClose }: JobCategoryDialogProps) => {
  const [createCategory, { error: addError }] = useCreateJobCategoyMutation();
  const [notification, setNotification] = useState<string>("");
  const [severity, setSeverity] = useState<"info" | "error">();
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const { showSuccessAlert, showErrorAlert } = useAlert();
  
  const validationSchema = Yup.object({
    jobCategoryName: Yup.string()
      .trim()
      .matches(
        /^[A-Za-z]+$/,
        "Job Category name must contain only letters with no spaces."
      )
      .max(50, "Job Category name cannot be longer than 50 characters.")
      .required("Job Category name is required."),

    probationPeriodInDays: Yup.number()
      .positive("Probation period must be a positive number.")
      .integer("Probation period must be a whole number.")
      .required("Probation period is required.")
      .min(30,"Probation Date should be greater than or equal to 30 days"),
  });
  // Closing the dialog
  const onDialogClose = useCallback(() => {
    approveReset();
    rejectReset();
    setDialogOpened(false);
    setSelectedAction(undefined);
  }, [approveReset, rejectReset]);
  const handleSubmit = useCallback(
    async (values: JobCategoryDto) => {
      try {
        const addCommand: CreateJobCategoryCommand = {
          jobCategoryName: values.jobCategoryName,
          probationPeriodInDays: values.probationPeriodInDays,
          approvalStatus: values.approvalStatus,
          isActive: values.isActive,
        };
        await createCategory({ createJobCategoryCommand: addCommand }).unwrap();
        showSuccessAlert("Job Category created successfully!");
        setSeverity("info");
        setOpenSnackbar(true);
        onClose();
       
      } catch (error) {
        setOpenSnackbar(true);
        setSeverity("error");
        showErrorAlert("An error occurred while saving.");
      }
    },
    [createCategory, onClose]
  );

  const serverErrors = (addError as any)?.data?.errors;

  return (
    <Dialog
      open={true}
      scroll="paper"
      maxWidth="md"
      fullWidth
      sx={{ "& .MuiDialog-paper": { width: "50%", maxHeight: "90vh" } }}
    >
      <Formik
        initialValues={emptyJobCategoryData}
        onSubmit={handleSubmit}
        enableReinitialize
        validationSchema={validationSchema}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ errors, touched }) => (
          <Form>
            <DialogHeader title="Add Job Category" onClose={onClose} />
            {notification && (
              <Box sx={{ p: 2 }}>
                <Alert severity={severity}>{notification}</Alert>
              </Box>
            )}
            <DialogContent dividers>
              <Grid container spacing={2}>
                {serverErrors && (
                  <Grid item xs={12}>
                    <Errors errors={serverErrors} />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <FormTextField
                    name="jobCategoryName"
                    label="Job Category Name"
                    fullWidth
                    error={Boolean(
                      touched.jobCategoryName && errors.jobCategoryName
                    )}
                    helperText={
                      touched.jobCategoryName && errors.jobCategoryName
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormTextField
                    name="probationPeriodInDays"
                    label="Probation Period (Days)"
                    type="number"
                    fullWidth
                    error={Boolean(
                      touched.probationPeriodInDays &&
                        errors.probationPeriodInDays
                    )}
                    helperText={
                      touched.probationPeriodInDays &&
                      errors.probationPeriodInDays
                    }
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button color="primary" variant="outlined" type="submit">
                Save
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
function rejectReset() {
  throw new Error("Function not implemented.");
}

function approveReset() {
  throw new Error("Function not implemented.");
}

function setDialogOpened(arg0: boolean) {
  throw new Error("Function not implemented.");
}

function setSelectedAction(undefined: undefined) {
  throw new Error("Function not implemented.");
}
