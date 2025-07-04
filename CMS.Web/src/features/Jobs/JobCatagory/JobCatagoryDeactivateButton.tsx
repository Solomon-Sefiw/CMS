import { Box, Button } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { WorkflowActionDialog } from "../../../components/workflow/WorkflowActionDialog";
import { useDeactivateJobCategoyMutation } from "../../../app/store";
import PowerOffIcon from "@mui/icons-material/PowerOff";
import { usePermission } from "../../../hooks";

export const JobCategoryDeactivateButton = ({
  id,
  disabled,
}: {
  id: number;
  disabled?: boolean;
}) => {
  const permissions = usePermission();
  const [dialogOpened, setDialogOpened] = useState(false);
  const [
    Deactivate,
    { error: DeactivateError, reset: submitReset, isLoading },
  ] = useDeactivateJobCategoyMutation();

  const onDialogClose = useCallback(() => {
    submitReset();
    setDialogOpened(false);
  }, [submitReset]);

  const handleSubmit = useCallback(
    (comment: string) => {
      Deactivate({ id /* , comment if needed */ }) // Include comment if your API supports it
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
        onClick={() => setDialogOpened(true)}
        disabled={disabled || !permissions.canDeactivateSetup}
        size="small"
        startIcon={<PowerOffIcon />}
      >
        Deactivate
      </Button>

      {dialogOpened && (
        <WorkflowActionDialog
          title="Deactivate Job Category"
          actionType="deactivate"
          onClose={onDialogClose}
          onSubmit={handleSubmit}
          errors={errors}
          submitting={isLoading}
          textAreaTitle="Please provide a reason for deactivation"
          emptyTextAreaErrorMsg="Comment is required for deactivation"
        />
      )}
    </Box>
  );
};
