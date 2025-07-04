import { Box, Button } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { removeEmptyFields } from "../../../../utils";
import { WorkflowActionDialog } from "../../../../components/workflow/WorkflowActionDialog";
import { useDeActivateEmployeeFamilyMutation } from "../../../../app/api/HCMSApi";
export const EmployeeFamilyDeActivateButton = ({
  id,
  disabled,
}: {
  id: number;
  disabled?: boolean;
}) => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const [Activate, { error: ActivateError, reset: submitReset }] =
    useDeActivateEmployeeFamilyMutation();

  const onDialogClose = useCallback(() => {
    submitReset();
    setDialogOpened(false);
  }, [submitReset]);

  const handleSubmit = useCallback(
    (comment: string) => {
      Activate({
        deActivateEmployeeFamilyCommand: removeEmptyFields({
          id,
          comment,
        }),
      })
        .unwrap()
        .then(onDialogClose)
        .catch(() => {
          console.log(ActivateError + "error from");
        });
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
          title="Deactivate Employee Family"
          onClose={onDialogClose}
          onSubmit={handleSubmit}
          errors={errors}
        />
      )}
    </Box>
  );
};
