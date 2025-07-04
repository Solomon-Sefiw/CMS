import { useGetEmployeeInfoQuery } from "../../../app/api";
import { useEmployeeId } from "./useEmployeeId";

export const useCurrentEmployeeVersionApprovalStatus = () => {
  const { id, version } = useEmployeeId();

  const { data: shareholder } = useGetEmployeeInfoQuery(
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
