import { ApprovalStatus } from "../../../../../app/api/enums";
import { DelegationList } from "../DelegationList";

export const RejectedDelegations = () => (
  <DelegationList status={ApprovalStatus.Rejected} />
);
