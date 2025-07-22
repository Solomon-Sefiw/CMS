
import { ApprovalStatus } from "../../../../../app/api/enums";
import { ActingList } from "../ActingList";

export const ApprovedActings = () => (
  <ActingList status={ApprovalStatus.Approved} />
);
