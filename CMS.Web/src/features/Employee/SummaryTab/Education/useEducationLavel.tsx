import { useMemo } from "react";

import { useGetAllEducationLevelQuery } from "../../../../app/store";
import { SelectOption } from "../../../../types";

export const useEducationLavel = () => {
  const { data: educationLavel } = useGetAllEducationLevelQuery();

  const educationLavelLookups = useMemo(
    () =>
      (educationLavel?.approved || []).map<SelectOption>(({ id, name }) => ({
        label: name || "",
        value: id,
      })),
    [educationLavel?.approved]
  );

  return { educationLavel, educationLavelLookups };
};
