import { ApprovalStatus } from "../../../../../app/api/enums";
import { ActingList } from "../ActingList";

export const SubmittedActings = () => (
  <ActingList status={ApprovalStatus.Submitted} />
);
