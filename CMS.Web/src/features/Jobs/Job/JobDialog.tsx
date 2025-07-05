import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { Formik, Form } from "formik";
import { DialogHeader, FormSelectField } from "../../../components";
import { useBusinessUnit } from "../../BusinessUnit/useBusinessUnits";
import { useJobRole } from "./useJobRole";
import { useCallback, useEffect, useState } from "react";
import { Errors } from "../../../components";
import {
  AddJobCommand,
  JobDto,
  UpdateJobCommand,
  useAddJobMutation,
  useUpdateJobMutation,
} from "../../../app/api";
import { useAlert } from "../../notification";

interface JobDialogProps {
  job?: JobDto;
  title: string;
  onClose: () => void;
}

const emptyJobData: JobDto = {
  id: undefined,
  jobRoleId: undefined,
  businessUnitId: undefined,
};

export const JobDialog = ({ onClose, job, title }: JobDialogProps) => {
  const [jobData, setJobData] = useState<JobDto>(emptyJobData);
  const [addJob, { error: addJobError }] = useAddJobMutation();
  const [updateJob, { error: updateJobError }] = useUpdateJobMutation();
  const { businessUnitLookups } = useBusinessUnit();
  const { jobRoleLookups } = useJobRole();
  const [notification, setNotification] = useState<string>("");
  const [severity, setSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("info");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState(false);
  const { showSuccessAlert, showErrorAlert } = useAlert();

  useEffect(() => {
    setJobData({
      ...emptyJobData,
      ...job,
    });
    if (job?.isLocked) {
      setIsLocked(true);
      setSeverity("error");
      showErrorAlert("This job is locked and cannot be updated.");
    }
  }, [job]);

  const handleSubmit = useCallback(
    async (values: JobDto) => {
      try {
        if (values.id) {
          const updateCommand: UpdateJobCommand = {
            jobId: values.id,
            jobRoleId: values.jobRoleId,
            businessunitId: values.businessUnitId,
          };
          const response = await updateJob({
            updateJobCommand: updateCommand,
          }).unwrap();
          if (response.isLocked) {
            showErrorAlert(
              "Updation is not allowed once the job is assigned to an employee."
            );
            setSeverity("warning");
            setIsLocked(true);
          } else {
            showSuccessAlert("Job updated successfully!");
            setSeverity("info");
          }
        } else {
          const addCommand: AddJobCommand = {
            jobRoleId: values.jobRoleId,
            businessunitId: values.businessUnitId,
          };
          const response = await addJob({ addJobCommand: addCommand }).unwrap();
          if (response.jobCountExceeded) {
            showSuccessAlert(
              "Job created successfully, but the count has exceeded the staff strength for this business unit."
            );
            setSeverity("warning");
          } else {
            showSuccessAlert("Job created successfully!");
            setSeverity("info");
          }
        }
        setOpenSnackbar(false);
          onClose();

      } catch (error) {
        setOpenSnackbar(false);
        setSeverity("error");
      }
    },
    [addJob, updateJob, onClose]
  );

  const errors =
    (addJobError as any)?.data?.errors || (updateJobError as any)?.data?.errors;

  return (
    <Dialog
      scroll="paper"
      open={true}
      maxWidth="lg"
      fullWidth
      sx={{ "& .MuiDialog-paper": { width: "50%", maxHeight: "90vh" } }}
    >
      <Formik
        initialValues={jobData}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {() => (
          <Form>
            <DialogHeader title={title} onClose={onClose} />
            {notification && (
              <Box sx={{ p: 2 }}>
                <Alert severity={severity}>{notification}</Alert>
              </Box>
            )}
            <DialogContent dividers={true}>
              <Grid container spacing={2}>
                {errors && (
                  <Grid item xs={12}>
                    <Errors errors={errors as any} />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <FormSelectField
                      name="businessUnitId"
                      label="Business Unit"
                      type="number"
                      options={businessUnitLookups}
                      fullWidth
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <FormSelectField
                      name="jobRoleId"
                      label="Job Role"
                      type="number"
                      options={jobRoleLookups}
                      fullWidth
                    />
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                color="primary"
                variant="outlined"
                type="submit"
                disabled={isLocked}
              >
                Save
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
