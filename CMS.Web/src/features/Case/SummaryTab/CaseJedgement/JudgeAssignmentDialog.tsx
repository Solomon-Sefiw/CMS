import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Grid,
  Box,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useAlert } from "../../../notification";
import { DialogHeader, Errors, FormSelectField, FormTextField } from "../../../../components";
import { JudgeAssignmentDto, useCreateJudgeAssignmentMutation, useUpdateJudgeAssignmentMutation, useUpdateJudgmentMutation } from "../../../../app/api/HCMSApi";
import { useBusinessUnit } from "../../../BusinessUnit";

const emptyData: JudgeAssignmentDto = {
  // caseId: undefined,
  chilotId: undefined,
  businessUnitId: undefined,
  // judgeId: undefined,
};

export const JudgeAssignmentDialog = ({
  onClose,
  title,
  assignment,
  caseId,
}: {
  onClose: () => void;
  title: string;
  assignment?: JudgeAssignmentDto;
  caseId: number;
}) => {
  const { businessUnitLookups } = useBusinessUnit();
  const [createJudgeAssignment, { error: createErr }] =
    useCreateJudgeAssignmentMutation();
  const [updateJudgeAssignment, { error: updateErr }] =
    useUpdateJudgeAssignmentMutation();
  const { showErrorAlert, showSuccessAlert } = useAlert();

  const validationSchema = Yup.object({
  });



  const handleSubmit = async (values: JudgeAssignmentDto) => {
    try {

      values.caseId = caseId;
      console.log(values);
      await (values.id
        ? updateJudgeAssignment({ updateJudgeAssignmentCommand :values})
        : createJudgeAssignment({createJudgeAssignmentCommand :values})
      ).unwrap();

      showSuccessAlert(
        values.id
          ? "Judge assignment updated successfully!"
          : "Judge assigned successfully!"
      );
      onClose();
    } catch (err: any) {
      showErrorAlert(
        err?.data?.detail || "Failed to save judge assignment."
      );
    }
  };

  const serverErrors = (
    (assignment?.id ? updateErr : createErr) as any
  )?.data?.errors;

  return (
    <Dialog open={true} maxWidth="sm" fullWidth>
      <Formik
        initialValues={assignment || emptyData}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        enableReinitialize
      >
        {({ errors, touched }) => (
          <Form>
            <DialogHeader title={title} onClose={onClose} />
            <DialogContent dividers>
              <Grid container spacing={2}>
                {serverErrors && (
                  <Grid item xs={12}>
                    <Errors errors={serverErrors} />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Box display="flex" gap={2}>
                    <FormTextField
                      name="chilotId"
                      label="Chilot ID"
                      type="number"
                      error={!!errors.chilotId && touched.chilotId}
                      helperText={touched.chilotId && errors.chilotId}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <FormSelectField
                    name="businessUnitId"
                    label="Business Unit ID"
                    type="number"
                    options={businessUnitLookups}
                    error={!!errors.businessUnitId && touched.businessUnitId}
                    helperText={touched.businessUnitId && errors.businessUnitId}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button variant="contained" color="primary" type="submit">
                Save
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
