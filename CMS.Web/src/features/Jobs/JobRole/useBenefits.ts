import { useMemo } from "react";
import { useGetAllLookupsQuery } from "../../../app/api";
import { MultipleSelectOption } from "../../../types";
import { ApprovalStatus } from "../../../app/api/enums";
import { NonNullChain } from "typescript";

export const useBenefits = () => {
  const { data } = useGetAllLookupsQuery();

  const { benefitLookups, jobRoleBenefits } = useMemo(() => {
    const approvedBenefits = (data?.benefits || []).filter(
      (benefit) => benefit.approvalStatus === ApprovalStatus.Approved
    );

    const benefitLookups: MultipleSelectOption[] = (data?.benefits || [])
      .filter(
        (b) => b.id != null && b.approvalStatus == ApprovalStatus.Approved
      ) // filter out only approved benefits
      .map(({ id, name }) => ({
        label: name ?? "",
        value: String(id), // or parseInt(id) if numeric
      }));

    return { benefitLookups, jobRoleBenefits: approvedBenefits };
  }, [data]);

  return {
    jobRoleBenefits,
    benefitLookups,
  };
};
