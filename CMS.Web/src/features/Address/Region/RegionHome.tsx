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
import LocationCityIcon from "@mui/icons-material/LocationCity"; // Using a relevant icon
import {
  useGetRegionCountPerStatusQuery,
  useSearchAllRegionsQuery, // Assuming you have this query
} from "../../../app/api";
import { PageHeader } from "../../../components/PageHeader";
import { Outlet, useNavigate } from "react-router-dom";
import { ArrowBackIosNew } from "@mui/icons-material";
import { RegionListTabs } from "./RegionGrids/RegionListTabs";
import { RegionDialog } from "./RegionDialog";
import { usePermission } from "../../../hooks";

export const RegionHome: React.FC = () => {
  const permissions = usePermission();
  const [dialogOpened, setDialogOpened] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoCompleteOpen, setAutoCompleteOpen] = useState(false);
  const navigate = useNavigate();

  const { data: regionCounts } = useGetRegionCountPerStatusQuery();
  const { data: allRegions = [] } = useSearchAllRegionsQuery(); // Assuming this query fetches all regions

  const getSearchOptions = useCallback(() => {
    if (searchInput.length < 3) return [];

    const searchTerm = searchInput.toLowerCase();
    const options = new Set<string>();

    allRegions.forEach((region) => {
      if (region.name?.toLowerCase().includes(searchTerm))
        options.add(region.name);
      // Add other relevant fields to search by if available
      // if (region.code?.toLowerCase().includes(searchTerm)) options.add(region.code);
    });

    return Array.from(options);
  }, [searchInput, allRegions]);

  const onDialogClose = useCallback(() => {
    setDialogOpened(false);
  }, []);

  const handleBackToHome = () => {
    navigate("/setup");
  };

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
  }, [searchInput, allRegions, getSearchOptions]);

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
        title={"Regions / City Administrations"}
        icon={<LocationCityIcon sx={{ fontSize: 15, color: "#1976d2" }} />}
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
              label="Search by Region Name"
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
          Add New Region / City Admin
        </Button>
      </Box>

      {/* Content Area */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <RegionListTabs counts={regionCounts} />
        <Divider sx={{ my: 2 }} />
        <Outlet context={{ searchQuery, regions: allRegions }} />{" "}
        {/* Pass search query and all regions as context */}
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

      {dialogOpened && (
        <RegionDialog onClose={onDialogClose} title="Add Region / City Admin" />
      )}
    </Box>
  );
};
