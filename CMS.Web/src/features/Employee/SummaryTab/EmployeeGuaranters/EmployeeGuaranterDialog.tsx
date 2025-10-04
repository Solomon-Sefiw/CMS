import { Form, Formik } from "formik";
import { useState, useCallback } from "react";
import {
  DialogHeader,
  FormTextField,
  FormSelectField,
} from "../../../../components";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  AddEmployeeGurantersCommand,
  useAddEmployeeGurantersMutation,
} from "../../../../app/api/HCMSApi";
import { removeEmptyFields } from "../../../../utils";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import dayjs from "dayjs";
import { Activation } from "../../../../app/api/enums";
import { enums } from "../../../../app/api";
import { useAlert } from "../../../notification/useAlert";

const emptyEmployeeGuaranter = {
  identificationCardNo: "",
  name: "",
  fathersName: "",
  grandfathersName: "",
  workingFirm: "",
  employeeId: 0,
  referenceno: "",
  salary: 0.0,
  guaranteeType: enums.Guarantee.OutWard,
  fromDate: "",
  toDate: "",
  active: enums.Activation.Active,
};

export const EmployeeGuaranterDialog = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const [employeeGuaranter, setEmployeeGuaranter] =
    useState<AddEmployeeGurantersCommand>(emptyEmployeeGuaranter);
  const [addEmployeeGuaranter] = useAddEmployeeGurantersMutation();
  const { id } = useParams<{ id: string }>();
  const employeeId = id ? Number(id) : NaN;
  const { showSuccessAlert, showErrorAlert } = useAlert();
  const [OutWardchecked, setOutWardChecked] = useState(false);
  const [InWardChecked, setInWardChecked] = useState(false);
  const [Active, setActive] = useState(true);

  const validationSchema = Yup.object({
    identificationCardNo: Yup.string()
      .required("Identification Card Number is required")
      .max(50, "IdentificationCardNo exceeds 50 characters"),
    name: Yup.string()
      .required("Name is required")
      .matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces")
      .min(2, "Name should be at least 2 characters long")
      .max(30, "Name should not be longer than 30 characters"),

    fathersName: Yup.string()
      .required("Father's Name is required")
      .matches(
        /^[A-Za-z\s]+$/,
        "fathersName can only contain letters and spaces"
      )
      .min(2, "Father's Name should be at least 2 characters long")
      .max(30, "Father's names exceeds 30 characters"),

    referenceno: Yup.string().max(50, "Reference number exceeds 50 number"),
    grandfathersName: Yup.string()
      .required("Grandfather's Name is required")
      .matches(
        /^[A-Za-z\s]+$/,
        "Grandfather can only contain letters and spaces"
      )
      .min(2, "Grandfather's Name should be at least 2 characters long")
      .max(30, "Grandfather's name exceeds 30 characters"),

    workingFirm: Yup.string()
      .required("Working Firm is required")
      .min(2, "Working Firm should be at least 2 characters long")
      .max(100, "Working Firm should not be longer than 100 characters"),

    fromDate: Yup.date().nullable().notRequired(), // Make fromDate optional
    toDate: Yup.date().nullable().notRequired(),
  });

  const handleSubmit = useCallback(
    (values: AddEmployeeGurantersCommand) => {
      const fromDate = values.fromDate
        ? dayjs(values.fromDate).format("YYYY-MM-DD")
        : null;
      const toDate = values.toDate
        ? dayjs(values.toDate).format("YYYY-MM-DD")
        : null;

      const payload = removeEmptyFields({
        ...values,
        employeeId,
        fromDate,
        toDate,
      });

      addEmployeeGuaranter({
        addEmployeeGurantersCommand: payload,
      })
        .unwrap()
        .then((response: any) => {
          showSuccessAlert("Employee Guaranter Added Successfully");
          onClose();
        })
        .catch((error: any) => {
          showErrorAlert("Failed to Add Employee Guaranter");
          onClose();
        });
    },
    [onClose, addEmployeeGuaranter, employeeId]
  );

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
    >
      <Formik
        initialValues={employeeGuaranter}
        enableReinitialize={true}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ values, handleChange, handleBlur, setFieldValue }) => (
          <Form>
            <DialogHeader title="Add Employee Guaranter" onClose={onClose} />
            <DialogContent dividers>
              <Grid container spacing={2}>
                {/* Employee Guaranter Details */}
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <FormTextField
                      name="name"
                      label="First Name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <FormTextField
                      name="fathersName"
                      label="Father's Name"
                      value={values.fathersName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <FormTextField
                      name="grandfathersName"
                      label="Grandfather's Name"
                      value={values.grandfathersName || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Box>
                </Grid>

                {/* Optional Field for Grandfather's Name */}
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <FormTextField
                      name="identificationCardNo"
                      label="Identification Card No"
                      value={values.identificationCardNo}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <FormTextField
                      name="referenceno"
                      label="Reference No"
                      value={values.referenceno}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <FormTextField
                      name="workingFirm"
                      label="workingFirm"
                      value={values.workingFirm || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Box>
                </Grid>
                {/* **/}
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <FormTextField
                      name="salary"
                      label="Salary"
                      type="number"
                      value={values.salary}
                      sx={{ width: "40%" }}
                      onChange={handleChange}
                      onBlur={handleBlur} // Set the width to 30% for uniformity
                    />
                    <FormTextField
                      name="fromDate"
                      label="From Date"
                      type="date"
                      value={values.fromDate}
                    />
                    <FormTextField
                      name="toDate"
                      label="To Date"
                      type="date"
                      value={values.toDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <FormSelectField
                      name="guaranteeType"
                      label="Guarantee Type"
                      sx={{ width: "33%" }}
                      options={[
                        { label: "OutWard", value: enums.Guarantee.OutWard },
                        { label: "InWard", value: enums.Guarantee.InWard },
                      ]}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.active === Activation.Active}
                          onChange={(event) => {
                            setFieldValue(
                              "active",
                              event.target.checked
                                ? Activation.Active
                                : Activation.InActive
                            );
                          }}
                          name="active"
                          color="primary"
                        />
                      }
                      label="Is Active"
                    />
                    {values.guaranteeType == enums.Guarantee.OutWard && (
                      <Button color="primary" variant="outlined" type="submit">
                        Generate Letter
                      </Button>
                    )}
                  </Box>
                </Grid>

                {/* **/}
              </Grid>
            </DialogContent>

            {/* Dialog Actions */}
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={onClose}>Cancel</Button>
              <Button color="primary" variant="outlined" type="submit">
                Save
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
