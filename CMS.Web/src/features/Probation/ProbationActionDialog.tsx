import { useState, useEffect, useCallback } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  DialogHeader,
  FormSelectField,
  FormTextField,
  SelectOption,
} from "../../components";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Grid,
} from "@mui/material";
import {
  EmployeeDto,
  useGetAllJobListQuery,
  useGetAllBusinessUnitsQuery,
} from "../../app/api/HCMSApi";
import { enums } from "../../app/api";
import {
  useEmployeeProbationApproveMutation,
  useEmployeeProbationTerminationMutation,
  useRejectedProbationActivateMutation,
} from "../../app/api/HCMSApi";
import {
  EmployeeProbationApproveCommand,
  EmployeeProbationTerminationCommand,
} from "../../app/api/HCMSApi";
import { useAlert } from "../notification";
import { ProbationResult } from "../../app/api/enums";
import { getEnumOptions } from "../../components/form-controls/get-enum-list";
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
  probationResult: enums.ProbationResult.BecomePermanent,
  probationRemark: "",
};

interface EmployeeProbationProps {
  employee?: EmployeeDto;
  actionType?: string;
  onClose: () => void;
}

export const ProbationActionDialog = ({
  employee,
  actionType,
  onClose,
}: EmployeeProbationProps) => {
  const [formData, setFormData] = useState<EmployeeDto>(emptyEmployeeData);
  const { data: businessUnitJobList } = useGetAllJobListQuery();
  const { data: businessUnitList } = useGetAllBusinessUnitsQuery();
  const [ActivateProbation, { error: ActivateProbationError }] =
    useEmployeeProbationApproveMutation();
  const [DeactvateProbation, { error: DeactivatProbationError }] =
    useEmployeeProbationTerminationMutation();
  const [rejectedProbationActivate, { error: RejectedProbationErrro }] =
    useRejectedProbationActivateMutation();
  const { showErrorAlert, showSuccessAlert } = useAlert();
  useEffect(() => {
    if (employee) {
      setFormData({
        ...emptyEmployeeData,
        id: employee.id ?? 0,
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
    async (values: typeof formData) => {
      try {
        if (actionType === "Approve") {
          const command = {
            employeeProbationApproveCommand: {
              employeeId: values?.id,
              probationResult: values?.probationResult,
              probationRemark: values?.probationRemark,
            },
          };
          ActivateProbation(command);
          showSuccessAlert("Probation Period Approved Successfully");
        } else if (actionType === "Terminate") {
          const Command = {
            employeeProbationTerminationCommand: {
              employeeId: values?.id,
              probationResult: values?.probationResult,
              probationRemark: values?.probationRemark,
            },
          };
          DeactvateProbation(Command);
          showSuccessAlert("Probation Period Terminated Successfully");
        } else if (actionType === "Active") {
          const Command = {
            rejectedProbationActivateCommand: {
              employeeId: values?.id,
              probationResult: values?.probationResult,
              probationRemark: values?.probationRemark,
              employeeStatus: enums.EmployeeStatusEnum.UnderProbation,
            },
          };
          rejectedProbationActivate(Command);
          showSuccessAlert("Probation Period Activated Successfully");
        }
        onClose();
      } catch (error) {
        showErrorAlert("Probation Period Terminated/Approved Not Done");
        onClose();
      }
    },
    [actionType, employee, onClose]
  );

  return (
    <Dialog
      scroll="paper"
      disableEscapeKeyDown
      maxWidth="md"
      open={true}
      fullWidth
    >
      <Formik
        initialValues={formData}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, values }) => (
          <Form onSubmit={handleSubmit}>
            <DialogHeader title="Probation Action" onClose={onClose} />
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
                  {actionType === "Approve" && (
                    <FormSelectField
                      name="probationResult"
                      label="Probation Result"
                      value={ProbationResult.BecomePermanent}
                      options={getEnumOptions(ProbationResult)}
                    />
                  )}
                  {actionType !== "Approve" && (
                    <FormSelectField
                      name="probationResult"
                      label="Probation Result"
                      options={getEnumOptions(ProbationResult)}
                    />
                  )}
                </Grid>
                <Grid item xs={12}>
                  <FormTextField
                    name="probationRemark"
                    label="Probation Remark"
                    multiline
                    rows={4}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              {actionType === "Approve" && (
                <Button type="submit" color="success" variant="contained">
                  Approve Probation
                </Button>
              )}
              {actionType === "Terminate" && (
                <Button type="submit" color="warning" variant="contained">
                  Terminate Probation
                </Button>
              )}
              {actionType === "Extend" && (
                <Button type="submit" color="info" variant="contained">
                  Extend Probation
                </Button>
              )}
              {actionType === "Active" && (
                <Button type="submit" color="info" variant="contained">
                  Active Probation
                </Button>
              )}
              <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
