import { useMemo } from "react";
import { useGetAllChilotQuery } from "../../app/api/HCMSApi";
import { SelectOption } from "../../types";
export const useChilot = () => {
  const { data: chilots } = useGetAllChilotQuery();

  const chilotLookups = useMemo(
    () =>
      (chilots?.approved || []).map<SelectOption>(({ id, name }) => ({
        label: name || "",
        value: id,
      })),
    [chilots?.approved]
  );

  return { chilots, chilotLookups };
};
