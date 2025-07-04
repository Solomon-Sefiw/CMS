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
  useGetSingleEmployeeQuery,
} from "../../../../app/api/HCMSApi";
import { AddEmployeeFamilyCommand, enums } from "../../../../app/api";
import dayjs from "dayjs";
import {
  FamilyType,
  IsParentLiving,
  ParentType,
  SpouseIsWorking,
} from "../../../../app/api/enums";
import { removeEmptyFields } from "../../../../utils";
import { useParams } from "react-router-dom";
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
} as AddEmployeeFamilyCommand;

export const EmployeeFamilyDialog = ({ onClose }: { onClose: () => void }) => {
  const [EmployeeFamily, setEmployeeFamily] =
    useState<AddEmployeeFamilyCommand>(emptyEmployeeFamily);
  const [addEmployeeFamily] = useAddEmployeeChildrenMutation();
  const { id } = useParams<{ id: string }>();
  const employeeId = id ? Number(id) : NaN;

  const [familyType, setFamilyType] = useState<FamilyType | undefined>(
    emptyEmployeeFamily.familyType
  );

  const handleFamilyTypeChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setFamilyType(event.target.value as FamilyType);
  };
  //
  const [calculatedAge, setCalculatedAge] = useState<number | undefined>();

  const [dateOfBirth, setDateOfBirth] = useState("");
  const [age, setAge] = useState<number | null>(null);
  //
  const status = enums.MartialStatus.Single;
  const [IsSingle, setIsSingle] = useState<boolean>(true);
  const {
    data: Status,
    isLoading: MaritalStatusLoading,
    refetch,
  } = useGetSingleEmployeeQuery({ id: status });

  //
  const getFamilyTypeOptions = () => {
    const options = [
      { label: "Parent", value: enums.FamilyType.EmployeeParent },
      { label: "Child", value: enums.FamilyType.EmployeeChild },
    ];

    if (!Status) {
      options.push({ label: "Spouse", value: enums.FamilyType.EmployeeSpouse });
    }

    return options;
  };
  //

  useEffect(() => {
    setEmployeeFamily({
      ...emptyEmployeeFamily,
      familyType: familyType,
    });
  }, [familyType]);
  //
  const handleDateOfBirthChange = (value: string, setFieldValue: any) => {
    setFieldValue("dateOfBirth", value);
    if (value) {
      const calculatedAge = calculateAge(value);
      setFieldValue("age", calculatedAge);
    }
  };
  const calculateAge = (dob: string) => {
    const today = dayjs();
    const birthDate = dayjs(dob);
    return today.diff(birthDate, "year");
  };
  //
  const nameRegex = /^[A-Za-z\s\-']+$/;
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .matches(nameRegex, "first Name can only contain letters and spaces")
      .max(30, "First Name exceeds 30 characters")
      .required("First Name is Required"),
    lastName: Yup.string()
      .matches(nameRegex, "last Name must be letter and Spaces")
      .max(30, "Last Name exceeds 30 characters")
      .required("Last Name is required"),
    middleName: Yup.string()
      .matches(nameRegex, "Middle Name can only be letter and Spaces")
      .max(30, "Middle Name exceeds 30 characters")
      .required("Middle Name is required"),
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

    parentLivelyHood: Yup.string()
      .nullable()
      .when("isParentLiving", {
        is: enums.IsParentLiving.Yes,
        then: (schema) =>
          schema
            .required("Parent LivelyHood is required")
            .max(50, "Parent lively hood exceeds 50 characters"),

        otherwise: (schema) =>
          schema.nullable().max(50, "Parent lively hood exceeds 50 characters"),
      }),
  });

  const handleSubmit = useCallback(
    (values: AddEmployeeFamilyCommand) => {
      let payload;
      const dateOfBirth = values.dateOfBirth
        ? dayjs(values.dateOfBirth).format("YYYY-MM-DD")
        : undefined;
      payload = removeEmptyFields({
        ...values,
        employeeId,
        dateOfBirth,
      });
      addEmployeeFamily({
        addEmployeeFamilyCommand: payload,
      })
        .unwrap()
        .then(onClose)
        .catch((error: any) => {
          // console.log(error.data + "Error froma dding Employee Family");
        });
    },
    [onClose, addEmployeeFamily, familyType, employeeId]
  );

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
    >
      <Formik
        initialValues={EmployeeFamily}
        enableReinitialize={true}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validationSchema={validationSchema} // Add the validation schema here
      >
        {({ values, handleChange, setFieldValue }) => (
          <Form>
            <DialogHeader title="Add Employee Family" onClose={onClose} />
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <FormSelectField
                      name="familyType"
                      label="Family Type"
                      sx={{ width: "33%" }}
                      options={getFamilyTypeOptions()}
                      value={familyType}
                      onChange={(e) => {
                        handleChange(e);
                        handleFamilyTypeChange(e);
                      }}
                    />
                    {values.familyType === FamilyType.EmployeeSpouse && (
                      <>
                        <FormSelectField
                          name="spouseIsWorking"
                          label="Is Spouse Working"
                          sx={{ width: "33%" }}
                          options={[
                            { label: "Yes", value: enums.SpouseIsWorking.Yes },
                            { label: "No", value: enums.SpouseIsWorking.No },
                          ]}
                        />
                        {values.spouseIsWorking === SpouseIsWorking.Yes && (
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
                          value={values.dateOfBirth}
                          onChange={(e) =>
                            handleDateOfBirthChange(
                              e.target.value,
                              setFieldValue
                            )
                          } // Update date of birth and calculate age
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
    </Dialog>
  );
};
