import { Box, Button } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { removeEmptyFields } from "../../../utils";
import { WorkflowActionDialog } from "../../../components/workflow/WorkflowActionDialog";
import { useActivateJobRoleMutation } from "../../../app/api/HCMSApi";
export const JobGradeActivateButton = ({
  id,
  disabled,
}: {
  id: number;
  disabled?: boolean;
}) => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const [Activate, { error: ActivateError, reset: submitReset }] =
    useActivateJobRoleMutation();

  const onDialogClose = useCallback(() => {
    submitReset();
    setDialogOpened(false);
  }, [submitReset]);

  const handleSubmit = useCallback(
    (comment: string) => {
      Activate({
        activateJobRoleCommand: removeEmptyFields({
          id,
          comment,
        }),
      })
        .unwrap()
        .then(onDialogClose)
        .catch(() => {});
    },
    [id, onDialogClose, Activate]
  );

  const errors = useMemo(
    () => (ActivateError as any)?.data?.errors,
    [ActivateError]
  );

  return (
    <Box>
      <Button
        onClick={() => {
          setDialogOpened(true);
        }}
        disabled={disabled}
      >
        Activate
      </Button>

      {dialogOpened && (
        <WorkflowActionDialog
          title="Activate JobRole"
          onClose={onDialogClose}
          onSubmit={handleSubmit}
          errors={errors}
        />
      )}
    </Box>
  );
};
