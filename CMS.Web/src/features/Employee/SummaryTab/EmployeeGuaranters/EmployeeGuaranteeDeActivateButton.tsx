import { Box, Button } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { removeEmptyFields } from "../../../../utils";
import { WorkflowActionDialog } from "../../../../components/workflow/WorkflowActionDialog";
import {
  useDeActivateEmployeeGuaranteeMutation,
  DeActivateEmployeeGurantersCommand,
} from "../../../../app/api/HCMSApi";

export const EmployeeGuaranteeDeActivateButton = ({
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
    useDeActivateEmployeeGuaranteeMutation();
  const onDialogClose = useCallback(() => {
    submitReset();
    setDialogOpened(false);
  }, [submitReset]);

  const handleSubmit = useCallback(
    (comment: string) => {
      Activate({
        deActivateEmployeeGurantersCommand: removeEmptyFields({
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
        Deactivate
      </Button>

      {dialogOpened && (
        <WorkflowActionDialog
          title="Deactivate Employee Guarantee"
          onClose={onDialogClose}
          onSubmit={handleSubmit}
          errors={errors}
        />
      )}
    </Box>
  );
};
