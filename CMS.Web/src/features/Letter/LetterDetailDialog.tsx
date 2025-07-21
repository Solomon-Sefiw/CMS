import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Alert,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { Formik, Form } from "formik";
import {
  DialogHeader,
  FormSelectField,
  FormTextField,
} from "../../components";
import { DocumentType, LetterType, LetterStatus } from "../../app/api/enums";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks";
import { useBusinessUnit } from "../BusinessUnit";
import { saveAs } from "file-saver";
import { FormRichLetterTextField } from "../../components/form-controls/form-letter";
import { DocumentDownload } from "../../components/DocumentDownload";
import { LetterDto, useUsersQuery } from "../../app/store";
import htmlDocx from "html-docx-js/dist/html-docx";

interface LetterTypeOption {
  value: number;
  label: string;
}

const useLetterTypesLookups = (): {
  letterTypeLookups: LetterTypeOption[];
  isLoading: boolean;
} => {
  return {
    letterTypeLookups: [
      { value: LetterType.Incoming, label: "Incoming" },
      { value: LetterType.Outgoing, label: "Outgoing" },
      { value: LetterType.InternalMemo, label: "Internal Memo" },
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
  status: LetterStatus.pending,
  senderId: undefined,
  recipientId: undefined,
  businessUnitId: undefined,
  letterDocuments: [],
};

export const LetterDetailDialog = ({ onClose, initialLetter, title }: LetterDialogProps) => {
  const { user } = useAuth();
  const [letterData, setLetterData] = useState<LetterDto>(emptyLetterData);
  const { letterTypeLookups, isLoading: areLetterTypesLoading } = useLetterTypesLookups();
  const { data: users, isLoading: areUsersLoading } = useUsersQuery();
  const { businessUnitLookups } = useBusinessUnit();
  const areLookupsLoading = areLetterTypesLoading || areUsersLoading;
  const activeAttachments = (letterData.letterDocuments || []).filter((d) => d.documentType === DocumentType.LetterDocument && !d.isDeleted);

  useEffect(() => {
    setLetterData({
      ...emptyLetterData,
      ...initialLetter,
      receivedDate: initialLetter?.receivedDate ? new Date(initialLetter.receivedDate).toISOString().split("T")[0] : "",
      sentDate: initialLetter?.sentDate ? new Date(initialLetter.sentDate).toISOString().split("T")[0] : "",
    });
  }, [initialLetter]);


  return (
    <Dialog scroll="paper" disableEscapeKeyDown open maxWidth="md" fullWidth onClose={onClose}>
      {areLookupsLoading ? (
        <DialogContent><Typography>Loading form data...</Typography></DialogContent>
      ) : (
        <>
          <DialogHeader title={title} onClose={onClose} />
          <Formik initialValues={letterData} enableReinitialize onSubmit={() => {}}>
            {({ values }) => {
              const recipientOptions = (users || []).filter((u) =>  u.id !== user?.id).map((u) => ({
                label: `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Unknown User",
                value: u.id || "",
              }));
              
              return (
                <Form>
                  <DialogContent dividers>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <FormTextField 
                          name="referenceNumber" 
                          label="Reference Number" 
                          fullWidth 
                          disabled={true} 
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormSelectField 
                          name="letterType" 
                          label="Letter Type" 
                          options={letterTypeLookups} 
                          fullWidth 
                          disabled={true} 
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormTextField 
                          name="subject" 
                          label="Subject" 
                          fullWidth 
                          disabled={true} 
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormSelectField 
                          name="businessUnitId" 
                          label="Business Unit" 
                          options={businessUnitLookups} 
                          fullWidth 
                          disabled={true} 
                        />
                      </Grid>
                      {values.businessUnitId && (
                        <Grid item xs={12} sm={6}>
                          <FormSelectField 
                            name="recipientId" 
                            label="Recipient" 
                            options={recipientOptions} 
                            fullWidth 
                            disabled={true} 
                          />
                        </Grid>
                      )}
                      <Grid item xs={12}>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Typography variant="subtitle2">Letter Attachment</Typography>
                          <Box>
                            {activeAttachments.map((d) => (
                              <DocumentDownload 
                                key={d.id} 
                                documentId={d.documentId!} 
                                label={d.fileName || "Download"} 
                              />
                            ))}
                          </Box>
                        </Box>
                        <Divider sx={{ mt: 2 }} />
                      </Grid>
                     <Grid item xs={12}><FormRichLetterTextField name="content" /></Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={onClose} variant="outlined">
                      Close
                    </Button>
                  </DialogActions>
                </Form>
              );
            }}
          </Formik>
        </>
      )}
    </Dialog>
  );
};