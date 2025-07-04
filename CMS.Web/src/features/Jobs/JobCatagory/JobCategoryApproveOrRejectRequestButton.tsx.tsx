import { Button } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { WorkflowActionDialog } from "../../../components/workflow/WorkflowActionDialog";
import {
  useApproveJobCatagoryMutation,
  useRejectJobCategoryMutation,
  useGetJobCategoryByIdQuery, // Import refetch method
} from "../../../app/api";
import { usePermission } from "../../../hooks";

export const JobCategoryApproveOrRejectRequestButton = ({
  id,
  onActionCompleted,
}: {
  id: number;
  onActionCompleted?: () => void;
}) => {
  const permissions = usePermission();
  const [dialogOpened, setDialogOpened] = useState(false);
  const [selectedAction, setSelectedAction] = useState<"approve" | "reject">();
  const [approve, { error: approveError, reset: approveReset }] =
    useApproveJobCatagoryMutation();
  const [reject, { error: rejectError, reset: rejectReset }] =
    useRejectJobCategoryMutation();
  const [commentError, setCommentError] = useState<string | null>(null);

  // Refetch hook to reload the data after each approval or rejection
  const { refetch } = useGetJobCategoryByIdQuery(
    { id: id ?? 0 },
    { skip: id === undefined }
  );

  // Closing the dialog
  const onDialogClose = useCallback(() => {
    approveReset();
    rejectReset();
    setDialogOpened(false);
    setSelectedAction(undefined);
  }, [approveReset, rejectReset]);

  const handleSubmit = useCallback(
    async (comment: string) => {
      if (!selectedAction) return;
      if (!comment.trim()) {
        setCommentError("Comment is required.");
        return;
      }

      setCommentError(null);

      if (id === undefined) {
        console.error("ID is required but undefined.");
        return;
      }

      console.log("Attempting to approve/reject job category with ID:", id); // Log the ID

      try {
        if (selectedAction === "approve") {
          const response = await approve({ id: id ?? 0 }).unwrap();
          console.log("Approve response:", response); // Log response
        } else if (selectedAction === "reject") {
          const response = await reject({
            rejectJobCategoryCommand: { id: id ?? 0, comment },
          }).unwrap();
          console.log("Reject response:", response); // Log response
        }

        // Refetch data to reflect the updated state
        await refetch();

        onDialogClose(); // Close the dialog after submission
        onActionCompleted?.(); // Call the callback after action completion
      } catch (error) {
        console.error("Error occurred:", error); // Log error details
        setCommentError("An error occurred. Please try again.");
      }
    },
    [
      approve,
      reject,
      id,
      selectedAction,
      onDialogClose,
      onActionCompleted,
      refetch,
    ]
  );
  // Extract errors from mutations
  const errors = useMemo(
    () => ((approveError || rejectError) as any)?.data?.errors,
    [approveError, rejectError]
  );

  return (
    <>
      <Button
        onClick={() => {
          setDialogOpened(true);
          setSelectedAction("approve");
        }}
        size="small"
        disabled={!permissions.canApproveRejectSetup}
      >
        Approve
      </Button>

      <Button
        onClick={() => {
          setDialogOpened(true);
          setSelectedAction("reject");
        }}
        size="small"
        disabled={!permissions.canApproveRejectSetup}
      >
        Reject
      </Button>

      {dialogOpened && (
        <WorkflowActionDialog
          title={
            selectedAction === "approve"
              ? "Approve Job Category"
              : "Reject Job Category"
          }
          onClose={onDialogClose}
          onSubmit={handleSubmit}
          errors={errors}
          actionType={selectedAction}
        />
      )}

      {commentError && (
        <div style={{ color: "red", marginTop: "10px" }}>{commentError}</div>
      )}
    </>
  );
};
