import { Box, Button } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { removeEmptyFields } from "../../../utils";
import { WorkflowActionDialog } from "../../../components/workflow/WorkflowActionDialog";
import { useDeactivateJobRoleMutation } from "../../../app/api/HCMSApi";
export const JobRoleDeactivateButton = ({
  id,
  disabled,
}: {
  id: number;
  disabled?: boolean;
}) => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const [Deactivate, { error: DeactivateError, reset: submitReset }] =
    useDeactivateJobRoleMutation();

  const onDialogClose = useCallback(() => {
    submitReset();
    setDialogOpened(false);
  }, [submitReset]);

  const handleSubmit = useCallback(
    (comment: string) => {
      Deactivate({
        deactivateJobRoleCommand: removeEmptyFields({
          id,
          comment,
        }),
      })
        .unwrap()
        .then(onDialogClose)
        .catch(() => {});
    },
    [id, onDialogClose, Deactivate]
  );

  const errors = useMemo(
    () => (DeactivateError as any)?.data?.errors,
    [DeactivateError]
  );

  return (
    <Box>
      <Button
        onClick={() => {
          setDialogOpened(true);
        }}
        disabled={disabled}
        size="small"
      >
        Deactivate
      </Button>

      {dialogOpened && (
        <WorkflowActionDialog
          title="Deactivate JobRole"
          onClose={onDialogClose}
          onSubmit={handleSubmit}
          errors={errors}
        />
      )}
    </Box>
  );
};
