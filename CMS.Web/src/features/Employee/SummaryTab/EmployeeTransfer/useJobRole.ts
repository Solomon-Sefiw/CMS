import { useMemo } from "react";
import { useGetAllLookupsQuery } from "../../../../app/api";
import { SelectOption } from "./types";

export const useJobRole = () => {
  const { data } = useGetAllLookupsQuery();

  const { jobRoleLookups, jobRoles } = useMemo(() => {
    const filteredJobRoles = (data?.jobRoles || []).filter(
      ({ approvalStatus }) => approvalStatus === 4
    );

    const jobRoleLookups = filteredJobRoles.map<SelectOption>(
      ({ id, roleName, description }) => ({
        label: roleName || description || "",
        value: id,
      })
    );

    return { jobRoleLookups, jobRoles: filteredJobRoles };
  }, [data]);

  return {
    jobRoles,
    jobRoleLookups,
  };
};
