import { useMemo } from "react";
import { SelectOption } from "../../types";
import { useGetAllLookupsQuery } from "../../app/api/HCMSApi";

export const useBusinessUnitType = () => {
  const { data } = useGetAllLookupsQuery();

  const { businessUnitTypeLookups, businessUnitTypes } = useMemo(() => {
    const businessUnitTypeLookups = (
      data?.businessUnitTypes || []
    ).map<SelectOption>(({ value, name, description }) => ({
      label: name || description || "",
      value: value,
    }));

    return {
      businessUnitTypeLookups,
      businessUnitTypes: data?.businessUnits || [],
    };
  }, [data]);
  return {
    businessUnitTypes,
    businessUnitTypeLookups,
  };
};
