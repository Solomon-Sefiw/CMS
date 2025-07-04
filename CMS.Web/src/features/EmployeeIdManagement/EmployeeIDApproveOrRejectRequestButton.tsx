import { Button } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { EmployeeDto } from "../../app/api/HCMSApi";
import {
  useEmployeeIdCardApprovalApprovalMutation,
  useEmployeeIdCardApprovalRejectedMutation,
} from "../../app/api/HCMSApi";
import { EmployeeIDWorkflowActionDialog } from "./EmployeeIDWorkflowActionDialog";
import {
  EmployeeIdCardApprovalApprovalCommand,
  EmployeeIdCardApprovalRejectedCommand,
} from "../../app/api/HCMSApi";
import { enums } from "../../app/api";
import { usePermission } from "../../hooks";

type WorkflowActionType = "approve" | "reject";

type WorkflowSubmitPayload = {
  employeeId: number | undefined;
  remark: string | undefined;
  action: WorkflowActionType | undefined;
};

export const EmployeeIDApproveOrRejectRequestButton = ({
  employee,
}: {
  employee: EmployeeDto;
}) => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const [selectedAction, setSelectedAction] = useState<
    "approve" | "reject" | undefined
  >();
  const [approve, { error: approveError, reset: approveReset }] =
    useEmployeeIdCardApprovalApprovalMutation();
  const [reject, { error: rejectError, reset: rejectReset }] =
    useEmployeeIdCardApprovalRejectedMutation();
const permissions = usePermission();

  const onDialogClose = useCallback(() => {
    approveReset();
    rejectReset();
    setDialogOpened(false);
  }, [approveReset, rejectReset]);

  const handleWorkflowSubmit = useCallback(
    async ({ employeeId, remark, action }: WorkflowSubmitPayload) => {
      const status =
        action === "approve"
          ? enums.EmployeeIDCardStatus.IDCardApproved
          : enums.EmployeeIDCardStatus.IDCardApprovalRejected;

      const payload = {
        employeeId,
        status,
        employeeIdCardStatusRemark: remark,
      };

      try {
        if (action === "approve") {
          await approve({
            employeeIdCardApprovalApprovalCommand: payload,
          }).unwrap();
        } else {
          await reject({
            employeeIdCardApprovalRejectedCommand: payload,
          }).unwrap();
        }
        onDialogClose();
      } catch (err) {
        console.error("Submission failed:", err);
      }
    },
    [approve, reject, onDialogClose]
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
        disabled={!permissions.CanApproveRejectEmployeeId}
      >
        Approve
      </Button>

      <Button
        onClick={() => {
          setDialogOpened(true);
          setSelectedAction("reject");
        }}
        size="small"
        disabled={!permissions.CanApproveRejectEmployeeId}
      >
        Reject
      </Button>

      {dialogOpened && (
        <EmployeeIDWorkflowActionDialog
          title="Employee ID Approval"
          action={selectedAction}
          onClose={onDialogClose}
          onSubmit={(remark) =>
            handleWorkflowSubmit({
              employeeId: employee.employeeId,
              remark,
              action: selectedAction!,
            })
          }
          errors={errors}
          employeeId={employee?.employeeId}
        />
      )}
    </>
  );
};
