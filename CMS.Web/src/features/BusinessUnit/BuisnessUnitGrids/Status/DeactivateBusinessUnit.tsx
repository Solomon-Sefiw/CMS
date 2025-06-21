import { Box, Button, Typography } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useDeactivateBusinessUnitMutation } from "../../../../app/api";
import { removeEmptyFields } from "../../../../utils";
import { WorkflowActionDialog } from "../../../../components/workflow/WorkflowActionDialog";

import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import PowerOffIcon from "@mui/icons-material/PowerOff";
import { usePermission } from "../../../../hooks";
export const DeactivateBusinessUnit = ({ id }: { id: number | undefined }) => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const [deactivate, { error: submitError, reset: submitReset }] =
    useDeactivateBusinessUnitMutation();
    const permissions = usePermission();

  const onDialogClose = useCallback(() => {
    submitReset();
    setDialogOpened(false);
  }, [submitReset]);

  const handleSubmit = useCallback(
    (comment: string) => {
      deactivate({
        deActiveBusinessUnitCommand: removeEmptyFields({
          id,
          comment,
        }),
      })
        .unwrap()
        .then(onDialogClose)
        .catch(() => {});
    },
    [id, onDialogClose, deactivate]
  );

  const errors = useMemo(
    () => (submitError as any)?.data?.errors,
    [submitError]
  );

  return (
    <Box>
      <Button
        sx={{ color: "red", fontSize: 16, fontFamily: "bold" }}
        onClick={() => {
          setDialogOpened(true);
        }}
        size="small"
        disabled={!permissions.canActivateSetup}
      >
        <PowerOffIcon />
        Deactivate {" "}
      </Button>

      {dialogOpened && (
        <WorkflowActionDialog
          title="Deactivating Comment | Reason "
          onClose={onDialogClose}
          onSubmit={handleSubmit}
          errors={errors}
        />
      )}
    </Box>
  );
};
