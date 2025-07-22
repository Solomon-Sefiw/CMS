import {
  Box,
  Button,
  Tab,
  Tabs,
} from "@mui/material";
import { useState } from "react";
import {
  Add,
  Assignment,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { usePermission } from "../../../hooks";
import { ContentCard } from "../../../components";
import { EducationDto } from "../../../app/api";
import { EmployeeGuaranter } from "../SummaryTab/EmployeeGuaranters/EmployeeGuaranter";
import { DelegationHome } from "./Delegation/DelegationHome";
import { ActingHome } from "./Acting/ActingHome";

export const EmployeeActivity = () => {
  const params = useParams();
  const navigate = useNavigate();
  
  
  const [tabValue, setTabValue] = useState(0);
  const permissions = usePermission();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    if (newValue === 0) {
      navigate('delegation/approved');
    }
        if (newValue === 1) {
      navigate('acting/approved');
    }

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
          <Tab label="Disciplinary Action" />
        </Tabs>

      </Box>

      {/* Assignment Tab Content */}
      {tabValue === 0 && (
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {/* Your existing assignment content */}
        </Box>
      )}

      {/* Delegation Tab */}
      {tabValue === 0 && (
        <Box sx={{ mt: 2 }}>
          <DelegationHome />
        </Box>
      )}

      {/* Other Tabs */}
      {tabValue === 1 && <ActingHome />}
      {tabValue === 2 && <EmployeeGuaranter />}
      {/* Add other tab contents as needed */}
    </ContentCard>
  );
};