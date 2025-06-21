import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PersonIcon from "@mui/icons-material/Person";
import { ReactElement, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ApplicationRole,
  useAddUserRoleMutation,
  useGetRolesQuery,
  useGetUserDetailQuery,
  useRemoveUserRoleMutation,
} from "../../../app/api";
import { UserProfile } from "./UserProfile";

type TabKey = "profile" | "permissions";

const tabs: { key: TabKey; label: string; icon?: ReactElement<any> }[] = [
  {
    key: "profile",
    label: "Profile",
    icon: <PersonIcon fontSize="small" />,
  },
  {
    key: "permissions",
    label: "Roles & Permissions",
    icon: <ManageAccountsIcon fontSize="small" />,
  },
];

export const UserDetail = () => {
  const navigate = useNavigate();
  const params = useParams();

  // Added refetch to useGetUserDetailQuery
  const {
    data: userDetail,
    refetch: refetchUserDetail, // Add refetch function here
  } = useGetUserDetailQuery(
    {
      id: params.id,
    },
    { skip: !params.id }
  );

  const { data: applicationRoles } = useGetRolesQuery();

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [addUserRole] = useAddUserRoleMutation();
  const [removeUserRole] = useRemoveUserRoleMutation();

  useEffect(() => {
    const index = tabs.findIndex((x) => x.key === params.tab);

    if (index >= 0) {
      if (selectedTabIndex !== index) {
        setSelectedTabIndex(index); // Set selectedTabIndex before navigating
        navigate(`/sys-admin/users/${params.id}/${tabs[index].key}`, {
          replace: true, // Use replace for consistency
        });
      }
    } else {
      setSelectedTabIndex(0); // Set selectedTabIndex before navigating
      navigate(`/sys-admin/users/${params.id}/${tabs[0].key}`, {
        replace: true, // Use replace for consistency
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, params.id, params.tab]); // Ensure all dependencies are covered

  const handleRoleChange = async (role: ApplicationRole, selected: boolean) => {
    if (!role?.name || !params.id) return; // Ensure role name and user ID are present

    const payload = {
      id: params.id,
      role: role.name,
    };

    try {
      if (selected) {
        await addUserRole(payload).unwrap();
      } else {
        await removeUserRole(payload).unwrap();
      }
      // Refetch user detail to update UI immediately after a successful role change
      await refetchUserDetail();
    } catch (error) {
      console.error("Failed to update user role:", error);
      // You might want to add more robust error handling here,
      // like showing a user-friendly notification.
    }
  };

  return (
    <>
      {userDetail && (
        <UserProfile
          userDetail={userDetail}
          applicationRoles={applicationRoles}
          onRoleChange={handleRoleChange}
        />
      )}
    </>
  );
};