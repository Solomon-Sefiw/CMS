import { Button } from "@mui/material";
import { useCallback, useState } from "react";
import { usePermission } from "../../../../hooks";
import { ApproveReemploymentForm } from "../Reemployment/ApproveReemploymentForm";
import { WorkflowActionDialog } from "../../../../components/workflow/WorkflowActionDialog";
import { useRejectReemploymentMutation } from "../../../../app/api";

export const ApproveOrRejectRequestButton = ({
  reemploymentId,
}: {
  reemploymentId: number;
}) => {
  const permissions = usePermission();
  const [dialogOpened, setDialogOpened] = useState(false);
  const [selectedAction, setSelectedAction] = useState<"approve" | "reject">();
  const [rejectReemployment] = useRejectReemploymentMutation();

  const onDialogClose = useCallback(() => {
    setDialogOpened(false);
    setSelectedAction(undefined);
  }, []);

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

      {dialogOpened && selectedAction === "approve" && (
        <ApproveReemploymentForm
          reemploymentId={reemploymentId}
          onClose={onDialogClose}
        />
      )}

      {dialogOpened && selectedAction === "reject" && (
        <WorkflowActionDialog
          title="Re-Employment Reject"
          actionType="reject"
          onClose={onDialogClose}
          onSubmit={async (comment: string) => {
            try {
              await rejectReemployment({
                rejectReemploymentCommand: {
                  reemploymentId: reemploymentId,
                  remark: comment,
                },
              }).unwrap();
              onDialogClose();
            } catch (err) {
              console.error("Reject error:", err);
            }
          }}
          errors={null}
        />
      )}
    </>
  );
};
