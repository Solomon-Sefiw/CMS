import { ApprovalStatus } from "../../../../../app/api/enums";
import { DelegationList } from "../DelegationList";

export const SubmittedDelegations = () => (
  <DelegationList status={ApprovalStatus.Submitted} />
);