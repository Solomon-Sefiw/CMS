import { Box, Button } from "@mui/material";
import { useState, useCallback, useMemo } from "react";
import { usePermission } from "../../../../../hooks";
import { useRejectResignationMutation, useSubmitResignationMutation } from "../../../../../app/store";
import { removeEmptyFields } from "../../../../../utils";
import { WorkflowActionDialog } from "../../../../../components";

export const ResignationRejectButton = ({ id }: { id: number }) => {
  const permissions = usePermission();
  const [dialogOpened, setDialogOpened] = useState(false);
  const [reject, { error: submitError, reset: submitReset }] = useRejectResignationMutation();

  const onDialogClose = useCallback(() => { submitReset(); setDialogOpened(false); }, [submitReset]);
  const handleSubmit = useCallback((comment: string) => {
    reject({ rejectResignationCommand: removeEmptyFields({ id, comment }) }).unwrap().then(onDialogClose).catch(() => {});
  }, [id, reject, onDialogClose]);

  const errors = useMemo(() => (submitError as any)?.data?.errors, [submitError]);

  return (
    <Box>
      <Button onClick={() => setDialogOpened(true)} color="warning" size="small" disabled={!permissions.canApproveRejectSetup}>Remove Resignation</Button>
      {dialogOpened && <WorkflowActionDialog title="Remove Resignation" onClose={onDialogClose} onSubmit={handleSubmit} errors={errors} />}
    </Box>
  );
};
