import { useMemo } from "react";
import { JobRoleDto, useGetAllLookupsQuery } from "../../../app/api";
import { SelectOption } from "./types";

export const useJobTitles = () => {
  const { data: lookups } = useGetAllLookupsQuery();

  const approvedJobRoles =
    lookups?.jobRoles?.filter((jobRole) => jobRole.approvalStatus === 4) || [];

  const jobTitlesLookups = useMemo(
    () =>
      approvedJobRoles.map<SelectOption>(({ roleName, id }: JobRoleDto) => ({
        label: roleName || "",
        value: id,
      })),
    [approvedJobRoles]
  );

  return { jobTitles: approvedJobRoles, jobTitlesLookups };
};
