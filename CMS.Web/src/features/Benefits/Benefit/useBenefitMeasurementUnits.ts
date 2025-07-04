import { useMemo } from "react";
import { useGetAllLookupsQuery } from "../../../app/api";
import { ApprovalStatus } from "../../../app/api/enums";
import { SelectOption } from "../../../types";
export const useBenefitMeasurementUnits = () => {
  const { data } = useGetAllLookupsQuery();

  const { benefitUnitOfMeasurementLookups, measurementUnit } = useMemo(() => {
    const approvedBenefitUnitOfMeasurements = (
      data?.benefitUnitOfMeasurements || []
    ).filter((status) => status.approvalStatus === ApprovalStatus.Approved);

    const benefitUnitOfMeasurementLookups =
      approvedBenefitUnitOfMeasurements.map<SelectOption>(
        ({ id, name, description }) => ({
          label: name || description || "",
          value: id,
        })
      );

    return {
      benefitUnitOfMeasurementLookups,
      measurementUnit: approvedBenefitUnitOfMeasurements,
    };
  }, [data]);

  return {
    measurementUnit,
    benefitUnitOfMeasurementLookups,
  };
};
