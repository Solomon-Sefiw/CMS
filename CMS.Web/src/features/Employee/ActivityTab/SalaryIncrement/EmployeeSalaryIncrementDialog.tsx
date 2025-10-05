import { Form, Formik } from "formik";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  DialogHeader,
  FormSelectField,
  FormTextField,
  Errors,
} from "../../../../components";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
  Autocomplete,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
} from "@mui/material";
import {
  useAddEmployeeSalaryIncrementMutation,
  useGetEmployeeInfoQuery,
} from "../../../../app/api";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { useAlert } from "../../../notification";
import { removeEmptyFields } from "../../../../utils";
import dayjs from "dayjs";
import { skipToken } from "@reduxjs/toolkit/query";
import { AddSalaryIncrementCommand } from "../../../../app/api";
import { JobGradeStepSalaryDialog } from "./JobGradeStepSalaryDialog";
const emptyEmployeeSalaryIncrement = {
  employeeId: undefined,
  jobRoleId: undefined,
  salaryIncrementDate: undefined,
  salaryIncrementEndDate: undefined,
  beforeGradeSalaryStepId: undefined,
  afterGradeSalaryStepId: undefined,
  remark: undefined,
  transactionStatus: undefined,
};

export const EmployeeSalaryIncrementDialog = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const { showSuccessAlert } = useAlert();
  const { id } = useParams<{ id: string }>();
  const employeeId = id ? Number(id) : NaN;

  const [EmployeeSalaryIncrementData, setEmployeeSalaryIncrementData] =
    useState<AddSalaryIncrementCommand>();
  const [searchTextAfter, setSearchTextAfter] = useState<string>("");
  const { data: employeeInfo } = useGetEmployeeInfoQuery(
    !isNaN(employeeId) ? { id: employeeId } : skipToken
  );

  const [addEmployeeSalaryIncrement, { error: AddingSalaryIncrementError }] =
    useAddEmployeeSalaryIncrementMutation();

  const valuesRef = useRef<any>(null);
  const setFieldValueRef = useRef<((field: string, value: any) => void) | null>(
    null
  );

  useEffect(() => {
    if (!EmployeeSalaryIncrementData && employeeId && employeeInfo) {
      const initialData = {
        ...emptyEmployeeSalaryIncrement,
        employeeId,
        jobRoleId: employeeInfo?.job?.jobRoleId,
        beforeGradeSalaryStepId: employeeInfo?.salaryOnGradeStepId ?? undefined, // or however you access current step
      };

      setEmployeeSalaryIncrementData(initialData);
      const stepId = employeeInfo?.salaryOnGradeStepId;

      if (stepId === 0) {
        setSelectedBeforeValue(0);
      } else if (stepId === 10) {
        setSelectedBeforeValue(10);
      } else if (stepId) {
        setSelectedBeforeValue(3);
      }
    }
  }, [EmployeeSalaryIncrementData, employeeId, employeeInfo]);

  // Handle form submission
  const handleSubmit = useCallback(
    (values: AddSalaryIncrementCommand) => {
      const salaryIncrementDate = values.salaryIncrementDate
        ? dayjs(values.salaryIncrementDate).format("YYYY-MM-DD")
        : null;

      const salaryIncrementEndDate = values.salaryIncrementEndDate
        ? dayjs(values.salaryIncrementEndDate).format("YYYY-MM-DD")
        : null;

      const payload = removeEmptyFields({
        ...values,
        salaryIncrementDate,
        salaryIncrementEndDate,
        employeeId,
      });

      addEmployeeSalaryIncrement({ addSalaryIncrementCommand: payload })
        .unwrap()
        .then((response) => {
          showSuccessAlert("Salary Increment Done Successfully");
          onClose();
        })
        .catch((error) => {
          console.error("Error submitting salary increment:", error);
          if (error?.data?.title) {
            alert(error.data.title);
          }
        });
    },
    [onClose, addEmployeeSalaryIncrement, employeeId]
  );
  const [selectedAfterValue, setSelectedAfterValue] = useState<number>(0);
  const [selectedBeforeValue, setSelectedBeforeValue] = useState<number>(0);
  const [salaryType, setSalaryType] = useState<number>(1); // Same here
  const [selectStep, setSelectStep] = useState<number | null>(null);
  const [isStepModalOpenAfter, setIsStepModalOpenAfter] = useState(false);
  const [isStepModalOpenBefore, setIsStepModalOpenBefore] = useState(false);
  const [step, setStep] = useState<number>(0);
  const [jobRoleGradeAfterId, setJobRoleGradeAfterId] = useState<
    number | undefined
  >();

  const handleSalaryOptionChangeBefore = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selected = Number(event.target.value);
    setSelectedBeforeValue(selected);
    const setFieldValue = setFieldValueRef.current;
    if (!setFieldValue) return;

    if (selected === 0) {
      setFieldValue("beforeGradeSalaryStepId", 0); // insert 0
    } else if (selected === 10) {
      setFieldValue("beforeGradeSalaryStepId", 10); // insert 10
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
    setFieldValue("beforeGradeSalaryStepId", step.stepNumber); // Set actual step ID
  };
  //
  // --- Handle Salary Option Change ---
  const handleSalaryOptionChangeAfter = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selected = Number(event.target.value);
    setSelectedAfterValue(selected);
    //
    //setSelectedValue(selected);
    const setFieldValue = setFieldValueRef.current;
    if (!setFieldValue) return;

    if (selected === 0) {
      setFieldValue("afterGradeSalaryStepId", 0); // insert 0
    } else if (selected === 10) {
      setFieldValue("afterGradeSalaryStepId", 10); // insert 10
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
    setFieldValue("afterGradeSalaryStepId", step.stepNumber); // Set actual step ID
  };
  //
  const errorsOnAdding = (AddingSalaryIncrementError as any)?.data?.errors;

  return (
    <Dialog scroll="paper" disableEscapeKeyDown maxWidth="md" open>
      {!!EmployeeSalaryIncrementData && (
        <Formik
          initialValues={EmployeeSalaryIncrementData}
          enableReinitialize
          onSubmit={handleSubmit}
          validateOnChange
          validateOnBlur
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
                  title="Add Employee SalaryIncrement"
                  onClose={onClose}
                />
                <DialogContent dividers>
                  <Grid container spacing={2}>
                    {errors && (
                      <Grid item xs={12}>
                        <Errors errors={errorsOnAdding} />
                      </Grid>
                    )}

                    {/* Job Role Section */}
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

                    {/* Date Fields */}
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <FormTextField
                          name="salaryIncrementDate"
                          label="salaryIncrement Date"
                          type="date"
                          value={values.salaryIncrementDate || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          sx={{ width: "50%" }}
                        />
                        <FormTextField
                          name="salaryIncrementEndDate"
                          label="salaryIncrement End Date"
                          type="date"
                          value={values.salaryIncrementEndDate || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          sx={{ width: "50%" }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h6">Salary Settlement</Typography>
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
                              onChange={(e) => {
                                handleSalaryOptionChangeBefore(e);
                                setFieldValue(
                                  "beforeGradeSalaryStepId",
                                  Number(e.target.value)
                                );
                              }}
                            >
                              <FormControlLabel
                                value={0}
                                disabled
                                control={<Radio />}
                                label="Base Salary"
                              />
                              <FormControlLabel
                                value={10}
                                disabled
                                control={<Radio />}
                                label="Ceiling Salary"
                              />
                              <FormControlLabel
                                value={3}
                                disabled
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
                              onChange={(e) => {
                                handleSalaryOptionChangeAfter(e);
                                setFieldValue(
                                  "afterGradeSalaryStepId",
                                  Number(e.target.value)
                                );
                              }}
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

                    {/* Remark */}
                    <Grid item xs={12}>
                      <FormTextField
                        name="remark"
                        label="salary Increment Remark"
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

                {/* Actions */}
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
            stepNumber: step.stepNumber ?? 0,
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
            stepNumber: step.stepNumber ?? 0,
            salaryAmount: step.salaryAmount ?? 0,
          })
        )}
        onConfirm={handleStepConfirmBefore}
      />
    </Dialog>
  );
};
