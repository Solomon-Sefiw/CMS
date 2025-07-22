// src/features/Employee/ActivityTab/Delegation/ApprovedDelegations.tsx
import { ApprovalStatus } from "../../../../../app/api/enums";
import { DelegationList } from "../DelegationList";

export const ApprovedDelegations = () => (
  <DelegationList status={ApprovalStatus.Approved} />
);

// Repeat for other statuses (DraftDelegations.tsx, SubmittedDelegations.tsx, RejectedDelegations.tsx)
// Just change the status prop in each