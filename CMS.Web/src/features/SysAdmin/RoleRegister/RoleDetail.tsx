import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PersonIcon from "@mui/icons-material/Person";
import { ReactElement, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Claim,
  useAddRoleClaimMutation,
  useGetPermissionsQuery,
  useGetRoleDetailQuery,
  useRemoveRoleClaimMutation,
} from "../../../app/api";
import { RoleProfile } from "./RoleProfile";

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

export const RoleDetail = () => {
  const navigate = useNavigate();
  const params = useParams();

  const {
    data: roleDetail,
    refetch: refetchRoleDetail,
  } = useGetRoleDetailQuery(
    {
      id: params.id!,
    },
    { skip: !params.id }
  );

  const { data: applicationClaim } = useGetPermissionsQuery();

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [addRoleClaim] = useAddRoleClaimMutation();
  const [removeRoleClaim] = useRemoveRoleClaimMutation();

  useEffect(() => {
    const index = tabs.findIndex((x) => x.key === params.tab);
    if (index >= 0) {
      if (selectedTabIndex !== index) {
        setSelectedTabIndex(index);
        navigate(`/sys-admin/roles/${params.id}/${tabs[index].key}`, {
          replace: true,
        });
      }
    } else {
      setSelectedTabIndex(0);
      navigate(`/sys-admin/roles/${params.id}/${tabs[0].key}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, params.id, params.tab]);

  const handleClaimChange = async (claim: Claim, selected: boolean) => {
    if (!claim?.claimValue) return;

    const payload = {
      id: params.id!,
      claim: claim.claimValue,
    };

    try {
      if (selected) {
        await addRoleClaim(payload).unwrap();
      } else {
        await removeRoleClaim(payload).unwrap();
      }
      // Refetch role detail to update UI
      await refetchRoleDetail();
    } catch (error) {
      console.error("Failed to update claim:", error);
    }
  };

  return (
    <>
      {roleDetail && (
        <RoleProfile
          roleDetail={roleDetail}
          applicationClaim={applicationClaim ?? []}
          onClaimChange={handleClaimChange}
        />
      )}
    </>
  );
};
