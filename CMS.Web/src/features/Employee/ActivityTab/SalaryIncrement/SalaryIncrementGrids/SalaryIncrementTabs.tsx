import { 
  Box, 
  Tab, 
  Tabs, 
  Typography, 
  Badge,
  Paper,
  styled 
} from "@mui/material";
import { 
  CheckCircleOutline, 
  PendingActions, 
  Drafts, 
  Cancel 
} from "@mui/icons-material";
import { useState } from "react";
import { ApprovedSalaryIncrement } from "./ApprovedSalaryIncrement";
import { SalaryIncrementAprovalRequests } from "./SalaryIncrementAprovalRequests";
import { RejectedSalaryIncrementApprovalRequests } from "./RejectedSalaryIncrementApprovalRequests";
import { DraftSalaryincrement } from "./DraftSalaryIncrement";
import { useTheme } from "@mui/material/styles";

// Styled components
const IconTab = styled(Tab)(({ theme }) => ({
  minHeight: 64,
  '& .MuiTab-iconWrapper': {
    marginBottom: theme.spacing(0.5),
  },
}));

export const SalaryIncrementTabs = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  const tabs = [
    { 
      value: 0, 
      label: "Approved", 
      icon: <CheckCircleOutline color="success" />,
      color: "success" 
    },
    { 
      value: 1, 
      label: "Approval Requests", 
      icon: <PendingActions color="info" />,
      color: "primary" 
    },
    { 
      value: 2, 
      label: "Rejected", 
      icon: <Cancel color="error" />,
      color: "error" 
    },
    { 
      value: 3, 
      label: "Draft", 
      icon: <Drafts color="warning" />,
      color: "info" 
    },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ 
        borderRadius: '6px',
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
        mb: 2
      }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          sx={{
            '& .MuiTabs-indicator': {
              height: 4,
              backgroundColor: '#0d47a1',
            }
          }}
        >
          {tabs.map((tab) => (
            <IconTab
              key={tab.value}
              value={tab.value}
              icon={tab.icon}
              iconPosition="top"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 600,
                      color: tabValue === tab.value ? '#0d47a1' : 'inherit'
                    }}
                  >
                    {tab.label}
                  </Typography>
                </Box>
              }
              sx={{
                color: tabValue === tab.value ? '#032557ff' : 'inherit',
                minWidth: 120,
                px: 3,
              }}
            />
          ))}
        </Tabs>
      </Paper>

      {tabValue === 0 && <ApprovedSalaryIncrement />}
      {tabValue === 1 && <SalaryIncrementAprovalRequests />}
      {tabValue === 2 && <RejectedSalaryIncrementApprovalRequests />}
      {tabValue === 3 && <DraftSalaryincrement />}
    </Box>
  );
};