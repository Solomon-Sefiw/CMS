import { useMemo } from "react";
import { SelectOption } from "../../../types";
import { useGetAllLookupsQuery } from "../../../app/api/HCMSApi";

export const useJobRole = () => {
  const { data } = useGetAllLookupsQuery();
  const { jobRoleLookups, jobRoles } = useMemo(() => {
    const jobRoleLookups = (data?.jobRoles || []).map<SelectOption>(
      ({ id, roleName, description }) => ({
        label: roleName || description || "",
        value: id,
      })
    );

    return { jobRoleLookups, jobRoles: data?.jobRoles || [] };
  }, [data]);
  return {
    jobRoles,
    jobRoleLookups,
  };
};
