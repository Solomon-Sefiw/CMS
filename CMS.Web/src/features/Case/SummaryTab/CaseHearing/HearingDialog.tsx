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
import { HearingDto, useCreateHearingMutation, useUpdateHearingMutation } from "../../../../app/api/HCMSApi";
import { useBusinessUnit } from "../../../BusinessUnit";
import { getEnumOptions } from "../../../../components/form-controls/get-enum-list";
import { HearingType } from "../../../../app/api/enums";

const emptyData: HearingDto = {
  id: 0,
  caseId: 0,
  scheduledAt: "",
  hearingType: HearingType.Main,
  locationOrUrl: "",
  responsibleJudgeId: "",
  chilotId: undefined,
  businessUnitId: undefined,
  notes: "",
};

export const HearingDialog = ({
  onClose,
  title,
  hearing,
  caseId,
}: {
  onClose: () => void;
  title: string;
  hearing?: HearingDto;
  caseId: number;
}) => {
  const { businessUnitLookups } = useBusinessUnit();
  const [createHearing, { error: createErr }] = useCreateHearingMutation();
  const [updateHearing, { error: updateErr }] = useUpdateHearingMutation();
  const { showErrorAlert, showSuccessAlert } = useAlert();

  const validationSchema = Yup.object({
    scheduledAt: Yup.string().required("Scheduled date is required"),
    hearingType: Yup.string().required("Hearing type is required"),
  });

  const handleSubmit = async (values: HearingDto) => {
    try {
      values.caseId = caseId;
      await (values.id
        ? updateHearing({updateHearingCommand :values})
        : createHearing({createHearingCommand : values})
      ).unwrap();

      showSuccessAlert(
        values.id ? "Hearing updated successfully!" : "Hearing added successfully!"
      );
      onClose();
    } catch (err: any) {
      showErrorAlert(err?.data?.detail || "Failed to save hearing.");
    }
  };

  const serverErrors = ((hearing?.id ? updateErr : createErr) as any)?.data?.errors;

  return (
    <Dialog open={true} maxWidth="sm" fullWidth>
      <Formik
        initialValues={hearing || emptyData}
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
                  <FormTextField
                    name="scheduledAt"
                    label="Scheduled Date"
                    type="datetime-local"
                    fullWidth
                    error={!!errors.scheduledAt && touched.scheduledAt}
                    helperText={touched.scheduledAt && errors.scheduledAt}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormSelectField
                    name="hearingType"
                    label="Hearing Type"
                    options={getEnumOptions(HearingType)}
                    error={!!errors.hearingType && touched.hearingType}
                    helperText={touched.hearingType && errors.hearingType}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormTextField
                    name="locationOrUrl"
                    label="Location / URL"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormTextField
                    name="responsibleJudgeId"
                    label="Responsible Judge ID"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormTextField
                    name="notes"
                    label="Notes"
                    multiline
                    rows={3}
                    fullWidth
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
