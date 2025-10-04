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
  UpdateEmployeeReClassificationCommand,
  useGetEmployeeInfoQuery,
  useGetEmployeeReClassificationByIdQuery,
  useGetJobGradeOfJobRoleQuery,
  useGetJobRoleforPromotionQuery,
  useSearchBusinessUnitsQuery,
  useUpdateEmployeeReClassificationMutation,
} from "../../../../app/api";
import {
  EmployeeTransactionStatus,
  ReClassificationType,
} from "../../../../app/api/enums";
import { getEnumOptions } from "../../../../components/form-controls/get-enum-list";
import { useJobRole } from "../../../Jobs/Job/useJobRole";
import { skipToken } from "@reduxjs/toolkit/query";

const emptyEmployeReClassification: UpdateEmployeeReClassificationCommand = {
  employeeId: undefined,
  reClassificationDate: undefined,
  reClassificationEndDate: undefined,
  jobRoleBeforeId: undefined,
  jobRoleAfterId: undefined,
  reClassificationType: enums.ReClassificationType.JobRoleChange,
};

interface EmployeeReClassificationUpdateProps {
  onClose: () => void;
  Id?: number;
}

export const EmployeeReClassificationUpdate = ({
  onClose,
  Id,
}: EmployeeReClassificationUpdateProps) => {
  const { showSuccessAlert, showErrorAlert } = useAlert();

  const [employeeReClassification, setEmployeeReClassification] =
    useState<UpdateEmployeeReClassificationCommand>(
      emptyEmployeReClassification
    );

  const [
    updateEmployeeReClassification,
    { error: updateReClassificationError },
  ] = useUpdateEmployeeReClassificationMutation();

  const reClassificationId = Id ? Number(Id) : NaN;
  const {
    data: EmployeeReClassificationInfo,
    isLoading,
    error,
  } = useGetEmployeeReClassificationByIdQuery({ id: reClassificationId });

  //
  const [searchTextAfter, setSearchTextAfter] = useState<string>("");
  const { data: jobRoleListAfter = [], isLoading: isJobRoleAfterLoading } =
    useGetJobRoleforPromotionQuery(
      { rolename: searchTextAfter },
      { skip: searchTextAfter.length < 4 }
    );

  const [jobRoleListBeforeId, setJobRoleListBeforeId] = useState<any[]>([]);
  const [jobRoleListAfterId, setJobRoleListAfterId] = useState<any[]>([]);

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
  const [jobRoleGradeAfterId, setJobRoleGradeAfterId] = useState<
    number | undefined
  >();
  const setFieldValueRef = useRef<((field: string, value: any) => void) | null>(
    null
  );

  const { data: GradeInfoAfter } = useGetJobGradeOfJobRoleQuery(
    jobRoleGradeAfterId ? { roleid: jobRoleGradeAfterId } : skipToken
  );
  const gradeId = GradeInfoAfter?.jobGrade?.jobGradeId;
  useEffect(() => {
    if (!isLoading && EmployeeReClassificationInfo && !error) {
      setEmployeeReClassification({
        ...emptyEmployeReClassification,
        ...EmployeeReClassificationInfo,
        reClassificationDate:
          EmployeeReClassificationInfo.reClassificationDate || undefined,
        reClassificationEndDate:
          EmployeeReClassificationInfo.reClassificationEndDate ?? undefined,
        jobRoleBeforeId: EmployeeReClassificationInfo?.jobRoleBeforeId,
      });

      const jobRoleBefore = EmployeeReClassificationInfo.jobRoleBefore;
      if (
        jobRoleBefore &&
        !jobRoleListBeforeId.some((j) => j.id === jobRoleBefore.id)
      ) {
        setJobRoleListBeforeId((prev) => [...prev, jobRoleBefore]);
      }

      const jobRoleAfter = EmployeeReClassificationInfo.jobRoleAfter;
      if (
        jobRoleAfter &&
        !jobRoleListAfterId.some((j) => j.id === jobRoleAfter.id)
      ) {
        setJobRoleListAfterId((prev) => [...prev, jobRoleAfter]);
        setJobRoleGradeAfterId(
          EmployeeReClassificationInfo.jobRoleAfter?.jobGrade?.jobGradeId
        );
      }
    }
  }, [EmployeeReClassificationInfo, isLoading, error, employeeInfo]);

  //

  const mergedJobRoleListAfter = [
    ...(jobRoleListAfterId || []),
    ...jobRoleListAfter.filter(
      (j) => !jobRoleListAfterId?.some((existing) => existing.id === j.id)
    ),
  ];

  const handleSubmit = useCallback(
    (values: UpdateEmployeeReClassificationCommand) => {
      const reClassificationDate = values.reClassificationDate
        ? dayjs(values.reClassificationDate).format("YYYY-MM-DD")
        : "";

      const reClassificationEndDate = values.reClassificationEndDate
        ? dayjs(values.reClassificationEndDate).format("YYYY-MM-DD")
        : "";

      const payload = removeEmptyFields({
        ...values,
        reClassificationDate,
        reClassificationEndDate,
      });

      updateEmployeeReClassification({
        updateEmployeeReClassificationCommand: payload,
      })
        .unwrap()
        .then((response: any) => {
          showSuccessAlert("Employee ReClassification Updated Successfully");
          setEmployeeReClassification(response);
          onClose();
        })
        .catch((error: any) => {
          //onClose();
        });
    },
    [onClose, updateEmployeeReClassification]
  );
  //

  const validJobRoleIds = jobRoleListAfter
    .map((j) => j.id)
    .filter((id): id is number => typeof id === "number");

  // Validation Schema
  const validationSchema = Yup.object({
    jobRoleAfterId: Yup.number()
      .typeError("Job Role After must be a number")
      .required("Job Role After is required")
      .oneOf(validJobRoleIds, "Please selecet JobRole"),

    reClassificationDate: Yup.date()
      .required("ReClassification Date is required")
      .typeError("Invalid date"),

    reClassificationType: Yup.number().required(
      "ReClassification Type is required"
    ),

    remark: Yup.string()
      .nullable()
      .max(500, "Remark can't exceed 500 characters"),
  });
  const errorUpdating = (updateReClassificationError as any)?.data?.errors;

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
    >
      {!!employeeReClassification && (
        <Formik
          initialValues={
            employeeReClassification || emptyEmployeReClassification
          }
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validateOnChange={true}
          validateOnBlur={true}
          validationSchema={validationSchema} // ✅ this is missing!
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
            setFieldValueRef.current = setFieldValue;
            const handleJobRoleAfterChange = (newValue: any) => {
              setJobRoleGradeAfterId(newValue?.id);
            };

            return (
              <Form>
                <DialogHeader
                  title="Update Employee ReClassification"
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
                          name="reClassificationDate"
                          label="ReClassification Date"
                          type="date"
                          value={values.reClassificationDate || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          sx={{ width: "100%" }}
                        />
                        <FormTextField
                          name="reClassificationEndDate"
                          label="ReClassification End Date"
                          type="date"
                          value={values.reClassificationEndDate || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          sx={{ width: "100%" }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <FormSelectField
                          name="reClassificationType"
                          label="ReClassification Type"
                          options={getEnumOptions(ReClassificationType)}
                          sx={{ width: "50%" }}
                        />
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
    </Dialog>
  );
};
