import { useMemo } from "react";

import { useGetAllFieldOfStudyQuery } from "../../../../app/store";
import { SelectOption } from "../../../../types";

export const useFieldOfStudy = () => {
  const { data: fieldOfStudies } = useGetAllFieldOfStudyQuery();

  const fieldOfStudyLookups = useMemo(
    () =>
      (fieldOfStudies?.approved || []).map<SelectOption>(({ id, name }) => ({
        label: name || "",
        value: id,
      })),
    [fieldOfStudies?.approved]
  );

  return { fieldOfStudies, fieldOfStudyLookups };
};
