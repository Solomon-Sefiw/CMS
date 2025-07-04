import { useMemo } from "react";

import { useGetAllInstitutionNameQuery } from "../../../../app/store";
import { SelectOption } from "../../../../types";

export const useInstitutionName = () => {
  const { data: institutionNames } = useGetAllInstitutionNameQuery();

  const institutionNamesLookups = useMemo(
    () =>
      (institutionNames?.approved || []).map<SelectOption>(({ id, name }) => ({
        label: name || "",
        value: id,
      })),
    [institutionNames?.approved]
  );

  return { institutionNames, institutionNamesLookups };
};
