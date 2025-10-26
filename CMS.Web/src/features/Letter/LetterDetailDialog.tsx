// src/features/Letter/LetterDetailDialog.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Chip,
  Typography,
  Divider,
  Tooltip,
} from "@mui/material";
import { Formik, Form } from "formik";
import {
  DialogHeader,
  FormSelectField,
  FormTextField,
} from "../../components";
import { LetterType, LetterStatus } from "../../app/api/enums";
import { useAuth } from "../../hooks";
import { useBusinessUnit } from "../BusinessUnit";
import { FormRichLetterTextField } from "../../components/form-controls/form-letter";
import { LetterAttachmentPreviewModal } from "./LetterAttachmentPreviewModal";
import { LetterDto, useUsersQuery } from "../../app/api";

interface SelectOption {
  label: string;
  value: string | number;
}

const useLetterTypesLookups = (): { letterTypeLookups: SelectOption[]; isLoading: boolean } => ({
  letterTypeLookups: [
    { value: LetterType.Incoming, label: "Incoming" },
    { value: LetterType.Outgoing, label: "Outgoing" },
    { value: LetterType.InternalMemo, label: "Internal Memo" },
  ],
  isLoading: false,
});

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
  recipientIds: [],
  ccUserIds: [],
  ccDepartmentIds: [],
  businessUnitId: undefined,
  letterDocument: undefined,
};

export const LetterDetailDialog = ({ onClose, initialLetter, title }: LetterDialogProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<LetterDto>(emptyLetterData);
  const { letterTypeLookups, isLoading: areLetterTypesLoading } = useLetterTypesLookups();
  const { data: users, isLoading: areUsersLoading } = useUsersQuery();
  const { businessUnitLookups } = useBusinessUnit();
  const areLookupsLoading = areLetterTypesLoading || areUsersLoading;

  // Use letterDocument directly
  const activeAttachment = formData.letterDocument ?? null;

  useEffect(() => {
    const newFormData = {
      ...emptyLetterData,
      ...initialLetter,
      receivedDate: initialLetter?.receivedDate
        ? new Date(initialLetter.receivedDate).toISOString().split("T")[0]
        : "",
      sentDate: initialLetter?.sentDate
        ? new Date(initialLetter.sentDate).toISOString().split("T")[0]
        : "",
      recipientIds: initialLetter?.recipientIds ?? [],
      ccUserIds: initialLetter?.ccUserIds ?? [],
      ccDepartmentIds: initialLetter?.ccDepartmentIds ?? [],
    };
    setFormData(newFormData);

    // Console log for debugging
    console.log("LetterDetailDialog - Form Data:", newFormData);
    console.log("LetterDetailDialog - Attachment:", activeAttachment);
  }, [initialLetter]);

  return (
    <Dialog open maxWidth="md" fullWidth scroll="paper" disableEscapeKeyDown>
      {areLookupsLoading ? (
        <DialogContent>
          <Typography>Loading form data...</Typography>
        </DialogContent>
      ) : (
        <>
          <DialogHeader title={title} onClose={onClose} />
          <Formik initialValues={formData} enableReinitialize onSubmit={() => {}}>
            {({ values }) => {
              const recipientOptions = (users || [])
                .filter((u) => u.id !== user?.id)
                .map((u) => ({
                  label: `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Unknown",
                  value: u.id!,
                }));

              const ccOptions = (users || []).map((u) => ({
                label: `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Unknown",
                value: u.id!,
              }));

              const deptOptions = (businessUnitLookups || []).map((bu) => ({
                label: bu.label,
                value: Number(bu.value),
              }));

              // Prepare recipients for display
              const firstRecipient = values.recipientIds?.[0]
                ? recipientOptions.find((opt) => opt.value === values.recipientIds![0])?.label ?? "-"
                : "-";
              const recipientTooltip = values.recipientIds
                ?.map((id) => recipientOptions.find((opt) => opt.value === id)?.label ?? "-")
                .join(", ") || "-";

              // Prepare CC users and departments
              const firstCC =
                values.ccUserIds?.[0]
                  ? ccOptions.find((opt) => opt.value === values.ccUserIds![0])?.label ?? "-"
                  : values.ccDepartmentIds?.[0]
                  ? deptOptions.find((opt) => opt.value === values.ccDepartmentIds![0])?.label ?? "-"
                  : "-";
              const ccTooltip = [
                ...(values.ccUserIds?.map((id) =>
                  `CC: ${ccOptions.find((opt) => opt.value === id)?.label ?? "-"}`
                ) || []),
                ...(values.ccDepartmentIds?.map((id) =>
                  `CC: ${deptOptions.find((opt) => opt.value === id)?.label ?? "-"}`
                ) || []),
              ].join(", ") || "-";

              // Console log for debugging
              console.log("LetterDetailDialog - Recipients:", recipientOptions.filter((opt) =>
                values.recipientIds?.includes(opt.value as string)
              ));
              console.log("LetterDetailDialog - CC Users:", ccOptions.filter((opt) =>
                values.ccUserIds?.includes(opt.value as string)
              ));
              console.log("LetterDetailDialog - CC Departments:", deptOptions.filter((opt) =>
                values.ccDepartmentIds?.includes(opt.value as number)
              ));

              return (
                <Form>
                  <DialogContent dividers sx={{ bgcolor: "#f5f5f5" }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormTextField
                          name="referenceNumber"
                          label="Reference Number"
                          fullWidth
                          disabled={true}
                          InputProps={{ sx: { bgcolor: "white" } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormSelectField
                          name="letterType"
                          label="Letter Type"
                          options={letterTypeLookups}
                          fullWidth
                          disabled={true}
                          sx={{ bgcolor: "white" }}
                        />
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <FormTextField
                            name="subject"
                            label="Subject"
                            fullWidth
                            disabled={true}
                            InputProps={{ sx: { bgcolor: "white" } }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormSelectField
                            name="businessUnitId"
                            label="Business Unit"
                            options={businessUnitLookups ?? []}
                            fullWidth
                            disabled={true}
                            sx={{ bgcolor: "white" }}
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
                          {values.businessUnitId && (
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.5 }}>
                                Recipients
                              </Typography>
                              <Tooltip title={recipientTooltip} placement="top">
                                <Chip
                                  size="small"
                                  label={firstRecipient}
                                  sx={{ height: 24, bgcolor: "#e3f2fd", color: "#1976d2", fontWeight: 500 }}
                                />
                              </Tooltip>
                            </Box>
                          )}
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.5 }}>
                              CC
                            </Typography>
                            <Tooltip title={ccTooltip} placement="top">
                              <Chip
                                size="small"
                                label={`CC: ${firstCC}`}
                                sx={{
                                  height: 24,
                                  bgcolor: values.ccUserIds?.[0] ? "#ffcc80" : "#b2dfdb",
                                  color: values.ccUserIds?.[0] ? "#e65100" : "#00695c",
                                  fontWeight: 500,
                                }}
                              />
                            </Tooltip>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                            Letter Attachment
                          </Typography>
                          {activeAttachment ? (
                            <LetterAttachmentPreviewModal
                              documentId={activeAttachment.id ?? ""}
                              fileName={activeAttachment.fileName ?? "Attachment"}
                              onView={() => {
                                console.log("LetterDetailDialog - Viewing attachment:", activeAttachment);
                              }}
                            />
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No Attachment
                            </Typography>
                          )}
                        </Box>
                        <Divider sx={{ my: 2 }} />
                      </Grid>
                      {(values.recipientIds?.length ?? 0) > 1 ||
                      (values.ccUserIds?.length ?? 0) > 0 ||
                      (values.ccDepartmentIds?.length ?? 0) > 0 ? (
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                            All Recipients
                          </Typography>
                          {values.recipientIds?.length ? (
                            <Box sx={{ ml: 2, mb: 2 }}>
                              {values.recipientIds.map((id) => {
                                const recipient = recipientOptions.find((opt) => opt.value === id);
                                return (
                                  <Typography key={id} variant="body2" sx={{ color: "#555", mb: 0.5 }}>
                                    {recipient?.label ?? "-"}
                                  </Typography>
                                );
                              })}
                            </Box>
                          ) : (
                            <Typography variant="body2" sx={{ color: "#555", ml: 2, mb: 2 }}>
                              None
                            </Typography>
                          )}
                          <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                            All CC
                          </Typography>
                          {values.ccUserIds?.length || values.ccDepartmentIds?.length ? (
                            <Box sx={{ ml: 2 }}>
                              {values.ccUserIds?.map((id) => {
                                const ccUser = ccOptions.find((opt) => opt.value === id);
                                return (
                                  <Typography
                                    key={`u-${id}`}
                                    variant="body2"
                                    sx={{ color: "#555", mb: 0.5 }}
                                  >
                                    CC: {ccUser?.label ?? "-"}
                                  </Typography>
                                );
                              })}
                              {values.ccDepartmentIds?.map((id) => {
                                const ccDept = deptOptions.find((opt) => opt.value === id);
                                return (
                                  <Typography
                                    key={`d-${id}`}
                                    variant="body2"
                                    sx={{ color: "#555", mb: 0.5 }}
                                  >
                                    CC: {ccDept?.label ?? "-"}
                                  </Typography>
                                );
                              })}
                            </Box>
                          ) : (
                            <Typography variant="body2" sx={{ color: "#555", ml: 2 }}>
                              None
                            </Typography>
                          )}
                          <Divider sx={{ my: 2 }} />
                        </Grid>
                      ) : (
                        <Grid item xs={12}>
                          <Divider sx={{ my: 2 }} />
                        </Grid>
                      )}
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 500 }}>
                          Content
                        </Typography>
                        <Box sx={{ bgcolor: "white", p: 2, borderRadius: 1, border: "1px solid #e0e0e0" }}>
                          <FormRichLetterTextField name="content" readOnly={true} />
                        </Box>
                      </Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions sx={{ p: 2 }}>
                    <Button onClick={onClose} variant="outlined" color="primary">
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