import React, { useCallback, useState } from "react";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Paper,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Outlet, useNavigate } from "react-router-dom";
import { ArrowBackIosNew } from "@mui/icons-material";
import { PageHeader } from "../../../components/PageHeader";
import { useGetBenefitCountPerStatusQuery } from "../../../app/api";
import { BenefitDialog } from "./BenefitDialog";
import { BenefitListTabs } from "./BenefitGrids/BenefitListTabs";
import { usePermission } from "../../../hooks";

export const BenefitHome: React.FC = () => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const navigate = useNavigate();
  const { data: benefitCount } = useGetBenefitCountPerStatusQuery();
const permissions = usePermission();
  const onDialogClose = useCallback(() => {
    setDialogOpened(false);
  }, []);

  const handleBackToHome = () => navigate("/setup");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        position: "relative",
      }}
    >
      <PageHeader title={"Benefit"} icon={<CardGiftcardIcon />} />

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpened(true)}
          sx={{
            backgroundColor: "#1976d2",
            "&:hover": { backgroundColor: "#1565c0" },
          }}
          disabled={!permissions.canCreateUpdateSetup}
        >
          Add New
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 3 }}>
        <BenefitListTabs counts={benefitCount} />
        <Divider sx={{ my: 2 }} />
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
        <Button
          variant="contained"
          startIcon={<ArrowBackIosNew />}
          onClick={handleBackToHome}
          sx={{
            backgroundColor: "#1976d2",
            "&:hover": { backgroundColor: "#1565c0" },
            boxShadow: 3,
            borderRadius: "50%",
            minWidth: "auto",
            width: "56px",
            height: "56px",
            padding: 0,
          }}
        />
      </Box>

      {dialogOpened && (
        <BenefitDialog onClose={onDialogClose} title="Add Benefit" />
      )}
    </Box>
  );
};
