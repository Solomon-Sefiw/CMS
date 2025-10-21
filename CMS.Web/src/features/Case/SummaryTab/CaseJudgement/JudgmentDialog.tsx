import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Grid,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { DialogHeader, Errors, FormTextField } from "../../../../components";
import { JudgmentDto, useCreateJudgmentMutation, useUpdateJudgmentMutation } from "../../../../app/api/HCMSApi";

const emptyData: JudgmentDto = {
  id: 0,
  caseId: 0,
  htmlContent: "",
  pdfFilePath: "",
  signedByUserId: "",
  signedAt: "",
  isPublished: false,
  publishedAt: "",
};

export const JudgmentDialog = ({
  onClose,
  title,
  judgment,
  caseId,
}: {
  onClose: () => void;
  title: string;
  judgment?: JudgmentDto;
  caseId: number;
}) => {
  const [createJudgment, { error: createErr }] = useCreateJudgmentMutation();
  const [updateJudgment, { error: updateErr }] = useUpdateJudgmentMutation();

  const validationSchema = Yup.object({
    htmlContent: Yup.string().required("Content is required"),
  });

  const handleSubmit = async (values: JudgmentDto) => {
    try {
      values.caseId = caseId;
      await (values.id
        ? updateJudgment({ updateJudgmentCommand: values })
        : createJudgment({ createJudgmentCommand: values })
      ).unwrap();
      onClose();
    } catch (err: any) {
      console.error(err);
    }
  };

  const serverErrors = ((judgment?.id ? updateErr : createErr) as any)?.data?.errors;

  return (
    <Dialog open maxWidth="sm" fullWidth>
      <Formik
        initialValues={judgment || emptyData}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
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
                    name="htmlContent"
                    label="HTML Content"
                    multiline
                    rows={6}
                    fullWidth
                    error={!!errors.htmlContent && touched.htmlContent}
                    helperText={touched.htmlContent && errors.htmlContent}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormTextField
                    name="pdfFilePath"
                    label="PDF File Path"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormTextField
                    name="signedByUserId"
                    label="Signed By User ID"
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
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
