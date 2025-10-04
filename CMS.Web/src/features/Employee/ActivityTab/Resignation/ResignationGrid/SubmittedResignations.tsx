import { ApprovalStatus } from "../../../../../app/api/enums";
import { ResignationList } from "../ResignationList";
export const SubmittedResignations = () => <ResignationList status={ApprovalStatus.Submitted} />;
