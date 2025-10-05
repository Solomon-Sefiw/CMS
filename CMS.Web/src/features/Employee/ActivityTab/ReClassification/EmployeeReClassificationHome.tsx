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
import { EmployeeReClassificationDialog } from "./EmployeeReClassificationDialog";
import { EmployeeReClassificationUpdate } from "./EmployeeReClassificationUpdate";
import { RejectReClassificationDialog } from "./RejectReClassificationDialog";
import { ApproveReClassificationDialog } from "./ApproveReClassificationDialog";
import { useGetEmployeeReClassificationListQuery } from "../../../../app/api/HCMSApi";
import { ReClassificationTabs } from "./ReClassificationGrids/ReClassificationTabs";
import { usePermission } from "../../../../hooks";
import { useTheme } from "@mui/material/styles";

// Styled components
const ReClassificationHeader = styled(Typography)(({ theme }) => ({
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

export const EmployeeReClassificationHome = () => {
  const theme = useTheme();
  const [openReClassificationDialog, setOpenReClassificationDialog] = useState(false);
  const [reClassificationData, setReClassificationData] = useState<number | undefined>();
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [approvedId, setApprovedId] = useState<number | undefined>();
  const [employeeId, setEmployeeId] = useState<number | undefined>();
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectId, setRejectId] = useState<number | undefined>();
  const permissions = usePermission();

  const { id } = useParams<{ id: string }>();
  const currentEmployeeId = id ? Number(id) : NaN;

  const { data: reClassificationList, refetch } = useGetEmployeeReClassificationListQuery({ 
    employeeId: currentEmployeeId 
  });

   const countByStatus = (status: string) => {
    return reClassificationList?.filter(p => p.transactionStatus?.toString() === status).length || 0;
  };
  // Dialog handlers (keep all existing functionality)
  const closeDialog = () => {
    setOpenReClassificationDialog(false);
    refetch();
  };

  const updateDialogClose = () => {
    setReClassificationData(undefined);
    setOpenUpdateDialog(false);
    refetch();
  };

  const updateReClassificationDialog = (id: number | undefined) => {
    setReClassificationData(id);
    setOpenUpdateDialog(true);
  };

  const approveReClassificationDialogOpen = (id: number | undefined, empId: number | undefined) => {
    setEmployeeId(empId);
    setApprovedId(id);
    setOpenApproveDialog(true);
  };

  const approveDialogClose = () => {
    setEmployeeId(undefined);
    setApprovedId(undefined);
    setOpenApproveDialog(false);
  };

  const rejectReClassificationDialogOpen = (id: number, empId: number) => {
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
            <ReClassificationHeader variant="h5" sx={{ color: '#0d47a1' }}>
              Employee ReClassification
            </ReClassificationHeader>
            
            {/* Status Chips */}
            <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
              <StatusChip 
                label="ReClassification Management" 
                className="draft"
                icon={<Drafts fontSize="small" />}
              />
            </Stack>
          </Box>

          {/* Add ReClassification Button */}
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenReClassificationDialog(true)}
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
            Add ReClassification
          </Button>
        </Box>

        {/* ReClassificationTabs */}
        <ReClassificationTabs 
        counts={{
            approved: countByStatus('Approved'),
            approvalRequests: countByStatus('Pending'),
            rejected: countByStatus('Rejected'),
            drafts: countByStatus('Draft')
          }}
        />
      </Box>

      {/* Dialogs */}
      {openReClassificationDialog && (
        <EmployeeReClassificationDialog onClose={closeDialog} />
      )}
      {openUpdateDialog && reClassificationData !== undefined && (
        <EmployeeReClassificationUpdate
          Id={reClassificationData}
          onClose={updateDialogClose}
        />
      )}
      {openRejectDialog && rejectId !== undefined && employeeId !== undefined && (
        <RejectReClassificationDialog
          Id={rejectId}
          employeeId={employeeId}
          onClose={rejectDialogClose}
        />
      )}
      {openApproveDialog && approvedId !== undefined && employeeId !== undefined && (
        <ApproveReClassificationDialog
          Id={approvedId}
          employeeId={employeeId}
          onClose={approveDialogClose}
        />
      )}
    </Box>
  );
};