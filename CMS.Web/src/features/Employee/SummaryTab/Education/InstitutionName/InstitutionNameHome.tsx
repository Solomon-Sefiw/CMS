import React, { useCallback, useState, useEffect } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Paper,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import GradeIcon from "@mui/icons-material/Grade";
import {
  useGetInstitutionNameCountPerStatusQuery,
  useSearchAllInstitutionNamesQuery,
} from "../../../../../app/store";
import { PageHeader } from "../../../../../components/PageHeader";
import { Outlet, useNavigate } from "react-router-dom";
import { ArrowBackIosNew } from "@mui/icons-material";
import { usePermission } from "../../../../../hooks";
import { InstitutionNameDialog } from "./InstitutionNameDialog";
import { InstitutionNameListTabs } from "./InstitutionNameGrids/InstitutionNameListTabs";

export const InstitutionNameHome = () => {
  const permissions = usePermission();
  const [dialogOpened, setDialogOpened] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoCompleteOpen, setAutoCompleteOpen] = useState(false);
  const navigate = useNavigate();

  const { data: institutionNameCounts } =
    useGetInstitutionNameCountPerStatusQuery();
  const { data: allInstitutionNames = [] } =
    useSearchAllInstitutionNamesQuery();

  const getSearchOptions = useCallback(() => {
    if (searchInput.length < 3) return [];

    const searchTerm = searchInput.toLowerCase();
    const options = new Set<string>();

    allInstitutionNames.forEach((institutionName) => {
      if (institutionName.name?.toLowerCase().includes(searchTerm))
        options.add(institutionName.name);
      if (institutionName.description?.toLowerCase().includes(searchTerm))
        options.add(institutionName.description);
    });

    return Array.from(options);
  }, [searchInput, allInstitutionNames]);

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
  }, [searchInput, allInstitutionNames, getSearchOptions]);

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
        title={"Institution Names"}
        icon={<GradeIcon sx={{ fontSize: 15, color: "#1976d2" }} />}
      />

      {/* Search and Add Button Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        {/* Search Field */}
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
              label="Search by Name or Description"
              sx={{ width: 400 }}
            />
          )}
        />

        {/* Add New Button */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpened(true)}
          disabled={!permissions.canCreateUpdateSetup}
          sx={{
            backgroundColor: "#1976d2",
            "&:hover": { backgroundColor: "#1565c0" },
          }}
        >
          Add New Institution Name
        </Button>
      </Box>

      {/* Content Area */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <InstitutionNameListTabs counts={institutionNameCounts} />
        <Divider sx={{ my: 2 }} />
        <Outlet
          context={{ searchQuery, institutionNames: allInstitutionNames }}
        />
      </Paper>

      {/* Floating Back Button */}
      <Box sx={{ position: "fixed", bottom: 16, left: 280, zIndex: 1000 }}>
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

      {/* Dialog */}
      {dialogOpened && (
        <InstitutionNameDialog
          onClose={onDialogClose}
          title="Add Institution Name"
        />
      )}
    </Box>
  );
};
