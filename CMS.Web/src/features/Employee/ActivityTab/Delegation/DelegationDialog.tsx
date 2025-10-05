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
import {
  DelegationDto,
  useCreateDelegationMutation,
  useGetEmployeeByIdQuery,
  useUpdateDelegationMutation
} from "../../../../app/store";
import { useCallback, useEffect, useState } from "react";
import { useAlert } from "../../../notification";
import { DialogHeader, Errors, FormTextField } from "../../../../components";
import { useBusinessUnit } from "../../../BusinessUnit";
import { useJobRole } from "../../../Jobs/JobRole/useJobRole";
import dayjs from "dayjs";
import { FormAutocomplete } from "../../../../components/form-controls/form-auto-complete";

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
  endDate: null
};


export const DelegationDialog = ({
  onClose,
  initialDelegation,
  title,
  employeeId,
}: DelegationDialogProps) => {
  const [delegationData, setDelegationData] =
    useState<DelegationDto>(emptyDelegationData);
  const [
    createDelegation,
    { error: createDelegationError, isLoading: isCreating },
  ] = useCreateDelegationMutation();
  const [
    updateDelegation,
    { error: updateDelegationError, isLoading: isUpdating },
  ] = useUpdateDelegationMutation();
  const { showSuccessAlert, showErrorAlert } = useAlert();
  const [notification, setNotification] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const { businessUnitLookups } = useBusinessUnit();
  const { jobRoleLookups } = useJobRole();
  const { data: employeeData, refetch } = useGetEmployeeByIdQuery(
    { id: employeeId },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    refetch();
    setDelegationData({
      ...emptyDelegationData,
      ...initialDelegation,
      startDate: initialDelegation?.startDate ? initialDelegation.startDate : "",
      endDate: initialDelegation?.endDate ? initialDelegation.endDate : null
    });
    if (initialDelegation?.id) {
      setNotification("This delegation is being edited.");
      setOpenSnackbar(true);
    }
  }, [initialDelegation, refetch]);

  const validationSchema = (latestDelegation?: DelegationDto, existingDelegations: DelegationDto[] = []) =>
    Yup.object({
      jobRoleId: Yup.number().required("Job Role is required.").nullable().test("not-same-latest-jobrole", "Cannot assign same Job Role as latest active delegation.", function (jobRoleId) {
        if (!latestDelegation) return true;
        return jobRoleId !== latestDelegation.jobRoleId;
      }),
      businessUnitId: Yup.number().required("Business Unit is required.").nullable(),
      startDate: Yup.string().required("Start Date is required.").test("start-after-latest", "Start Date must be on or after latest active delegation's start date.", function (startDate) {
        if (!latestDelegation?.startDate || !startDate) return true;
        return new Date(startDate) >= new Date(latestDelegation.startDate);
      }),
      endDate: Yup.string().nullable().test("is-after-start", "End Date must be after Start Date", function (endDate) {
        const { startDate } = this.parent;
        if (!startDate || !endDate) return true;
        return new Date(endDate) > new Date(startDate);
      }).test("no-overlap", "This delegation overlaps with an existing active delegation.", function (endDate) {
        const { startDate } = this.parent;
        if (!startDate) return true;
        const newStart = new Date(startDate);
        const newEnd = endDate ? new Date(endDate) : new Date(8640000000000000);
        return !existingDelegations.some(d => {
          const existingStart = d.startDate ? new Date(d.startDate) : new Date(8640000000000000);
          const existingEnd = d.endDate ? new Date(d.endDate) : new Date(8640000000000000);
          return newStart <= existingEnd && newEnd >= existingStart;
        });
      })
    });

  const handleSubmit = useCallback(
    async (
      values: DelegationDto,
      { setSubmitting, resetForm }: FormikHelpers<DelegationDto>
    ) => {
      try {
        values.employeeId = employeeId;
        values.startDate = dayjs(values.startDate).format("YYYY-MM-DD");
        if (values.endDate) {
          values.endDate = dayjs(values.endDate).format("YYYY-MM-DD");
        }
        setSubmitting(true);
        const action = initialDelegation?.id
          ? updateDelegation({ updateDelegationCommands: { ...values, id: initialDelegation.id } })
          : createDelegation({ createDelegationCommand: values });
        await action.unwrap();
        showSuccessAlert(initialDelegation?.id ? "Delegation updated successfully!" : "Delegation created successfully!");
        resetForm();
        onClose();
      } catch (error: any) {
        showErrorAlert(error?.data?.detail || "Failed to save delegation.");
      } finally {
        setSubmitting(false);
      }
    },
    [
      createDelegation,
      updateDelegation,
      onClose,
      showErrorAlert,
      initialDelegation?.id,
    ]
  );

  const errors =
    (createDelegationError as any)?.data?.errors ||
    (updateDelegationError as any)?.data?.errors;

  const isSaving = isCreating || isUpdating;
  return (
    <Dialog scroll="paper" disableEscapeKeyDown={true} maxWidth="md" open={true}>
      {openSnackbar && notification && (
        <Alert severity="warning" onClose={() => setOpenSnackbar(false)} sx={{ mb: 2 }}>
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
                  <Grid item xs={12}>
                    <FormAutocomplete
                      name="jobRoleId"
                      label="Job Role"
                    options = {jobRoleLookups.filter(jr => jr.value !== employeeData?.job?.jobRoleId)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormAutocomplete
                      name="businessUnitId"
                      label="Business Unit"
                      options={businessUnitLookups.filter(bu => bu.value !== 1 && bu.value !== employeeData?.businessUnitID)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormTextField
                      name="startDate"
                      label="Start Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={!!errors?.startDate}
                      helperText={errors?.startDate}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormTextField
                      name="endDate"
                      label="End Date"
                      type="date"
                      fullWidth
                      disabled={!delegationData.startDate}
                      InputProps={{
                        inputProps: {
                          min: delegationData.startDate
                        }
                      }}
                      InputLabelProps={{ shrink: true }}
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
