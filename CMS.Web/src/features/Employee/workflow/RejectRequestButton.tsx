import { Button } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { WorkflowActionDialog } from "../../../components/workflow/WorkflowActionDialog";
import { useRejectEmployeeApprovalRequestMutation } from "../../../app/api";
import { usePermission } from "../../../hooks";

export const RejectRequestButton = ({ id }: { id: number }) => {
  const permissions = usePermission();
  const [showDialog, setShowDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [reject, { error: rejectError, reset: rejectReset }] =
    useRejectEmployeeApprovalRequestMutation();

  const onDialogClose = useCallback(() => {
    rejectReset();
    setShowDialog(false);
    setSubmitting(false);
  }, [rejectReset]);

  const handleSubmit = useCallback(
    (comment: string) => {
      setSubmitting(true);
      reject({
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
    [reject, id, onDialogClose]
  );

  const errors = useMemo(
    () => (rejectError as any)?.data?.errors,
    [rejectError]
  );

  return (
    <>
      <Button
        size="large"
        color="error"
        variant="contained"
        disabled={!permissions.CanApproveRejectEmployeePersonalInfo}
        onClick={() => {
          setShowDialog(true);
        }}
      >
        Reject
      </Button>
      {showDialog && (
        <WorkflowActionDialog
          title="Reject Request"
          textAreaTitle="Please provide your rejection reason"
          emptyTextAreaErrorMsg="Rejection reason is required"
          onSubmit={handleSubmit}
          onClose={onDialogClose}
          errors={errors}
          submitting={submitting}
        />
      )}
    </>
  );
};
