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
  LanguageSkillDto,
  useCreateLanguageMutation,
  useUpdateLanguageSkillMutation,
  useGetLanguageSkillByIdQuery,
} from "../../../../app/api";
import { useAlert } from "../../../notification";
import { DialogHeader, Errors, FormSelectField } from "../../../../components";
import { Language, LanguageSkillLevel } from "../../../../app/api/enums";
import { getEnumOptions } from "../../../../components/form-controls/get-enum-list";

const emptyLanguageData = {
  language: 0,
  speaking: 0,
  listening: 0,
  writing: 0,
  reading: 0,
} as any;

export const LanguageSkillDialog = ({
  onClose,
  title,
  requestId,
  language,
}: {
  onClose: () => void;
  title: string;
  requestId?: number;
  language?: LanguageSkillDto;
}) => {
  const [languageData, setLanguageData] = useState<
    LanguageSkillDto | undefined
  >();

  const { refetch } = useGetLanguageSkillByIdQuery(
    { employeeId: requestId },
    { skip: !requestId }
  );

  const [addLanguageSkill, { error: CreateLanguageErr }] =
    useCreateLanguageMutation();
  const [updateLanguageSkill, { error: UpdateLanguageErr }] =
    useUpdateLanguageSkillMutation();
  const { showSuccessAlert, showErrorAlert } = useAlert();

  useEffect(() => {
    setLanguageData({
      ...emptyLanguageData,
      ...language,
    });
  }, [language]);

  const validationSchema = Yup.object({
    language: Yup.number()
      .required("Language is required.")
      .min(1, "Language is required."),
    reading: Yup.number()
      .required("Reading Skill is required.")
      .min(1, "Reading Skill is required."),
    writing: Yup.number()
      .required("Writing Skill is required.")
      .min(1, "Writing Skill is required."),
    listening: Yup.number()
      .required("Listening Skill is required.")
      .min(1, "Listening Skill is required."),
    speaking: Yup.number()
      .required("Speaking Skill is required.")
      .min(1, "Speaking Skill is required."),
  });

  const handleSubmit = useCallback(
    async (
      values: LanguageSkillDto,
      { setErrors }: FormikHelpers<LanguageSkillDto>
    ) => {
      values.employeeId = requestId;

      const normalizedValues = {
        ...values,
        employeeId: values.employeeId ?? undefined, // Ensure it's number | undefined
      };

      (values?.id
        ? updateLanguageSkill({
            updateLanguageSkillCommand: values,
          })
        : addLanguageSkill({
            createLanguageSkillCommand: values as any,
          })
      )
        .unwrap()
        .then(() => {
          values.id
            ? showSuccessAlert("Language Skill updated successfully!")
            : showSuccessAlert("Language Skill created successfully!");
          refetch(); // Trigger a refetch to refresh the list of language skills
          onClose();
        })
        .catch((error) => {
          showErrorAlert(error?.data?.detail);
        });
    },
    [
      onClose,
      requestId,
      addLanguageSkill,
      updateLanguageSkill,
      showErrorAlert,
      showSuccessAlert,
      refetch,
    ]
  );

  const errors = ((language?.id ? UpdateLanguageErr : CreateLanguageErr) as any)
    ?.data?.errors;

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
    >
      {!!languageData && (
        <Formik
          initialValues={languageData as any}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          validateOnChange={true}
        >
          <Form>
            <DialogHeader title={title} onClose={onClose} />
            <DialogContent dividers={true}>
              <Grid container spacing={2}>
                {errors && (
                  <Grid item xs={12}>
                    <Errors errors={errors as any} />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <FormSelectField
                      name="language"
                      label="Language"
                      options={getEnumOptions(Language)}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <FormSelectField
                      name="speaking"
                      label="Speaking"
                      options={getEnumOptions(LanguageSkillLevel)}
                    />
                    <FormSelectField
                      name="listening"
                      label="Listening"
                      options={getEnumOptions(LanguageSkillLevel)}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <FormSelectField
                      name="writing"
                      label="Writing"
                      options={getEnumOptions(LanguageSkillLevel)}
                    />
                    <FormSelectField
                      name="reading"
                      label="Reading"
                      options={getEnumOptions(LanguageSkillLevel)}
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
        </Formik>
      )}
    </Dialog>
  );
};
