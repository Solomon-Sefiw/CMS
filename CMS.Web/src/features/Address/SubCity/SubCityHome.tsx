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
import {
  useGetSubCityCountPerStatusQuery,
  useSearchAllSubCitiesQuery,
} from "../../../app/api";
import { PageHeader } from "../../../components/PageHeader";
import { Outlet, useNavigate } from "react-router-dom";
import { ArrowBackIosNew } from "@mui/icons-material";
import { SubCityListTabs } from "./SubCityGrids/SubCityListTabs";
import { SubCityDialog } from "./SubCityDialog";
import { usePermission } from "../../../hooks";

export const SubCityHome: React.FC = () => {
  const permissions = usePermission();
  // State management
  const [dialogOpened, setDialogOpened] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoCompleteOpen, setAutoCompleteOpen] = useState(false);
  const navigate = useNavigate();

  // Data fetching
  const { data: subCityCounts } = useGetSubCityCountPerStatusQuery();
  const { data: subCities = [] } = useSearchAllSubCitiesQuery();

  // Search options generation (only name and description)
  const getSearchOptions = () => {
    if (searchInput.length < 3) return [];

    const searchTerm = searchInput.toLowerCase();
    const options = new Set<string>();

    subCities.forEach((subCity) => {
      if (subCity.name?.toLowerCase().includes(searchTerm))
        options.add(subCity.name);
      if (subCity.description?.toLowerCase().includes(searchTerm))
        options.add(subCity.description);
    });

    return Array.from(options);
  };

  // Event handlers
  const onDialogClose = useCallback(() => {
    setDialogOpened(false);
  }, []);

  const handleBackToHome = () => navigate("/setup");

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    // We will handle autoCompleteOpen in the useEffect now
  };

  const handleSearchSelect = (value: string | null) => {
    setSearchQuery(value || "");
  };

  // Effects
  useEffect(() => {
    if (searchInput.length >= 3) {
      const options = getSearchOptions();
      setAutoCompleteOpen(options.length > 0); // Open only if there are options
    } else {
      setAutoCompleteOpen(false);
    }
  }, [searchInput, subCities]); // Re-run effect when searchInput or subCities change

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        position: "relative",
      }}
    >
      <PageHeader title={"Sub-City / Zone"} icon={undefined} />

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
          Add New SubCity/ Zone
        </Button>
      </Box>

      {/* Content Area */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <SubCityListTabs counts={subCityCounts} />
        <Divider sx={{ my: 2 }} />
        <Outlet context={{ searchQuery, subCities }} />{" "}
        {/* Pass subCities data as well */}
      </Paper>

      {/* Floating Back Button */}
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

      {/* Dialog */}
      {dialogOpened && (
        <SubCityDialog onClose={onDialogClose} title="Add Sub-City / Zone" />
      )}
    </Box>
  );
};
