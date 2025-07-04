import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import {
  DialogHeader,
  FormSelectField,
  FormTextField,
  SelectOption,
} from "../../components";

import CircularProgress from "@mui/material/CircularProgress";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import {
  EmployeeDto,
  useGetAllBusinessUnitsQuery,
  useGetAllJobListQuery,
} from "../../app/api/HCMSApi";
import { enums } from "../../app/api";
import { getEnumOptions } from "../../components/form-controls/get-enum-list";
import { ProbationResult } from "../../app/api/enums";
import { Form, Formik } from "formik";

const emptyEmployeeData = {
  firstName: "",
  employeeId: 0,
  middleName: "",
  lastName: "",
  amharicFirstName: "",
  amharicMiddleName: "",
  amharicLastName: "",
  businessUnitID: 0,
  jobId: 0,
  birthDate: "",
  employementDate: "",
  gender: enums.Gender.Male,
  martialStatus: enums.MartialStatus.Single,
  employeeStatus: enums.EmployeeStatusEnum.Active,
  probationRemark: "",
};

interface WorkflowActionDialogProps {
  title: string;
  textAreaTitle?: string;
  emptyTextAreaErrorMsg?: string;
  onClose: () => void;
  onSubmit: (Employee: EmployeeDto) => void;
  errors: any;
  submitting?: boolean;
  employee?: EmployeeDto;
}

export const ProbationWorkflowActionDialog = ({
  onSubmit,
  onClose,
  title,
  textAreaTitle,
  emptyTextAreaErrorMsg,
  errors,
  submitting,
  employee,
}: WorkflowActionDialogProps) => {
  const [formData, setFormData] = useState<EmployeeDto>(emptyEmployeeData);
  const { data: businessUnitJobList } = useGetAllJobListQuery();
  const { data: businessUnitList } = useGetAllBusinessUnitsQuery();

  useEffect(() => {
    if (employee) {
      setFormData({
        ...emptyEmployeeData,
        employeeId: employee.employeeId ?? 0,
        firstName: employee.firstName ?? "",
        middleName: employee.middleName ?? "",
        lastName: employee.lastName ?? "",
        employementDate: employee.employementDate ?? "",
        jobId: employee.jobId ?? 0,
        businessUnitID: employee.businessUnitID ?? 0,
        probationResult: employee.probationResult,
        probationRemark: employee.probationRemark ?? "",
      });
    }
  }, [employee]);

  const handleSubmit = useCallback(
    async (values: EmployeeDto) => {
      onSubmit({
        ...formData,
        ...values,
        probationRemark: values.probationRemark,
      });
    },
    [formData, onSubmit]
  );

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
    >
      <Formik
        initialValues={formData}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, values }) => (
          <Form onSubmit={handleSubmit}>
            <DialogHeader title={title} onClose={onClose} />
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormTextField name="firstName" label="First Name" disabled />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormTextField
                    name="middleName"
                    label="Middle Name"
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormTextField name="lastName" label="Last Name" disabled />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormTextField
                    name="employementDate"
                    label="Employment Date"
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormSelectField
                    name="jobId"
                    label="Job Role"
                    options={
                      businessUnitJobList
                        ?.filter((j) =>
                          j.businessUnitId === formData.businessUnitID
                            ? true
                            : j.isVacant === true
                        )
                        .map((j) => ({
                          value: j.id,
                          label: j.jobRole,
                        })) as SelectOption[]
                    }
                    value={formData.jobId || ""}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormSelectField
                    name="businessUnitID"
                    label="Business Unit"
                    options={
                      (businessUnitList?.approved || [])
                        .filter((j) => j.id === formData.businessUnitID)
                        .map((j) => ({
                          value: j.id,
                          label: j.name,
                        })) as SelectOption[]
                    }
                    value={formData.businessUnitID || ""}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormSelectField
                    name="probationResult"
                    label="Probation Result"
                    options={getEnumOptions(ProbationResult)}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormTextField
                    name="probationRemark"
                    type="textarea"
                    label="Probation Remark"
                    multiline
                    rows={4}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={onClose} variant="outlined">
                Cancel
              </Button>
              <Button
                color="primary"
                variant="contained"
                type="submit"
                disabled={submitting}
                startIcon={
                  submitting ? <CircularProgress size={16} /> : undefined
                }
              >
                Submit
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
