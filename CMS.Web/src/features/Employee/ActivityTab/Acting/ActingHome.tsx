import { useState } from "react";
import { Box, Tabs, Tab, Paper, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useGetActingCountPerStatusQuery } from "../../../../app/store";
import { ActingProvider } from "./ActingProvider";
import { ApprovedActings } from "./ActingGrids/ApprovedActings";
import { DraftActings } from "./ActingGrids/DraftActings";
import { SubmittedActings } from "./ActingGrids/SubmittedActings";
import { RejectedActings } from "./ActingGrids/RejectedActings";
import AddIcon from "@mui/icons-material/Add";
import { usePermission } from "../../../../hooks";
import { useTheme } from "@mui/material/styles";
import { ActingDialog } from "./ActingDialog";

export const ActingHome = () => {
  const { id, status = "approved" } = useParams();
  const navigate = useNavigate();
  const employeeId = Number(id);
  const theme = useTheme();
  const permissions = usePermission();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: counts } = useGetActingCountPerStatusQuery({ id : employeeId });

  const tabs = [
    { value: "approved", label: "Approved", count: counts?.approved },
    { value: "submitted", label: "Submitted", count: counts?.submitted },
    { value: "rejected", label: "Rejected", count: counts?.rejected },
    { value: "draft", label: "Draft", count: counts?.draft },
  ];

  return (
    <ActingProvider>
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
              onChange={(e, newValue) => navigate(`acting/${newValue}`)}
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
            New Acting
          </Button>
        </Box>

        <Box sx={{ mt: 2 }}>
          {status === "approved" && <ApprovedActings />}
          {status === "draft" && <DraftActings />}
          {status === "submitted" && <SubmittedActings />}
          {status === "rejected" && <RejectedActings />}
        </Box>

        {/* Add New acting Modal */}
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