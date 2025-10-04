import { Button } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { usePermission } from "../../../../../hooks";
import {
  useApproveDelegationMutation,
  useRejectDelegationMutation,
} from "../../../../../app/api";
import { WorkflowActionDialog } from "../../../../../components";
import { removeEmptyFields } from "../../../../../utils";

export const ApproveOrRejectRequestDelegation = ({ id }: { id: number }) => {
  const permissions = usePermission();
  const [dialogOpened, setDialogOpened] = useState(false);
  const [selectedAction, setSelectedAction] = useState<"approve" | "reject">();
  const [approve, { error: approveError, reset: approveReset }] =
    useApproveDelegationMutation();
  const [reject, { error: rejectError, reset: rejectReset }] =
    useRejectDelegationMutation();
  const [commentError, setCommentError] = useState<string | null>(null);

  const onDialogClose = useCallback(() => {
    approveReset();
    rejectReset();
    setDialogOpened(false);
  }, [approveReset, rejectReset]);

  const handleSubmit = useCallback(
    async (comment: string) => {
      if (!selectedAction) return;
      if (!comment || comment.trim() === "") {
        setCommentError("Comment is required.");
        return;
      }

      setCommentError(null);

      const payload = removeEmptyFields({
        id,
        comment,
      });

      (selectedAction === "approve"
        ? approve({
            approveDelegationCommand: payload,
          })
        : reject({
            rejectDelegationCommand: payload,
          })
      )
        .unwrap()
        .then(onDialogClose)
        .catch(() => {});
    },
    [approve, id, onDialogClose, reject, selectedAction]
  );

  const errors = useMemo(
    () => ((approveError || rejectError) as any)?.data?.errors,
    [approveError, rejectError]
  );

  return (
    <>
      <Button
        onClick={() => {
          setDialogOpened(true);
          setSelectedAction("approve");
        }}
        size="small"
        disabled={!permissions.CanApproveRejectEmployeeActivity}
      >
        Approve
      </Button>

      <Button
        onClick={() => {
          setDialogOpened(true);
          setSelectedAction("reject");
        }}
        size="small"
        disabled={!permissions.CanApproveRejectEmployeeActivity}
      >
        Reject
      </Button>

      {dialogOpened && (
        <WorkflowActionDialog
          title="Approval Request"
          onClose={() => {
            onDialogClose();
            setSelectedAction(undefined);
          }}
          onSubmit={handleSubmit}
          errors={errors}
        />
      )}

      {commentError && (
        <div style={{ color: "red", marginTop: "10px" }}>{commentError}</div>
      )}
    </>
  );
};
