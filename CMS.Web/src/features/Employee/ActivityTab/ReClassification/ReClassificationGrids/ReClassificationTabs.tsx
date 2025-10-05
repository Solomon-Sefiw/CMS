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
import { ApprovedReClassification } from "./ApprovedReClassification";
import { DraftReClassification } from "./DraftReClassification";
import { ReClassificationAprovalRequests } from "./ReClassificationAprovalRequests";
import { RejectedReClassificationApprovalRequests } from "./RejectedReClassificationApprovalRequests";
import { useTheme } from "@mui/material/styles";
import { PromotionCountsByStatus } from "../../../../../app/api/HCMSApi";

// Styled components
const IconTab = styled(Tab)(({ theme }) => ({
  minHeight: 64,
  '& .MuiTab-iconWrapper': {
    marginBottom: theme.spacing(0.5),
  },
}));

export const ReClassificationTabs = ({
  counts,
}: {
  counts?: PromotionCountsByStatus;
}) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  const tabs = [
    { 
      value: 0, 
      label: "Approved ReClassification", 
      count: counts?.approved,
      icon: <CheckCircleOutline color="success" />,
      color: "success" 
    },
    { 
      value: 1, 
      label: "Approval Requests", 
      count: counts?.approvalRequests,
      icon: <PendingActions color="info" />,
      color: "primary" 
    },
    { 
      value: 2, 
      label: "Rejected", 
      count: counts?.rejected,
      icon: <Cancel color="error" />,
      color: "error" 
    },
    { 
      value: 3, 
      label: "Draft", 
      count: counts?.drafts,
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
                  {tab.count && tab.count > 0 && (
                    <Badge
                      badgeContent={tab.count}
                      sx={{ ml: 1 }}
                    />
                  )}
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

      {tabValue === 0 && <ApprovedReClassification />}
      {tabValue === 1 && <ReClassificationAprovalRequests />}
      {tabValue === 2 && <RejectedReClassificationApprovalRequests />}
      {tabValue === 3 && <DraftReClassification />}
    </Box>
  );
};