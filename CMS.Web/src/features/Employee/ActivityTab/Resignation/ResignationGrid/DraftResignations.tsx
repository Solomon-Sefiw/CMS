import { ApprovalStatus } from "../../../../../app/api/enums";
import { ResignationList } from "../ResignationList";

export const DraftResignations = () => <ResignationList status={ApprovalStatus.Draft} />;
