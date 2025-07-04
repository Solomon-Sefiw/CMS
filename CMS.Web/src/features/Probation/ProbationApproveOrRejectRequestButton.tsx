import { Button } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { EmployeeDto, enums, ProbationApprovalCommand } from "../../app/store";
import { ProbationWorkflowActionDialog } from "./ProbationWorkflowActionDialog";
import { useRejectProbationApprovalMutation,useProbationApprovalMutation } from "../../app/api/HCMSApi";
import { usePermission } from "../../hooks";

export const ProbationApproveOrRejectRequestButton = ({
  employee,
}: {
  employee: EmployeeDto;
}) => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const [selectedAction, setSelectedAction] = useState<"approve" | "reject">();
  const [approve, { error: approveError, reset: approveReset }] =
    useProbationApprovalMutation();
  const [reject, { error: rejectError, reset: rejectReset }] =
  useRejectProbationApprovalMutation();
const permissions = usePermission();
  const onDialogClose = useCallback(() => {
    approveReset();
    rejectReset();
    setDialogOpened(false);
  }, [approveReset, rejectReset]);

  const handleSubmit = useCallback(
    async (command: ProbationApprovalCommand) => {
      if (!selectedAction) return;

      const basePayload = {
        id: employee.id,
        employeeId: employee.employeeId,
        probationResult: employee.probationResult,
        probationRemark: command.probationRemark,
      };

      const employeeStatus =
        selectedAction === "reject"
          ? enums.EmployeeStatusEnum.ProbationApprovalRejected
          : employee.probationResult === enums.ProbationResult.BecomePermanent
          ? enums.EmployeeStatusEnum.Active
          : enums.EmployeeStatusEnum.Terminated;

      const probationResult =
        selectedAction === "reject"
          ? enums.ProbationResult.ReturnedFromApproval
          : employee.probationResult;

      const payload = {
        ...basePayload,
        employeeStatus,
        probationResult,
      };

      (selectedAction === "approve"
        ? approve({ probationApprovalCommand: payload })
        : reject({ probationRejectApprovalCommand: payload })
      )
        .unwrap()
        .then(onDialogClose)
        .catch((err) => {
          console.error("Probation approval error:", err);
        });
    },
    [approve, onDialogClose, reject, selectedAction, employee, enums]
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
        disabled={!permissions.CanApproveRejectEmployeeProbation}
      >
        Approve
      </Button>

      <Button
        onClick={() => {
          setDialogOpened(true);
          setSelectedAction("reject");
        }}
        size="small"
        disabled={!permissions.CanApproveRejectEmployeeProbation}
      >
        Reject
      </Button>

      {dialogOpened && (
        <ProbationWorkflowActionDialog
          title="Probation Approval Request"
          onClose={() => {
            onDialogClose();
            setSelectedAction(undefined);
          }}
          onSubmit={handleSubmit}
          errors={errors}
          employee={employee}
        />
      )}
    </>
  );
};
