import { Form, Formik } from "formik";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  DialogHeader,
  Errors,
  FormSelectField,
  FormTextField,
  SelectOption,
} from "../../../../../components";
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
import { removeEmptyFields } from "../../../../../utils";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { useAlert } from "../../../../notification";
import {
  enums,
  UpdateEmployeePromotionCommand,
  useGetAllBusinessUnitsQuery,
  useGetEmployeeInfoQuery,
  useGetEmployeePromotionByIdQuery,
  useGetJobGradeOfJobRoleQuery,
  useGetJobRoleforPromotionQuery,
  useGetSalaryOfEmployeeByRoleQuery,
  useSearchBusinessUnitsQuery,
  useUpdateEmployeePromotionMutation,
} from "../../../../../app/api";
import {
  EmployeeTransactionStatus,
  PromotionType,
} from "../../../../../app/api/enums";
import { getEnumOptions } from "../../../../../components/form-controls/get-enum-list";
import { useJobRole } from "../../../../Jobs/Job/useJobRole";
import { skipToken } from "@reduxjs/toolkit/query";
import { JobGradeStepSalaryDialog } from "./JobGradeStepSalaryDialog";

const emptyEmployePromotion: UpdateEmployeePromotionCommand = {
  employeeId: undefined,
  promotionDate: undefined,
  promotionEndDate: undefined,
  jobRoleBeforeId: undefined,
  jobRoleAfterId: undefined,
  promotionType: enums.PromotionType.Promotion,
  businessUnitBeforeId: undefined,
  businessUnitAfterId: undefined,
  isBusinessUnitChange: false,
  beforeGradeSalaryStepId: undefined,
  afterGradeSalaryStepId: undefined,
};

interface EmployeePromotionUpdateProps {
  onClose: () => void;
  Id?: number;
}

export const EmployeePromotionUpdate = ({
  onClose,
  Id,
}: EmployeePromotionUpdateProps) => {
  const { showSuccessAlert, showErrorAlert } = useAlert();

  const [employeePromotion, setEmployeePromotion] =
    useState<UpdateEmployeePromotionCommand>(emptyEmployePromotion);

  const [updateEmployeePromotion, { error: updatePromotionError }] =
    useUpdateEmployeePromotionMutation();

  const PromotionId = Id ? Number(Id) : NaN;
  const {
    data: EmployeePromotionInfo,
    isLoading,
    error,
  } = useGetEmployeePromotionByIdQuery({ id: PromotionId });

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

  const valuesRef = useRef<any>(null);
  const setFieldValueRef = useRef<((field: string, value: any) => void) | null>(
    null
  );

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
  const handleStepConfirmAfter = (step: {
    stepId: number;
    stepNumber: number;
    salary: number;
  }) => {
    setStep(step.stepId);
    const setFieldValue = setFieldValueRef.current;
    if (!setFieldValue) return;
    setFieldValue("afterGradeSalaryStepId", step.stepNumber); // Set actual step ID
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
    stepNumber: number;
    salary: number;
  }) => {
    setStep(step.stepId);
    const setFieldValue = setFieldValueRef.current;
    if (!setFieldValue) return;
    setFieldValue("beforeGradeSalaryStepId", step.stepNumber); // Set actual step ID
  };
  //
  useEffect(() => {
    if (isLoading || error || !EmployeePromotionInfo) return;
    if (!isLoading && EmployeePromotionInfo && !error) {
      if (EmployeePromotionInfo.afterGradeSalaryStepId === 0) {
        setSelectedAfterValue(0);
      } else if (EmployeePromotionInfo.afterGradeSalaryStepId === 10) {
        setSelectedAfterValue(10);
      } else {
        setSelectedAfterValue(3); // from step
        setSelectStep(EmployeePromotionInfo?.afterGradeSalaryStepId ?? null); // set the actual step ID
      }

      // Handle "Before" salary radio selection
      if (EmployeePromotionInfo.beforeGradeSalaryStepId === 0) {
        setSelectedBeforeValue(0);
      } else if (EmployeePromotionInfo.beforeGradeSalaryStepId === 10) {
        setSelectedBeforeValue(10);
      } else {
        setSelectedBeforeValue(3); // from step
        setSelectStep(EmployeePromotionInfo?.beforeGradeSalaryStepId ?? null); // set the actual step ID
      }

      setEmployeePromotion({
        ...emptyEmployePromotion,
        ...EmployeePromotionInfo,
        promotionDate: EmployeePromotionInfo.promotionDate || undefined,
        promotionEndDate: EmployeePromotionInfo.promotionEndDate ?? undefined,
        businessUnitBeforeId: EmployeePromotionInfo?.businessUnitBeforeId,
        jobRoleBeforeId: EmployeePromotionInfo?.jobRoleBeforeId,
      });

      const jobRoleBefore = EmployeePromotionInfo.jobRoleBefore;
      if (
        jobRoleBefore &&
        !jobRoleListBeforeId.some((j) => j.id === jobRoleBefore.id)
      ) {
        setJobRoleListBeforeId((prev) => [...prev, jobRoleBefore]);
      }

      const jobRoleAfter = EmployeePromotionInfo.jobRoleAfter;
      if (
        jobRoleAfter &&
        !jobRoleListAfterId.some((j) => j.id === jobRoleAfter.id)
      ) {
        setJobRoleListAfterId((prev) => [...prev, jobRoleAfter]);
        setJobRoleGradeAfterId(
          EmployeePromotionInfo.jobRoleAfter?.jobGrade?.jobGradeId
        );
      }

      const businessUnitBefore = EmployeePromotionInfo.businessUnitBefore;
      if (
        businessUnitBefore &&
        !BusinessUnitListBeforeId.some((b) => b.id === businessUnitBefore.id)
      ) {
        setBusinessUnitListBeforeId((prev) => [...prev, businessUnitBefore]);
      }

      const businessUnitAfter = EmployeePromotionInfo.businessUnitAfter;
      if (
        businessUnitAfter &&
        !BusinessUnitListAfterId.some((b) => b.id === businessUnitAfter.id)
      ) {
        setBusinessUnitListAfterId((prev) => [...prev, businessUnitAfter]);
      }
    }
  }, [EmployeePromotionInfo, isLoading, error]);

  //

  useEffect(() => {
    const values = valuesRef.current;
    const setFieldValue = setFieldValueRef.current;
    if (!values || !setFieldValue) return;
    if (
      values.isBusinessUnitChange === false &&
      values.businessUnitAfterId !== values.businessUnitBeforeId
    ) {
      setFieldValue("businessUnitAfterId", values.businessUnitBeforeId ?? "");
    }
  }, [
    valuesRef.current?.isBusinessUnitChange,
    valuesRef.current?.businessUnitBeforeId,
  ]);

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
    (values: UpdateEmployeePromotionCommand) => {
      const promotionDate = values.promotionDate
        ? dayjs(values.promotionDate).format("YYYY-MM-DD")
        : "";

      const promotionEndDate = values.promotionEndDate
        ? dayjs(values.promotionEndDate).format("YYYY-MM-DD")
        : "";

      const payload = removeEmptyFields({
        ...values,
        promotionDate,
        promotionEndDate,
      });

      updateEmployeePromotion({
        updateEmployeePromotionCommand: payload, // <- update this key
      })
        .unwrap()
        .then((response: any) => {
          showSuccessAlert("Employee Promotion Updated Successfully");
          setEmployeePromotion(response);
          onClose();
        })
        .catch((error: any) => {
          //onClose();
        });
    },
    [onClose, updateEmployeePromotion]
  );

  // Prepare valid jobRole IDs
  const validJobRoleIds = jobRoleListAfter
    .map((j) => j.id)
    .filter((id): id is number => typeof id === "number");

  // Validation Schema
  const validationSchema = Yup.object({
    jobRoleAfterId: Yup.number()
      .typeError("Job Role After must be a number")
      .required("Job Role After is required")
      .oneOf(validJobRoleIds, "Please selecet JobRole"),

    promotionDate: Yup.date()
      .required("Promotion Date is required")
      .typeError("Invalid date"),

    remark: Yup.string()
      .nullable()
      .max(500, "Remark can't exceed 500 characters"),
  });
  //

  //

  const errorsUpdatingPromotion = (updatePromotionError as any)?.data?.errors;

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
    >
      {!!employeePromotion && (
        <Formik
          initialValues={employeePromotion || emptyEmployePromotion}
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
                  label: bu.name ?? "Unknown Business Unit",
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
                  title="Update Employee Promotion"
                  onClose={onClose}
                />
                <DialogContent dividers>
                  <Grid container spacing={2}>
                    {errorsUpdatingPromotion && (
                      <Grid item xs={12}>
                        <Errors errors={errorsUpdatingPromotion as any} />
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <FormSelectField
                          name="jobRoleBeforeId"
                          label="Job Role Before"
                          options={
                            EmployeePromotionInfo?.jobRoleBefore?.roleName &&
                            EmployeePromotionInfo?.jobRoleBefore?.roleName
                              ? [
                                  {
                                    value:
                                      EmployeePromotionInfo.jobRoleBefore?.id,
                                    label:
                                      EmployeePromotionInfo.jobRoleBefore
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
                                touched.jobRoleAfterId && errors.jobRoleAfterId
                              )}
                              helperText={
                                touched.jobRoleAfterId && errors.jobRoleAfterId
                                  ? errors.jobRoleAfterId
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
                          name="promotionDate"
                          label="Promotion Date"
                          type="date"
                          value={values.promotionDate || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          sx={{ width: "100%" }}
                        />
                        <FormTextField
                          name="promotionEndDate"
                          label="Promotion End Date"
                          type="date"
                          value={values.promotionEndDate || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          sx={{ width: "100%" }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <FormSelectField
                          name="promotionType"
                          label="Promotion Type"
                          options={getEnumOptions(PromotionType)}
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
                        label="Promotion Remark"
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
