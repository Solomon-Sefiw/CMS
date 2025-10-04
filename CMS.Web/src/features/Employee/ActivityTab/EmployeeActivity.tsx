 
import { Box, Tab, Tabs } from "@mui/material";
import { useMemo, useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { usePermission } from "../../../hooks";
import { ContentCard } from "../../../components";
import { EmployeePromotionHome } from "./Promotion/EmployeePromotion/EmployeePromotionHome";
import { EmployeeDemotionHome } from "./Demotion/EmployeeDemotionHome";
import { EmployeeReClassificationHome } from "./ReClassification/EmployeeReClassificationHome";
import { DelegationHome } from "./Delegation/DelegationHome";
import { ActingHome } from "./Acting/ActingHome";
import { EmployeeWarningHome } from "./EmployeeWarning/EmployeeWarningHome";
import { EmployeeSalaryIncrementHome } from "./SalaryIncrement/EmployeeSalaryIncrementHome";
import { SuspensionHome } from "./Suspension/SuspensionHome";
import { ResignationHome } from "./Resignation/ResignationHome";
 
export const EmployeeActivity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
 
  const [tabValue, setTabValue] = useState(0);
 
  const base = `/employee-detail/${id}/activities`;
  const transferPath = `${base}/transfer`;
  const reemploymentPath = `${base}/reemployment`;

  useEffect(() => {
    if (location.pathname.startsWith(transferPath)) {
      setTabValue(2);
    } else if (location.pathname.startsWith(reemploymentPath)) {
      setTabValue(10);
    }
  }, [location.pathname, transferPath, reemploymentPath]);
 

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    if (newValue === 2) navigate(transferPath);
     if (newValue === 10) navigate(reemploymentPath);
  };
 
  return (
    <ContentCard>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Delegation" />
          <Tab label="Acting" />
          <Tab label="Transfer" />
          <Tab label="Promotion" />
          <Tab label="Demotion" />
          <Tab label="Reclassification" />
          <Tab label="Salary Increment" />
          <Tab label="Disciplinary Action" />
          <Tab label="Suspension" />
          <Tab label="Resignation" />
           <Tab label="Re-Employment" />
        </Tabs>
      </Box>
 
      {tabValue === 0 && <DelegationHome />}
      {tabValue === 1 && <ActingHome />}
      {tabValue === 3 && <EmployeePromotionHome />}
      {tabValue === 4 && <EmployeeDemotionHome />}
      {tabValue === 5 && <EmployeeReClassificationHome />}
      {tabValue === 6 && <EmployeeSalaryIncrementHome/>}
      {tabValue === 7 && <EmployeeWarningHome />}
      {tabValue === 8 && <SuspensionHome />}
      {tabValue === 9 && <ResignationHome />}
 
      {/* Transfer tab uses routing */}
      {tabValue === 2 && <Outlet />}
       {tabValue === 10 && <Outlet />}
    </ContentCard>
  );
};