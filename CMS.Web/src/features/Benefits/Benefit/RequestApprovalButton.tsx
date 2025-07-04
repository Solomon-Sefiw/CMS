import { Box, Button } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { WorkflowActionDialog } from "../../../components/workflow";
import { removeEmptyFields } from "../../../utils";
import { useSubmitBenefitMutation } from "../../../app/store";
import { usePermission } from "../../../hooks";
export const RequestApprovalButton = ({ id }: { id: number }) => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const [submit, { error: submitError, reset: submitReset }] =
    useSubmitBenefitMutation();
  const permissions = usePermission();
  const onDialogClose = useCallback(() => {
    submitReset();
    setDialogOpened(false);
  }, [submitReset]);

  const handleSubmit = useCallback(
    (comment: string) => {
      submit({
        submitBenefitCommand: removeEmptyFields({
          id,
          remark: comment,
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
