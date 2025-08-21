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
} from "@mui/material";
import dayjs from "dayjs";
import { removeEmptyFields } from "../../../../utils";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { useAlert } from "../../../notification";
import {
  enums,
  UpdateEmployeeDemotionCommand,
  UpdateEmployeePromotionCommand,
  useGetAllBusinessUnitsQuery,
  useGetEmployeeDemotionByIdQuery,
  useGetEmployeeInfoQuery,
  useGetEmployeePromotionByIdQuery,
  useGetJobGradeOfJobRoleQuery,
  useGetJobRoleforPromotionQuery,
  useGetSalaryOfEmployeeByRoleQuery,
  useSearchBusinessUnitsQuery,
  useUpdateEmployeeDemotionMutation,
  useUpdateEmployeePromotionMutation,
} from "../../../../app/api";
import {
  EmployeeTransactionStatus,
  PromotionType,
} from "../../../../app/api/enums";
import { getEnumOptions } from "../../../../components/form-controls/get-enum-list";
import { useJobRole } from "../../../Jobs/Job/useJobRole";
import { skipToken } from "@reduxjs/toolkit/query";
import { DemotionType } from "../../../../app/api/enums";
import { JobGradeStepSalaryDialog } from "../Promotion/EmployeePromotion/JobGradeStepSalaryDialog";

const emptyEmployeDemotion: UpdateEmployeeDemotionCommand = {
  employeeId: undefined,
  demotionDate: undefined,
  demotionEndDate: undefined,
  jobRoleBeforeId: undefined,
  jobRoleAfterId: undefined,
  demotionType: enums.DemotionType.Other,
  businessUnitBeforeId: undefined,
  businessUnitAfterId: undefined,
  isBusinessUnitChange: false,
  beforeGradeSalaryStepId: 0,
  afterGradeSalaryStepId: 0,
};

interface EmployeeDemotionUpdateProps {
  onClose: () => void;
  Id?: number;
}

export const EmployeeDemotionUpdate = ({
  onClose,
  Id,
}: EmployeeDemotionUpdateProps) => {
  const { showSuccessAlert, showErrorAlert } = useAlert();
  const [employeeDemotion, setEmployeeDemotion] =
    useState<UpdateEmployeeDemotionCommand>(emptyEmployeDemotion);
  const [updateEmployeeDemotion, { error: updateDemotionError }] =
    useUpdateEmployeeDemotionMutation();
  const demotionId = Id ? Number(Id) : NaN;
  const {
    data: EmployeeDemotionInfo,
    isLoading,
    error,
  } = useGetEmployeeDemotionByIdQuery({ id: demotionId });
  //
  const [searchTextBefore, setSearchTextBefore] = useState<string>("");

  const [searchTextAfter, setSearchTextAfter] = useState<string>("");
  const { data: jobRoleListAfter = [], isLoading: isJobRoleAfterLoading } =
    useGetJobRoleforPromotionQuery(
      { rolename: searchTextAfter },
      { skip: searchTextAfter.length < 4 }
    );

  const [jobRoleListBeforeId, setJobRoleListBeforeId] = useState<any[]>([]);
  const [jobRoleListAfterId, setJobRoleListAfterId] = useState<any[]>([]);
  //
  const [BusinessUnitListBeforeId, setBusinessUnitListBeforeId] = useState<
    any[]
  >([]);
  const [BusinessUnitListAfterId, setBusinessUnitListAfterId] = useState<any[]>(
    []
  );
  const [BusinessUnitAfter, setBusinessUnitAfter] = useState<string>("");
  const {
    data: BusinessUnitListAfter = [],
    isLoading: BusinessUnitListAfterLoading,
  } = useSearchBusinessUnitsQuery(
    { query: BusinessUnitAfter },
    { skip: BusinessUnitAfter.length <= 2 }
  );
  //
  const { id } = useParams<{ id: string }>();
  const employeeId = id ? Number(id) : NaN;
  const numericId =
    id !== undefined && !isNaN(Number(id)) ? Number(id) : undefined;
  const { data: employeeInfo, refetch } = useGetEmployeeInfoQuery(
    numericId !== undefined ? { id: numericId } : skipToken
  );
  const { data: businessUnitList } = useGetAllBusinessUnitsQuery();
  const [selectedAfterValue, setSelectedAfterValue] = useState<number>(1);
  const [selectedBeforeValue, setSelectedBeforeValue] = useState<number>(1);
  const [salaryType, setSalaryType] = useState<number>(1); // Same here
  const [selectStep, setSelectStep] = useState<number | null>(null);
  const [isStepModalOpenAfter, setIsStepModalOpenAfter] = useState(false);
  const [isStepModalOpenBefore, setIsStepModalOpenBefore] = useState(false);
  const [step, setStep] = useState<number>(0);
  const [jobRoleGradeAfterId, setJobRoleGradeAfterId] = useState<
    number | undefined
  >();

  const { data: GradeInfoAfter } = useGetJobGradeOfJobRoleQuery(
    jobRoleGradeAfterId ? { roleid: jobRoleGradeAfterId } : skipToken
  );

  const gradeId = GradeInfoAfter?.jobGrade?.jobGradeId;

  const { data: salaryAfterfromJobGrade } = useGetSalaryOfEmployeeByRoleQuery(
    gradeId
      ? {
          gradeId,
          salarytype: selectedAfterValue,
          step: selectedAfterValue === 3 ? selectStep ?? undefined : undefined,
          stepId: step,
        }
      : skipToken
  );
  const valuesRef = useRef<any>(null);
  const setFieldValueRef = useRef<((field: string, value: any) => void) | null>(
    null
  );
  // --- Handle Salary Option Change ---
  const handleSalaryOptionChangeAfter = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selected = Number(event.target.value);
    setSelectedAfterValue(selected);
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
  const handleStepConfirmAfter = (step: { stepId: number; salary: number }) => {
    setStep(step.stepId);
    setSelectStep(step.stepId);
    const setFieldValue = setFieldValueRef.current;
    if (!setFieldValue) return;
    setFieldValue("afterGradeSalaryStepId", step.stepId); // Set actual step ID
  };
  //
  // --- Handle Salary Option Change ---
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
    salary: number;
  }) => {
    setStep(step.stepId);
    setSelectStep(step.stepId);
    const setFieldValue = setFieldValueRef.current;
    if (!setFieldValue) return;
    setFieldValue("beforeGradeSalaryStepId", step.stepId); // Set actual step ID
  };
  //
  useEffect(() => {
    if (!isLoading && EmployeeDemotionInfo && !error) {
      if (EmployeeDemotionInfo.afterGradeSalaryStepId === 0) {
        setSelectedAfterValue(0);
      } else if (EmployeeDemotionInfo.afterGradeSalaryStepId === 10) {
        setSelectedAfterValue(10);
      } else {
        setSelectedAfterValue(3); // from step
        setSelectStep(EmployeeDemotionInfo?.afterGradeSalaryStepId ?? null); // set the actual step ID
      }

      // Handle "Before" salary radio selection
      if (EmployeeDemotionInfo.beforeGradeSalaryStepId === 0) {
        setSelectedBeforeValue(0);
      } else if (EmployeeDemotionInfo.beforeGradeSalaryStepId === 10) {
        setSelectedBeforeValue(10);
      } else {
        setSelectedBeforeValue(3); // from step
        setSelectStep(EmployeeDemotionInfo?.beforeGradeSalaryStepId ?? null); // set the actual step ID
      }

      setEmployeeDemotion({
        ...emptyEmployeDemotion,
        ...EmployeeDemotionInfo,
        demotionDate: EmployeeDemotionInfo.demotionDate || undefined,
        demotionEndDate: EmployeeDemotionInfo.demotionEndDate ?? undefined,
        businessUnitBeforeId: EmployeeDemotionInfo?.businessUnitBeforeId,
        jobRoleBeforeId: EmployeeDemotionInfo?.jobRoleBeforeId,
      });

      const jobRoleBefore = EmployeeDemotionInfo.jobRoleBefore;
      if (
        jobRoleBefore &&
        !jobRoleListBeforeId.some((j) => j.id === jobRoleBefore.id)
      ) {
        setJobRoleListBeforeId((prev) => [...prev, jobRoleBefore]);
      }

      const jobRoleAfter = EmployeeDemotionInfo.jobRoleAfter;
      if (
        jobRoleAfter &&
        !jobRoleListAfterId.some((j) => j.id === jobRoleAfter.id)
      ) {
        setJobRoleListAfterId((prev) => [...prev, jobRoleAfter]);
        setJobRoleGradeAfterId(
          EmployeeDemotionInfo.jobRoleAfter?.jobGrade?.jobGradeId
        );
      }

      const businessUnitBefore = EmployeeDemotionInfo.businessUnitBefore;
      if (
        businessUnitBefore &&
        !BusinessUnitListBeforeId.some((b) => b.id === businessUnitBefore.id)
      ) {
        setBusinessUnitListBeforeId((prev) => [...prev, businessUnitBefore]);
      }

      const businessUnitAfter = EmployeeDemotionInfo.businessUnitAfter;
      if (
        businessUnitAfter &&
        !BusinessUnitListAfterId.some((b) => b.id === businessUnitAfter.id)
      ) {
        setBusinessUnitListAfterId((prev) => [...prev, businessUnitAfter]);
      }
    }
  }, [
    EmployeeDemotionInfo,
    isLoading,
    error,
    employeeInfo,
    jobRoleListBeforeId,
    jobRoleListAfterId,
    BusinessUnitListBeforeId,
    BusinessUnitListAfterId,
  ]);

  //

  const mergedJobRoleListAfter = [
    ...(jobRoleListAfterId || []),
    ...jobRoleListAfter.filter(
      (j) => !jobRoleListAfterId?.some((existing) => existing.id === j.id)
    ),
  ];

  const mergedBusinessUnitListAfter = [
    ...(BusinessUnitListAfterId ?? []),
    ...BusinessUnitListAfter.filter(
      (b) =>
        !(BusinessUnitListAfterId ?? []).some(
          (existing) => existing.id === b.id
        )
    ),
  ];
  const handleSubmit = useCallback(
    (values: UpdateEmployeeDemotionCommand) => {
      const demotionDate = values.demotionDate
        ? dayjs(values.demotionDate).format("YYYY-MM-DD")
        : "";

      const demotionEndDate = values.demotionEndDate
        ? dayjs(values.demotionEndDate).format("YYYY-MM-DD")
        : "";

      const payload = removeEmptyFields({
        ...values,
        demotionDate,
        demotionEndDate,
      });

      updateEmployeeDemotion({
        updateEmployeeDemotionCommand: payload, // <- update this key
      })
        .unwrap()
        .then((response: any) => {
          showSuccessAlert("Employee Promotion Updated Successfully");
          setEmployeeDemotion(response);
          onClose();
        })
        .catch((error: any) => {
          //onClose();
        });
    },
    [onClose, updateEmployeeDemotion]
  );
  //

  const validationSchema = Yup.object().shape({
    jobRoleAfterId: Yup.number()
      .required("Job Role After is required")
      .typeError("Job Role After is required"),

    demotionDate: Yup.date()
      .required("Promotion Date is required")
      .typeError("Invalid date"),

    demotionType: Yup.number().required("Promotion Type is required"),

    businessUnitAfterId: Yup.number()
      .required("Business Unit After is required")
      .typeError("Business Unit After is required"),

    isBusinessUnitChange: Yup.boolean(),

    remark: Yup.string()
      .nullable()
      .max(500, "Remark can't exceed 500 characters"),
  });
  //
  const errorsUpdatingDemotion = (updateDemotionError as any)?.data?.errors;

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
    >
      {!!employeeDemotion && (
        <Formik
          initialValues={employeeDemotion || emptyEmployeDemotion}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validateOnChange={true}
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
            const filteredBusinessUnits: SelectOption[] = [
              ...(businessUnitList?.approved || [])
                .filter((bu) =>
                  employeeInfo?.businessUnitID
                    ? bu.id === employeeInfo.businessUnitID
                    : true
                )
                .map((bu) => ({
                  value: bu.id,
                  label: bu.name ?? "Unnamed Business Unit",
                })),

              ...(values.businessUnitBeforeId &&
              !(businessUnitList?.approved || []).some(
                (b) => b.id === values.businessUnitBeforeId
              )
                ? [
                    {
                      value: values.businessUnitBeforeId,
                      label: "Unknown Business Unit",
                    },
                  ]
                : []),
            ];
            const handleJobRoleAfterChange = (newValue: any) => {
              setJobRoleGradeAfterId(newValue?.id);
            };

            return (
              <Form>
                <DialogHeader
                  title="Update Employee Demotion"
                  onClose={onClose}
                />
                <DialogContent dividers>
                  <Grid container spacing={2}>
                    {errorsUpdatingDemotion && (
                      <Grid item xs={12}>
                        <Errors errors={errorsUpdatingDemotion as any} />
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <FormSelectField
                          name="jobRoleBeforeId"
                          label="Job Role Before"
                          options={
                            EmployeeDemotionInfo?.jobRoleBefore?.roleName &&
                            EmployeeDemotionInfo?.jobRoleBefore?.roleName
                              ? [
                                  {
                                    value:
                                      EmployeeDemotionInfo.jobRoleBefore?.id,
                                    label:
                                      EmployeeDemotionInfo.jobRoleBefore
                                        .roleName,
                                  },
                                ]
                              : []
                          }
                          value={values.jobRoleBeforeId}
                          disabled
                          fullWidth
                        />
                        <Autocomplete
                          options={mergedJobRoleListAfter}
                          loading={isJobRoleAfterLoading}
                          getOptionLabel={(option) => option.roleName || ""}
                          value={
                            mergedJobRoleListAfter.find(
                              (option) => option.id === values.jobRoleAfterId
                            ) || null
                          }
                          onChange={(event, newValue) => {
                            setFieldValue(
                              "jobRoleAfterId",
                              newValue?.id || null
                            );
                            handleJobRoleAfterChange(newValue);
                          }}
                          inputValue={searchTextAfter}
                          onInputChange={(event, newInputValue) => {
                            setSearchTextAfter(newInputValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="JobRole After"
                              name="jobRoleAfterId"
                              onBlur={handleBlur}
                              error={Boolean(
                                touched?.jobRoleAfterId &&
                                  errors?.jobRoleAfterId
                              )}
                              helperText={
                                touched?.jobRoleAfterId
                                  ? errors?.jobRoleAfterId
                                  : ""
                              }
                              fullWidth
                            />
                          )}
                          sx={{ width: "100%" }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <FormTextField
                          name="demotionDate"
                          label="Demotion Date"
                          type="date"
                          value={values.demotionDate || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          sx={{ width: "100%" }}
                        />
                        <FormTextField
                          name="demotionEndDate"
                          label="Demotion End Date"
                          type="date"
                          value={values.demotionEndDate || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          sx={{ width: "100%" }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <FormSelectField
                          name="demotionType"
                          label="Demotion Type"
                          options={getEnumOptions(DemotionType)}
                          sx={{ width: "50%" }}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              name="isBusinessUnitChange"
                              checked={values.isBusinessUnitChange}
                              onChange={(e) => {
                                handleChange(e);
                                const checked = e.target.checked;
                                const values = valuesRef.current;
                                const setFieldValue = setFieldValueRef.current;

                                if (!checked && values && setFieldValue) {
                                  setFieldValue(
                                    "businessUnitAfterId",
                                    values.businessUnitBeforeId ?? ""
                                  );
                                }
                              }}
                              onBlur={handleBlur}
                            />
                          }
                          label="Is BusinessUnit Change"
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <FormSelectField
                          name="businessUnitBeforeId"
                          label="Business Unit Before"
                          options={filteredBusinessUnits}
                          value={values.businessUnitBeforeId ?? ""} // <-- selected value here
                          sx={{ width: "100%" }}
                          disabled
                        />

                        <Autocomplete
                          options={mergedBusinessUnitListAfter}
                          loading={BusinessUnitListAfterLoading}
                          getOptionLabel={(option) => option.name || ""}
                          value={
                            mergedBusinessUnitListAfter.find(
                              (option) =>
                                option.id === values.businessUnitAfterId
                            ) || null
                          }
                          onChange={(event, newValue) => {
                            setFieldValue(
                              "businessUnitAfterId",
                              newValue?.id || ""
                            );
                          }}
                          inputValue={BusinessUnitAfter}
                          onInputChange={(event, newInputValue) => {
                            setBusinessUnitAfter(newInputValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="BusinessUnit After"
                              name="businessUnitAfterId"
                              onBlur={handleBlur}
                              error={Boolean(
                                touched?.businessUnitAfterId &&
                                  errors?.businessUnitAfterId
                              )}
                              helperText={
                                touched?.businessUnitAfterId
                                  ? errors?.businessUnitAfterId
                                  : ""
                              }
                              fullWidth
                              disabled={
                                !Boolean(Number(values.isBusinessUnitChange))
                              }
                            />
                          )}
                          sx={{ width: "100%" }}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Box>
                          <Typography>From Salary Before</Typography>

                          <RadioGroup
                            row
                            name="beforeGradeSalaryStepId"
                            value={selectedBeforeValue}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setSelectedBeforeValue(val);
                              handleSalaryOptionChangeBefore(e);
                              setFieldValue("beforeGradeSalaryStepId", val);
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
                        </Box>
                        <Box>
                          <Typography>From Salary After</Typography>

                          <RadioGroup
                            row
                            name="afterGradeSalaryStepId"
                            value={selectedAfterValue}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setSelectedAfterValue(val);
                              handleSalaryOptionChangeAfter(e);
                              setFieldValue("afterGradeSalaryStepId", val);
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
                        </Box>
                      </Box>
                    </Grid>

                    {/* Job Title, City, Last Salary */}

                    <Grid item xs={12}>
                      <FormTextField
                        name="remark"
                        label="Demotion Remark"
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
        steps={(GradeInfoAfter?.jobGrade?.steps ?? []).map((step) => ({
          id: step.id ?? 0,
          stepNumber: step.stepNumber ?? 0, // default to 0 if undefined
          salaryAmount: step.salaryAmount ?? 0, // default to 0 if undefined
        }))}
        onConfirm={handleStepConfirmAfter}
      />
      <JobGradeStepSalaryDialog
        open={isStepModalOpenBefore}
        onClose={() => setIsStepModalOpenBefore(false)}
        steps={(GradeInfoAfter?.jobGrade?.steps ?? []).map((step) => ({
          id: step.id ?? 0,
          stepNumber: step.stepNumber ?? 0, // default to 0 if undefined
          salaryAmount: step.salaryAmount ?? 0, // default to 0 if undefined
        }))}
        onConfirm={handleStepConfirmBefore}
      />
    </Dialog>
  );
};
