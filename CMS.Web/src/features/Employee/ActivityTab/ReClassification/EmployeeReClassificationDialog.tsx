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
} from "@mui/material";
import {
  AddEmployeeReClassificationCommand,
  enums,
  useAddEmployeeReClassificationMutation,
  useGetEmployeeInfoQuery,
  useGetJobRoleforPromotionQuery,
} from "../../../../app/api";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { useAlert } from "../../../notification";
import { removeEmptyFields } from "../../../../utils";
import dayjs from "dayjs";
import { ReClassificationType } from "../../../../app/api/enums";
import { getEnumOptions } from "../../../../components/form-controls/get-enum-list";
import { skipToken } from "@reduxjs/toolkit/query";

const emptyEmployeReClassification = {
  employeeId: undefined,
  reClassificationDate: undefined,
  reClassificationEndDate: undefined,
  jobRoleBeforeId: undefined,
  jobRoleAfterId: 0,
  reClassificationType: enums.ReClassificationType.JobRoleChange,
  remark: undefined,
};

export const EmployeeReClassificationDialog = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const { showSuccessAlert } = useAlert();
  const { id } = useParams<{ id: string }>();
  const employeeId = id ? Number(id) : NaN;

  const [EmployeeReClassificationData, setEmployeeReClassificationData] =
    useState<AddEmployeeReClassificationCommand>();
  const [searchTextAfter, setSearchTextAfter] = useState<string>("");

  const { data: employeeInfo } = useGetEmployeeInfoQuery(
    !isNaN(employeeId) ? { id: employeeId } : skipToken
  );

  const [addEmployeeReClassification, { error: AddingReClassificationError }] =
    useAddEmployeeReClassificationMutation();

  const { data: jobRoleListAfter = [], isLoading: isJobRoleAfterLoading } =
    useGetJobRoleforPromotionQuery(
      { rolename: searchTextAfter },
      { skip: searchTextAfter.length < 4 }
    );

  const valuesRef = useRef<any>(null);
  const setFieldValueRef = useRef<((field: string, value: any) => void) | null>(
    null
  );

  // Initialize form data
  useEffect(() => {
    if (
      !EmployeeReClassificationData &&
      employeeId &&
      employeeInfo &&
      employeeInfo.businessUnitID
    ) {
      setEmployeeReClassificationData({
        ...emptyEmployeReClassification,
        employeeId,
        jobRoleBeforeId: employeeInfo?.job?.jobRoleId,
      });
    }
  }, [EmployeeReClassificationData, employeeId, employeeInfo]);

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

  // Handle form submission
  const handleSubmit = useCallback(
    (values: AddEmployeeReClassificationCommand) => {
      const reClassificationDate = values.reClassificationDate
        ? dayjs(values.reClassificationDate).format("YYYY-MM-DD")
        : null;

      const reClassificationEndDate = values.reClassificationEndDate
        ? dayjs(values.reClassificationEndDate).format("YYYY-MM-DD")
        : null;

      const payload = removeEmptyFields({
        ...values,
        reClassificationDate,
        reClassificationEndDate,
        employeeId,
      });

      addEmployeeReClassification({
        addEmployeeReClassificationCommand: payload,
      })
        .unwrap()
        .then((response) => {
          showSuccessAlert("Employee ReClassification Added Successfully");
          onClose();
        });
    },
    [onClose, addEmployeeReClassification, employeeId, showSuccessAlert]
  );

  const errorsOnAdding = (AddingReClassificationError as any)?.data?.errors;

  return (
    <Dialog scroll="paper" disableEscapeKeyDown maxWidth="md" open>
      {!!EmployeeReClassificationData && (
        <Formik
          initialValues={EmployeeReClassificationData}
          enableReinitialize
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
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
                  title="Add Employee ReClassification"
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
                          onChange={(_, newValue) => {
                            setFieldValue(
                              "jobRoleAfterId",
                              newValue ? newValue.id : null
                            );
                          }}
                          inputValue={searchTextAfter}
                          onInputChange={(_, newInputValue) => {
                            setSearchTextAfter(newInputValue);
                          }}
                          onBlur={() => setFieldTouched("jobRoleAfterId", true)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Job Role After"
                              name="jobRoleAfterId"
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

                    {/* Date Fields */}
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <FormTextField
                          name="reClassificationDate"
                          label="ReClassification Date"
                          type="date"
                          value={values.reClassificationDate || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          sx={{ width: "50%" }}
                        />
                        <FormTextField
                          name="reClassificationEndDate"
                          label="ReClassification End Date"
                          type="date"
                          value={values.reClassificationEndDate || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          sx={{ width: "50%" }}
                        />
                      </Box>
                    </Grid>

                    {/* Type */}
                    <Grid item xs={12}>
                      <FormSelectField
                        name="reClassificationType"
                        label="ReClassification Type"
                        options={getEnumOptions(ReClassificationType)}
                        sx={{ width: "50%" }}
                      />
                    </Grid>

                    {/* Remark */}
                    <Grid item xs={12}>
                      <FormTextField
                        name="remark"
                        label="ReClassification Remark"
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
    </Dialog>
  );
};
