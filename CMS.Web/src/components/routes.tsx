import { useEffect, useMemo } from "react";
import {
  matchRoutes,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth, usePermission } from "../hooks";
import { Login, MFA } from "../features/user";
import { ForgotPassword } from "../main/account";

import SetupMenu from "./layouts/SetupMenu";
import { AuthenticatedRoutes } from "./authenticated-routes";

import {
  RegisterNewUser,
  SysAdminDashboard,
  UserDetail,
  Users,
} from "../features/SysAdmin";
import { Roles } from "../features/SysAdmin/RoleRegister/Roles";
import { RoleDetail } from "../features/SysAdmin/RoleRegister/RoleDetail";
import { RegisterNewRole } from "../features/SysAdmin/RoleRegister/RegisterNewRole";

import Home from "../features/Dashboard/Home";
import { BusinessUnitsHome } from "../features/BusinessUnit";
import { ApprovalRequests, ApprovedBusinessUnits, DraftBusinessUnits, RejectedApprovalRequests } from "../features/BusinessUnit/BuisnessUnitGrids";
import BusinessUnitDetail from "../features/BusinessUnit/BusinessUnitDetail";
import { RegionHome } from "../features/Address/Region/RegionHome";
import { ApprovedRegions, DraftRegions, RegionApprovalRequests, RegionRejectedApprovalRequest } from "../features/Address/Region/RegionGrids";
import { SubCityHome } from "../features/Address/SubCity/SubCityHome";
import { ApprovedSubCities, DraftSubCities, SubCityApprovalRequests, SubCityRejectedApprovalRequest } from "../features/Address/SubCity/SubCityGrids";
import { LetterHome } from "../features/Letter/LetterHome";
import { ArchivedLetters, PendingLetters, ReceivedLetters, RespondedLetters } from "../features/Letter/LetterGrid";
import { ApprovedBenefits, BenefitApprovalRequests, BenefitRejectedApprovalRequest, DraftBenefits } from "../features/Benefits/Benefit/BenefitGrids";
import { BenefitHome } from "../features/Benefits/Benefit/BenefitHome";
import { ApprovedBenefitUnitOfMeasurements, BenefitUnitOfMeasurementApprovalRequests, BenefitUnitOfMeasurementRejectedApprovalRequest, DraftBenefitUnitOfMeasurements } from "../features/Benefits/BenefitUnitOfMeasurement/BenefitUnitOfMeasurementGrids";
import { BenefitUnitOfMeasurementHome } from "../features/Benefits/BenefitUnitOfMeasurement/BenefitUnitOfMeasurementHome";
import { ApprovedBenefitUnitPrices, BenefitUnitPriceApprovalRequests, BenefitUnitPriceRejectedApprovalRequest, DraftBenefitUnitPrices } from "../features/Benefits/BenefitUnitPrice/BenefitUnitPriceGrids";
import { BenefitUnitPriceHome } from "../features/Benefits/BenefitUnitPrice/BenefitUnitPriceHome";
import { ApprovedBenefitValues, BenefitValueApprovalRequests, BenefitValueRejectedApprovalRequest, DraftBenefitValues } from "../features/Benefits/BenefitValue/BenefitValueGrids";
import { BenefitValueHome } from "../features/Benefits/BenefitValue/BenefitValueHome";
import { ApprovedBranchGrades, BranchGradeApprovalRequests, BranchGradeRejectedApprovalRequest, DraftBranchGrades } from "../features/BranchGrade/BranchGradeGrids";
import { BranchGradeHome } from "../features/BranchGrade/BranchGradeHome";
import { DocumentsTab } from "../features/Employee/documentsTab/DocumentsTab";
import { EmployeeDetail } from "../features/Employee/EmployeeDetail/EmployeeDetails";
import { ApprovedEmployees, SubmittedEmployees, RejectedEmployees, DraftEmployees } from "../features/Employee/EmployeeGrids";
import { EmployeesHome } from "../features/Employee/EmployeeHome";
import { PromotionTab } from "../features/Employee/promotionTab/PromotionTab";
import { ApprovedAwards, SubmittedAwards, RejectedAwards, DraftAwards } from "../features/Employee/SummaryTab/Education/Award/AwardGrids";
import { AwardHome } from "../features/Employee/SummaryTab/Education/Award/AwardHome";
import { ApprovedEducationLevels, SubmittedEducationLevels, RejectedEducationLevels, DraftEducationLevels } from "../features/Employee/SummaryTab/Education/EducationLevel/EducationLevelGrids";
import { EducationLevelHome } from "../features/Employee/SummaryTab/Education/EducationLevel/EducationLevelHome";
import { EmployeeEducation } from "../features/Employee/SummaryTab/Education/EmployeeEducation";
import { ApprovedFieldOfStudies, SubmittedFieldOfStudies, RejectedFieldOfStudies, DraftFieldOfStudies } from "../features/Employee/SummaryTab/Education/FieldOfStudy/FieldOfStudyGrids";
import { FieldOfStudyHome } from "../features/Employee/SummaryTab/Education/FieldOfStudy/FieldOfStudyHome";
import { ApprovedInstitutionNames, SubmittedInstitutionNames, RejectedInstitutionNames, DraftInstitutionNames } from "../features/Employee/SummaryTab/Education/InstitutionName/InstitutionNameGrids";
import { InstitutionNameHome } from "../features/Employee/SummaryTab/Education/InstitutionName/InstitutionNameHome";
import { SummaryTab } from "../features/Employee/SummaryTab/SummaryTab";
import { ApprovedJobs, JobApprovalRequests, JobRejectedApprovalRequest, DraftJobs } from "../features/Jobs/Job/JobGrids";
import { JobHome } from "../features/Jobs/Job/JobHome";
import { ApprovedJobCategories } from "../features/Jobs/JobCatagory/JobCatagoryGrids/ApprovedJobCategory";
import { DraftJobCategory } from "../features/Jobs/JobCatagory/JobCatagoryGrids/DraftJobCatagory";
import { JobCategoryApprovalRequests } from "../features/Jobs/JobCatagory/JobCatagoryGrids/JobCategoryApprovalRequests";
import { JobCategoryRejectedApprovalRequests } from "../features/Jobs/JobCatagory/JobCatagoryGrids/JobCategoryRejectedApprovalRequests";
import { JobCatagoryHome } from "../features/Jobs/JobCatagory/JobCatagoryHome";
import { ApprovedJobGrade, JobGradeApprovalRequests, JobGradeRejectedApprovalRequests, DraftJobGrade } from "../features/Jobs/JobGrade/JobGradeGrids";
import { JobGradeHome } from "../features/Jobs/JobGrade/JobGradeHome";
import { ApprovedJobRole, JobRoleApprovalRequests, JobRoleRejectedApprovalRequests, DraftJobRole } from "../features/Jobs/JobRole/JobRoleGrids";
import { JobRoleHome } from "../features/Jobs/JobRole/JobRoleHome";
import { ApprovedJobRoleCategories, JobRoleCategoryApprovalRequests, JobRoleCategoryRejected, DraftJobRoleCategories } from "../features/Jobs/JobRoleCategory/JobRoleCategoryGrids";
import { JobRoleCategoryHome } from "../features/Jobs/JobRoleCategory/JobRoleCategoryHome";
import { DraftEmployeeID, RejectedEmployeeID, EmployeeIdApprovalRequests } from "../features/EmployeeIdManagement/EmployeeIDGrids";
import { ReplaceableEmployeeID } from "../features/EmployeeIdManagement/EmployeeIDGrids/ReplaceableEmployeeID";
import { EmployeeIDHome } from "../features/EmployeeIdManagement/EmployeeIDHome";
import { EmployeesIdManagementList } from "../features/EmployeeIdManagement/EmployeesIdManagementListList";
import { ProbationApprovalRequests, DraftProbation, RejectedProbation } from "../features/Probation/ProbationGrids";
import { ProbationHome } from "../features/Probation/ProbationHome";
import { ActingHome } from "../features/Employee/ActivityTab/Acting/ActingHome";
import { DelegationHome } from "../features/Employee/ActivityTab/Delegation/DelegationHome";
import { EmployeeActivity } from "../features/Employee/ActivityTab/EmployeeActivity";

const AppRoutes = () => {
  const navigate = useNavigate();
  const { loggedIn } = useAuth();
  const location = useLocation();
  const matches = matchRoutes([{ path: "/login" }], location);

  useEffect(() => {
    if (loggedIn && matches && matches[0].pathname === "/login") {
      navigate("/");
    }
  }, [loggedIn, navigate, matches]);

  const permissions = usePermission();

  const isSysAdmin = useMemo(() => {
    return permissions.canCreateUpdateUser;
  }, [permissions.canCreateUpdateUser]);

  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="verify" element={<MFA />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      {/* AuthenticatedRoutes */}
      <Route element={<AuthenticatedRoutes />}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/setup" element={<SetupMenu />} />
        <Route path="/sys-admin" element={<SysAdminDashboard />}>
          <Route index element={<Users />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:id/:tab?" element={<UserDetail />} />
          <Route path="new-user" element={<RegisterNewUser />} />
          <Route path="roles" element={<Roles />} />
          <Route path="roles/:id/:tab?" element={<RoleDetail />} />
          <Route path="roles/new-role" element={<RegisterNewRole />} />
        </Route>


        {/*Branch Grade */}
        <Route path="branch-grade" element={<BranchGradeHome />}>
          <Route index element={<ApprovedBranchGrades />} />
          <Route
            path="approval-requests"
            element={<BranchGradeApprovalRequests />}
          />
          <Route
            path="rejected-approval-requests"
            element={<BranchGradeRejectedApprovalRequest />}
          />
          <Route path="draft" element={<DraftBranchGrades />} />
        </Route>
        {/*Benefit Measurement Unit */}
        <Route
          path="measurement-unit"
          element={<BenefitUnitOfMeasurementHome />}
        >
          <Route index element={<ApprovedBenefitUnitOfMeasurements />} />
          <Route
            path="approval-requests"
            element={<BenefitUnitOfMeasurementApprovalRequests />}
          />
          <Route
            path="rejected-approval-requests"
            element={<BenefitUnitOfMeasurementRejectedApprovalRequest />}
          />
          <Route path="draft" element={<DraftBenefitUnitOfMeasurements />} />
        </Route>

        {/*Benefit */}
        <Route path="benefit" element={<BenefitHome />}>
          <Route index element={<ApprovedBenefits />} />
          <Route
            path="approval-requests"
            element={<BenefitApprovalRequests />}
          />
          <Route
            path="rejected-approval-requests"
            element={<BenefitRejectedApprovalRequest />}
          />
          <Route path="draft" element={<DraftBenefits />} />
        </Route>

        {/*Benefit-Unit-Price */}
        <Route path="benefit-unit-price" element={<BenefitUnitPriceHome />}>
          <Route index element={<ApprovedBenefitUnitPrices />} />
          <Route
            path="approval-requests"
            element={<BenefitUnitPriceApprovalRequests />}
          />
          <Route
            path="rejected-approval-requests"
            element={<BenefitUnitPriceRejectedApprovalRequest />}
          />
          <Route path="draft" element={<DraftBenefitUnitPrices />} />
        </Route>

        {/* Benefit-Value */}
        <Route path="benefit-value" element={<BenefitValueHome />}>
          <Route index element={<ApprovedBenefitValues />} />
          <Route
            path="approval-requests"
            element={<BenefitValueApprovalRequests />}
          />
          <Route
            path="rejected-approval-requests"
            element={<BenefitValueRejectedApprovalRequest />}
          />
          <Route path="draft" element={<DraftBenefitValues />} />
        </Route>




        {/* Education Related */}
        <Route path="education-level" element={<EducationLevelHome />}>
          <Route index element={<ApprovedEducationLevels />} />
          <Route
            path="approval-requests"
            element={<SubmittedEducationLevels />}
          />
          <Route
            path="rejected-approval-requests"
            element={<RejectedEducationLevels />}
          />
          <Route path="draft" element={<DraftEducationLevels />} />
        </Route>
        <Route path="field-of-study" element={<FieldOfStudyHome />}>
          <Route index element={<ApprovedFieldOfStudies />} />
          <Route
            path="approval-requests"
            element={<SubmittedFieldOfStudies />}
          />
          <Route
            path="rejected-approval-requests"
            element={<RejectedFieldOfStudies />}
          />
          <Route path="draft" element={<DraftFieldOfStudies />} />
        </Route>

        <Route path="institution-name" element={<InstitutionNameHome />}>
          <Route index element={<ApprovedInstitutionNames />} />
          <Route
            path="approval-requests"
            element={<SubmittedInstitutionNames />}
          />
          <Route
            path="rejected-approval-requests"
            element={<RejectedInstitutionNames />}
          />
          <Route path="draft" element={<DraftInstitutionNames />} />
        </Route>

        <Route path="award" element={<AwardHome />}>
          <Route index element={<ApprovedAwards />} />
          <Route path="approval-requests" element={<SubmittedAwards />} />
          <Route
            path="rejected-approval-requests"
            element={<RejectedAwards />}
          />
          <Route path="draft" element={<DraftAwards />} />
        </Route>

        {/* jobCategory */}
        <Route path="jobcategory" element={<JobCatagoryHome />}>
          <Route index element={<ApprovedJobCategories />} />
          <Route
            path="approval-requests"
            element={<JobCategoryApprovalRequests />}
          />
          <Route
            path="rejected-approval-requests"
            element={<JobCategoryRejectedApprovalRequests />}
          />
          <Route path="draft" element={<DraftJobCategory />} />
        </Route>

        <Route path="jobtitle" element={<JobRoleHome />} />
        <Route path="employees" element={<EmployeesHome />}>
          <Route index element={<ApprovedEmployees />} />
          <Route path="approval-requests" element={<SubmittedEmployees />} />
          <Route path="rejected-approval-requests" element={<RejectedEmployees />} />
          <Route path="draft" element={<DraftEmployees />} />
        </Route>
        <Route path="/employee-detail/:id" element={<EmployeeDetail />}>
          <Route index element={<SummaryTab />} />
          <Route path="summary" element={<SummaryTab />} />
          <Route path="promotion" element={<PromotionTab />} />
                    <Route path="activities" element={<EmployeeActivity />}>
            <Route path="delegation">
              <Route index element={<Navigate to="approved" replace />} />
              <Route path=":status" element={<DelegationHome />} />
            </Route>
            <Route path="acting">
              <Route index element={<Navigate to="approved" replace />} />
              <Route path=":status" element={<ActingHome />} />
            </Route>
          </Route>
          <Route path="other" element={<EmployeeEducation />} />
          <Route path="documents" element={<DocumentsTab />} />
        </Route>
        {/* jobRoleCategoryCounts */}
        <Route path="job-role-category" element={<JobRoleCategoryHome />}>
          <Route index element={<ApprovedJobRoleCategories />} />
          <Route
            path="approval-requests"
            element={<JobRoleCategoryApprovalRequests />}
          />
          <Route
            path="rejected-approval-requests"
            element={<JobRoleCategoryRejected />}
          />
          <Route path="draft" element={<DraftJobRoleCategories />} />
        </Route>
        <Route path="/job" element={<JobHome />}>
          <Route index element={<ApprovedJobs />} />
          <Route path="approval-requests" element={<JobApprovalRequests />} />
          <Route
            path="rejected-approval-requests"
            element={<JobRejectedApprovalRequest />}
          />
          <Route path="draft" element={<DraftJobs />} />
        </Route>
        <Route path="/jobRole" element={<JobRoleHome />}>
          <Route index element={<ApprovedJobRole />} />
          <Route
            path="approval-requests"
            element={<JobRoleApprovalRequests />}
          />
          <Route
            path="rejected-approval-requests"
            element={<JobRoleRejectedApprovalRequests />}
          />
          <Route path="draft" element={<DraftJobRole />} />
        </Route>

        {/* job grade**/}
        <Route path="/jobGrade" element={<JobGradeHome />}>
          <Route index element={<ApprovedJobGrade />} />
          <Route
            path="approval-requests"
            element={<JobGradeApprovalRequests />}
          />
          <Route
            path="rejected-approval-requests"
            element={<JobGradeRejectedApprovalRequests />}
          />
          <Route path="draft" element={<DraftJobGrade />} />
        </Route>
        {/* */}

        <Route path="/probation" element={<ProbationHome />}>
          <Route index element={<ProbationApprovalRequests />} />
          <Route
            path="/probation/underProbation"
            element={<DraftProbation />}
          />
          <Route path="/probation/rejected" element={<RejectedProbation />} />
        </Route>
        <Route path="/employeePrint" element={<EmployeesIdManagementList />} />

        <Route path="/employeeid" element={<EmployeeIDHome />}>
          <Route index element={<DraftEmployeeID />} />
          <Route path="/employeeid/rejected" element={<RejectedEmployeeID />} />
          <Route
            path="/employeeid/approvalrequest"
            element={<EmployeeIdApprovalRequests />}
          />
          <Route
            path="/employeeid/ReplaceId"
            element={<ReplaceableEmployeeID />}
          />
          <Route
            path="/employeeid/employeePrint"
            element={<EmployeesIdManagementList />}
          />
        </Route>





        {/* Business Unit  */}
        <Route path="businessunit" element={<BusinessUnitsHome />}>
          <Route index element={<ApprovedBusinessUnits />} />
          <Route path="business-unit/:id" element={<BusinessUnitDetail />} />
          <Route path="approval-requests" element={<ApprovalRequests />} />
          <Route path="rejected-approval-requests" element={<RejectedApprovalRequests />} />
          <Route path="draft" element={<DraftBusinessUnits />} />
        </Route>
        <Route path="region" element={<RegionHome />}>
          <Route index element={<ApprovedRegions />} />
          <Route path="approval-requests" element={<RegionApprovalRequests />} />
          <Route path="rejected-approval-requests" element={<RegionRejectedApprovalRequest />} />
          <Route path="draft" element={<DraftRegions />} />
        </Route>
        {/* Subcity */}
        <Route path="sub-city" element={<SubCityHome />}>
          <Route index element={<ApprovedSubCities />} />
          <Route path="approval-requests" element={<SubCityApprovalRequests />} />
          <Route path="rejected-approval-requests" element={<SubCityRejectedApprovalRequest />} />
          <Route path="draft" element={<DraftSubCities />} />
        </Route>

        {/* Letters */}
        <Route path="letters" element={<LetterHome />}>
          <Route index element={<RespondedLetters />} />
          <Route path="received" element={<ReceivedLetters />} />
          <Route path="archived" element={<ArchivedLetters />} />
          <Route path="pending" element={<PendingLetters />} />
        </Route>


      </Route>
    </Routes>
  );
};

export default AppRoutes;
