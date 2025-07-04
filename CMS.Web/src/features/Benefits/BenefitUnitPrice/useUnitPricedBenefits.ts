import { useMemo } from "react";
import { useGetAllLookupsQuery } from "../../../app/api";
import { ApprovalStatus } from "../../../app/api/enums";
import { SelectOption } from "../../../types";
export const useUnitPricedBenefits = () => {
  const { data } = useGetAllLookupsQuery();

  const { unitPricedBenefitLookups, allUnitPricedBenefit } = useMemo(() => {
    const approvedUnitPricedBenefits = (data?.unitPricedBenefits || []).filter(
      (status) => status.approvalStatus === ApprovalStatus.Approved
    );

    const unitPricedBenefitLookups =
      approvedUnitPricedBenefits.map<SelectOption>(({ id, name }) => ({
        label: name || "",
        value: id,
      }));

    return {
      unitPricedBenefitLookups,
      allUnitPricedBenefit: approvedUnitPricedBenefits,
    };
  }, [data]);

  return {
    allUnitPricedBenefit,
    unitPricedBenefitLookups,
  };
};
