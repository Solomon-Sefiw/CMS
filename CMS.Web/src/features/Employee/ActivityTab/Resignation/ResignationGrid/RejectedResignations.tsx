import { ApprovalStatus } from "../../../../../app/api/enums";
import { ResignationList } from "../ResignationList";
export const RejectedResignations = () => <ResignationList status={ApprovalStatus.Rejected} />;
