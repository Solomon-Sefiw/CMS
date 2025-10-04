import React, { useEffect, useState, useCallback } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Snackbar,
  Alert,
  TextField,
  Card,
  CardContent,
} from "@mui/material";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";

import {
  ReemploymentDto,
  CreateReemploymentCommand,
  UpdateReemploymentCommand,
  useCreateReemploymentMutation,
  useUpdateReemploymentMutation,
  EmployeeBasicInfoDto,
  useGetEmployeeWithDetailsQuery,
} from "../../../../app/api";

import { useAlert } from "../../../notification/useAlert";
import { DialogHeader } from "../../../../components/dialog/DialogHeader";
import { Errors } from "../../../../components/Errors";
import { FormSelectField } from "../../../../components/form-controls/form-select";
import { FormTextField } from "../../../../components";
import dayjs from "dayjs";

interface ReemploymentDialogProps {
  reemployment?: ReemploymentDto;
  title: string;
  onClose: () => void;
}

const reemploymentTypeOptions = [
  { value: 1, label: "Reinstate" },
  { value: 2, label: "Rehire" },
];

const emptyReemploymentData: ReemploymentDto = {
  id: undefined,
  employeeId: undefined,
  employeeName: "",
  businessUnitName: "",
  jobRoleName: "",
  reemploymentType: 1,
  approvalStatus: undefined,
  reemploymentDate: "",
  reasonForReemployment: "",
  remark: "",
};

export const ReemploymentDialog = ({
  reemployment,
  title,
  onClose,
}: ReemploymentDialogProps) => {
  const [reemploymentData, setReemploymentData] = useState<ReemploymentDto>(
    emptyReemploymentData
  );

  const [createReemployment, { error: createError }] =
    useCreateReemploymentMutation();
  const [updateReemployment, { error: updateError }] =
    useUpdateReemploymentMutation();

  const { showSuccessAlert, showErrorAlert } = useAlert();

  const { data: employeeDetails = {} as EmployeeBasicInfoDto } =
    useGetEmployeeWithDetailsQuery(
      { id: reemployment?.employeeId! },
      { skip: !reemployment?.employeeId }
    );

  useEffect(() => {
    setReemploymentData({ ...emptyReemploymentData, ...reemployment });
  }, [reemployment]);

  const handleSubmit = useCallback(
    async (values: ReemploymentDto) => {
      try {
         values.reemploymentDate = dayjs(values.reemploymentDate).format("YYYY-MM-DD");
        if (values.reemploymentDate) {
          values.reemploymentDate = dayjs(values.reemploymentDate).format("YYYY-MM-DD");
        }
        const payload = {
          employeeId: reemployment?.employeeId,
          reemploymentType: values.reemploymentType,
          reemploymentDate: values.reemploymentDate,
          reasonForReemployment: values.reasonForReemployment,
          remark: values.remark,
        };

        if (reemployment?.id) {
          await updateReemployment({
            updateReemploymentCommand: {
              ...payload,
              reemploymentId: reemployment.id,
            },
          }).unwrap();
          showSuccessAlert("Reemployment updated successfully");
        } else {
          await createReemployment({
            createReemploymentCommand: payload,
          }).unwrap();
          showSuccessAlert("Reemployment created successfully");
        }
        onClose();
      } catch {
        //showErrorAlert("Failed to save reemployment");
      }
    },
    [
      createReemployment,
      updateReemployment,
      onClose,
      showSuccessAlert,
      showErrorAlert,
      reemployment,
    ]
  );

  const errors =
    (createError as any)?.data?.errors || (updateError as any)?.data?.errors;

  const validationSchema = Yup.object().shape({
    reemploymentType: Yup.number().required("Reemployment type is required"),
    reemploymentDate: Yup.string().required("Reemployment date is required"),
    reasonForReemployment: Yup.string().required(
      "Reason for reemployment is required"
    ),
  });

  return (
    <Dialog open={true} maxWidth="md" fullWidth>
      <Formik
        initialValues={reemploymentData}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        enableReinitialize
      >
        {({ values }) => (
          <Form>
            <DialogHeader title={title} onClose={onClose} />
            <DialogContent dividers>
              <Grid container spacing={2}>
                {errors && (
                  <Grid item xs={12}>
                    <Errors errors={errors} />
                  </Grid>
                )}

                {employeeDetails && (
                  <>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Employee Name"
                        value={employeeDetails?.displayName || ""}
                        fullWidth
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Previous Business Unit"
                        value={employeeDetails.businessUnitName || ""}
                        fullWidth
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Previous Job Role"
                        value={employeeDetails.jobRoleName || ""}
                        fullWidth
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                  </>
                )}

                <Grid item xs={6}>
                  <FormSelectField
                    name="reemploymentType"
                    label="Reemployment Type"
                    options={reemploymentTypeOptions}
                  />
                </Grid>

                <Grid item xs={6}>
                  <FormTextField
                    name="reemploymentDate"
                    label="Reemployment Date"
                    type="date"
                   InputLabelProps={{ shrink: true }}
                     /> 
                </Grid>

                <Grid item xs={12}>
                  <Card
                    elevation={2}
                    sx={{
                      borderRadius: 1,
                      boxShadow: 2,
                      backgroundColor: "#fafafa",
                    }}
                  >
                    <CardContent>
                      <FormikTextField
                        name="reasonForReemployment"
                        label="Reemployment Reason"
                        multiline
                        rows={3}
                        fullWidth
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="outlined" color="primary">
                Save
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

const FormikTextField = ({ name, label, ...props }: any) => {
  const [field, meta] = useField(name);
  return (
    <TextField
      fullWidth
      label={label}
      {...field}
      {...props}
      error={Boolean(meta.touched && meta.error)}
      helperText={meta.touched && meta.error}
    />
  );
};
