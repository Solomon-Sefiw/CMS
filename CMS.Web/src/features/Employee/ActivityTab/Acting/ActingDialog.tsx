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
  ActingDto,
  useCreateActingMutation,
  useGetEmployeeByIdQuery,
  useUpdateActingMutation
} from "../../../../app/store";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAlert } from "../../../notification";
import { DialogHeader, Errors, FormSelectField, FormTextField } from "../../../../components";
import { useBusinessUnit } from "../../../BusinessUnit";
import { useJobRole } from "../../../Jobs/JobRole/useJobRole";
import dayjs from "dayjs";
import { getEnumOptions } from "../../../../components/form-controls/get-enum-list";
import { ActingType } from "../../../../app/api/enums";
import { FormAutocomplete } from "../../../../components/form-controls/form-auto-complete";

interface ActingDialogProps {
  initialActing?: ActingDto;
  title: string;
  employeeId: number;
  onClose: () => void;
}

const emptyActingData: ActingDto = {
  id: undefined,
  employeeId: undefined,
  jobRoleId: undefined,
  businessUnitId: null,
  startDate: "",
  endDate: null,
  actingType: undefined,
  previousBusinessUnitId: null,
  previousJobRoleId: null
};


export const ActingDialog = ({
  onClose,
  initialActing,
  title,
  employeeId
}: ActingDialogProps) => {
  const { showSuccessAlert, showErrorAlert } = useAlert();
  const { data: employeeData, refetch } = useGetEmployeeByIdQuery(
    { id: employeeId },
    { refetchOnMountOrArgChange: true }
  );
  const [createActing, { error: createActingError, isLoading: isCreating }] = useCreateActingMutation();
  const [updateActing, { error: updateActingError, isLoading: isUpdating }] = useUpdateActingMutation();
  const { businessUnitLookups } = useBusinessUnit();
  const { jobRoleLookups } = useJobRole();
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  useEffect(() => {
    refetch();
    if (initialActing?.id) {
      setOpenSnackbar(true);
    }
  }, [initialActing, refetch]);

  const validationSchema = Yup.object({
    jobRoleId: Yup.number().required("Job Role is required.").nullable(),
    businessUnitId: Yup.number().nullable(),
    actingType: Yup.number().required("Acting type is required."),
    startDate: Yup.string().required("Start Date is required."),
    endDate: Yup.string().nullable().test("is-after-start", "End Date must be after Start Date", function (endDate) {
      const { startDate } = this.parent;
      if (!startDate || !endDate) return true;
      return new Date(endDate) >= new Date(startDate);
    })
  });

  const initialFormData: ActingDto = useMemo(() => {
    return {
      ...emptyActingData,
      ...initialActing,
      employeeId,
      startDate: initialActing?.startDate ?? "",
      endDate: initialActing?.endDate ?? null
    };
  }, [initialActing, employeeId]);

  const handleSubmit = useCallback(
    async (
      values: ActingDto,
      { setSubmitting, resetForm }: FormikHelpers<ActingDto>
    ) => {
      try {
        values.employeeId = employeeId;
        values.startDate = dayjs(values.startDate).format("YYYY-MM-DD");
        if (values.endDate) {
          values.endDate = dayjs(values.endDate).format("YYYY-MM-DD");
        }
        values.previousBusinessUnitId = employeeData?.businessUnitID;
        values.previousJobRoleId = employeeData?.job?.jobRoleId ?? undefined;
        setSubmitting(true);
        const action = initialActing?.id
          ? updateActing({
            updateActingCommand: {
              ...values,
              id: initialActing.id,
              previousJobRoleId: values.previousJobRoleId ?? undefined
            }
          })
          : createActing({
            createActingCommand: {
              ...values,
              previousJobRoleId: values.previousJobRoleId ?? undefined
            }
          });
        await action.unwrap();
        showSuccessAlert(initialActing?.id ? "Acting updated successfully!" : "Acting created successfully!");
        resetForm();
        onClose();
      } catch (error: any) {
        showErrorAlert(error?.data?.detail || "Failed to save Acting.");
      } finally {
        setSubmitting(false);
      }
    },
    [createActing, updateActing, onClose, showErrorAlert, initialActing?.id]
  );

  const errors =
    (createActingError as any)?.data?.errors ||
    (updateActingError as any)?.data?.errors;

  const isSaving = isCreating || isUpdating;

  return (
    <Dialog scroll="paper" disableEscapeKeyDown maxWidth="md" open>
      {openSnackbar && (
        <Alert
          severity="warning"
          onClose={() => setOpenSnackbar(false)}
          sx={{ mb: 2 }}
        >
          This Acting is being edited.
        </Alert>
      )}
      <Formik
        initialValues={initialFormData}
        enableReinitialize
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        validateOnChange
      >
        {({ handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <DialogHeader title={title} onClose={onClose} />
            <DialogContent dividers>
              <Grid container spacing={2}>
                {errors && (
                  <Grid item xs={12}>
                    <Errors errors={errors as any} />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <FormSelectField
                    name="actingType"
                    label="Acting Type"
                    options={getEnumOptions(ActingType).filter(
                      option => option.value !== ActingType.Reassignment)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormAutocomplete
                    name="jobRoleId"
                    label="Job Role"
                    options={jobRoleLookups
                      .filter(jr => jr.value !== employeeData?.job?.jobRoleId) 
                      .filter(jr => jr.label?.toLowerCase().includes("acting"))
                    }
                  />

                </Grid>
                <Grid item xs={12}>
                  <FormAutocomplete
                    name="businessUnitId"
                    label="Business Unit"
                    options={businessUnitLookups.filter(bu => bu.value !== 1)}
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
                    disabled
                    fullWidth
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
    </Dialog>
  );
};
