import { useMemo, useEffect } from "react";
import { ApprovalStatus } from "../../../../app/api/enums";
import { useEmployeeId } from "../useEmployeeId";
import { useCurrentEmployeeVersionApprovalStatus } from "../useCurrentEmployeeVersionApprovalStatus";
import { useGetEmployeeChangeLogQuery } from "../../../../app/store";
import { employeeChangeLogsLabels } from "../../../../utils";

export const useEmployeeChangeLogs = () => {
  const { id } = useEmployeeId();
  const { approvalStatus } = useCurrentEmployeeVersionApprovalStatus();

  const {
    data,
    refetch: refetchChangeLogs,
    isFetching,
    isLoading,
  } = useGetEmployeeChangeLogQuery(
    {
      employeeId: id,
    },
    {
      skip: !id,
      refetchOnMountOrArgChange: true,
    }
  );

  const { changeLabels, changeLogs } = useMemo(() => {
    if (!approvalStatus || approvalStatus === ApprovalStatus.Approved) {
      return { changeLabels: [], changeLogs: undefined };
    }

    return {
      changeLabels: employeeChangeLogsLabels(data),
      changeLogs: data,
    };
  }, [approvalStatus, data]);

  return {
    changeLogs,
    changeLabels,
    refetchChangeLogs,
    isFetching,
    isLoading,
  };
};