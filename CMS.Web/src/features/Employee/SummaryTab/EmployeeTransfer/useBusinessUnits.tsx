import { useMemo } from "react";
import { useGetAllBusinessUnitsQuery } from "../../../../app/api";
import { SelectOption } from "./types";

export const useBusinessUnitss = () => {
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
