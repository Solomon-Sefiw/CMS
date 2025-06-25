import React, { useCallback, useState, useEffect } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Paper,
  TextField,
  Typography, // Added for potential titles/headings
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { usePermission } from "../../hooks"; // Assuming this hook is correct
import { Outlet, useNavigate } from "react-router-dom";
import {
  useGetLetterCountPerStatusQuery, // Renamed hook
  useSearchAllLettersQuery, // Renamed hook
} from "../../app/store"; // Adjust path as per your RTK Query setup
import { PageHeader } from "../../components"; // Assuming PageHeader exists
import { LetterTabs } from "./LetterGrid/LetterTabs"; // Assuming LetterTabs is designed for letters
import { ArrowBackIosNew } from "@mui/icons-material";
import { LetterDialog } from "./LetterDialog"; // The LetterDialog component we refined earlier

export const LetterHome: React.FC = () => {
  const permissions = usePermission();
  // State management
  const [dialogOpened, setDialogOpened] = useState(false);
  const [searchInput, setSearchInput] = useState(""); // Input value in the search field
  const [searchQuery, setSearchQuery] = useState(""); // Actual query sent to child components (Outlet)
  const [autoCompleteOpen, setAutoCompleteOpen] = useState(false);
  const navigate = useNavigate();

  // Data fetching
  const { data: letterStatusCounts, isLoading: areCountsLoading } =
    useGetLetterCountPerStatusQuery(); // Renamed for clarity
  const { data: allLetters = [], isLoading: areLettersLoading } =
    useSearchAllLettersQuery(); // Renamed for clarity

  // Unified loading state for the main view
  const isLoading = areCountsLoading || areLettersLoading;

  // Search options generation for Autocomplete
  const getSearchOptions = useCallback(() => {
    if (searchInput.length < 3) return [];

    const searchTerm = searchInput.toLowerCase();
    const options = new Set<string>();

    allLetters.forEach((letter) => {
      // Add relevant letter fields to search options
      if (letter.referenceNumber?.toLowerCase().includes(searchTerm)) {
        options.add(letter.referenceNumber);
      }
      if (letter.subject?.toLowerCase().includes(searchTerm)) {
        options.add(letter.subject);
      }
      if (letter.sender?.firstName?.toLowerCase().includes(searchTerm)) {
        options.add(letter.sender.firstName);
      }
      if (letter.recipient?.firstName?.toLowerCase().includes(searchTerm)) {
        options.add(letter.recipient.firstName);
      }
      if (letter.businessUnits?.name?.toLowerCase().includes(searchTerm)) {
        options.add(letter.businessUnits.name);
      }
    });

    return Array.from(options);
  }, [searchInput, allLetters]); // Dependencies for useCallback

  // Event handlers
  const onDialogClose = useCallback(() => {
    setDialogOpened(false);
    // Optionally refetch data if a new letter was added/updated
    // useGetLetterCountPerStatusQuery().refetch(); // if counts might change after add/update
    // useSearchAllLettersQuery().refetch();      // if full list might change
  }, []);

  const handleBackToHome = () => navigate("/setup"); // Navigate back to a general setup page

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleSearchSelect = (value: string | null) => {
    setSearchQuery(value || ""); // Set the query that will be passed to Outlet for actual filtering
    setAutoCompleteOpen(false); // Close autocomplete after selection
  };

  // Effect to manage Autocomplete open state based on searchInput length and options
  useEffect(() => {
    if (searchInput.length >= 3) {
      const options = getSearchOptions();
      // Only open if there are matching options AND the search input is long enough
      setAutoCompleteOpen(options.length > 0);
    } else {
      setAutoCompleteOpen(false);
    }
    // Also, clear the main searchQuery if the searchInput becomes too short,
    // so the child component doesn't filter with stale query
    if (searchInput.length < 3 && searchQuery !== "") {
      setSearchQuery("");
    }
  }, [searchInput, getSearchOptions, searchQuery]); // Dependencies for useEffect

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3, // Increased overall gap for better spacing
        position: "relative",
        p: 3, // Added padding to the main container
        backgroundColor: (theme) => theme.palette.background.default, // Use theme background
      }}
    >
      <PageHeader title={"Manage Letters"} icon={undefined} /> {/* Updated title */}

      {/* Search and Add Button Section */}
      <Paper
        elevation={2} // Subtle elevation for this section
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "12px", // Rounded corners
          backgroundColor: (theme) => theme.palette.background.paper, // Use paper background
          gap: 2, // Gap between search and button
          flexWrap: "wrap", // Allow wrapping on smaller screens
        }}
      >
        {/* Search Field */}
        <Autocomplete
          freeSolo // Allows user to type values not in options
          size="small"
          options={getSearchOptions()}
          open={autoCompleteOpen}
          onOpen={() => setAutoCompleteOpen(true)}
          onClose={() => setAutoCompleteOpen(false)}
          inputValue={searchInput}
          onInputChange={(_, value) => handleSearchChange(value)}
          onChange={(_, value) => handleSearchSelect(value)}
          sx={{ flexGrow: 1, minWidth: 250 }} // Allows it to grow and sets minimum width
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search by Reference No., Subject, Sender, Recipient or Business Unit" // More descriptive label
              variant="outlined" // Consistent outlined variant
              InputProps={{
                ...params.InputProps,
                type: "search", // Semantic type
              }}
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
            borderRadius: "8px", // Consistent rounded corners
            px: 3, // More horizontal padding
            py: 1.2, // More vertical padding
            fontSize: "0.9rem",
            fontWeight: "bold",
            backgroundColor: (theme) => theme.palette.primary.main,
            "&:hover": {
              backgroundColor: (theme) => theme.palette.primary.dark,
            },
            boxShadow: (theme) => theme.shadows[4], // Stronger shadow
          }}
        >
          Add New Letter
        </Button>
      </Paper>

      {/* Content Area - Tabs and Outlet */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: "12px" }}>
        <LetterTabs counts={letterStatusCounts} /> {/* Pass letterStatusCounts */}
        <Divider sx={{ my: 3 }} /> {/* Increased margin for divider */}
        <Outlet context={{ searchQuery }} />{" "}
        {/* Only pass searchQuery, as specific letter data is fetched by child tabs */}
      </Paper>

      {/* Dialog for adding/editing Letters */}
      {dialogOpened && (
        <LetterDialog onClose={onDialogClose} title="Add New Letter" />
      )}

      {/* Optional: Loading overlay for the main section */}
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1001,
            borderRadius: "12px",
          }}
        >
          {/* <CircularProgress size={60} /> */}
          <Typography variant="h6" color="text.secondary">
            Loading letters overview...
          </Typography>
        </Box>
      )}
    </Box>
  );
};