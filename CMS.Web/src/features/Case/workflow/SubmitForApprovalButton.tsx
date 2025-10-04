import { Button } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useSubmitForApprovalMutation } from "../../../app/api";
import { WorkflowActionDialog } from "../../../components/workflow/WorkflowActionDialog";
import { usePermission } from "../../../hooks";

export const SubmitForApprovalButton = ({
  id,
  isSubmissionAllowed, // Accept the new prop
}: {
  id: number;
  isSubmissionAllowed: boolean; // Define its type
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const permissions = usePermission();
  const [submit, { error: submitError, reset: submitReset }] =
    useSubmitForApprovalMutation();

  const onDialogClose = useCallback(() => {
    submitReset();
    setShowDialog(false);
    setSubmitting(false);
  }, [submitReset]);

  const handleSubmit = useCallback(
    (comment: string) => {
      setSubmitting(true);
      submit({
        changeWorkflowStatusEntityDto: {
          id,
          note: comment,
        },
      })
        .unwrap()
        .then(onDialogClose)
        .catch(() => {
          setSubmitting(false);
        });
    },
    [submit, id, onDialogClose]
  );

  const errors = useMemo(
    () => (submitError as any)?.data?.errors,
    [submitError]
  );

  return (
    <>
      <Button
        variant="contained"
        size="large"
        color="primary"
        // Button is disabled if user doesn't have permission OR if submission criteria are not met
        disabled={!permissions.CanSubmitEmployeeApprovalRequest || !isSubmissionAllowed}
        onClick={() => {
          setShowDialog(true);
        }}
      >
        Submit for Approval
      </Button>
      {showDialog && (
        <WorkflowActionDialog
          title="Submit Approval Request"
          textAreaTitle="Please list of all changes you made"
          emptyTextAreaErrorMsg="Changed items list is required"
          onSubmit={handleSubmit}
          onClose={onDialogClose}
          errors={errors}
          submitting={submitting}
        />
      )}
    </>
  );
};