import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
  styled,
  Paper,
  Badge,
  Tab,
  Tabs
} from "@mui/material";
import {
  Add,
  CheckCircleOutline,
  PendingActions,
  Drafts,
  Cancel
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { SuspensionProvider } from "./SuspensionProvider";
import { SuspensionDialog } from "./SuspensionDialog";
import { ApprovedSuspensions } from "./SuspensionGrid/ApprovedSuspensions";
import { SubmittedSuspensions } from "./SuspensionGrid/SubmittedSuspensions";
import { DraftSuspensions } from "./SuspensionGrid/DraftSuspensions";
import { RejectedSuspensions } from "./SuspensionGrid/RejectedSuspensions";
import { useGetActiveSuspentionQuery, useGetSuspensionCountPerStatusQuery } from "../../../../app/store";
import { usePermission } from "../../../../hooks";
import { useTheme } from "@mui/material/styles";

// Styled components
const SuspensionHeader = styled(Typography)(({ theme }) => ({
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

export const SuspensionHome = () => {
  const theme = useTheme();
  const { id, status = "approved" } = useParams();
  const navigate = useNavigate();
  const employeeId = Number(id);
  const permissions = usePermission();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: counts } = useGetSuspensionCountPerStatusQuery({ employeeId });
  const { data: activeSuspention } = useGetActiveSuspentionQuery({ id: employeeId });

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
    <SuspensionProvider>
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
              <SuspensionHeader variant="h5" sx={{ color: '#0d47a1' }}>
                Employee Suspensions
              </SuspensionHeader>
              
              {/* Status Chips */}
              <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                <StatusChip 
                  label={`Current Suspensions: ${counts?.draft || 0}`} 
                  className="draft"
                  icon={<Drafts fontSize="small" />}
                />
              </Stack>
            </Box>

            {/* New Suspension Button */}
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setIsAddModalOpen(true)}
              disabled={!permissions.CanCreateUpdateEmployeeActivity || activeSuspention?.isActive}
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
              New Suspension
            </Button>
          </Box>

          {/* Tabs */}
          <Paper elevation={3} sx={{ 
            borderRadius: '6px',
            overflow: 'hidden',
            border: `1px solid ${theme.palette.divider}`,
          }}>
            <Tabs
              value={status}
              onChange={(e, newValue) => navigate(`suspension/${newValue}`)}
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
          {status === "approved" && <ApprovedSuspensions />}
          {status === "draft" && <DraftSuspensions />}
          {status === "submitted" && <SubmittedSuspensions />}
          {status === "rejected" && <RejectedSuspensions />}
        </Box>

        {/* Add Modal */}
        {isAddModalOpen && (
          <SuspensionDialog
            onClose={() => setIsAddModalOpen(false)}
            title="Create New Suspension"
            employeeId={employeeId}
          />
        )}
      </Box>
    </SuspensionProvider>
  );
};