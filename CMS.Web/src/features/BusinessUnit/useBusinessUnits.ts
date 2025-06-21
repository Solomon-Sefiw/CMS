import { useMemo } from "react";
import { SelectOption } from "../../types";
import {
  useGetAllBusinessUnitsQuery,
  useGetAllLookupsQuery,
} from "../../app/api/HCMSApi";

export const useBusinessUnit = () => {
  const { data: businessUnits } = useGetAllBusinessUnitsQuery();

  const businessUnitLookups = useMemo(
    () =>
      (businessUnits?.approved || []).map<SelectOption>(({ id, name }) => ({
        label: name || "",
        value: id,
      })),
    [businessUnits?.approved]
  );

  return { businessUnits, businessUnitLookups };
};
