import React, { useState } from "react";
import { Box, Tabs, Tab, Paper, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useGetDelegationCountPerStatusQuery } from "../../../../app/store";
import { DelegationProvider } from "./DelegationProvider";
import { ApprovedDelegations } from "./DelegationGrids/ApprovedDelegations";
import { DraftDelegations } from "./DelegationGrids/DraftDelegations";
import { SubmittedDelegations } from "./DelegationGrids/SubmittedDelegations";
import { RejectedDelegations } from "./DelegationGrids/RejectedDelegations";
import AddIcon from "@mui/icons-material/Add";
import { usePermission } from "../../../../hooks";
import { useTheme } from "@mui/material/styles";
import { DelegationDialog } from "./DelegationDialog";

export const DelegationHome = () => {
  const { id, status = "approved" } = useParams();
  const navigate = useNavigate();
  const employeeId = Number(id);
  const theme = useTheme();
  const permissions = usePermission();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: counts } = useGetDelegationCountPerStatusQuery({ id : employeeId });

  const tabs = [
    { value: "approved", label: "Approved", count: counts?.approved },
    { value: "submitted", label: "Submitted", count: counts?.submitted },
    { value: "rejected", label: "Rejected", count: counts?.rejected },
    { value: "draft", label: "Draft", count: counts?.draft },
  ];

  return (
    <DelegationProvider>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Paper elevation={3} sx={{ flex: 1 }}>
            <Tabs
              value={status}
              onChange={(e, newValue) => navigate(`delegation/${newValue}`)}
              variant="scrollable"
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.value}
                  value={tab.value}
                  label={`${tab.label} (${tab.count || 0})`}
                />
              ))}
            </Tabs>
          </Paper>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsAddModalOpen(true)}
            disabled={!permissions.canCreateUpdateSetup}
            sx={{
              ml: 2,
              backgroundColor: theme.palette.primary.main,
              "&:hover": { backgroundColor: theme.palette.primary.dark },
            }}
          >
            New Delegation
          </Button>
        </Box>

        <Box sx={{ mt: 2 }}>
          {status === "approved" && <ApprovedDelegations />}
          {status === "draft" && <DraftDelegations />}
          {status === "submitted" && <SubmittedDelegations />}
          {status === "rejected" && <RejectedDelegations />}
        </Box>

        {/* Add New Delegation Modal */}
        {isAddModalOpen && (
          <DelegationDialog
            onClose={() => setIsAddModalOpen(false)}
            title="Create New Delegation"
            employeeId={employeeId}
          />
        )}
      </Box>
    </DelegationProvider>
  );
};