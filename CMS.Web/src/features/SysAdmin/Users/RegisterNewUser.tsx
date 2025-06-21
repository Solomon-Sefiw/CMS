import { Box, Typography } from "@mui/material";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterDto, useRegisterUserMutation } from "../../../app/api";

import { UserRegistrationForm } from "./UserRegistrationForm";
import { useRoles } from "../../Roles";

export const RegisterNewUser = () => {
  const navigate = useNavigate();

  const [registerUser, { error: registerUserError }] =
    useRegisterUserMutation();
  const { rolesLookups } = useRoles();

  const onCancel = useCallback(() => {
    navigate("/sys-admin/users");
  }, [navigate]);

  const onSubmit = useCallback(
    async (user: RegisterDto) => {
      registerUser({
        registerDto: user,
      })
        .unwrap()
        .then((data) => {
          navigate(`/sys-admin/users/${data.id}`);
        })
        .catch(() => {});
    },
    [navigate, registerUser]
  );

  const errors = (registerUserError as any)?.data;

  return (
    <Box>
      {rolesLookups?.length ? (
        <>
          <UserRegistrationForm
            onCancel={onCancel}
            onSubmit={onSubmit}
            roles={rolesLookups}
            errors={errors}
          />
        </>
      ) : (
        <span>Loading...</span>
      )}
    </Box>
  );
};
