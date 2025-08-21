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
    const CanCreateOrUpdateEmployeeInfo = hasPermission(Permission.canCreateUpdateEmployeePersonalInfo);
    const CanSubmitEmployeeApprovalRequest = hasPermission(Permission.canSubmitEmployeePersonalInfo);
    const CanApproveRejectEmployeePersonalInfo = hasPermission(Permission.canApproveRejectEmployeePersonalInfo);
    const CanActivateEmployeePersonalInfo = hasPermission(Permission.canActivateEmployeePersonalInfo);
    const CanDeactivateEmployeePersonalInfo = hasPermission(Permission.canDeactivateEmployeePersonalInfo);

    //user
    const canCreateUpdateUser = hasPermission(Permission.canCreateUpdateUser);
    const canViewUser = hasPermission(Permission.canViewUser);
    const canViewEmployeePersonalInfo = hasPermission(
      Permission.canViewEmployeePersonalInfo
    );
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
       //EmployeeProbation
   const CanViewEmployeeProbation = hasPermission(Permission.canViewEmployeeProbation);
   const CanSubmitEmployeeProbation = hasPermission(Permission.canSubmitEmployeeProbation);
   const CanTerminateEmployeeProbation = hasPermission(Permission.canTerminateEmployeeProbation);
   const CanApproveRejectEmployeeProbation = hasPermission(Permission.canApproveRejectEmployeeProbation);
   const CanActivateDeactivateEmployeeProbation = hasPermission(Permission.canActivateDeactivateEmployeeProbation);
          //EmployeeEmployeeId
   const CanViewEmployeeId = hasPermission(Permission.canViewEmployeeId);
   const CanCreateUpdateEmployeeId = hasPermission(Permission.canCreateUpdateEmployeeId);
   const CanSubmitEmployeeId = hasPermission(Permission.canSubmitEmployeeId);
   const CanApproveRejectEmployeeId = hasPermission(Permission.canApproveRejectEmployeeId);
   const CanGiveEmployeeId = hasPermission(Permission.canGiveEmployeeId);
   const CanReplaceEmployeeId = hasPermission(Permission.canReplaceEmployeeId);
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
   const CanViewEmployeeDistributionByJobCategoryPieChart = hasPermission(Permission.canViewEmployeeDistributionByJobCategoryPieChart);
   const CanViewMonthlyHRMetricsLineGraph = hasPermission(Permission.canViewMonthlyHRMetricsLineGraph);
    const CanViewAllApprovalSummaries = hasPermission(Permission.canViewAllApprovalSummaries);
    const CanViewAllApprovalRequestGrid = hasPermission(Permission.canViewAllApprovalRequestGrid);

   const CanViewLetterCountBoard = hasPermission(Permission.canViewLetterCountBoard);
   const CanViewRecentLettersBoard = hasPermission(Permission.canViewRecentLettersBoard);
       //Letter
    const CanViewLetter = hasPermission(Permission.canViewLetter);
    const CanCreateUpdateLetter = hasPermission(Permission.canCreateUpdateLetter);
    const CanSubmitLetter = hasPermission(Permission.canSubmitLetter);
    const CanApproveRejectLetter = hasPermission(Permission.canApproveRejectLetter);
    const CanActivateLetter = hasPermission(Permission.canActivateLetter);
    const CanDeactivateLetter = hasPermission(Permission.canDeactivateLetter);
    //Employee Activity
    const CanViewEmployeeActivity = hasPermission(
      Permission.canViewEmployeeActivity
    );
    const CanCreateUpdateEmployeeActivity = hasPermission(
      Permission.canCreateUpdateEmployeeActivity
    );
    const CanApproveRejectEmployeeActivity = hasPermission(
      Permission.canApproveRejectEmployeeActivity
    );
    const CanSubmitEmployeeActivity = hasPermission(
      Permission.canSubmitEmployeeActivity
    );
    const CanActivateEmployeeActivity = hasPermission(
      Permission.canActivateEmployeeActivity
    );
    const CanDeactivateEmployeeActivity = hasPermission(
      Permission.canDeactivateEmployeeActivity
    );


    return {
      //EmployeeID
      CanReplaceEmployeeId,
      CanGiveEmployeeId,
      CanApproveRejectEmployeeId,
      CanSubmitEmployeeId,
      CanCreateUpdateEmployeeId,
      CanViewEmployeeId,
      //EmployeeProbation
      CanViewEmployeeProbation,
      CanSubmitEmployeeProbation,
      CanTerminateEmployeeProbation,
      CanApproveRejectEmployeeProbation,
      CanActivateDeactivateEmployeeProbation,
      //AddressContact
      CanViewAddressAndContact,
      CanCreateUpdateAddressAndContact,
      CanActivateAddressAndContact,
      CanDeactivateAddressAndContact,
      //Employee
      CanCreateOrUpdateEmployeeInfo,
      CanSubmitEmployeeApprovalRequest,
      CanApproveRejectEmployeePersonalInfo,
      CanActivateEmployeePersonalInfo,
      CanDeactivateEmployeePersonalInfo,
      // user
      canCreateUpdateUser,
      canViewEmployeePersonalInfo,
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
      CanViewEmployeeDistributionByJobCategoryPieChart,
      CanViewMonthlyHRMetricsLineGraph,
      //Approval
      CanViewAllApprovalSummaries,
      CanViewAllApprovalRequestGrid,
            //Dashboard
      CanViewLetterCountBoard,
      CanViewRecentLettersBoard,
            //Letter
      CanViewLetter,
      CanSubmitLetter,
      CanCreateUpdateLetter,
      CanApproveRejectLetter,
      CanActivateLetter,
      CanDeactivateLetter,
            //Employee Activity
      CanViewEmployeeActivity,
      CanCreateUpdateEmployeeActivity,
      CanApproveRejectEmployeeActivity,
      CanSubmitEmployeeActivity,
      CanActivateEmployeeActivity,
      CanDeactivateEmployeeActivity,
    };
  }, [hasPermission]);

  return permissions;
};
