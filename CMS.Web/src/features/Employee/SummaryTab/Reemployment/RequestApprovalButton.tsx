import { Box, Button } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { usePermission } from "../../../../hooks";
import { removeEmptyFields } from "../../../../utils";
import { WorkflowActionDialog } from "../../../../components/workflow/WorkflowActionDialog";
import { useSubmitReemploymentMutation } from "../../../../app/store";

export const RequestApprovalButton = ({
  reemploymentId,
}: {
  reemploymentId: number;
}) => {
  const permissions = usePermission();
  const [dialogOpened, setDialogOpened] = useState(false);
  const [submit, { error: submitError, reset: submitReset }] =
    useSubmitReemploymentMutation();

  const onDialogClose = useCallback(() => {
    submitReset();
    setDialogOpened(false);
  }, [submitReset]);

  const handleSubmit = useCallback(
    (comment: string) => {
      submit({
        submitReemploymentCommand: removeEmptyFields({
          reemploymentId,
          comment,
        }),
      })
        .unwrap()
        .then(onDialogClose)
        .catch(() => {});
    },
    [reemploymentId, onDialogClose, submit]
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
        disabled={!permissions.CanSubmitEmployeeActivity}
      >
        Submit
      </Button>

      {dialogOpened && (
        <WorkflowActionDialog
          title="Submit Approval Request"
          onClose={onDialogClose}
          onSubmit={handleSubmit}
          errors={errors}
        />
      )}
    </Box>
  );
};
