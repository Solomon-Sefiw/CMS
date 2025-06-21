import { Box, Button, Typography } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { removeEmptyFields } from "../../utils";
import { WorkflowActionDialog } from "../../components/workflow/WorkflowActionDialog";
import {
  useGetAddressByRequestIdQuery,
  useSubmitBusinessUnitMutation,
} from "../../app/api";
import { AddressType } from "../../app/api/enums";
import { usePermission } from "../../hooks";

interface RequestApprovalButtonProps {
  id: number;
}

export const RequestApprovalButton: React.FC<RequestApprovalButtonProps> = ({
  id,
}) => {
  const permissions = usePermission();
  const [dialogOpened, setDialogOpened] = useState(false);
  const [
    submit,
    { error: submitError, reset: submitReset, isLoading: isSubmitting },
  ] = useSubmitBusinessUnitMutation();
  const { data: address } = useGetAddressByRequestIdQuery(
    { requestId: id, addressType: AddressType.BusinessUnitAddress },
    { skip: !id }
  );

  const hasAddress = useMemo(() => !!address?.id, [address]);

  const onDialogClose = useCallback(() => {
    submitReset();
    setDialogOpened(false);
  }, [submitReset]);

  const handleSubmit = useCallback(
    (comment: string) => {
      submit({
        submitBusinessUnitCommand: removeEmptyFields({
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
      {hasAddress ? (
        <Button
          onClick={() => {
            setDialogOpened(true);
          }}
          size="small"
          disabled={!permissions.canSubmitSetup || isSubmitting}
        >
          Submit for Approval
        </Button>
      ) : (
        <Typography color="error" variant="caption">
          Unable to Submit before Address is Added
        </Typography>
      )}

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
