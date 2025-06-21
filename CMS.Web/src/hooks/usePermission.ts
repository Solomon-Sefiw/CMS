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
   const CanViewAllActiveEmployees = hasPermission(Permission.canViewAllActiveEmployees);
   const CanViewAllVacantJobs = hasPermission(Permission.canViewAllVacantJobs);
   const CanViewAllResignedEmployees = hasPermission(Permission.canViewAllResignedEmployees);
   const CanViewAllBusinessUnits = hasPermission(Permission.canViewAllBusinessUnits);
   const CanViewAllNewEmployees = hasPermission(Permission.canViewAllNewEmployees);
   const CanViewAllPositions = hasPermission(Permission.canViewAllPositions);
   const CanViewTurnoverRates = hasPermission(Permission.canViewTurnoverRates);
   const CanViewRetentionRates = hasPermission(Permission.canViewRetentionRates);
   //Chart And Graph
   const CanViewEmployeeDistributionByStatusDoughnutChart = hasPermission(Permission.canViewEmployeeDistributionByStatusDoughnutChart);
   const CanViewMonthlyNewEmployeesOfFiscalYearBarChart = hasPermission(Permission.canViewMonthlyNewEmployeesOfFiscalYearBarChart);
   const CanViewEmployeeDistributionByChiefOfficeBarChart = hasPermission(Permission.canViewEmployeeDistributionByChiefOfficeBarChart);
   const CanViewEmployeeDistributionByJobCategoryPieChart = hasPermission(Permission.canViewEmployeeDistributionByJobCategoryPieChart);
   const CanViewMonthlyHRMetricsLineGraph = hasPermission(Permission.canViewMonthlyHRMetricsLineGraph);
    const CanViewAllApprovalSummaries = hasPermission(Permission.canViewAllApprovalSummaries);
    const CanViewAllApprovalRequestGrid = hasPermission(Permission.canViewAllApprovalRequestGrid);

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
      // Cards
      CanViewAllActiveEmployees,
      CanViewAllVacantJobs,
      CanViewAllResignedEmployees,
      CanViewAllBusinessUnits,
      CanViewAllNewEmployees,
      CanViewAllPositions,
      CanViewTurnoverRates,
      CanViewRetentionRates,
      //Chart And Graph
      CanViewEmployeeDistributionByStatusDoughnutChart,
      CanViewMonthlyNewEmployeesOfFiscalYearBarChart,
      CanViewEmployeeDistributionByChiefOfficeBarChart,
      CanViewEmployeeDistributionByJobCategoryPieChart,
      CanViewMonthlyHRMetricsLineGraph,
      //Approval
      CanViewAllApprovalSummaries,
      CanViewAllApprovalRequestGrid,
    };
  }, [hasPermission]);

  return permissions;
};
