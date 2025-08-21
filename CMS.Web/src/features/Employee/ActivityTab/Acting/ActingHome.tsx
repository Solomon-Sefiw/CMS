import { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Button,
  Badge,
  Chip,
  Stack,
  Typography,
  styled,
  Tooltip
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useGetActingCountPerStatusQuery, useGetAllActiveActingQuery } from "../../../../app/store";
import { ActingProvider } from "./ActingProvider";
import { ApprovedActings } from "./ActingGrids/ApprovedActings";
import { DraftActings } from "./ActingGrids/DraftActings";
import { SubmittedActings } from "./ActingGrids/SubmittedActings";
import { RejectedActings } from "./ActingGrids/RejectedActings";
import {
  CheckCircleOutline,
  PendingActions,
  Drafts,
  Cancel,
  Add
} from "@mui/icons-material";
import { usePermission } from "../../../../hooks";
import { useTheme } from "@mui/material/styles";
import { ActingDialog } from "./ActingDialog";

// Styled components
const ActingHeader = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.dark,
  fontWeight: 700,
  marginBottom: theme.spacing(1),
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  marginRight: theme.spacing(1),
  '&.draft': {
    backgroundColor: theme.palette.warning.light,
    color: 'text.secondary'
  },
  '&.rejected': {
    backgroundColor: theme.palette.error.light,
  },
}));

const IconTab = styled(Tab)(({ theme }) => ({
  minHeight: 64,
  '& .MuiTab-iconWrapper': {
    marginBottom: theme.spacing(0.5),
  },
}));

export const ActingHome = () => {
  const { id, status = "approved" } = useParams();
  const navigate = useNavigate();
  const employeeId = Number(id);
  const theme = useTheme();
  const permissions = usePermission();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: counts } = useGetActingCountPerStatusQuery({ id: employeeId });
  const { data: activeActing } = useGetAllActiveActingQuery({ id: employeeId });

  const tabs = [
    { 
      value: "approved", 
      label: "Approved", 
      count: counts?.approved, 
      icon: <CheckCircleOutline color="success" />,
      color: "success" 
    },
    { 
      value: "submitted", 
      label: "Submitted", 
      count: counts?.submitted, 
      icon: <PendingActions color="info" />,
      color: "primary" 
    },
    { 
      value: "rejected", 
      label: "Rejected", 
      count: counts?.rejected, 
      icon: <Cancel color="error" />,
      color: "error" 
    },
    { 
      value: "draft", 
      label: "Draft", 
      count: counts?.draft, 
      icon: <Drafts color="warning" />,
      color: "info" 
    },
  ];

  return (
    <ActingProvider>
      <Box sx={{ p: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 3,
            }}
          >
            <Box>
              <ActingHeader variant="h5" sx={{ color: '#0d47a1' }}>
                Acting Management
              </ActingHeader>
              
              {/* Status Chips */}
              <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                <StatusChip 
                  label={`Current Acting track : ${counts?.draft || 0}`} 
                  className="draft"
                  icon={<Drafts fontSize="small" />}
                />
              </Stack>
            </Box>

            {/* New Acting Button + Flag */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <Tooltip
                title={
                  activeActing?.isActive
                    ? "You cannot create a new acting while another acting is active."
                    : ""
                }
                arrow
                placement="top"
              >
                <span>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setIsAddModalOpen(true)}
                    disabled={
                      !permissions.CanCreateUpdateEmployeeActivity || activeActing?.isActive
                    }
                    sx={{
                      ml: 2,
                      px: 4,
                      py: 1.5,
                      borderRadius: '8px',
                      backgroundColor: '#1565c0',
                      '&:hover': {
                        backgroundColor: '#0d47a1',
                        boxShadow: '0 4px 12px rgba(13, 71, 161, 0.3)'
                      },
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '1rem'
                    }}
                  >
                    New Acting
                  </Button>
                </span>
              </Tooltip>

              {/* Visible warning chip */}
              {activeActing?.isActive && (
                <Chip 
                  label="Complete: Active acting First !!"
                  color="warning"
                  variant="outlined"
                  sx={{ mt: 1, fontWeight: 600 }}
                />
              )}
            </Box>
          </Box>

          {/* Tabs */}
          <Paper elevation={3} sx={{ 
            borderRadius: '6px',
            overflow: 'hidden',
            border: `1px solid ${theme.palette.divider}`,
          }}>
            <Tabs
              value={status}
              onChange={(e, newValue) => navigate(`acting/${newValue}`)}
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
                          color: status === tab.value ? '#0d47a1' : 'inherit'
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
                    color: status === tab.value ? '#032557ff' : 'inherit',
                    minWidth: 120,
                    px: 3,
                  }}
                />
              ))}
            </Tabs>
          </Paper>
        </Box>

        {/* Tab Content */}
        <Box sx={{ 
          mt: 3,
          borderRadius: '6px',
          overflow: 'hidden',
          boxShadow: 3,
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper
        }}>
          {status === "approved" && <ApprovedActings />}
          {status === "draft" && <DraftActings />}
          {status === "submitted" && <SubmittedActings />}
          {status === "rejected" && <RejectedActings />}
        </Box>

        {/* Dialog */}
        {isAddModalOpen && (
          <ActingDialog
            onClose={() => setIsAddModalOpen(false)}
            title="Create New Acting"
            employeeId={employeeId}
          />
        )}
      </Box>
    </ActingProvider>
  );
};
