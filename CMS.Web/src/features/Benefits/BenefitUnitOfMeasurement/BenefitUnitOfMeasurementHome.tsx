import React, { useCallback, useState } from "react";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
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
import { BenefitUnitOfMeasurementDialog } from "./BenefitUnitOfMeasurementDialog";
import { PageHeader } from "../../../components/PageHeader";
import { useGetBenefitUnitOfMeasurementCountPerStatusQuery } from "../../../app/api";
import StraightenIcon from "@mui/icons-material/Straighten";
import { BenefitUnitOfMeasurementListTabs } from "./BenefitUnitOfMeasurementGrids/BenefitUnitOfMeasurementListTabs";
import { usePermission } from "../../../hooks";

export const BenefitUnitOfMeasurementHome: React.FC = () => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const navigate = useNavigate();
  const { data: benefitUnitOfMeasurementCount } = useGetBenefitUnitOfMeasurementCountPerStatusQuery();
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
      <PageHeader
        title={"Benefit-Unit-Of-Measurement"}
        icon={<StraightenIcon />}
      />

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
        <BenefitUnitOfMeasurementListTabs
          counts={benefitUnitOfMeasurementCount}
        />
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
        <BenefitUnitOfMeasurementDialog
          onClose={onDialogClose}
          title="Add Measurement Unit"
        />
      )}
    </Box>
  );
};
