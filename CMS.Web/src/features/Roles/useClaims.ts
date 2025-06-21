import { useMemo } from "react";
import { useGetPermissionsQuery, useGetRolesQuery } from "../../app/api";
import { SelectOption, SelectOptionRole } from "../../types";

export const useClaims = () => {
  const { data: permissionClaims } = useGetPermissionsQuery();

  const claimsLookups = useMemo(
    () =>
      (permissionClaims || []).map<SelectOptionRole>(({ id, claimValue,claimCategory }) => ({
        label: claimValue!,
        value: claimValue!,
        claimCategory : claimCategory
      })),
    [permissionClaims]
  );
  return {
    permissionClaims,
    claimsLookups,
  };
};
