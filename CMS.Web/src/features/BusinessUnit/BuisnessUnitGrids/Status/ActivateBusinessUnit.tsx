import { Box, Button, Typography } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useActivateBusinessUnitMutation } from "../../../../app/api";
import { removeEmptyFields } from "../../../../utils";
import { WorkflowActionDialog } from "../../../../components/workflow/WorkflowActionDialog";
import { usePermission } from "../../../../hooks";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
export const ActivateBusinessUnit = ({ id }: { id: number | undefined }) => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const [activate, { error: submitError, reset: submitReset }] =
    useActivateBusinessUnitMutation();
  const permissions = usePermission();
  const onDialogClose = useCallback(() => {
    submitReset();
    setDialogOpened(false);
  }, [submitReset]);

  const handleSubmit = useCallback(
    (comment: string) => {
      activate({
        activateBusinessUnitCommand: removeEmptyFields({
          id,
          comment,
        }),
      })
        .unwrap()
        .then(onDialogClose)
        .catch(() => {});
    },
    [id, onDialogClose, activate]
  );

  const errors = useMemo(
    () => (submitError as any)?.data?.errors,
    [submitError]
  );

  return (
    <Box>
      <Button
        sx={{ color: "green" }}
        onClick={() => {
          setDialogOpened(true);
        }}
        size="small"
        disabled={!permissions.canDeactivateSetup}
      >
        <PowerSettingsNewIcon />
        <Typography variant="body1">Activate </Typography>{" "}

      </Button>

      {dialogOpened && (
        <WorkflowActionDialog
          title="Activation Comment | Reason "
          onClose={onDialogClose}
          onSubmit={handleSubmit}
          errors={errors}
        />
      )}
    </Box>
  );
};
