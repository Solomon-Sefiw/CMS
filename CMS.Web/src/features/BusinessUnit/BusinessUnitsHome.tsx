import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import { BusinessUnitDialog } from "./BusinessUnitDialog";
import { Outlet, useNavigate } from "react-router-dom";
import { BusinessUnitListTabs } from "./BuisnessUnitGrids/BusinessUnitListTabs";
import { PageHeader } from "../../components/PageHeader";
import {
  useGetBusinessUnitCountPerApprovalStatusQuery,
  useSearchAllBusinessUnitsQuery,
} from "../../app/api";
import { useEffect, useState } from "react";
import { Add, BusinessCenter } from "@mui/icons-material";
import { usePermission } from "../../hooks";

export const BusinessUnitsHome = () => {
  const permissions = usePermission();
  const [dialogOpened, setDialogOpened] = useState(false);
  const { data: businessUnitCounts } =
    useGetBusinessUnitCountPerApprovalStatusQuery();
  const { data = [] } = useSearchAllBusinessUnitsQuery();

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoCompleteOpen, setAutoCompleteOpen] = useState(false);

  useEffect(() => {
    if (!searchInput) {
      setAutoCompleteOpen(false);
      setSearchQuery("");
    }
  }, [searchInput]);

  // Function to extract unique values based on a key
  const extractUniqueValues = (
    arr: any[],
    key: string,
    filterInput: string
  ) => {
    const uniqueValues = new Set<string>();
    const filteredAndUnique = arr
      .filter((item) => {
        const value = item[key];
        return value && value.toLowerCase().includes(filterInput.toLowerCase());
      })
      .map((item) => item[key])
      .filter((value) => {
        if (!uniqueValues.has(value)) {
          uniqueValues.add(value);
          return true;
        }
        return false;
      });
    return filteredAndUnique;
  };

  const getSearchOptions = () => {
    if (searchInput.length < 3) return [];

    const uniqueNames = extractUniqueValues(data, "name", searchInput);
    const uniqueCodes = extractUniqueValues(
      data,
      "businessUnitCode",
      searchInput
    );
    const uniqueTypes = extractUniqueValues(
      data,
      "businessUnitTypeName",
      searchInput
    );
    const uniqueSupervisors = extractUniqueValues(
      data,
      "supervisorName",
      searchInput
    );

    const allOptions = [
      ...uniqueNames,
      ...uniqueCodes,
      ...uniqueTypes,
      ...uniqueSupervisors,
    ];
    // Remove duplicates
    return Array.from(new Set(allOptions));
  };

  return (
    <Box>
      <PageHeader
        title="Business Units"
        icon={<BusinessCenter sx={{ fontSize: 20, color: "#1976d2" }} />}
      />

      {/* Container for button and search, button on the right and search on new line */}
      <Box sx={{ marginBottom: 2 }}>
        {/* Add Business Unit Button */}
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", marginBottom: 1 }}
        >
          <Button
            variant="contained"
            startIcon={<Add />}
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
            Add New Business Unit
          </Button>
        </Box>
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            cursor: "progress",
          }}
        >

        </Box>
        {/* Business Unit Search on the new line */}
        <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
          <Stack
            spacing={1}
            sx={{ width: 400 }}
            direction="row"
            alignItems="center"
          >
            <Autocomplete
              id="searcher"
              size="small"
              value={searchInput}
              onChange={() => {
                setSearchQuery(searchInput);
              }} // Handle the selection
              onInputChange={(event, newInputValue, reason) => {
                setSearchInput(newInputValue);
                switch (reason) {
                  case "input":
                    setAutoCompleteOpen(!!newInputValue); // Open dropdown on typing
                    break;
                  case "clear":
                  case "reset":
                    setAutoCompleteOpen(false); // Close dropdown on clear
                    setSearchQuery(""); // Reset the search query when cleared
                    break;
                  default:
                }
              }}
              options={getSearchOptions()}
              open={autoCompleteOpen}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Filter By Names,Codes or Supervisors"
                />
              )}
              sx={{ flex: 1 }}
            />
          </Stack>
        </Box>
      </Box>

      <Paper sx={{ p: 2, flex: 1 }}>
        <BusinessUnitListTabs counts={businessUnitCounts} />
        <Divider />
        <Outlet context={{ searchQuery }} />{" "}
        {/* This is where dynamic content gets rendered */}
      </Paper>

      {dialogOpened && (
        <BusinessUnitDialog
          onClose={() => {
            setDialogOpened(false);
          }}
          title="Add Business Unit"
        />
      )}
    </Box>
  );
};
