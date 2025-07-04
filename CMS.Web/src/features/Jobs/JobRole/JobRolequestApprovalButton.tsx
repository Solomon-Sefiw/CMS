import { Box, Button } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { removeEmptyFields } from "../../../utils";
import { WorkflowActionDialog } from "../../../components/workflow/WorkflowActionDialog";
import { useSubmitJobRolesMutation } from "../../../app/api/HCMSApi";
import { usePermission } from "../../../hooks";
export const JobRolequestApprovalButton = ({ id }: { id: number }) => {
  const permissions = usePermission();
  const [dialogOpened, setDialogOpened] = useState(false);
  const [submit, { error: submitError, reset: submitReset }] =
    useSubmitJobRolesMutation();

  const onDialogClose = useCallback(() => {
    submitReset();
    setDialogOpened(false);
  }, [submitReset]);

  const handleSubmit = useCallback(
    (comment: string) => {
      submit({
        submitJobRolesCommand: removeEmptyFields({
          id: id !== undefined ? Number(id) : undefined, // Convert to number
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
          title="Submit JobRole"
          onClose={onDialogClose}
          onSubmit={handleSubmit}
          errors={errors}
        />
      )}
    </Box>
  );
};
