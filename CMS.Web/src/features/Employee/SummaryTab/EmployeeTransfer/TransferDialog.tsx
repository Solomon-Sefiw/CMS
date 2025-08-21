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
  Box,
} from "@mui/material";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";

import {
  EmployeeTransferDto,
  CreateTransferCommand,
  UpdateTransferCommand,
  useCreateTransferMutation,
  useUpdateTransferMutation,
  EmployeeBasicInfoDto,
  useGetEmployeeWithDetailsQuery,
} from "../../../../app/api";
import { useBusinessUnitss } from "./useBusinessUnits";
import { useJobRole } from "./useJobRole";
import { useAlert } from "../../../notification/useAlert";
import { DialogHeader } from "../../../../components/dialog/DialogHeader";
import { Errors } from "../../../../components/Errors";
import { FormSelectField } from "../../../../components/form-controls/form-select";
import { FormAutocomplete } from "../../../../components/form-controls/form-auto-complete";
import { FormTextField } from "../../../../components";
import dayjs from "dayjs";
interface TransferDialogProps {
  transfer?: EmployeeTransferDto;
  title: string;
  onClose: () => void;
}

const transferTypeOptions = [
  { value: 1, label: "Business Unit Change" },
  { value: 2, label: "Job Role Change" },
  { value: 3, label: "Both Business Unit & Job Role Change" },
];

const emptyTransferData: EmployeeTransferDto = {
  id: undefined,
  employeeId: undefined,
  transferType: 1,
  toBusinessUnitId: undefined,
  toJobRoleId: undefined,
  transferDate: "",
  transferReason: "",
};

export const TransferDialog = ({
  transfer,
  title,
  onClose,
}: TransferDialogProps) => {
  const [transferData, setTransferData] =
    useState<EmployeeTransferDto>(emptyTransferData);
  const [createTransfer, { error: createError }] = useCreateTransferMutation();
  const [updateTransfer, { error: updateError }] = useUpdateTransferMutation();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { showSuccessAlert, showErrorAlert } = useAlert();

  const { businessUnitLookups } = useBusinessUnitss();
  const { jobRoleLookups } = useJobRole();

  const { data: employeeDetails = {} as EmployeeBasicInfoDto, isLoading } =
    useGetEmployeeWithDetailsQuery(
      { id: transfer?.employeeId! },
      { skip: !transfer?.employeeId }
    );

  useEffect(() => {
    setTransferData({ ...emptyTransferData, ...transfer });
  }, [transfer]);

  const handleSubmit = useCallback(
    async (values: EmployeeTransferDto) => {
      try {
                values.transferDate = dayjs(values.transferDate).format("YYYY-MM-DD");
                if (values.transferDate) {
                  values.transferDate = dayjs(values.transferDate).format("YYYY-MM-DD");
                }
        const payload = {
          employeeId: transfer?.employeeId,
          transferType: values.transferType,
          toBusinessUnitId: values.toBusinessUnitId,
          toJobRoleId: values.toJobRoleId,
          transferDate: values.transferDate,
          transferReason: values.transferReason,
        };

        if (transfer?.id) {
          await updateTransfer({
            updateTransferCommand: { ...payload, id: transfer.id },
          }).unwrap();
          showSuccessAlert("Transfer updated successfully");
        } else {
          await createTransfer({ createTransferCommand: payload }).unwrap();
          showSuccessAlert("Transfer created successfully");
        }
        onClose();
      } catch {
        showErrorAlert("Failed to save transfer");
      }
    },
    [
      createTransfer,
      updateTransfer,
      onClose,
      showSuccessAlert,
      showErrorAlert,
      transfer,
    ]
  );

  const errors =
    (createError as any)?.data?.errors || (updateError as any)?.data?.errors;

  const validationSchema = Yup.object().shape({
    transferType: Yup.number()
      .oneOf([1, 2, 3])
      .required("Transfer type is required"),
    transferDate: Yup.string().required("Transfer date is required"),
    transferReason: Yup.string().required("Transfer reason is required"),
  });

  return (
    <Dialog open={true} maxWidth="md" fullWidth>
      <Formik
        initialValues={transferData}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        enableReinitialize
      >
        {({ values, setFieldValue }) => {
          const showBU = values.transferType === 1 || values.transferType === 3;
          const showJobRole =
            values.transferType === 2 || values.transferType === 3;

          return (
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
                          label="Current Business Unit"
                          value={employeeDetails.businessUnitName || ""}
                          fullWidth
                          InputProps={{ readOnly: true }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Current Job Role"
                          value={employeeDetails.jobRoleName || ""}
                          fullWidth
                          InputProps={{ readOnly: true }}
                        />
                      </Grid>
                    </>
                  )}

                  <Grid item xs={12}>
                    <FormSelectField
                      name="transferType"
                      label="Transfer Type"
                      options={transferTypeOptions}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const val = Number(e.target.value);
                        setFieldValue("transferType", val);
                        if (val === 1) setFieldValue("toJobRoleId", "");
                        if (val === 2) setFieldValue("toBusinessUnitId", "");
                      }}
                    />
                  </Grid>

                  {showBU && (
                    <Grid item xs={6}>

                      <Box sx={{ width: "100%" }}>
                        <FormAutocomplete
                          name="toBusinessUnitId"
                          label="Destination Business Unit"
                          options={businessUnitLookups.filter(bu => bu.value !== 1)}

                        />
                      </Box>
                    </Grid>

                  )}

                  {showJobRole && (
                    <Grid item xs={6}>

                 <Box sx={{ width: "100%" }}>
                        <FormAutocomplete
                        name="toJobRoleId"
                        label="Job Role"
                        options={jobRoleLookups}
                        />
                      </Box>
                    </Grid>
                  )}

                  <Grid item xs={6}>
                    <FormTextField
                      name="transferDate"
                      label="Transfer Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                    /> 
                  </Grid>

                  <Grid item xs={12}>
                    <FormikTextField
                      name="transferReason"
                      label="Transfer Reason"
                      multiline
                      rows={3}
                    />
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
          );
        }}
      </Formik>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="error">Something went wrong</Alert>
      </Snackbar>
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
