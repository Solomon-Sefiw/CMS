import { Box, Typography } from "@mui/material";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CreateRoleDto, useCreateRoleMutation, useGetPermissionsQuery } from "../../../app/api";
import { RoleRegistrationForm } from "./RoleRegistrationForm";
import { useClaims } from "../../Roles/useClaims";
import { getuid } from "process";

export const RegisterNewRole = () => {
  const navigate = useNavigate();

  const [registerRole, { error: registerRoleError }] = useCreateRoleMutation();
  const { claimsLookups } = useClaims();
const { data: applicationClaim } = useGetPermissionsQuery();

  const onCancel = useCallback(() => {
    navigate("/sys-admin/roles");
  }, [navigate]);

  const onSubmit = useCallback(
    async (roleData: any) => {
      // console.log(roleData);
      // Mapping the roleData from RoleRegistrationForm to the CreateRoleDto
      const createRolePayload: CreateRoleDto = {
        role: {
          id: "",
          name: roleData.name,
          description: roleData.description,
          displayName: roleData.displayName,
          claims: roleData.claims.map((claim: string) => ({
            claimValue: claim,
            claimType: "HCMS.Permission",
          })),
        },
        permissionNames: roleData.claims || [], // Assuming permissionNames comes from claims (you can adjust if needed)
      };

      // Now pass the mapped payload to the mutation
      registerRole({ createRoleDto: createRolePayload })
        .unwrap()
        .then((data) => {
          navigate(`/sys-admin/roles/${data.id}`);
        })
        .catch(() => {});
    },
    [navigate, registerRole]
  );

  const errors = (registerRoleError as any)?.data;

  return (
    <Box>
      {claimsLookups?.length ? (
        <>
          <RoleRegistrationForm
            onCancel={onCancel}
            onSubmit={onSubmit}
            claims={claimsLookups}
            errors={errors}
          />
        </>
      ) : (
        <span>Loading...</span>
      )}
    </Box>
  );
};