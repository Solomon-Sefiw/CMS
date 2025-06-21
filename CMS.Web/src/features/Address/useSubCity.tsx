import { useMemo } from "react";
import { SelectOption } from "../../types";
import { useGetAllSubCityQuery } from "../../app/api/HCMSApi";

export const useSubCity = () => {
  const { data: subCities } = useGetAllSubCityQuery();

  const subcityLookups = useMemo(
    () =>
      (subCities?.approved || []).map<SelectOption>(({ id, name }) => ({
        label: name || "",
        value: id,
      })),
    [subCities?.approved]
  );

  return { subCities, subcityLookups };
};
