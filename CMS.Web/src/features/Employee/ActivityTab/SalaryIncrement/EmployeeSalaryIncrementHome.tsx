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
import { EmployeeSalaryIncrementDialog } from "./EmployeeSalaryIncrementDialog";
import { SalaryIncrementTabs } from "./SalaryIncrementGrids/SalaryIncrementTabs";
import { usePermission } from "../../../../hooks";
import { useTheme } from "@mui/material/styles";

// Styled components
const SalaryIncrementHeader = styled(Typography)(({ theme }) => ({
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

export const EmployeeSalaryIncrementHome = () => {
  const theme = useTheme();
  const [openSalaryIncrementDialog, setOpenSalaryIncrementDialog] = useState(false);
  const permissions = usePermission();

  const { id } = useParams<{ id: string }>();
  const currentEmployeeId = id ? Number(id) : NaN;

  const closeDialog = () => {
    setOpenSalaryIncrementDialog(false);
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
            <SalaryIncrementHeader variant="h5" sx={{ color: '#0d47a1' }}>
              Employee Salary Increment
            </SalaryIncrementHeader>
            
            {/* Status Chips */}
            <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
              <StatusChip 
                label="Salary Increment Management" 
                className="draft"
                icon={<Drafts fontSize="small" />}
              />
            </Stack>
          </Box>

          {/* Add Salary Increment Button */}
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenSalaryIncrementDialog(true)}
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
            Add Salary Increment
          </Button>
        </Box>

        {/* SalaryIncrementTabs */}
        <SalaryIncrementTabs />
      </Box>

      {/* Dialog */}
      {openSalaryIncrementDialog && (
        <EmployeeSalaryIncrementDialog onClose={closeDialog} />
      )}
    </Box>
  );
};