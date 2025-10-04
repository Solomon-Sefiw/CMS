import { Box, Button } from "@mui/material";
import { useState, useCallback, useMemo } from "react";
import { useSubmitSuspensionMutation } from "../../../../../app/store";
import { usePermission } from "../../../../../hooks";
import { removeEmptyFields } from "../../../../../utils";
import { WorkflowActionDialog } from "../../../../../components";

export const SuspensionApprovalButton = ({ id }: { id: number }) => {
  const permissions = usePermission();
  const [dialogOpened, setDialogOpened] = useState(false);
  const [submit, { error: submitError, reset: submitReset }] = useSubmitSuspensionMutation();

  const onDialogClose = useCallback(() => { submitReset(); setDialogOpened(false); }, [submitReset]);
  const handleSubmit = useCallback((comment: string) => {
    submit({ submitSuspensionCommand: removeEmptyFields({ id, comment }) }).unwrap().then(onDialogClose).catch(() => {});
  }, [id, submit, onDialogClose]);

  const errors = useMemo(() => (submitError as any)?.data?.errors, [submitError]);

  return (
    <Box>
      <Button onClick={() => setDialogOpened(true)} size="small" disabled={!permissions.CanSubmitEmployeeActivity}>Submit</Button>
      {dialogOpened && <WorkflowActionDialog title="Submit Approval Request" onClose={onDialogClose} onSubmit={handleSubmit} errors={errors} />}
    </Box>
  );
};
