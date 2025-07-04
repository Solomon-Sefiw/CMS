import { Box, Button } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { removeEmptyFields } from "../../../utils";
import { WorkflowActionDialog } from "../../../components/workflow/WorkflowActionDialog";
import { useActivateJobCategoryMutation } from "../../../app/api/HCMSApi";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import PowerOffIcon from "@mui/icons-material/PowerOff";
import { usePermission } from "../../../hooks";
export const JobCategoryActivateButton = ({
  id,
  disabled,
}: {
  id: number;
  disabled?: boolean;
}) => {
  const permissions = usePermission();
  const [dialogOpened, setDialogOpened] = useState(false);
  const [activate, { error: activateError, reset: submitReset }] =
    useActivateJobCategoryMutation();

  const onDialogClose = useCallback(() => {
    submitReset();
    setDialogOpened(false);
  }, [submitReset]);

  const handleSubmit = useCallback(
    (comment: string) => {
      if (id === undefined) return;

      activate({
        id, // now guaranteed to be a number
        ...(comment ? { comment } : {}), // only include comment if it's defined
      })
        .unwrap()
        .then(onDialogClose)
        .catch(() => {});
    },
    [id, onDialogClose, activate]
  );

  const errors = useMemo(
    () => (activateError as any)?.data?.errors,
    [activateError]
  );

  return (
    <Box>
      <Button
        onClick={() => setDialogOpened(true)}
        disabled={disabled || !permissions.canActivateSetup}
        startIcon={<PowerSettingsNewIcon />}
      >
        Activate
      </Button>

      {dialogOpened && (
        <WorkflowActionDialog
          title="Activate Job Category"
          actionType="activate"
          onClose={onDialogClose}
          onSubmit={handleSubmit}
          errors={errors}
        />
      )}
    </Box>
  );
};
