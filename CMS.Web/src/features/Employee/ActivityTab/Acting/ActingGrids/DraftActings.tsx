import { ApprovalStatus } from "../../../../../app/api/enums";
import { ActingList } from "../ActingList";

export const DraftActings = () => <ActingList status={ApprovalStatus.Draft} />;
