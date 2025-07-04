import { Button } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { removeEmptyFields } from "../../../utils";
import { WorkflowActionDialog } from "../../../components/workflow/WorkflowActionDialog";
import {
  useActivateJobMutation,
  useDeactivateJobMutation,
} from "../../../app/api";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

import BlockIcon from "@mui/icons-material/Block";
export type JobStatus = 1 | 2;

export const ActivateOrDeActivateButton = ({
  id,
  initialStatus,
}: {
  id: number;
  initialStatus: JobStatus;
}) => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const [selectedAction, setSelectedAction] = useState<
    "activate" | "deactivate"
  >();
  const [activate, { error: activateError, reset: activateReset }] =
    useActivateJobMutation();
  const [deactivate, { error: deactivateError, reset: deactivateReset }] =
    useDeactivateJobMutation();
  const [commentError, setCommentError] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState(initialStatus);

  const onDialogClose = useCallback(() => {
    activateReset();
    deactivateReset();
    setDialogOpened(false);
  }, [activateReset, deactivateReset]);

  const handleSubmit = useCallback(
    async (comment: string) => {
      if (!selectedAction) return;
      if (!comment || comment.trim() === "") {
        setCommentError("Comment is required.");
        return;
      }

      setCommentError(null);

      const payload = removeEmptyFields({ id, comment });

      (selectedAction === "activate"
        ? activate({ activateJobCommand: payload })
        : deactivate({ deactivateJobCommand: payload })
      )
        .unwrap()
        .then(() => {
          setJobStatus(selectedAction === "activate" ? 1 : 2);
          onDialogClose();
        })
        .catch(() => {});
    },
    [activate, id, onDialogClose, deactivate, selectedAction]
  );

  const errors = useMemo(
    () => ((activateError || deactivateError) as any)?.data?.errors,
    [activateError, deactivateError]
  );

  return (
    <>
      {jobStatus === 1 ? (
        <Button
          onClick={() => {
            setDialogOpened(true);
            setSelectedAction("deactivate");
          }}
          size="small"
          startIcon={<BlockIcon style={{ color: "red" }} />}
        >
          Activated
        </Button>
      ) : (
        <Button
          onClick={() => {
            setDialogOpened(true);
            setSelectedAction("activate");
          }}
          size="small"
          startIcon={<PowerSettingsNewIcon style={{ color: "green" }} />}
        >
          Deactivated
        </Button>
      )}

      {dialogOpened && (
        <WorkflowActionDialog
          title={
            selectedAction === "activate"
              ? "Activation Request"
              : "Deactivation Request"
          }
          onClose={() => {
            onDialogClose();
            setSelectedAction(undefined);
          }}
          onSubmit={handleSubmit}
          errors={errors}
        />
      )}

      {commentError && (
        <div style={{ color: "red", marginTop: "10px" }}>{commentError}</div>
      )}
    </>
  );
};
