import { useGetCaseInfoQuery } from "../../../app/api";
import { useCaseId } from "./useCaseId";

export const useCurrentCaseVersionApprovalStatus = () => {
  const { id, version } = useCaseId();

  const { data: shareholder } = useGetCaseInfoQuery(
    {
      id,
      version,
    },
    {
      skip: !id,
    }
  );

  return { approvalStatus: shareholder?.approvalStatus };
};
