import { Button } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { removeEmptyFields } from "../../../utils";
import { WorkflowActionDialog } from "../../../components/workflow/WorkflowActionDialog";
import {
  useApproveJobGradeMutation,
  useRejectJobGradeMutation,
} from "../../../app/api/HCMSApi";
import { usePermission } from "../../../hooks";

export const JobGradeApproveOrRejectRequestButton = ({
  id,
}: {
  id: number;
}) => {
  const permissions = usePermission();
  const [dialogOpened, setDialogOpened] = useState(false);
  const [selectedAction, setSelectedAction] = useState<"approve" | "reject">();
  const [approve, { error: approveError, reset: approveReset }] =
    useApproveJobGradeMutation();
  const [reject, { error: rejectError, reset: rejectReset }] =
    useRejectJobGradeMutation();

  const onDialogClose = useCallback(() => {
    approveReset();
    rejectReset();
    setDialogOpened(false);
  }, [approveReset, rejectReset]);

  const handleSubmit = useCallback(
    async (comment: string) => {
      if (!selectedAction) return;

      const payload = removeEmptyFields({
        id,
        comment,
      });
      (selectedAction === "approve"
        ? approve({
            approveJobGradeCommand: payload,
          })
        : reject({
            rejectJobGradeCommand: payload,
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
        disabled={!permissions.canApproveRejectSetup}
      >
        Approve
      </Button>

      <Button
        onClick={() => {
          setDialogOpened(true);
          setSelectedAction("reject");
        }}
        size="small"
        disabled={!permissions.canApproveRejectSetup}
      >
        Reject
      </Button>

      {dialogOpened && (
        <WorkflowActionDialog
          title="Job Grade Approval Request"
          onClose={() => {
            onDialogClose();
            setSelectedAction(undefined);
          }}
          onSubmit={handleSubmit}
          errors={errors}
        />
      )}
    </>
  );
};
