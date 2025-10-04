import { useMemo, useEffect } from "react";
import { ApprovalStatus } from "../../../../app/api/enums";
import { useGetEmployeeChangeLogQuery } from "../../../../app/store";
import { employeeChangeLogsLabels } from "../../../../utils";
import { useCurrentCaseVersionApprovalStatus } from "../useCurrentCaseVersionApprovalStatus";
import { useCaseId } from "../useCaseId";

export const useEmployeeChangeLogs = () => {
  const { id } = useCaseId();
  const { approvalStatus } = useCurrentCaseVersionApprovalStatus();

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