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
import NumbersIcon from "@mui/icons-material/Numbers";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { Outlet, useNavigate } from "react-router-dom";
import { ArrowBackIosNew } from "@mui/icons-material";
import { PageHeader } from "../../../components/PageHeader";
import { useGetBenefitValueCountPerStatusQuery } from "../../../app/store";
import { BenefitValueDialog } from "./BenefitValueDialog";
import { BenefitValueListTabs } from "./BenefitValueGrids/BenefitValueListTabs";
import { usePermission } from "../../../hooks";

export const BenefitValueHome: React.FC = () => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const navigate = useNavigate();
  const { data: benefitValueCount } = useGetBenefitValueCountPerStatusQuery();
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
      <PageHeader title={"Benefit-Value"} icon={<NumbersIcon />} />
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
        <BenefitValueListTabs counts={benefitValueCount} />
        <Divider sx={{ my: 2 }} />
        <Outlet />
      </Paper>

      <Box
        sx={{
          position: "fixed",
          bottom: 16,
          left: 180,
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
        <BenefitValueDialog onClose={onDialogClose} title="Add Benefit value" />
      )}
    </Box>
  );
};
