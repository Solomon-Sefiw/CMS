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

                {/* Business Unit  */}
        <Route path="businessunit" element={<BusinessUnitsHome />}>
          <Route index element={<ApprovedBusinessUnits />} />
          <Route path="business-unit/:id" element={<BusinessUnitDetail />} />
          <Route path="approval-requests" element={<ApprovalRequests />} />
          <Route
            path="rejected-approval-requests"
            element={<RejectedApprovalRequests />}
          />
          <Route path="draft" element={<DraftBusinessUnits />} />
        </Route>
                <Route path="region" element={<RegionHome />}>
          <Route index element={<ApprovedRegions />} />
          <Route
            path="approval-requests"
            element={<RegionApprovalRequests />}
          />
          <Route
            path="rejected-approval-requests"
            element={<RegionRejectedApprovalRequest />}
          />
          <Route path="draft" element={<DraftRegions />} />
        </Route>
        {/* Subcity */}
        <Route path="sub-city" element={<SubCityHome />}>
          <Route index element={<ApprovedSubCities />} />
          <Route
            path="approval-requests"
            element={<SubCityApprovalRequests />}
          />
          <Route
            path="rejected-approval-requests"
            element={<SubCityRejectedApprovalRequest />}
          />
          <Route path="draft" element={<DraftSubCities />} />
        </Route>

      </Route>
    </Routes>
  );
};

export default AppRoutes;
