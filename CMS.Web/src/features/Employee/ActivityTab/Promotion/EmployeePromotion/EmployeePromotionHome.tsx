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
import { EmployeePromotionDialog } from "./EmployeePromotionDialog";
import { EmployeePromotionUpdate } from './EmployeePromotionUpdate';
import { EmployeePromotionDto, useGetEmployeePromotionListQuery } from "../../../../../app/api/HCMSApi";
import { PromotionTabs } from "./PromotionGrids/PromotionTabs";
import { RejectPromotionDialog } from "./RejectPromotionDialog";
import { ApprovePromotionDialog } from "./ApprovePromotionDialog";
import { usePermission } from "../../../../../hooks";
import { useTheme } from "@mui/material/styles";


interface EmployeePromotionProps {
  items?: EmployeePromotionDto[];
  hideWorkflowComment?: boolean;
  suppressActionColumn?: boolean;
}

// Styled components
const PromotionHeader = styled(Typography)(({ theme }) => ({
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

export const EmployeePromotionHome = ({
  items = [],
  hideWorkflowComment,
  suppressActionColumn,
}: EmployeePromotionProps) => {
  const theme = useTheme();
  
  const [openEmployeePromotionDialog, setOpenEmployeePromotionDialog] = useState(false);
  const [employeePromotionData, setEmployeePromotionData] = useState<number | undefined>();
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [approvedId, setApprovedId] = useState<number | undefined>();
  const [employeeId, setEmployeeId] = useState<number | undefined>();
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectId, setRejectId] = useState<number | undefined>();
  const permissions = usePermission();

  const { id } = useParams<{ id: string }>();
  const currentEmployeeId = id ? Number(id) : NaN;

  const { data: promotionList, refetch } = useGetEmployeePromotionListQuery({ 
    employeeId: currentEmployeeId 
  });

  // Helper function to count promotions by status
  const countByStatus = (status: string) => {
    return promotionList?.filter(p => p.transactionStatus?.toString() === status).length || 0;
  };

  const closeDialog = () => {
    setOpenEmployeePromotionDialog(false);
    refetch();
  };

  const updateDialogClose = () => {
    setEmployeePromotionData(undefined);
    setOpenUpdateDialog(false);
    refetch();
  };

  const updateEmployeePromotionDialog = (id: number | undefined) => {
    setEmployeePromotionData(id);
    setOpenUpdateDialog(true);
  };

  const approvePromotionDialogOpen = (id: number | undefined, empId: number | undefined) => {
    setEmployeeId(empId);
    setApprovedId(id);
    setOpenApproveDialog(true);
  };

  const approveDialogClose = () => {
    setEmployeeId(undefined);
    setApprovedId(undefined);
    setOpenApproveDialog(false);
  };

  const rejectPromotionDialogOpen = (id: number, empId: number) => {
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
            <PromotionHeader variant="h5" sx={{ color: '#0d47a1' }}>
              Employee Promotion
            </PromotionHeader>
            
            {/* Status Chips */}
            <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
              <StatusChip 
                label={`Current Promotion track: ${countByStatus('Draft')}`} 
                className="draft"
                icon={<Drafts fontSize="small" />}
              />
            </Stack>
          </Box>

          {/* Add Promotion Button */}
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenEmployeePromotionDialog(true)}
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
            Add Promotion
          </Button>
        </Box>

        {/* PromotionTabs will handle its own styling */}
        <PromotionTabs 
          counts={{
            approved: countByStatus('Approved'),
            approvalRequests: countByStatus('Pending'),
            rejected: countByStatus('Rejected'),
            drafts: countByStatus('Draft')
          }}
        />
      </Box>

      {/* Dialogs */}
      {openEmployeePromotionDialog && (
        <EmployeePromotionDialog onClose={closeDialog} />
      )}
      {openUpdateDialog && employeePromotionData !== undefined && (
        <EmployeePromotionUpdate
          Id={employeePromotionData}
          onClose={updateDialogClose}
        />
      )}
      {openRejectDialog && rejectId !== undefined && employeeId !== undefined && (
        <RejectPromotionDialog
          Id={rejectId}
          employeeId={employeeId}
          onClose={rejectDialogClose}
        />
      )}
      {openApproveDialog && approvedId !== undefined && employeeId !== undefined && (
        <ApprovePromotionDialog
          Id={approvedId}
          employeeId={employeeId}
          onClose={approveDialogClose}
        />
      )}
    </Box>
  );
};