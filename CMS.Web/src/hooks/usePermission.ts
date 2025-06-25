import { useCallback, useMemo } from "react";
import { useCurrentUserInfoQuery } from "../app/api";
import { Permission } from "../app/api/enums";

export const usePermission = () => {
  const { data } = useCurrentUserInfoQuery();

  const hasPermission = useCallback(
    (permission: Permission) => {
      return !!data?.permissions?.some(
        (x) => x.name === permission && x.hasPermission
      );
    },
    [data?.permissions]
  );

  const permissions = useMemo(() => {

    //user
    const canCreateUpdateUser = hasPermission(Permission.canCreateUpdateUser);
    const canViewUser = hasPermission(Permission.canViewUser);
    //setup
    const canCreateUpdateSetup = hasPermission(Permission.canCreateUpdateSetup);
    const canViewSetup = hasPermission(Permission.canViewSetup);
    const canApproveRejectSetup = hasPermission(Permission.canApproveRejectSetup);
    const canSubmitSetup = hasPermission(Permission.canSubmitSetup);
    const canActivateSetup = hasPermission(Permission.canActivateSetup);
    const canDeactivateSetup = hasPermission(Permission.canDeactivateSetup);
    //AddressContact
   const CanViewAddressAndContact = hasPermission(Permission.canViewAddressAndContact);
   const CanCreateUpdateAddressAndContact = hasPermission(Permission.canCreateUpdateAddressAndContact);
   const CanActivateAddressAndContact = hasPermission(Permission.canActivateAddressAndContact);
   const CanDeactivateAddressAndContact = hasPermission(Permission.canDeactivateAddressAndContact);
         //Dashboard
   const CanViewLetterCountBoard = hasPermission(Permission.canViewLetterCountBoard);
   const CanViewRecentLettersBoard = hasPermission(Permission.canViewRecentLettersBoard);


    return {
      
      //AddressContact
      CanViewAddressAndContact,
      CanCreateUpdateAddressAndContact,
      CanActivateAddressAndContact,
      CanDeactivateAddressAndContact,

      // user
      canCreateUpdateUser,
      canViewUser,
      //setup
      canCreateUpdateSetup,
      canViewSetup,
      canApproveRejectSetup,
      canSubmitSetup,
      canActivateSetup,
      canDeactivateSetup,
      //Dashboard
      CanViewLetterCountBoard,
      CanViewRecentLettersBoard
    };
  }, [hasPermission]);

  return permissions;
};
