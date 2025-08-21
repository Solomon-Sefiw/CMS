import { Button } from "@mui/material";
import { useState, useCallback, useMemo } from "react";
import { usePermission } from "../../../../../hooks";
import { useApproveResignationMutation, useRejectResignationMutation } from "../../../../../app/store";
import { removeEmptyFields } from "../../../../../utils";
import { WorkflowActionDialog } from "../../../../../components";

export const ApproveOrRejectResignation = ({ id }: { id: number }) => {
  const permissions = usePermission();
  const [dialogOpened, setDialogOpened] = useState(false);
  const [selectedAction, setSelectedAction] = useState<"approve" | "reject">();
  const [approve, { error: approveError, reset: approveReset }] = useApproveResignationMutation();
  const [reject, { error: rejectError, reset: rejectReset }] = useRejectResignationMutation();
  const [commentError, setCommentError] = useState<string | null>(null);

  const onDialogClose = useCallback(() => { approveReset(); rejectReset(); setDialogOpened(false); }, [approveReset, rejectReset]);
  const handleSubmit = useCallback(async (comment: string) => {
    if (!selectedAction) return;
    if (!comment?.trim()) { setCommentError("Comment is required."); return; }
    setCommentError(null);

    const payload = removeEmptyFields({ id, comment });
    (selectedAction === "approve" ? approve({ approveResignationCommand: payload }) : reject({ rejectResignationCommand: payload }))
      .unwrap()
      .then(onDialogClose)
      .catch(() => { });
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
