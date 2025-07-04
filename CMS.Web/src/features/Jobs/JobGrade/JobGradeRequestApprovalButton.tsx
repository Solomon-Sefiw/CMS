import { Box, Button } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { removeEmptyFields } from "../../../utils";
import { WorkflowActionDialog } from "../../../components/workflow/WorkflowActionDialog";
import { useSubmitJobGradeMutation } from "../../../app/api/HCMSApi";
import { usePermission } from "../../../hooks";
export const JobGradeRequestApprovalButton = ({
  id,
}: {
  id: number | undefined;
}) => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const [submit, { error: submitError, reset: submitReset }] =
    useSubmitJobGradeMutation();
  const permissions = usePermission();
  const onDialogClose = useCallback(() => {
    submitReset();
    setDialogOpened(false);
  }, [submitReset]);

  const handleSubmit = useCallback(
    (comment: string) => {
      submit({
        submitJobGradeCommand: removeEmptyFields({
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
          title="Submit JobGrade"
          onClose={onDialogClose}
          onSubmit={handleSubmit}
          errors={errors}
        />
      )}
    </Box>
  );
};
