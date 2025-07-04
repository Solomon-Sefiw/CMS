import { Box, Button } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { removeEmptyFields } from "../../../../utils";
import { WorkflowActionDialog } from "../../../../components/workflow/WorkflowActionDialog";
import {
  useActivateEmployeeGuranteeMutation,
  ActivateEmployeeGurantersCommand,
} from "../../../../app/api/HCMSApi";

export const EmployeeGuaranteeActivateButton = ({
  id,
  employeeId,
  disabled,
}: {
  id: number;
  employeeId: number;
  disabled?: boolean;
}) => {
  const [dialogOpened, setDialogOpened] = useState(false);

  const [Activate, { error: ActivateError, reset: submitReset }] =
    useActivateEmployeeGuranteeMutation();
  const onDialogClose = useCallback(() => {
    submitReset();
    setDialogOpened(false);
  }, [submitReset]);

  const handleSubmit = useCallback(
    (comment: string) => {
      Activate({
        activateEmployeeGurantersCommand: removeEmptyFields({
          id,
          employeeId,
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
        variant="outlined"
        color="primary"
        size="small"
        onClick={() => {
          setDialogOpened(true);
        }}
        disabled={disabled}
      >
        Activate
      </Button>

      {dialogOpened && (
        <WorkflowActionDialog
          title="Activate Employee Family"
          onClose={onDialogClose}
          onSubmit={handleSubmit}
          errors={errors}
        />
      )}
    </Box>
  );
};
