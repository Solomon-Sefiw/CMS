import { ApprovalStatus } from "../../../../../app/api/enums";
import { DelegationList } from "../DelegationList";

export const DraftDelegations = () => (
  <DelegationList status={ApprovalStatus.Draft} />
);