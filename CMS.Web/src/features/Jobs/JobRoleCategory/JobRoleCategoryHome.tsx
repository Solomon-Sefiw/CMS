import React, { useCallback, useState, useEffect } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { PageHeader } from "../../../components/PageHeader";
import { Outlet, useNavigate } from "react-router-dom";
import { ArrowBackIosNew } from "@mui/icons-material";
import { JobRoleCategoryListTabs } from "./JobRoleCategoryGrids/JobRoleCategoryListTabs";
import { JobRoleCategoryDialog } from "./JobRoleCategoryDialog";
import {
  useGetJobRoleCategoryCountPerStatusQuery,
  useSearchAllJobRoleCatagoriesQuery,
} from "../../../app/api";
import { usePermission } from "../../../hooks";

export const JobRoleCategoryHome: React.FC = () => {
  const permissions = usePermission();
  const [dialogOpened, setDialogOpened] = useState(false);
  const { data: jobRoleCategoryCounts } =
    useGetJobRoleCategoryCountPerStatusQuery();
  const { data: jobRoleCategories = [] } = useSearchAllJobRoleCatagoriesQuery();
  const navigate = useNavigate();

  // Search state
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoCompleteOpen, setAutoCompleteOpen] = useState(false);

  const onDialogClose = useCallback(() => {
    setDialogOpened(false);
  }, []);

  const handleBackToHome = () => {
    navigate("/setup");
  };

  useEffect(() => {
    if (!searchInput) {
      setAutoCompleteOpen(false);
      setSearchQuery("");
    }
  }, [searchInput]);

  // Function to extract search options based on Name and Description
  const getSearchOptions = () => {
    if (searchInput.length < 3) return [];

    const options = new Set<string>();

    jobRoleCategories.forEach((category) => {
      // Check Name
      if (category.name?.toLowerCase().includes(searchInput.toLowerCase())) {
        options.add(category.name);
      }

      // Check Description
      if (
        category.description?.toLowerCase().includes(searchInput.toLowerCase())
      ) {
        options.add(category.description);
      }
    });

    return Array.from(options);
  };

  return (
    <Box>
      <PageHeader title={"Job Role Category"} icon={undefined} />

      {/* Action bar with button and search */}
      <Box sx={{ marginBottom: 2 }}>
        {/* Add Job Role Category Button */}
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", marginBottom: 1 }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpened(true)}
            disabled={!permissions.canCreateUpdateSetup}
            sx={{
              color: "#fff",
              borderColor: "#1976d2",
              backgroundColor: "#1976d2",
              "&:hover": {
                backgroundColor: "#1976d2",
                color: "#fff",
                borderColor: "#1976d2",
              },
            }}
          >
            Add New Job Role Category
          </Button>
        </Box>

        {/* Back Button */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            cursor: "pointer",
          }}
        >
          <Button
            startIcon={<ArrowBackIosNew />}
            onClick={handleBackToHome}
            variant="contained"
            sx={{
              backgroundColor: "#1976d2",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#1976d2",
              },
            }}
          ></Button>
        </Box>

        {/* Job Role Category Search */}
        <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
          <Stack
            spacing={1}
            sx={{ width: 400 }}
            direction="row"
            alignItems="center"
          >
            <Autocomplete
              id="job-role-category-searcher"
              size="small"
              freeSolo
              value={searchInput}
              onChange={(_, newValue) => {
                setSearchQuery(newValue || "");
              }}
              onInputChange={(_, newInputValue, reason) => {
                setSearchInput(newInputValue);
                if (reason === "clear" || reason === "reset") {
                  setSearchQuery("");
                }
              }}
              options={getSearchOptions()}
              open={autoCompleteOpen && searchInput.length >= 3}
              onOpen={() => {
                if (searchInput.length >= 3) {
                  setAutoCompleteOpen(true);
                }
              }}
              onClose={() => setAutoCompleteOpen(false)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search by Name or Description"
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    if (e.target.value.length >= 3) {
                      setAutoCompleteOpen(true);
                    } else {
                      setAutoCompleteOpen(false);
                    }
                  }}
                />
              )}
              sx={{ flex: 1 }}
            />
          </Stack>
        </Box>
      </Box>

      <Paper sx={{ p: 2, flex: 1 }}>
        <JobRoleCategoryListTabs counts={jobRoleCategoryCounts} />
        <Divider />
        <Outlet context={{ searchQuery }} />
      </Paper>

      {dialogOpened && (
        <JobRoleCategoryDialog
          onClose={onDialogClose}
          title="Add Job Role Category"
        />
      )}
    </Box>
  );
};
