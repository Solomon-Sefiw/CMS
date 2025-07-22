import { ApprovalStatus } from "../../../../../app/api/enums";
import { ActingList } from "../ActingList";


export const RejectedActings = () => (
  <ActingList status={ApprovalStatus.Rejected} />
);