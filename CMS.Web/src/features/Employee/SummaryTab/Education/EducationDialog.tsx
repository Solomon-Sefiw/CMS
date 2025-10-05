import { Form, Formik, FormikHelpers } from "formik";
import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
} from "@mui/material";
import * as Yup from "yup";
import {
  EducationDto,
  useCreateEducationMutation,
  useGetEducationByIdQuery,
  useUpdateEducationMutation,
} from "../../../../app/api";
import { useAlert } from "../../../notification";
import {
  DialogHeader,
  Errors,
  FormSelectField,
  FormTextField,
} from "../../../../components";
import dayjs from "dayjs";
import { useAward } from "./useAwards";
import { useEducationLavel } from "./useEducationLavel";
import { useFieldOfStudy } from "./useFieldOfStudy";
import { useInstitutionName } from "./useInstitutionName";

const emptyEducationData = {
  startDate: "",
  endDate: "",
  institutionNameId: undefined,
  educationLevelId: undefined,
  awardId: undefined,
  fieldOfStudyId: undefined,
  schoolCity: "",
  employeeId: undefined,
  cgpa:null,
} as EducationDto;

export const EducationDialog = ({
  onClose,
  title,
  requestId,
  education,
}: {
  onClose: () => void;
  title: string;
  requestId?: number;
  education?: EducationDto;
}) => {
  const [educationData, setEducationData] = useState<
    EducationDto | undefined
  >();

  const [addEducation, { error: CreateEducationErr }] =
    useCreateEducationMutation();
  const [updateEducation, { error: UpdateEducationErr }] =
    useUpdateEducationMutation();
  const { showSuccessAlert, showErrorAlert } = useAlert();
  const { awardLookups } = useAward();
  const { educationLavelLookups } = useEducationLavel(); // Get educationLevels from the hook
  const { fieldOfStudyLookups } = useFieldOfStudy();
  const { institutionNamesLookups } = useInstitutionName();

  const { refetch } = useGetEducationByIdQuery(
    { employeeId: requestId },
    { skip: !requestId }
  );

  useEffect(() => {
    setEducationData({
      ...emptyEducationData,
      ...education,
    });
  }, [education]);

  const validationSchema = Yup.object({
        cgpa: Yup.number()
             .nullable() // allows null
             .typeError("CGPA must be a number")
             .min(0, "CGPA cannot be less than 0")
             .max(4, "CGPA cannot be greater than 4")
             .test(
               "max-decimals",
               "CGPA can have at most 2 decimal places",
               (value) => {
                 if (value === null || value === undefined) return true; // skip if empty
                 return /^\d+(\.\d{1,2})?$/.test(value.toString());
               }
             ),
    startDate: Yup.date()
      .required("Start Date is required.")
      .max(new Date(), "Start Date cannot be in the future"),
    endDate: Yup.date()
      .required("End Date is required.")
      .min(Yup.ref("startDate"), "End Date cannot be before the Start Date")
      .when("startDate", (startDate, schema) => {
        if (startDate) {
          return schema.test(
            "is-valid-education-duration",
            "The end date is not logically aligned with the education level.",
            function (endDate) {
              if (!endDate || !this.parent.educationLevelId) return true;

              const startYear = dayjs(
                startDate as unknown as string | number | Date
              ).year();
              const endYear = dayjs(endDate).year();
              const duration = endYear - startYear;
              const educationLevelId = this.parent.educationLevelId;
              const educationLevelName: string | undefined =
                educationLavelLookups
                  ?.find((el) => el.value === educationLevelId)
                  ?.label?.toLowerCase();

              switch (educationLevelName) {
                case "pre-kindergarten":
                case "kindergarten":
                  return duration >= 1 && duration <= 2;
                case "grade 1":
                case "grade 2":
                case "grade 3":
                case "grade 4":
                case "grade 5":
                case "grade 6":
                case "grade 7":
                case "grade 8":
                  return duration >= 1 && duration <= 1;
                case "grade 9":
                case "grade 10":
                  return duration >= 1 && duration <= 1;
                case "grade 11":
                case "grade 12":
                  return duration >= 1 && duration <= 1;
                case "tvet level i":
                case "tvet level ii":
                case "tvet level iii":
                case "tvet level iv":
                case "tvet level v":
                  return duration >= 1 && duration <= 3;
                case "certificate":
                  return duration >= 1 && duration <= 2;
                case "diploma":
                  return duration >= 2 && duration <= 3;
                case "advanced diploma":
                  return duration >= 3 && duration <= 4;
                case "associate degree":
                  return duration >= 2 && duration <= 3;
                case "bachelor's degree":
                  return duration >= 3 && duration <= 5;
                case "postgraduate certificate":
                case "postgraduate diploma":
                  return duration >= 1 && duration <= 2;
                case "master's degree":
                  return duration >= 1 && duration <= 3;
                case "doctoral degree (phd)":
                  return duration >= 3 && duration <= 7;
                case "professional degree (e.g., md, jd, mba)":
                  return duration >= 2 && duration <= 4;
                case "post-doctoral":
                case "other":
                  return endYear >= startYear;
                default:
                  return true;
              }
            }
          );
        }
        return schema;
      })
      .when(
        ["educationLevelId", "startDate"],
        ([educationLevelId, startDate], schema) => {
          const educationLevelName: string | undefined = educationLavelLookups
            ?.find((el) => el.value === educationLevelId)
            ?.label?.toLowerCase();
          if (
            startDate &&
            (educationLevelName === "grade 1" ||
              educationLevelName === "grade 2" ||
              educationLevelName === "grade 3" ||
              educationLevelName === "grade 4" ||
              educationLevelName === "grade 5" ||
              educationLevelName === "grade 6" ||
              educationLevelName === "grade 7" ||
              educationLevelName === "grade 8" ||
              educationLevelName === "grade 9" ||
              educationLevelName === "grade 10" ||
              educationLevelName === "grade 11" ||
              educationLevelName === "grade 12" ||
              educationLevelName === "pre-kindergarten" ||
              educationLevelName === "kindergarten")
          ) {
            return schema.test(
              "not-after-expected-graduation",
              "The end date seems misaligned with the typical duration for this education level.",
              function (endDate) {
                if (!endDate || !startDate) return true;
                const start = dayjs(startDate);
                const end = dayjs(endDate);
                const durationYears = end.diff(start, "year");

                switch (educationLevelName) {
                  case "pre-kindergarten":
                  case "kindergarten":
                    return durationYears <= 2;
                  case "grade 1":
                  case "grade 2":
                  case "grade 3":
                  case "grade 4":
                  case "grade 5":
                  case "grade 6":
                  case "grade 7":
                  case "grade 8":
                  case "grade 9":
                  case "grade 10":
                  case "grade 11":
                  case "grade 12":
                    return durationYears <= 1;
                  default:
                    return true;
                }
              }
            );
          }
          return schema;
        }
      ),
    institutionNameId: Yup.number()
      .nullable()
      .required("Institution Name is required."),
    educationLevelId: Yup.number()
      .nullable()
      .required("Education Level is required."),
    awardId: Yup.number().nullable().required("Award is required."),
    fieldOfStudyId: Yup.number()
      .nullable()
      .required("Field of Study is required."),
    schoolCity: Yup.string()
      .required("School City is required.")
      .max(100, "School City cannot exceed 100 characters."),
  });

  const handleSubmit = useCallback(
    async (
      values: EducationDto,
      { setErrors }: FormikHelpers<EducationDto>
    ) => {
      values.employeeId = requestId;
      values.startDate = dayjs(values.startDate).format("YYYY-MM-DD");
      values.endDate = dayjs(values.endDate).format("YYYY-MM-DD");

      try {
        await (values?.id
          ? updateEducation({
              updateEducationCommand: values,
            })
          : addEducation({
              createEducationCommand: values,
            })
        ).unwrap();
        onClose();
        refetch();
        showSuccessAlert(
          values?.id
            ? "Education updated successfully"
            : "Education added successfully"
        );
      } catch (error: any) {
        showErrorAlert(
          error?.data?.detail || "Failed to save education details"
        );
        if (error?.data?.errors) {
          setErrors(error.data.errors);
        }
      }
    },
    [
      onClose,
      requestId,
      addEducation,
      updateEducation,
      showErrorAlert,
      showSuccessAlert,
      refetch,
    ]
  );

  const serverErrors = (
    (education?.id ? UpdateEducationErr : CreateEducationErr) as any
  )?.data?.errors;

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
    >
      {!!educationData && (
        <Formik
          initialValues={educationData as any}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          validateOnChange={true}
        >
          {({ values, errors: formikErrors, touched, setFieldValue }) => (
            <Form>
              <DialogHeader title={title} onClose={onClose} />
              <DialogContent dividers={true}>
                <Grid container spacing={2}>
                  {serverErrors && Object.keys(serverErrors).length > 0 && (
                    <Grid item xs={12}>
                      <Errors errors={serverErrors as any} />
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <FormSelectField
                        name="educationLevelId"
                        label="Education Level"
                        options={educationLavelLookups}
                        sx={{ width: "60%" }}
                      />
                       <FormTextField
                        name="cgpa"
                        label="CGPA"
                        type="text"
                        sx={{ width: "60%" }}
                      />
                      </Box>
                      </Grid>

                    <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      
                      <FormTextField
                        name="startDate"
                        label="Start Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        error={!!formikErrors.startDate && touched.startDate}
                        helperText={touched.startDate && formikErrors.startDate}
                        sx={{flex:1}}
                      />
                      <FormTextField
                        name="endDate"
                        label="End Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        error={!!formikErrors.endDate && touched.endDate}
                        helperText={touched.endDate && formikErrors.endDate}
                        sx={{flex:1}}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <FormSelectField
                        name="fieldOfStudyId"
                        label="Field Of Study"
                        options={fieldOfStudyLookups}
                      />
                      <FormSelectField
                        name="institutionNameId"
                        label="Institution Name"
                        options={institutionNamesLookups}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <FormSelectField
                        name="awardId"
                        label="Award"
                        options={awardLookups}
                      />
                      <FormTextField
                        name="schoolCity"
                        label="School City"
                        type="text"
                        error={!!formikErrors.schoolCity && touched.schoolCity}
                        helperText={
                          touched.schoolCity && formikErrors.schoolCity
                        }
                      />
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
