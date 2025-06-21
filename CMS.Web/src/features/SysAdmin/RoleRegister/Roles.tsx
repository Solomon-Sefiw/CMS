import AddIcon from "@mui/icons-material/Add";
import { Box, Button } from "@mui/material";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { RoleWithClaimsDto, useGetRoleClaimQuery } from "../../../app/api";
import { RolesList } from "./RolesList";
import { usePermission } from "../../../hooks";

export const Roles = () => {
  const navigate = useNavigate();
  const { data: roles } = useGetRoleClaimQuery();
  const permissions = usePermission();
  const onRoleSelect = useCallback(
    (role: RoleWithClaimsDto) => {
      navigate(`/sys-admin/roles/${role.roleId}`);
    },
    [navigate]
  );
  return (
    <Box>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ flex: 1 }}></Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => {
              navigate("/sys-admin/roles/new-role");
            }}
            // disabled={!permissions.canViewUser}
          >
            Add New Roles
          </Button>
        </Box>
      </Box>
      <RolesList roles={roles || []} onSelect={onRoleSelect} />
    </Box>
  );
};