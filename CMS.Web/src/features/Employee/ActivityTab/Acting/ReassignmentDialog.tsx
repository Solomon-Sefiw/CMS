import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
} from "@mui/material";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";

import {
  ActingDto,
  ReAssignmentActingCommand,
  useCreateReassignmentMutation,
  useGetEmployeeByIdQuery,
} from "../../../../app/store";
import { useAlert } from "../../../notification";
import {
  DialogHeader,
  Errors,
  FormSelectField,
  FormTextField,
} from "../../../../components";
import { useBusinessUnit } from "../../../BusinessUnit";
import { useJobRole } from "../../../Jobs/JobRole/useJobRole";
import { ActingType } from "../../../../app/api/enums";

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
  previousBusinessUnitId: null,
  previousJobRoleId: null,
  actingType: ActingType.Reassignment,
};

export const ReassignmentDialog = ({
  onClose,
  initialActing,
  title,
  employeeId,
}: ActingDialogProps) => {
  const { data: employeeData } = useGetEmployeeByIdQuery({ id: employeeId });

  const [actingData, setActingData] = useState<ActingDto>(emptyActingData);
  const [
    createReassignment,
    { error: createReassignError, isLoading: isCreating },
  ] = useCreateReassignmentMutation();
  const { showSuccessAlert, showErrorAlert } = useAlert();

  const { businessUnitLookups } = useBusinessUnit();
  const { jobRoleLookups } = useJobRole();

  useEffect(() => {
    setActingData({
      ...emptyActingData,
      ...initialActing,
      startDate: initialActing?.startDate || "",
      endDate: initialActing?.endDate || null,
      // 👇 use `initialActing` values as rollback targets
      previousJobRoleId: initialActing?.previousJobRoleId ?? null,
      previousBusinessUnitId: initialActing?.previousBusinessUnitId ?? null,
    });
  }, [initialActing]);

  const validationSchema = Yup.object({
    previousJobRoleId: Yup.number().required("Previous Job Role is required."),
    previousBusinessUnitId: Yup.number().nullable(),
    startDate: Yup.string().required("Start Date is required."),
    endDate: Yup.string()
      .nullable()
      .test(
        "is-after-start",
        "End Date must be after Start Date",
        function (endDate) {
          const { startDate } = this.parent;
          if (!startDate || !endDate) return true;
          return new Date(endDate) >= new Date(startDate);
        }
      ),
  });

  const handleSubmit = useCallback(
    async (
      values: ActingDto,
      { setSubmitting, resetForm }: FormikHelpers<ActingDto>
    ) => {
      try {
        setSubmitting(true);

        const formattedStartDate = dayjs(values.startDate).format("YYYY-MM-DD");
        const formattedEndDate = values.endDate
          ? dayjs(values.endDate).format("YYYY-MM-DD")
          : null;

        const reassignmentPayload: ReAssignmentActingCommand = {
          employeeId,
          actingType: ActingType.Reassignment,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          // 👇 rollback target
          jobRoleId: values.previousJobRoleId!,
          businessUnitId: values.previousBusinessUnitId ?? null,
          // 👇 current becomes new previous
          previousJobRoleId: employeeData?.job?.jobRoleId ?? undefined,
          previousBusinessUnitId: employeeData?.businessUnitID ?? undefined,
        };

        const action = createReassignment({
          reAssignmentActingCommand: reassignmentPayload,
        });

        await action.unwrap();

        showSuccessAlert("Reassignment completed successfully!");
        resetForm();
        onClose();
      } catch (error: any) {
        showErrorAlert(error?.data?.detail || "Failed to save reassignment.");
      } finally {
        setSubmitting(false);
      }
    },
    [createReassignment, onClose, showErrorAlert, employeeId, employeeData]
  );

  const errors = (createReassignError as any)?.data?.errors;
  const isSaving = isCreating;

  return (
    <Dialog scroll="paper" disableEscapeKeyDown maxWidth="md" open>
      <Formik
        initialValues={actingData}
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
                    <Errors errors={errors} />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <FormSelectField
                    name="previousJobRoleId"
                    label="Reassign To Job Role"
                    options={jobRoleLookups.filter( (jr) => jr.value !== employeeData?.job?.jobRoleId )} // Exclude the first option if needed
                    error={!!errors?.previousJobRoleId}
                    helperText={errors?.previousJobRoleId}
                    disabled={true} // Disable job role for now
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormSelectField
                    name="previousBusinessUnitId"
                    label="Reassign To Business Unit"
                    options={businessUnitLookups.filter(bu => bu.value !== 1)} // Exclude the first option if needed
                    error={!!errors?.previousBusinessUnitId}
                    helperText={errors?.previousBusinessUnitId}
                    disabled={true} // Disable business unit for now
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormTextField
                    name="startDate"
                    label="Reassignment Start Date"
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
                    InputLabelProps={{ shrink: true }}
                    disabled={true} // Disable end date for now
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
