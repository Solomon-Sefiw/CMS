import React, { useCallback, useState, useEffect } from "react";
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
import { PageHeader } from "../../components/PageHeader";
import { BranchGradeListTabs } from "./BranchGradeGrids/BranchGradeListTabs";
import { BranchGradeDialog } from "./BranchGradeDialog";
import {
  useGetBranchGradeByDescriptionQuery,
  useGetBranchGradeCountPerStatusQuery,
} from "../../app/api";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { usePermission } from "../../hooks";

export const BranchGradeHome: React.FC = () => {
  const permissions = usePermission();
  const [dialogOpened, setDialogOpened] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoCompleteOpen, setAutoCompleteOpen] = useState(false);
  const navigate = useNavigate();
  const { data: branchGradeCount } = useGetBranchGradeCountPerStatusQuery();

  const { data: branchGrades = [] } = useGetBranchGradeByDescriptionQuery(
    searchInput.length >= 2 ? { description: searchInput } : skipToken
  );

  const getSearchOptions = () => {
    const searchTerm = searchInput.toLowerCase();
    const options = new Set<string>();

    branchGrades.forEach((branchGrade) => {
      if (branchGrade.description?.toLowerCase().includes(searchTerm)) {
        options.add(branchGrade.description);
      }
    });

    return Array.from(options);
  };

  const onDialogClose = useCallback(() => {
    setDialogOpened(false);
  }, []);

  const handleBackToHome = () => navigate("/setup");

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleSearchSelect = (value: string | null) => {
    setSearchQuery(value || "");
  };

  useEffect(() => {
    if (searchInput.length >= 3) {
      const options = getSearchOptions();
      setAutoCompleteOpen(options.length > 0);
    } else {
      setAutoCompleteOpen(false);
    }
  }, [searchInput, branchGrades]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        position: "relative",
      }}
    >
      <PageHeader title={"Branch-Grade"} icon={<WorkspacePremiumIcon />} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Autocomplete
          freeSolo
          size="small"
          options={getSearchOptions()}
          open={autoCompleteOpen}
          onOpen={() => {
            const options = getSearchOptions();
            setAutoCompleteOpen(options.length > 0 && searchInput.length >= 3);
          }}
          onClose={() => setAutoCompleteOpen(false)}
          inputValue={searchInput}
          onInputChange={(_, value) => handleSearchChange(value)}
          onChange={(_, value) => handleSearchSelect(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search by Description"
              sx={{ width: 400 }}
            />
          )}
        />

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
          Add New Branch Grade
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 3 }}>
        <BranchGradeListTabs counts={branchGradeCount} />
        <Divider sx={{ my: 2 }} />
        <Outlet context={{ searchQuery, branchGrades }} />
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
        <BranchGradeDialog onClose={onDialogClose} title="Add Branch Grade" />
      )}
    </Box>
  );
};
