import { Box, Button } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { usePermission } from "../../../../../hooks";
import {
  useRemoveDelegationMutation,
  useSubmitDelegationMutation,
} from "../../../../../app/api";
import { removeEmptyFields } from "../../../../../utils";
import { WorkflowActionDialog } from "../../../../../components";

export const DelegationRemoveButton = ({ id }: { id: number }) => {
  const permissions = usePermission();
  const [dialogOpened, setDialogOpened] = useState(false);
  const [submit, { error: submitError, reset: submitReset }] =
    useRemoveDelegationMutation();

  const onDialogClose = useCallback(() => {
    submitReset();
    setDialogOpened(false);
  }, [submitReset]);

  const handleSubmit = useCallback(
    (comment: string) => {
      submit({
        removeDeligationCommand: removeEmptyFields({
          id,
          comment,
        }),
      })
        .unwrap()
        .then(onDialogClose)
        .catch(() => {});
    },
    [id, onDialogClose, submit]
  );

  const errors = useMemo(
    () => (submitError as any)?.data?.errors,
    [submitError]
  );

  return (
    <Box>
      <Button
        onClick={() => {
          setDialogOpened(true);
        }}
        size="small"
        disabled={!permissions.CanApproveRejectEmployeeActivity}
        variant="outlined"
        color="error"
      >
        Remove
      </Button>

      {dialogOpened && (
        <WorkflowActionDialog
          title="Remove Delegaation"
          onClose={onDialogClose}
          onSubmit={handleSubmit}
          errors={errors}
        />
      )}
    </Box>
  );
};
