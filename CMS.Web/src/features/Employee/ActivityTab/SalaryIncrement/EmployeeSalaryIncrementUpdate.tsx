import { Form, Formik } from "formik";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  DialogHeader,
  Errors,
  FormSelectField,
  FormTextField,
  SelectOption,
} from "../../../../components";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Checkbox,
  Paper,
} from "@mui/material";
import dayjs from "dayjs";
import { removeEmptyFields } from "../../../../utils";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { useAlert } from "../../../notification";
import {
  UpdateSalaryIncrementCommand,
  useGetEmployeeInfoQuery,
  useGetSalaryIncrementByIdQuery,
  useUpdateSalaryIncrementMutation,
} from "../../../../app/api";
import { skipToken } from "@reduxjs/toolkit/query";
import { JobGradeStepSalaryDialog } from "./JobGradeStepSalaryDialog";
const emptySalaryIncrement: UpdateSalaryIncrementCommand = {
  id: undefined,
  employeeId: undefined,
  jobRoleId: undefined,
  salaryIncrementDate: undefined,
  salaryIncrementEndDate: undefined,
  beforeGradeSalaryStepId: undefined,
  afterGradeSalaryStepId: undefined,
  remark: undefined,
  transactionStatus: undefined,
};

interface EmployeeSalaryIncremenupdateProps {
  onClose: () => void;
  Id?: number;
}

export const EmployeeSalaryIncrementUpdate = ({
  onClose,
  Id,
}: EmployeeSalaryIncremenupdateProps) => {
  const { showSuccessAlert } = useAlert();
  const [employeeSalaryIncrement, setEmployeeSalaryIncrement] =
    useState<UpdateSalaryIncrementCommand>(emptySalaryIncrement);

  const [updateSalaryIncrement, { error: updateSalaryIncrementError }] =
    useUpdateSalaryIncrementMutation();

  const salaryIncrementId = Id ?? NaN;
  const {
    data: EmployeeSalaryIncremntInfo,
    isLoading,
    error,
  } = useGetSalaryIncrementByIdQuery({ id: salaryIncrementId });

  const { id } = useParams<{ id: string }>();
  const numericId =
    id !== undefined && !isNaN(Number(id)) ? Number(id) : undefined;

  const { data: employeeInfo } = useGetEmployeeInfoQuery(
    numericId !== undefined ? { id: numericId } : skipToken
  );

  const valuesRef = useRef<any>(null);
  const setFieldValueRef = useRef<((field: string, value: any) => void) | null>(
    null
  );

  useEffect(() => {
    if (!isLoading && EmployeeSalaryIncremntInfo && !error) {
      setEmployeeSalaryIncrement({
        ...emptySalaryIncrement,
        ...EmployeeSalaryIncremntInfo,
      });
    }
  }, [EmployeeSalaryIncremntInfo, isLoading, error]);
  const [selectedAfterValue, setSelectedAfterValue] = useState<number>(0);
  const [selectedBeforeValue, setSelectedBeforeValue] = useState<number>(0);
  const [salaryType, setSalaryType] = useState<number>(1); // Same here
  const [selectStep, setSelectStep] = useState<number | null>(null);
  const [isStepModalOpenAfter, setIsStepModalOpenAfter] = useState(false);
  const [isStepModalOpenBefore, setIsStepModalOpenBefore] = useState(false);
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    if (employeeSalaryIncrement.beforeGradeSalaryStepId !== undefined) {
      if (employeeSalaryIncrement?.beforeGradeSalaryStepId == 0) {
        setSelectedBeforeValue(0);
      } else if (employeeSalaryIncrement?.beforeGradeSalaryStepId == 10) {
        setSelectedBeforeValue(10);
      } else {
        setSelectedBeforeValue(3);
      }
    }
    if (employeeSalaryIncrement.afterGradeSalaryStepId !== undefined) {
      if (employeeSalaryIncrement?.afterGradeSalaryStepId == 0) {
        setSelectedAfterValue(0);
      } else if (employeeSalaryIncrement?.afterGradeSalaryStepId == 10) {
        setSelectedAfterValue(10);
      } else {
        setSelectedAfterValue(3);
      }
    }
  }, [employeeSalaryIncrement]);

  const handleSalaryOptionChangeBefore = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selected = Number(event.target.value);
    setSelectedBeforeValue(selected);
    const setFieldValue = setFieldValueRef.current;
    if (!setFieldValue) return;

    if (selected === 0) {
      setFieldValue("beforeGradeSalaryStepId", 0);
    } else if (selected === 10) {
      setFieldValue("beforeGradeSalaryStepId", 10);
    } else if (selected === 3) {
      setIsStepModalOpenBefore(true);
    }
  };
  // --- Handle Step Selection ---
  const handleStepConfirmBefore = (step: {
    stepId: number;
    stepNumber: number;
    salary: number;
  }) => {
    setStep(step.stepNumber);
    const setFieldValue = setFieldValueRef.current;
    if (!setFieldValue) return;
    setFieldValue("beforeGradeSalaryStepId", step.stepNumber);
  };
  //
  const handleSalaryOptionChangeAfter = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selected = Number(event.target.value);
    setSelectedAfterValue(selected);
    //
    const setFieldValue = setFieldValueRef.current;
    if (!setFieldValue) return;

    if (selected === 0) {
      setFieldValue("afterGradeSalaryStepId", 0);
    } else if (selected === 10) {
      setFieldValue("afterGradeSalaryStepId", 10);
    } else if (selected === 3) {
      setIsStepModalOpenAfter(true);
    }
  };

  // --- Handle Step Selection ---
  const handleStepConfirmAfter = (step: {
    stepId: number;
    stepNumber: number;
    salary: number;
  }) => {
    setStep(step.stepNumber);
    const setFieldValue = setFieldValueRef.current;
    if (!setFieldValue) return;
    setFieldValue("afterGradeSalaryStepId", step.stepNumber);
  };
  //

  const handleSubmit = useCallback(
    (values: UpdateSalaryIncrementCommand) => {
      const salaryIncrementDate = values.salaryIncrementDate
        ? dayjs(values.salaryIncrementDate).format("YYYY-MM-DD")
        : undefined;

      const salaryIncrementEndDate = values.salaryIncrementEndDate
        ? dayjs(values.salaryIncrementEndDate).format("YYYY-MM-DD")
        : undefined;

      const payload: UpdateSalaryIncrementCommand = {
        id: values.id!,
        employeeId: values.employeeId!,
        jobRoleId: values.jobRoleId,
        salaryIncrementDate,
        salaryIncrementEndDate,
        beforeGradeSalaryStepId: values.beforeGradeSalaryStepId,
        afterGradeSalaryStepId: values.afterGradeSalaryStepId,
        remark: values.remark,
        transactionStatus: values.transactionStatus,
      };

      updateSalaryIncrement({
        updateSalaryIncrementCommand: payload,
      })
        .unwrap()
        .then(() => {
          showSuccessAlert("Employee Salary Increment Updated Successfully");
          onClose();
        })
        .catch((error: any) => {
          console.error("Update failed:", error);
        });
    },
    [onClose, updateSalaryIncrement, showSuccessAlert]
  );

  const validationSchema = Yup.object({
    salaryIncrementDate: Yup.date()
      .required("Salary Increment Date is required")
      .typeError("Invalid date"),
    remark: Yup.string()
      .nullable()
      .max(500, "Remark can't exceed 500 characters"),
  });

  const errorUpdating = (updateSalaryIncrementError as any)?.data?.errors;

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
    >
      {!!employeeSalaryIncrement && (
        <Formik
          initialValues={employeeSalaryIncrement || emptySalaryIncrement}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validateOnChange={true}
          validateOnBlur={true}
          validationSchema={validationSchema}
        >
          {({
            values,
            handleChange,
            handleBlur,
            setFieldTouched,
            setFieldValue,
            touched,
            errors,
          }) => {
            valuesRef.current = values;
            setFieldValueRef.current = setFieldValue;
            return (
              <Form>
                <DialogHeader
                  title="Update Salary Increment"
                  onClose={onClose}
                />
                <DialogContent dividers>
                  <Grid container spacing={2}>
                    {errors && (
                      <Grid item xs={12}>
                        <Errors errors={errorUpdating as any} />
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <FormSelectField
                          name="jobRoleId"
                          label="Job Role "
                          options={
                            employeeInfo?.job?.jobRoleId &&
                            employeeInfo?.job?.jobRole?.roleName
                              ? [
                                  {
                                    value: employeeInfo.job.jobRoleId,
                                    label: employeeInfo.job.jobRole.roleName,
                                  },
                                ]
                              : []
                          }
                          value={values.jobRoleId}
                          disabled
                          fullWidth
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <FormTextField
                          name="salaryIncrementDate"
                          label="Salary Increment Date"
                          type="date"
                          value={values.salaryIncrementDate || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          sx={{ width: "100%" }}
                        />
                        <FormTextField
                          name="salaryIncrementEndDate"
                          label="Salary Increment End Date"
                          type="date"
                          value={values.salaryIncrementEndDate || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          sx={{ width: "100%" }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ mt: 2 }}>
                        Salary Settlement
                      </Typography>

                      <Grid container spacing={2}>
                        {/* BEFORE SALARY */}
                        <Grid item xs={6}>
                          <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                              Before Increment
                            </Typography>
                            <RadioGroup
                              row
                              name="beforeGradeSalaryStepId"
                              value={selectedBeforeValue}
                              onChange={handleSalaryOptionChangeBefore}
                            >
                              <FormControlLabel
                                value={0}
                                control={<Radio />}
                                label="Base Salary"
                              />
                              <FormControlLabel
                                value={10}
                                control={<Radio />}
                                label="Ceiling Salary"
                              />
                              <FormControlLabel
                                value={3}
                                control={<Radio />}
                                label="From Step"
                              />
                            </RadioGroup>
                          </Paper>
                        </Grid>

                        {/* AFTER SALARY */}
                        <Grid item xs={6}>
                          <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                              After Increment
                            </Typography>
                            <RadioGroup
                              row
                              name="afterGradeSalaryStepId"
                              value={selectedAfterValue}
                              onChange={handleSalaryOptionChangeAfter}
                            >
                              <FormControlLabel
                                value={0}
                                control={<Radio />}
                                label="Base Salary"
                              />
                              <FormControlLabel
                                value={10}
                                control={<Radio />}
                                label="Ceiling Salary"
                              />
                              <FormControlLabel
                                value={3}
                                control={<Radio />}
                                label="From Step"
                              />
                            </RadioGroup>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <FormTextField
                        name="remark"
                        label="Salary Increment Remark"
                        type="text"
                        value={values.remark || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        multiline
                        rows={4}
                      />
                    </Grid>
                  </Grid>
                </DialogContent>

                {/* Dialog Actions */}
                <DialogActions>
                  <Button onClick={onClose}>Cancel</Button>
                  <Button color="primary" variant="outlined" type="submit">
                    Save
                  </Button>
                </DialogActions>
              </Form>
            );
          }}
        </Formik>
      )}

      <JobGradeStepSalaryDialog
        open={isStepModalOpenAfter}
        onClose={() => setIsStepModalOpenAfter(false)}
        steps={(employeeInfo?.job?.jobRole?.jobGrade?.steps ?? []).map(
          (step) => ({
            id: step.id ?? 0,
            stepNumber: step.stepNumber ?? 0, // default to 0 if undefined
            salaryAmount: step.salaryAmount ?? 0,
          })
        )}
        onConfirm={handleStepConfirmAfter}
      />
      <JobGradeStepSalaryDialog
        open={isStepModalOpenBefore}
        onClose={() => setIsStepModalOpenBefore(false)}
        steps={(employeeInfo?.job?.jobRole?.jobGrade?.steps ?? []).map(
          (step) => ({
            id: step.id ?? 0,
            stepNumber: step.stepNumber ?? 0, // default to 0 if undefined
            salaryAmount: step.salaryAmount ?? 0, // default to 0 if undefined  handleStepConfirmBefore
          })
        )}
        onConfirm={handleStepConfirmBefore}
      />
    </Dialog>
  );
};
