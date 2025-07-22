import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Alert,
} from "@mui/material";
import { Formik, Form, FormikHelpers } from "formik";

import * as Yup from "yup";
import { DelegationDto, useCreateDelegationMutation, useUpdateDelegationMutation } from "../../../../app/store";
import { useCallback, useEffect, useState } from "react";
import { useAlert } from "../../../notification";
import { DialogHeader, Errors, FormSelectField, FormTextField } from "../../../../components";
import { useBusinessUnit } from "../../../BusinessUnit";
import { useJobRole } from "../../../Jobs/JobRole/useJobRole";
import dayjs from "dayjs";


interface DelegationDialogProps {
  initialDelegation?: DelegationDto;
  title: string;
  employeeId: number;
  onClose: () => void;
}

const emptyDelegationData: DelegationDto = {
  id: undefined,
  employeeId: undefined,
  jobRoleId: undefined,
  businessUnitId: null,
  startDate: "",
  endDate: null,
};

export const DelegationDialog = ({
  onClose,
  initialDelegation,
  title,
  employeeId
}: DelegationDialogProps) => {
  const [delegationData, setDelegationData] = useState<DelegationDto>(emptyDelegationData);
  const [createDelegation, { error: createDelegationError, isLoading: isCreating }] =
    useCreateDelegationMutation();
  const [updateDelegation, { error: updateDelegationError, isLoading: isUpdating }] =
    useUpdateDelegationMutation();
  const { showSuccessAlert, showErrorAlert } = useAlert();
  const [notification, setNotification] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
const { businessUnitLookups } = useBusinessUnit();
const { jobRoleLookups } = useJobRole();

  useEffect(() => {
    setDelegationData({
      ...emptyDelegationData,
      ...initialDelegation,
      // Ensure dates are formatted correctly for input type="date"
      startDate: initialDelegation?.startDate ? initialDelegation.startDate : "",
      endDate: initialDelegation?.endDate ? initialDelegation.endDate : null,
    });
    if (initialDelegation?.id) {
      setNotification("This delegation is being edited."); // Updated notification
      setOpenSnackbar(true);
    } 
  }, [initialDelegation]);

  const validationSchema = Yup.object({
    jobRoleId: Yup.number().required("Job Role is required.").nullable(),
    businessUnitId: Yup.number().nullable(), // BusinessUnitId is optional (nullable in C#)
    startDate: Yup.string().required("Start Date is required."),
    endDate: Yup.string()
      .nullable()
      .test(
        "is-after-start",
        "End Date must be after Start Date",
        function (endDate) {
          const { startDate } = this.parent;
          if (!startDate || !endDate) {
            return true; // Allow empty or if start date is missing
          }
          // Compare dates by converting to Date objects
          return new Date(endDate) >= new Date(startDate);
        }
      ),
  });

  const handleSubmit = useCallback(
    async (
      values: DelegationDto,
      { setSubmitting, resetForm }: FormikHelpers<DelegationDto>
    ) => {
      try {
        values.employeeId = employeeId; // Ensure employeeId is set from props
        values.startDate = dayjs(values.startDate).format('YYYY-MM-DD');
          if (values.endDate) {
             values.endDate = dayjs(values.endDate).format('YYYY-MM-DD');
           }

        setSubmitting(true);
        const action = initialDelegation?.id
          ? updateDelegation({
              updateDelegationCommands: { ...values, id: initialDelegation.id },
            })
          : createDelegation({ createDelegationCommand: values });

        await action.unwrap();
        showSuccessAlert(
          initialDelegation?.id
            ? "Delegation updated successfully!" // Updated success message
            : "Delegation created successfully!" // Updated success message
        );
        resetForm();
        onClose();
      } catch (error: any) {
        showErrorAlert(error?.data?.detail || "Failed to save delegation."); // Updated error message
      } finally {
        setSubmitting(false);
      }
    },
    [createDelegation, updateDelegation, onClose, showErrorAlert, initialDelegation?.id]
  );

  const errors =
    (createDelegationError as any)?.data?.errors ||
    (updateDelegationError as any)?.data?.errors;

  const isSaving = isCreating || isUpdating;

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
    >
      {openSnackbar && notification && (
        <Alert
          severity="warning"
          onClose={() => setOpenSnackbar(false)}
          sx={{ mb: 2 }}
        >
          {notification}
        </Alert>
      )}
      {!!delegationData && (
        <Formik
          initialValues={delegationData}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          validateOnChange={true}
        >
          {({ handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <DialogHeader title={title} onClose={onClose} />
              <DialogContent dividers={true}>
                <Grid container spacing={2}>
                  {errors && (
                    <Grid item xs={12}>
                      <Errors errors={errors as any} />
                    </Grid>
                  )}


                  {/* Job Role Dropdown */}
                  <Grid item xs={12}>
                    <FormSelectField
                      name="jobRoleId"
                      label="Job Role"
                      type="number"
                      options={jobRoleLookups}
                      error={!!errors?.jobRoleId}
                      helperText={errors?.jobRoleId}
                    />
                  </Grid>

                  {/* Business Unit Dropdown (Optional) */}
                  <Grid item xs={12}>
                    <FormSelectField
                      name="businessUnitId"
                      label="Business Unit"
                      type="number"
                      options={businessUnitLookups}
                      error={!!errors?.businessUnitId}
                      helperText={errors?.businessUnitId}
                    />
                  </Grid>

                  {/* Start Date */}
                  <Grid item xs={12} sm={6}>
                    <FormTextField
                      name="startDate"
                      label="Start Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }} // Ensures label is always "shrunk" for date input
                      error={!!errors?.startDate}
                      helperText={errors?.startDate}
                    />
                  </Grid>

                  {/* End Date */}
                  <Grid item xs={12} sm={6}>
                    <FormTextField
                      name="endDate"
                      label="End Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }} // Ensures label is always "shrunk" for date input
                      error={!!errors?.endDate}
                      helperText={errors?.endDate}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} disabled={isSaving || isSubmitting}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  variant="outlined"
                  type="submit"
                  disabled={isSaving || isSubmitting}
                >
                  {isSaving || isSubmitting ? "Saving..." : "Save"}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      )}
    </Dialog>
  );
};
