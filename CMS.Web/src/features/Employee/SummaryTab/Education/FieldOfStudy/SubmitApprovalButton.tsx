import { Box, Button } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { usePermission } from "../../../../../hooks";
import {
  useSubmitAwardMutation,
  useSubmitFieldOfStudyMutation,
} from "../../../../../app/store";
import { removeEmptyFields } from "../../../../../utils";
import { WorkflowActionDialog } from "../../../../../components/workflow/WorkflowActionDialog";

export const SubmitApprovalButton = ({ id }: { id: number }) => {
  const permissions = usePermission();
  const [dialogOpened, setDialogOpened] = useState(false);
  const [submit, { error: submitError, reset: submitReset }] =
    useSubmitFieldOfStudyMutation();

  const onDialogClose = useCallback(() => {
    submitReset();
    setDialogOpened(false);
  }, [submitReset]);

  const handleSubmit = useCallback(
    (comment: string) => {
      submit({
        submitFieldOfStudyCommand: removeEmptyFields({
          id,
          comment,
        }),
      })
        .unwrap()
        .then(onDialogClose)
        .catch(() => {});
    },
    [id, onDialogClose, submit]
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
        disabled={!permissions.canSubmitSetup}
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
