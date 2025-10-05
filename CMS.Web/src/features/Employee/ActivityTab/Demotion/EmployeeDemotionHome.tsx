import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
  styled,
  Paper
} from "@mui/material";
import {
  Add,
  CheckCircleOutline,
  PendingActions,
  Drafts,
  Cancel
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { EmployeeDemotionDialog } from "./EmployeeDemotionDialog";
import { EmployeeDemotionUpdate } from './EmployeeDemotionUpdate';
import { useGetEmployeeDemotionListQuery } from "../../../../app/api/HCMSApi";
import { DemotionTabs } from "./DemotionGrids/DemotionTabs";
import { RejectDemotionDialog } from "./RejectDemotionDialog";
import { ApproveDemotionDialog } from "./ApproveDemotionDialog";
import { usePermission } from "../../../../hooks";
import { useTheme } from "@mui/material/styles";

// Styled components
const DemotionHeader = styled(Typography)(({ theme }) => ({
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

export const EmployeeDemotionHome = () => {
  const theme = useTheme();
  const [openEmployeeDemotionDialog, setOpenEmployeeDemotionDialog] = useState(false);
  const [employeeDemotionData, setEmployeeDemotionData] = useState<number | undefined>();
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [approvedId, setApprovedId] = useState<number | undefined>();
  const [employeeId, setEmployeeId] = useState<number | undefined>();
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectId, setRejectId] = useState<number | undefined>();
  const permissions = usePermission();

  const { id } = useParams<{ id: string }>();
  const currentEmployeeId = id ? Number(id) : NaN;

  const { data: demotionList, refetch } = useGetEmployeeDemotionListQuery({ 
    employeeId: currentEmployeeId 
  });

    const countByStatus = (status: string) => {
    return demotionList?.filter(p => p.transactionStatus?.toString() === status).length || 0;
  };
  // Dialog handlers (keep all existing functionality)
  const closeDialog = () => {
    setOpenEmployeeDemotionDialog(false);
    refetch();
  };

  const updateDialogClose = () => {
    setEmployeeDemotionData(undefined);
    setOpenUpdateDialog(false);
    refetch();
  };

  const updateEmployeeDemotionDialog = (id: number | undefined) => {
    setEmployeeDemotionData(id);
    setOpenUpdateDialog(true);
  };

  const approveDemotionDialogOpen = (id: number | undefined, empId: number | undefined) => {
    setEmployeeId(empId);
    setApprovedId(id);
    setOpenApproveDialog(true);
  };

  const approveDialogClose = () => {
    setEmployeeId(undefined);
    setApprovedId(undefined);
    setOpenApproveDialog(false);
  };

  const rejectDemotionDialogOpen = (id: number, empId: number) => {
    setEmployeeId(empId);
    setRejectId(id);
    setOpenRejectDialog(true);
  };

  const rejectDialogClose = () => {
    setEmployeeId(undefined);
    setApprovedId(undefined);
    setOpenRejectDialog(false);
  };

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
            <DemotionHeader variant="h5" sx={{ color: '#0d47a1' }}>
              Employee Demotion
            </DemotionHeader>
            
            {/* Status Chips */}
            <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
              <StatusChip 
                label="Demotion Management" 
                className="draft"
                icon={<Drafts fontSize="small" />}
              />
            </Stack>
          </Box>

          {/* Add Demotion Button */}
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenEmployeeDemotionDialog(true)}
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
            disabled={!permissions.CanCreateUpdateEmployeeActivity}
          >
            Add Demotion
          </Button>
        </Box>

        {/* DemotionTabs - Will pass counts as-is */}
        <DemotionTabs counts={{
            approved: countByStatus('Approved'),
            approvalRequests: countByStatus('Pending'),
            rejected: countByStatus('Rejected'),
            drafts: countByStatus('Draft')
          }} />
      </Box>

      {/* Dialogs */}
      {openEmployeeDemotionDialog && (
        <EmployeeDemotionDialog onClose={closeDialog} />
      )}
      {openUpdateDialog && employeeDemotionData !== undefined && (
        <EmployeeDemotionUpdate
          Id={employeeDemotionData}
          onClose={updateDialogClose}
        />
      )}
      {openRejectDialog && rejectId !== undefined && employeeId !== undefined && (
        <RejectDemotionDialog
          Id={rejectId}
          employeeId={employeeId}
          onClose={rejectDialogClose}
        />
      )}
      {openApproveDialog && approvedId !== undefined && employeeId !== undefined && (
        <ApproveDemotionDialog
          Id={approvedId}
          employeeId={employeeId}
          onClose={approveDialogClose}
        />
      )}
    </Box>
  );
};