import { useMemo } from "react";
import { useGetBenefitValuesListByBenefitIdQuery } from "../../../app/api";
import { SelectOption, SelectOptionForNumber } from "../../../types";
import { ApprovalStatus } from "../../../app/api/enums";

export const useBenefitValues = (benefitId: number) => {
  const { data, isLoading, isError } = useGetBenefitValuesListByBenefitIdQuery({
    benefitId,
  });

  const benefitValueLookups: SelectOptionForNumber[] = useMemo(() => {
    return (data || [])
      .filter(
        (x) =>
          x.approvalStatus === ApprovalStatus.Approved &&
          x.value !== undefined &&
          x.id !== undefined
      )
      .map(({ id, value }) => ({
        label: value?.toString() ?? "",
        value: id,
      }));
  }, [data]);

  return {
    benefitValueLookups,
    isLoading,
    isError,
  };
};
