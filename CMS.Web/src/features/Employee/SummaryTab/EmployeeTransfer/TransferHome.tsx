import React, { useCallback, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Chip,
  Stack,
  Typography,
  styled,
  Divider,
  Tabs,
  Badge,
  Tab,
  useTheme
} from "@mui/material";
import {
  TransferWithinAStation,
  Add,
  ArrowBackIosNew,
  CheckCircleOutline,
  PendingActions,
  Drafts,
  Cancel
} from "@mui/icons-material";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { TransferDialog } from "./TransferDialog";
import { usePermission } from "../../../../hooks/usePermission";
import { useGetTransferCountPerStatusQuery } from "../../../../app/api";
import { TransferListTabs } from "./EmployeeTransferGrids/TransferListTabs";

// Styled components
const TransferHeader = styled(Typography)(({ theme }) => ({
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

export const TransferHome: React.FC = () => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const navigate = useNavigate();
  const params=useParams();
  const permissions = usePermission();
  const { id: employeeIdFromRoute } = useParams();
  const { data: transferCount } = useGetTransferCountPerStatusQuery({employeeId:params.id as any});

  const onDialogClose = useCallback(() => {
    setDialogOpened(false);
  }, []);

  const handleBackToHome = () => navigate("/setup");
  const theme = useTheme();
  const tabs = [
    { 
      value: "", 
      label: "Transfers", 
      count: transferCount?.approved, 
      icon: <CheckCircleOutline color="success" />,
      color: "success" 
    },
    { 
      value: "approval-requests", 
      label: "Approval Requests", 
      count: transferCount?.approvalRequests, 
      icon: <PendingActions color="info" />,
      color: "primary" 
    },
    { 
      value: "rejected-approval-requests", 
      label: "Rejected", 
      count: transferCount?.rejected, 
      icon: <Cancel color="error" />,
      color: "error" 
    },
    { 
      value: "draft", 
      label: "Draft", 
      count: transferCount?.drafts, 
      icon: <Drafts color="warning" />,
      color: "info" 
    },
  ];

  return (
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
            <TransferHeader variant="h5" sx={{ color: '#0d47a1' }}>
              Employee Transfer
            </TransferHeader>
            
            {/* Status Chips */}
            <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
              <StatusChip 
                label={`Current Transfer track : ${transferCount?.drafts || 0}`} 
                className="draft"
                icon={<Drafts fontSize="small" />}
              />
            </Stack>
          </Box>

          {/* Initiate Transfer Button */}
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setDialogOpened(true)}
            disabled={!permissions.CanCreateUpdateEmployeeActivity}
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
            Initiate Transfer
          </Button>
        </Box>

        {/* Tabs */}
        <Paper elevation={3} sx={{ 
          borderRadius: '6px',
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`,
        }}>
          <Tabs
            value={window.location.pathname.split('/').pop() || 'transfers'}
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
                        color: window.location.pathname.includes(tab.value) ? '#0d47a1' : 'inherit'
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
                  color: window.location.pathname.includes(tab.value) ? '#032557ff' : 'inherit',
                  minWidth: 120,
                  px: 3,
                }}
                onClick={() => navigate(`/employee-detail/${employeeIdFromRoute}/activities/transfer/${tab.value}`)}
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
        <Outlet />
      </Box>

      {/* Back Button */}
      <Box
        sx={{
          position: "fixed",
          bottom: 16,
          left: 280,
          zIndex: 1000,
        }}
      >
      </Box>

      {/* Dialog */}
      {dialogOpened && (
        <TransferDialog
          onClose={onDialogClose}
          title="Initiate Transfer"
          transfer={{ employeeId: Number(employeeIdFromRoute) || 0 }}
        />
      )}
    </Box>
  );
};