import { ApprovalStatus } from "../../../../../app/api/enums";
import { SuspensionList } from "../SuspensionList";

export const DraftSuspensions = () => <SuspensionList status={ApprovalStatus.Draft} />;
