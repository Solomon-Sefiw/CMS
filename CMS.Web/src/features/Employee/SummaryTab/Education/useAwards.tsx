import { useMemo } from "react";

import { useGetAllAwardQuery } from "../../../../app/store";
import { SelectOption } from "../../../../types";

export const useAward = () => {
  const { data: awards } = useGetAllAwardQuery();

  const awardLookups = useMemo(
    () =>
      (awards?.approved || []).map<SelectOption>(({ id, name }) => ({
        label: name || "",
        value: id,
      })),
    [awards?.approved]
  );

  return { awards, awardLookups };
};
