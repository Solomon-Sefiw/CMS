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
import GradeIcon from "@mui/icons-material/Grade"; // Using GradeIcon

import { Outlet, useNavigate } from "react-router-dom";
import { ArrowBackIosNew } from "@mui/icons-material";
import { usePermission } from "../../../hooks";
import { useGetChilotCountPerStatusQuery, useSearchAllChilotsQuery } from "../../../app/api/HCMSApi";
import { PageHeader } from "../../../components";
import { ChilotDialog } from "./ChilotDialog";
import { ChilotListTabs } from "./ChilotGrids/ChilotListTabs";

export const ChilotHome = () => {
  // Changed component name
  const permissions = usePermission();
  const [dialogOpened, setDialogOpened] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoCompleteOpen, setAutoCompleteOpen] = useState(false);
  const navigate = useNavigate();

  const { data: chilotCounts } = useGetChilotCountPerStatusQuery(); // Changed variable name
  const { data: allChilots = [] } = useSearchAllChilotsQuery(); // Changed variable name

  const getSearchOptions = useCallback(() => {
    if (searchInput.length < 3) return [];

    const searchTerm = searchInput.toLowerCase();
    const options = new Set<string>();

    allChilots.forEach((chilot) => {
      // Changed variable name
      if (chilot.name?.toLowerCase().includes(searchTerm))
        options.add(chilot.name);
      if (chilot.roomNumber?.toLowerCase().includes(searchTerm))
        options.add(chilot.roomNumber);
    });

    return Array.from(options);
  }, [searchInput, allChilots]); // Changed variable name

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
  }, [searchInput, allChilots, getSearchOptions]); // Added getSearchOptions to dependency array

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
        title={"Awards"}
        icon={<GradeIcon sx={{ fontSize: 15, color: "#1976d2" }} />}
      />{" "}
      {/* Changed title and icon */}
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
          Add New Award {/* Changed text */}
        </Button>
      </Box>
      {/* Content Area */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <ChilotListTabs // Changed component name
          counts={chilotCounts} // Changed variable name
        />
        <Divider sx={{ my: 2 }} />
        <Outlet context={{ searchQuery, chilots: allChilots }} />{" "}
        {/* Changed prop name and variable name */}
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
        <ChilotDialog // Changed component name
          onClose={onDialogClose}
          title="Add Chilot" // Changed title
        />
      )}
    </Box>
  );
};
