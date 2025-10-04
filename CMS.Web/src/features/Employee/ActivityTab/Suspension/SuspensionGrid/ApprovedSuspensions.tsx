import { ApprovalStatus } from "../../../../../app/api/enums";
import { SuspensionList } from "../SuspensionList";


export const ApprovedSuspensions = () => <SuspensionList status={ApprovalStatus.Approved} />;
