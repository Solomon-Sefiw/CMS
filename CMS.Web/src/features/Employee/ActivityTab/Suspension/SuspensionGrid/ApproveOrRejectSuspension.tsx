import { Button } from "@mui/material";
import { useState, useCallback, useMemo } from "react";
import { useApproveSuspensionMutation, useRejectSuspensionMutation } from "../../../../../app/api";
import { removeEmptyFields } from "../../../../../utils";
import { usePermission } from "../../../../../hooks";
import { WorkflowActionDialog } from "../../../../../components";

export const ApproveOrRejectSuspension = ({ id }: { id: number }) => {
  const permissions = usePermission();
  const [dialogOpened, setDialogOpened] = useState(false);
  const [selectedAction, setSelectedAction] = useState<"approve" | "reject">();
  const [approve, { error: approveError, reset: approveReset }] = useApproveSuspensionMutation();
  const [reject, { error: rejectError, reset: rejectReset }] = useRejectSuspensionMutation();
  const [commentError, setCommentError] = useState<string | null>(null);

  const onDialogClose = useCallback(() => { approveReset(); rejectReset(); setDialogOpened(false); }, [approveReset, rejectReset]);
  const handleSubmit = useCallback(async (comment: string) => {
    if (!selectedAction) return;
    if (!comment?.trim()) { setCommentError("Comment is required."); return; }
    setCommentError(null);

    const payload = removeEmptyFields({ id, comment });
    (selectedAction === "approve" ? approve({ approveSuspensionCommand: payload }) : reject({ rejectSuspensionCommand: payload }))
      .unwrap()
      .then(onDialogClose)
      .catch(() => {});
  }, [approve, id, onDialogClose, reject, selectedAction]);

  const errors = useMemo(() => ((approveError || rejectError) as any)?.data?.errors, [approveError, rejectError]);

  return (
    <>
      <Button onClick={() => { setDialogOpened(true); setSelectedAction("approve"); }} size="small" disabled={!permissions.CanApproveRejectEmployeeActivity}>Approve</Button>
      <Button onClick={() => { setDialogOpened(true); setSelectedAction("reject"); }} size="small" disabled={!permissions.CanApproveRejectEmployeeActivity}>Reject</Button>

      {dialogOpened && <WorkflowActionDialog title="Approval Request" onClose={() => { onDialogClose(); setSelectedAction(undefined); }} onSubmit={handleSubmit} errors={errors} />}
      {commentError && <div style={{ color: "red", marginTop: 10 }}>{commentError}</div>}
    </>
  );
};
