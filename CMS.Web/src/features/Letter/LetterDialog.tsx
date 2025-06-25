import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Alert,
  Typography,
} from "@mui/material";
import { Formik, Form, FormikHelpers } from "formik";
import {
  DialogHeader,
  FormSelectField,
  FormTextField,
} from "../../components";
import { useCallback, useEffect, useState } from "react";
import { Errors } from "../../components";
import { useAlert } from "../notification";
import * as Yup from "yup";
import { LetterDto, useCreateLetterMutation, useUpdateLetterMutation, useUsersQuery } from "../../app/api";
import { useAuth } from "../../hooks";
import { useBusinessUnit } from "../BusinessUnit";

const useLetterTypesLookups = () => {
  return {
    letterTypeLookups: [
      { value: 1, label: "Incoming" },
      { value: 2, label: "Outgoing" },
      { value: 3, label: "Internal Memo" },
    ],
    isLoading: false,
  };
};

interface LetterDialogProps {
  initialLetter?: LetterDto;
  title: string;
  onClose: () => void;
}

const emptyLetterData: LetterDto = {
  id: undefined,
  referenceNumber: "",
  subject: "",
  content: "",
  letterType: undefined,
  status: undefined,
  senderId: undefined,
  recipientId: undefined,
  businessUnitId: undefined,
};

export const LetterDialog = ({
  onClose,
  initialLetter,
  title,
}: LetterDialogProps) => {
  const { user } = useAuth();
  const [letterData, setLetterData] = useState<LetterDto>(emptyLetterData);
  const [createLetter, { error: createLetterError, isLoading: isCreating }] =
    useCreateLetterMutation();
  const [updateLetter, { error: updateLetterError, isLoading: isUpdating }] =
    useUpdateLetterMutation();
  const { showSuccessAlert, showErrorAlert } = useAlert();
  const [notification, setNotification] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState(false);

  const { letterTypeLookups, isLoading: areLetterTypesLoading } = useLetterTypesLookups();
  const { data: users, isLoading: areUsersLoading } = useUsersQuery();
  const { businessUnitLookups } = useBusinessUnit();

  const areLookupsLoading = areLetterTypesLoading || areUsersLoading;

  useEffect(() => {
    setLetterData({
      ...emptyLetterData,
      ...initialLetter,
      receivedDate: initialLetter?.receivedDate ? new Date(initialLetter.receivedDate).toISOString().split('T')[0] : "",
      sentDate: initialLetter?.sentDate ? new Date(initialLetter.sentDate).toISOString().split('T')[0] : "",
    });

    if (initialLetter?.id) {
      setIsLocked(true);
      setNotification("This letter is being viewed/edited.");
      setOpenSnackbar(true);
    } else {
      setIsLocked(false);
      setOpenSnackbar(false);
      setNotification("");
    }
  }, [initialLetter]);

  const validationSchema = Yup.object({
    referenceNumber: Yup.string()
      .required("Reference Number is required.")
      .max(50, "Reference Number cannot be longer than 50 characters."),
    subject: Yup.string()
      .required("Subject is required.")
      .max(200, "Subject cannot be longer than 200 characters."),
    content: Yup.string()
      .required("Content is required.")
      .max(1000, "Content cannot be longer than 1000 characters."),

    recipientId: Yup.string()
      .nullable()
      .when('businessUnitId', {
        is: (val: number | null | undefined) => val && val > 0,
        then: (schema) => schema.required("Recipient is required when a Business Unit is selected."),
        otherwise: (schema) => schema.notRequired(),
      }),
    businessUnitId: Yup.number()
      .required("Business Unit is required.")
      .nullable()
      .min(1, "Business Unit is required."),
  });

  const handleSubmit = useCallback(
    async (
      values: LetterDto,
      { setSubmitting, resetForm }: FormikHelpers<LetterDto>
    ) => {
      const submitValues = {
        ...values,
        senderId: user?.id || undefined,
      };

      try {
        const action = initialLetter?.id
          ? updateLetter({
              updateLetterCommand: submitValues
            })
          : createLetter({ createLetterCommand: submitValues });

        await action.unwrap();
        showSuccessAlert(
          initialLetter?.id
            ? "Letter updated successfully!"
            : "Letter created successfully!"
        );
        resetForm();
        onClose();
      } catch (error: any) {
        showErrorAlert(error?.data?.detail || "Failed to save letter.");
      } finally {
        setSubmitting(false);
      }
    },
    [createLetter, updateLetter, onClose, showErrorAlert, initialLetter?.id, user?.id]
  );

  const errors =
    (createLetterError as any)?.data?.errors ||
    (updateLetterError as any)?.data?.errors;

  const isSaving = isCreating || isUpdating;

  return (
    <Dialog
      scroll="paper"
      disableEscapeKeyDown={true}
      maxWidth="md"
      fullWidth
      open={true}
      onClose={onClose}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          background: 'linear-gradient(145deg, #f0f2f5, #e0e3e7)',
        },
      }}
    >
      {openSnackbar && notification && (
        <Alert
          severity="warning"
          onClose={() => setOpenSnackbar(false)}
          sx={{ mb: 2, borderRadius: '8px', mx: 2, mt: 2 }}
        >
          {notification}
        </Alert>
      )}

      {areLookupsLoading ? (
        <DialogContent sx={{ minHeight: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography>Loading form data...</Typography>
        </DialogContent>
      ) : (
        <Formik
          initialValues={letterData}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          validateOnChange={true}
        >
          {({ handleSubmit, isSubmitting, values, setFieldValue }) => {
            const filteredRecipientOptions = (users || [])
              .filter(u =>
                values.businessUnitId && u.branchId === values.businessUnitId && u.id !== user?.id
              )
              .map((u: any) => ({
                label: u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : u.firstName || u.lastName || "Unknown User",
                value: u.id,
              }));

            return (
              <Form onSubmit={handleSubmit}>
                <DialogHeader title={title} onClose={onClose} />
                <DialogContent dividers={true} sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    {errors && (
                      <Grid item xs={12}>
                        <Errors errors={errors as any} />
                      </Grid>
                    )}

                    <Grid item xs={12} sm={6}>
                      <FormTextField
                        name="referenceNumber"
                        label="Reference Number"
                        type="text"
                        fullWidth
                        error={!!errors?.referenceNumber}
                        helperText={errors?.referenceNumber}
                        disabled={isLocked}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormSelectField
                        name="letterType"
                        label="Letter Type"
                        type="number"
                        options={letterTypeLookups}
                        fullWidth
                        error={!!errors?.letterType}
                        helperText={errors?.letterType}
                        disabled={isLocked}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormTextField
                        name="subject"
                        label="Subject"
                        type="text"
                        fullWidth
                        error={!!errors?.subject}
                        helperText={errors?.subject}
                        disabled={isLocked}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormSelectField
                        name="businessUnitId"
                        label="Business Unit"
                        type="number"
                        options={businessUnitLookups}
                        fullWidth
                        error={!!errors?.businessUnitId}
                        helperText={errors?.businessUnitId}
                        disabled={isLocked}
                        onChange={(event) => {
                          setFieldValue("businessUnitId", event.target.value);
                          setFieldValue("recipientId", undefined);
                        }}
                      />
                    </Grid>

                    {values.businessUnitId && values.businessUnitId > 0 && (
                      <Grid item xs={12} sm={6}>
                        <FormSelectField
                          name="recipientId"
                          label="Recipient"
                          type="string"
                          options={filteredRecipientOptions}
                          fullWidth
                          error={!!errors?.recipientId}
                          helperText={errors?.recipientId}
                          disabled={isLocked || filteredRecipientOptions.length === 0}
                          sx={filteredRecipientOptions.length === 0 ? { '& .MuiInputBase-root': { backgroundColor: '#f0f0f0' } } : {}}
                        />
                         {filteredRecipientOptions.length === 0 && values.businessUnitId && (
                           <Typography variant="caption" color="textSecondary" sx={{ ml: 1, mt: 0.5 }}>
                             No recipients found for this Business Unit (excluding yourself).
                           </Typography>
                         )}
                      </Grid>
                    )}

                    <Grid item xs={12}>
                      <FormTextField
                        name="content"
                        type="text"
                        placeholder="Letter Content"
                        label="Content"
                        fullWidth
                        multiline
                        minRows={2}
                        variant="outlined"
                        error={!!errors?.content}
                        helperText={errors?.content}
                        disabled={isLocked}
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
                  <Button
                    onClick={onClose}
                    disabled={isSaving || isSubmitting}
                    variant="outlined"
                    color="secondary"
                    sx={{ borderRadius: '8px' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                    disabled={isSaving || isSubmitting || isLocked}
                    sx={{ borderRadius: '8px' }}
                  >
                    {isSaving || isSubmitting ? "Saving..." : "Save"}
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