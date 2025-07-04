import { useMemo } from "react";
import { SelectOption } from "../../../../types";
import { useGetAllRegionQuery } from "../../../../app/api/HCMSApi";

export const useEmployeeRegion = () => {
  const { data: regions } = useGetAllRegionQuery();

  const regionLookups = useMemo(
    () =>
      (regions?.approved || []).map<SelectOption>(({ id, name }) => ({
        label: name || "",
        value: id,
      })),
    [regions?.approved]
  );

  return { regions, regionLookups };
};
