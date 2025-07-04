import { Button } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { WorkflowActionDialog } from "../../../components/workflow";
import { removeEmptyFields } from "../../../utils";
import { useApproveBenefitUnitPriceMutation, useRejectBenefitUnitPriceMutation } from "../../../app/api";
import { usePermission } from "../../../hooks";
export const ApproveOrRejectRequestButton = ({ id }: { id: number }) => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const [selectedAction, setSelectedAction] = useState<"approve" | "reject">();
  const [approve, { error: approveError, reset: approveReset }] =
    useApproveBenefitUnitPriceMutation();
  const [reject, { error: rejectError, reset: rejectReset }] =
    useRejectBenefitUnitPriceMutation();
const permissions = usePermission();
  const onDialogClose = useCallback(() => {
    approveReset();
    rejectReset();
    setDialogOpened(false);
    setSelectedAction(undefined);
  }, [approveReset, rejectReset]);

  const handleSubmit = useCallback(
    async (comment: string) => {
      if (!selectedAction) return;

      const payload = removeEmptyFields({
        id,
        remark: comment,
      });

      const action =
        selectedAction === "approve"
          ? approve({ approveBenefitUnitPriceCommand: payload })
          : reject({ rejectBenefitUnitPriceCommand: payload });

      action
        .unwrap()
        .then(onDialogClose)
        .catch(() => {});
    },
    [approve, reject, id, selectedAction, onDialogClose]
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
          title="Approval Request"
          onClose={onDialogClose}
          onSubmit={handleSubmit}
          errors={errors}
        />
      )}
    </>
  );
};
