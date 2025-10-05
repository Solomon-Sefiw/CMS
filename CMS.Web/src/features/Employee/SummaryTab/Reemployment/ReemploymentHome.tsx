import React, { useCallback, useState } from "react";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import { Box, Button, Divider, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { ArrowBackIosNew } from "@mui/icons-material";

import { ReemploymentDialog } from "./ReemploymentDialog";
import { usePermission } from "../../../../hooks/usePermission";
import { useGetReemploymentCountPerStatusQuery } from "../../../../app/api";
import { PageHeader } from "../../../../components/PageHeader";
import { ReemploymentListTabs } from "./EmployeeReemploymentGrids/ReemploymentListTabs";

export const ReemploymentHome: React.FC = () => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const navigate = useNavigate();
  const permissions = usePermission();
const params=useParams();
  const { id: employeeIdFromRoute } = useParams();
  const { data: reemploymentCount } = useGetReemploymentCountPerStatusQuery({employeeId:params.id as any});

  const onDialogClose = useCallback(() => {
    setDialogOpened(false);
  }, []);

  const handleBackToHome = () => navigate("/setup");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        position: "relative",
      }}
    >
      <Box
        sx={{
          mb: 1,
          "& .MuiTypography-root": {
            fontSize: "1rem",
            fontWeight: 200,
          },
        }}
      >
        <PageHeader title="Employee Re-Employment" icon={<WorkHistoryIcon />} />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpened(true)}
          disabled={!permissions.CanCreateUpdateEmployeeActivity}
          sx={{
            backgroundColor: "#1976d2",
            "&:hover": { backgroundColor: "#1565c0" },
          }}
        >
          Initiate Re-Employment
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 3 }}>
        <ReemploymentListTabs counts={reemploymentCount} />
        <Divider sx={{ my: 1 }} />
        <Outlet />
      </Paper>

      <Box
        sx={{
          position: "fixed",
          bottom: 16,
          left: 280,
          zIndex: 1000,
        }}
      >
      </Box>

      {dialogOpened && (
        <ReemploymentDialog
          onClose={onDialogClose}
          title="Initiate Re-Employment"
          reemployment={{ employeeId: Number(employeeIdFromRoute) || 0 }}
        />
      )}
    </Box>
  );
};
