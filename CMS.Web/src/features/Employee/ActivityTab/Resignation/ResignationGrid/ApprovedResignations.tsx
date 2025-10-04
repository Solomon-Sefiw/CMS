import { ApprovalStatus } from "../../../../../app/api/enums";
import { ResignationList } from "../ResignationList";


export const ApprovedResignations = () => <ResignationList status={ApprovalStatus.Approved} />;
