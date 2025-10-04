import { Form, Formik } from "formik";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  DialogHeader,
  FormSelectField,
  FormTextField,
  Errors,
  SelectOption,
} from "../../../../../components";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  Select,
  MenuItem,
  SelectChangeEvent,
  TextField,
  Autocomplete,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Typography,
} from "@mui/material";
import {
  AddEmployeePromotionCommand,
  enums,
  UpdateEmployeePromotionCommand,
  useAddEmployeePromotionMutation,
  useGetAllBusinessUnitsQuery,
  useGetEmployeeInfoQuery,
  useGetJobGradeOfJobRoleQuery,
  useGetJobRoleByIdQuery,
  useGetSalaryOfEmployeeByRoleQuery,
  useSearchBusinessUnitsQuery,
} from "../../../../../app/api";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { useAlert } from "../../../../notification";
import { removeEmptyFields } from "../../../../../utils";
import dayjs from "dayjs";
import {
  EmployeeTransactionStatus,
  PromotionType,
} from "../../../../../app/api/enums";
import { getEnumOptions } from "../../../../../components/form-controls/get-enum-list";
import { useBusinessUnit } from "../../../../BusinessUnit/useBusinessUnits";
import { useJobRole } from "../../../../Jobs/JobRole/useJobRole";
import { useGetJobRoleforPromotionQuery } from "../../../../../app/api";
import { skipToken } from "@reduxjs/toolkit/query";
import { FormCheckboxList } from "../../../../../components/form-controls/form-checkbox-list";
import { FormRadioGroup } from "../../FormRadioGroup";
import { JobGradeStepSalaryDialog } from "./JobGradeStepSalaryDialog";

const emptyEmployePromotion = {
  employeeId: undefined,
  promotionDate: undefined,
  promotionEndDate: undefined,
  jobRoleBeforeId: undefined,
  jobRoleAfterId: undefined,
  promotionType: enums.PromotionType.Promotion,
  businessUnitBeforeId: undefined,
  businessUnitAfterId: undefined,
  remark: undefined,
  isBusinessUnitChange: false,
  beforeGradeSalaryStepId: undefined,
  afterGradeSalaryStepId: undefined,
};

export const EmployeePromotionDialog = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const { showSuccessAlert, showErrorAlert } = useAlert();
  const [EmployeePromotionData, setEmployeePromotionData] =
    useState<AddEmployeePromotionCommand>();
  const [addEmployeePromotion, { error: AddingPromotionError }] =
    useAddEmployeePromotionMutation();
  const { id } = useParams<{ id: string }>();
  const employeeId = id ? Number(id) : NaN;
  //
  const numericId =
    id !== undefined && !isNaN(Number(id)) ? Number(id) : undefined;
  const { data: employeeInfo, refetch } = useGetEmployeeInfoQuery(
    numericId !== undefined ? { id: numericId } : skipToken
  );
  const { data: businessUnitList } = useGetAllBusinessUnitsQuery();

  const [selectedValue, setSelectedValue] = useState<number>(1); // Base Salary default
  const [selectStep, setSelectStep] = useState<number | null>(null);
  const [isStepModalOpenAfter, setIsStepModalOpenAfter] = useState(false);
  const [isStepModalOpenBefore, setIsStepModalOpenBefore] = useState(false);
  const [selectedAfterValue, setSelectedAfterValue] = useState<number>(0);
  const [selectedBeforeValue, setSelectedBeforeValue] = useState<number>(0);
  const [step, setStep] = useState<number>(0);
  const [jobRoleGradeAfterId, setJobRoleGradeAfterId] = useState<
    number | undefined
  >();
  const [BeforeSalaryType, setBeforeSalaryType] = useState<number>();
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
          salarytype: selectedValue,
          step: selectedValue === 3 ? selectStep ?? undefined : undefined,
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
    setStep(step.stepNumber);
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
    setStep(step.stepNumber);
    const setFieldValue = setFieldValueRef.current;
    if (!setFieldValue) return;
    setFieldValue("beforeGradeSalaryStepId", step.stepNumber); // Set actual step ID
  };
  //
  useEffect(() => {
    if (
      !EmployeePromotionData &&
      employeeId &&
      employeeInfo &&
      employeeInfo.businessUnitID
    ) {
      setEmployeePromotionData({
        ...emptyEmployePromotion,
        employeeId,
        businessUnitBeforeId: employeeInfo.businessUnitID,
        jobRoleBeforeId: employeeInfo?.job?.jobRoleId,
        businessUnitAfterId: employeeInfo.businessUnitID,
      });
    }
  }, [EmployeePromotionData, employeeId, employeeInfo]);

  useEffect(() => {
    if (employeeInfo) {
      if (employeeInfo?.salaryOnGradeStepId == 0) {
        setSelectedBeforeValue(0);
      } else if (employeeInfo?.salaryOnGradeStepId == 10) {
        setSelectedBeforeValue(10);
      } else {
        setSelectedBeforeValue(3);
      }
    }
  }, [employeeInfo]);
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
  }, [employeeInfo?.businessUnitID, valuesRef.current?.isBusinessUnitChange]);
  //
  const [searchTextAfter, setSearchTextAfter] = useState<string>("");
  const { data: jobRoleListAfter = [], isLoading: isJobRoleAfterLoading } =
    useGetJobRoleforPromotionQuery(
      { rolename: searchTextAfter },
      { skip: searchTextAfter.length < 4 }
    );
  //businessUnit on it
  const [BusinessUnitAfter, setBusinessUnitAfter] = useState<string>("");

  const {
    data: BusinessUnitListAfter = [],
    isLoading: BusinessUnitListAfterLoading,
  } = useSearchBusinessUnitsQuery(
    { query: BusinessUnitAfter },
    { skip: BusinessUnitAfter.length <= 2 }
  );
  //
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
  const handleSubmit = useCallback(
    (values: AddEmployeePromotionCommand) => {
      const promotionDate = values.promotionDate
        ? dayjs(values.promotionDate).format("YYYY-MM-DD")
        : null;

      const promotionEndDate = values.promotionEndDate
        ? dayjs(values.promotionEndDate).format("YYYY-MM-DD")
        : null;
      const payload = removeEmptyFields({
        ...values,
        promotionDate,
        promotionEndDate,
        employeeId,
      });

      addEmployeePromotion({
        addEmployeePromotionCommand: payload, // <- update this key
      })
        .unwrap()
        .then((response: any) => {
          showSuccessAlert("Employee Promotion Added Successfully");
          setEmployeePromotionData(response);
          onClose();
        })
        .catch((error: any) => {});
    },
    [onClose, addEmployeePromotion]
  );

  const errorsAddingPromotion = (AddingPromotionError as any)?.data?.errors;
  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
    >
      {!!EmployeePromotionData && (
        <Formik
          initialValues={EmployeePromotionData || emptyEmployePromotion}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          validateOnChange={true}
          validateOnBlur={true}
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

            const filteredBusinessUnitsAfter: SelectOption[] = [
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

              ...(values.businessUnitAfterId &&
              !(businessUnitList?.approved || []).some(
                (b) => b.id === values.businessUnitAfterId
              )
                ? [
                    {
                      value: values.businessUnitAfterId,
                      label: "Unknown Business Unit",
                    },
                  ]
                : []),
            ];

            return (
              <Form>
                <DialogHeader
                  title="Add Employee Promotion"
                  onClose={onClose}
                />
                <DialogContent dividers>
                  <Grid container spacing={2}>
                    {errorsAddingPromotion && (
                      <Grid item xs={12}>
                        <Errors errors={errorsAddingPromotion as any} />
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <FormSelectField
                          name="jobRoleBeforeId"
                          label="Job Role Before"
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
                          value={values.jobRoleBeforeId}
                          disabled
                          fullWidth
                        />
                        <Autocomplete
                          options={jobRoleListAfter}
                          loading={isJobRoleAfterLoading}
                          getOptionLabel={(option) => option.roleName || ""}
                          value={
                            jobRoleListAfter.find(
                              (option) => option.id === values.jobRoleAfterId
                            ) || null
                          }
                          onChange={(event, newValue) => {
                            setFieldValue(
                              "jobRoleAfterId",
                              newValue?.id || null
                            );
                            setJobRoleGradeAfterId(newValue?.id);
                          }}
                          inputValue={searchTextAfter}
                          onInputChange={(event, newInputValue) => {
                            setSearchTextAfter(newInputValue);
                          }}
                          onBlur={() => setFieldTouched("jobRoleAfterId", true)} // 👈 mark field as touched here
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
                          sx={{ width: "50%" }}
                          error={Boolean(
                            touched?.promotionDate && errors?.promotionDate
                          )}
                          helperText={
                            touched?.promotionDate ? errors?.promotionDate : ""
                          }
                        />
                        <FormTextField
                          name="promotionEndDate"
                          label="Promotion End Date"
                          type="date"
                          value={values.promotionEndDate || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          sx={{ width: "50%" }}
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
                          value={values.businessUnitBeforeId ?? ""}
                          sx={{ width: "100%" }}
                          disabled
                        />
                        {!values.isBusinessUnitChange ? (
                          <FormSelectField
                            name="businessUnitAfterId"
                            label="Business Unit After"
                            options={filteredBusinessUnitsAfter}
                            value={values.businessUnitAfterId ?? ""}
                            sx={{ width: "100%" }}
                            disabled
                          />
                        ) : (
                          <Autocomplete
                            options={BusinessUnitListAfter}
                            loading={BusinessUnitListAfterLoading}
                            getOptionLabel={(option) => option.name || ""}
                            value={
                              BusinessUnitListAfter.find(
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
                                label="Business Unit After"
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
                              />
                            )}
                            sx={{ width: "100%" }}
                          />
                        )}
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
                        </Box>
                        <Box>
                          <Typography>From Salary After</Typography>

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
                        </Box>
                      </Box>
                    </Grid>

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
          salaryAmount: step.salaryAmount ?? 0, // default to 0 if undefined  handleStepConfirmBefore
        }))}
        onConfirm={handleStepConfirmAfter}
      />
      <JobGradeStepSalaryDialog
        open={isStepModalOpenBefore}
        onClose={() => setIsStepModalOpenBefore(false)}
        steps={(GradeInfoAfter?.jobGrade?.steps ?? []).map((step) => ({
          id: step.id ?? 0,
          stepNumber: step.stepNumber ?? 0, // default to 0 if undefined
          salaryAmount: step.salaryAmount ?? 0, // default to 0 if undefined  handleStepConfirmBefore
        }))}
        onConfirm={handleStepConfirmBefore}
      />
    </Dialog>
  );
};
