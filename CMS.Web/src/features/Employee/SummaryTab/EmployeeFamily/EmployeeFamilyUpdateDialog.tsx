import { Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import {
  DialogHeader,
  FormSelectField,
  FormTextField,
} from "../../../../components";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
} from "@mui/material";
import {
  useAddEmployeeChildrenMutation,
  useUpdateEmployeeFamilyMutation,
  useGetFamilyQuery,
  EmployeeFamily,
} from "../../../../app/api/HCMSApi";
import { UpdateEmployeeFamilyCommand, enums } from "../../../../app/api";
import dayjs from "dayjs";
import { removeEmptyFields } from "../../../../utils";
import { useParams } from "react-router-dom";
import {
  FamilyType,
  SpouseIsWorking,
  IsParentLiving,
  ParentType,
} from "../../../../app/api/enums";
import * as Yup from "yup";
const emptyEmployeeFamily = {
  firstName: "",
  middleName: "",
  lastName: "",
  familyType: enums.FamilyType.EmployeeParent,
  gender: enums.Gender.Unspecified,
  dateOfBirth: "",
  fatherFullName: "",
  motherFullName: "",
  workingFirm: "",
  spouseIsWorking: enums.SpouseIsWorking.Unspecified,
  isParentLiving: enums.IsParentLiving.Unspecified,
  familyParentType: enums.ParentType.Unspecified,
  parentLivelyHood: "",
  isActive: enums.Activation.Active,
} as UpdateEmployeeFamilyCommand;

interface EmployeeFamilyUpdateDialogProps {
  onClose: () => void;
  Id?: number;
}

export const EmployeeFamilyUpdateDialog = ({
  onClose,
  Id,
}: EmployeeFamilyUpdateDialogProps) => {
  const { id } = useParams<{ id: string }>();
  const {
    data: employeeFamilyInfo,
    isLoading,
    error,
    refetch,
  } = useGetFamilyQuery({ familyId: Id });

  const [employeeFamily, setEmployeeFamily] =
    useState<EmployeeFamily>(emptyEmployeeFamily);
  const [familyType, setFamilyType] = useState<FamilyType>();
  useEffect(() => {
    if (employeeFamilyInfo && typeof employeeFamilyInfo === "object") {
      const data = employeeFamilyInfo["0"]
        ? employeeFamilyInfo["0"]
        : employeeFamilyInfo;
      setEmployeeFamily({
        ...emptyEmployeeFamily,
        ...data,
      });
    }
  }, [employeeFamilyInfo]);
  //
  const nameRegex = /^[A-Za-z\s\-']+$/;
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .matches(nameRegex, "first Name can only contain letters and spaces")
      .required("First Name is Required")
      .max(30, "First Name exceeds 30 characters"),
    lastName: Yup.string()
      .matches(nameRegex, "Last Name can only contain letters and spaces")
      .required("Last Name is required")
      .max(30, "Last Name exceeds 30 characters"),
    middleName: Yup.string()
      .matches(nameRegex, "Middle Name can only contain letters and spaces")
      .required("Middle Name is required")
      .max(30, "Middle Name exceeds 30 characters"),
    familyType: Yup.mixed()
      .oneOf(
        [
          enums.FamilyType.EmployeeParent,
          enums.FamilyType.EmployeeSpouse,
          enums.FamilyType.EmployeeChild,
        ],
        "Invalid Family Type"
      )
      .required("Family Type is required"),

    spouseIsWorking: Yup.mixed().when("familyType", {
      is: enums.FamilyType.EmployeeSpouse,
      then: (schema) =>
        schema
          .required("Spouse working status is required")
          .oneOf(
            [enums.SpouseIsWorking.Yes, enums.SpouseIsWorking.No],
            "Spouse working status must be Yes or No"
          ),
      otherwise: (schema) => schema.nullable(),
    }),

    workingFirm: Yup.string()
      .nullable()
      .when(["spouseIsWorking"], {
        is: enums.SpouseIsWorking.Yes,
        then: (schema) => schema.required("Working Firm is required"),
        otherwise: (schema) => schema.nullable(),
      }),

    isParentLiving: Yup.mixed().when("familyType", {
      is: enums.FamilyType.EmployeeParent,
      then: (schema) =>
        schema
          .required("Parent living status is required")
          .oneOf(
            [enums.IsParentLiving.Yes, enums.IsParentLiving.No],
            "Must be Yes or No"
          ),
      otherwise: (schema) => schema.nullable(),
    }),

    familyParentType: Yup.mixed().when("familyType", {
      is: enums.FamilyType.EmployeeParent,
      then: (schema) =>
        schema
          .required("Parent Type is required")
          .oneOf(
            [enums.ParentType.Father, enums.ParentType.Mother],
            "Must be Father or Mother"
          ),
      otherwise: (schema) => schema.nullable(),
    }),

    gender: Yup.mixed().when("familyType", {
      is: enums.FamilyType.EmployeeChild,
      then: (schema) =>
        schema
          .required("Gender is required")
          .oneOf(
            [enums.Gender.Male, enums.Gender.Female],
            "Must be Male or Female"
          ),
      otherwise: (schema) => schema.nullable(),
    }),

    dateOfBirth: Yup.date()
      .nullable()
      .when("familyType", {
        is: enums.FamilyType.EmployeeChild,
        then: (schema) => schema.required("Date of Birth is required"),
        otherwise: (schema) => schema.nullable(),
      }),

    fatherFullName: Yup.string()
      .nullable()
      .when("familyType", {
        is: enums.FamilyType.EmployeeChild,
        then: (schema) => schema.required("Father's Full Name is required"),
        otherwise: (schema) => schema.nullable(),
      }),

    motherFullName: Yup.string()
      .nullable()
      .when("familyType", {
        is: enums.FamilyType.EmployeeChild,
        then: (schema) => schema.required("Mother's Full Name is required"),
        otherwise: (schema) => schema.nullable(),
      }),

    parentLivelyHood: Yup.string()
      .nullable()
      .when("isParentLiving", {
        is: enums.IsParentLiving.Yes,
        then: (schema) =>
          schema
            .required("Parent LivelyHood is required")
            .max(50, "Parent Lively Hood exceeds 50 characters"),
        otherwise: (schema) =>
          schema.nullable().max(50, "Parent lively hood exceeds 50 characters"),
      }),
  });
  //

  const handleFamilyTypeChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setFamilyType(event.target.value as FamilyType);
  };
  //
  const [updateEmployeeFamily] = useUpdateEmployeeFamilyMutation();

  const handleSubmit = useCallback(
    (values: UpdateEmployeeFamilyCommand) => {
      let payload;
      const dateOfBirth = values.dateOfBirth
        ? dayjs(values.dateOfBirth).format("YYYY-MM-DD")
        : undefined;
      payload = removeEmptyFields({
        ...values,
        dateOfBirth,
      });
      updateEmployeeFamily({ updateEmployeeFamilyCommand: payload })
        .unwrap()
        .then(() => {
          refetch();
          onClose();
        })
        .catch((error: any) => {});
    },
    [onClose, updateEmployeeFamily]
  );

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
    >
      {!!employeeFamily && (
        <Formik
          initialValues={employeeFamily}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validateOnChange={true}
          validationSchema={validationSchema} // Add the validation schema here
        >
          {({ values, handleChange }) => (
            <Form>
              <DialogHeader title="Update Employee Family" onClose={onClose} />
              <DialogContent dividers>
                <Grid container spacing={2}>
                  {/* Employee Details */}
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <FormSelectField
                        name="familyType"
                        label="Family Type"
                        sx={{ width: "33%" }}
                        options={[
                          {
                            label: "Parent",
                            value: enums.FamilyType.EmployeeParent,
                          },
                          {
                            label: "Spouse",
                            value: enums.FamilyType.EmployeeSpouse,
                          },
                          {
                            label: "Child",
                            value: enums.FamilyType.EmployeeChild,
                          },
                        ]}
                        value={familyType} // bind to local state
                        onChange={(e) => {
                          handleChange(e);
                          handleFamilyTypeChange(e); // Update local state
                        }}
                      />
                      {values.familyType === FamilyType.EmployeeSpouse && (
                        <>
                          <FormSelectField
                            name="spouseIsWorking"
                            label="Is Spouse Working"
                            sx={{ width: "33%" }}
                            options={[
                              {
                                label: "Yes",
                                value: enums.SpouseIsWorking.Yes,
                              },
                              { label: "No", value: enums.SpouseIsWorking.No },
                            ]}
                          />

                          {values.familyType === FamilyType.EmployeeSpouse && (
                            <FormTextField
                              name="workingFirm"
                              label="Working Firm"
                              type="text"
                            />
                          )}
                        </>
                      )}
                      {/** */}
                      {values.familyType === FamilyType.EmployeeParent && (
                        <FormSelectField
                          name="isParentLiving"
                          label="Is Employee Parent Living"
                          sx={{ width: "33%" }}
                          options={[
                            { label: "Yes", value: enums.IsParentLiving.Yes },
                            { label: "No", value: enums.IsParentLiving.No },
                          ]}
                        />
                      )}
                      {/* **/}
                      {values.familyType === FamilyType.EmployeeParent && (
                        <FormSelectField
                          name="familyParentType"
                          label="Parent Type"
                          sx={{ width: "33%" }}
                          options={[
                            { label: "Father", value: enums.ParentType.Father },
                            { label: "Mother", value: enums.ParentType.Mother },
                          ]}
                        />
                      )}
                      {values.familyType === enums.FamilyType.EmployeeChild && (
                        <>
                          <FormSelectField
                            name="gender"
                            label="Gender"
                            sx={{ width: "33%" }}
                            options={[
                              { label: "Male", value: enums.Gender.Male },
                              { label: "Female", value: enums.Gender.Female },
                            ]}
                          />
                          <FormTextField
                            name="dateOfBirth"
                            label="Date of Birth"
                            type="date"
                            sx={{ width: "40%" }}
                          />
                        </>
                      )}
                      {/** */}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <FormTextField
                        name="firstName"
                        label="First Name"
                        type="text"
                      />
                      <FormTextField
                        name="middleName"
                        label="Middle Name"
                        type="text"
                      />
                      <FormTextField
                        name="lastName"
                        label="Last Name"
                        type="text"
                      />
                    </Box>
                  </Grid>

                  {/* Family Type and Gender */}
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 1 }}></Box>
                  </Grid>

                  {/* Parent Info */}
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {values.familyType === enums.FamilyType.EmployeeChild && (
                        <>
                          <FormTextField
                            name="fatherFullName"
                            label="Father's Full Name"
                            type="text"
                          />
                          <FormTextField
                            name="motherFullName"
                            label="Mother's Full Name"
                            type="text"
                          />
                        </>
                      )}

                      {values.familyType === FamilyType.EmployeeParent && (
                        <FormTextField
                          name="parentLivelyHood"
                          label="ParentLivelyHood"
                          type="text"
                          sx={{ width: "40%" }}
                        />
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button color="primary" variant="outlined" type="submit">
                  Save
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      )}
    </Dialog>
  );
};
