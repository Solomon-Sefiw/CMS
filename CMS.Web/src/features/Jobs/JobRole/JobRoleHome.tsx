import AddIcon from "@mui/icons-material/Add";
import WorkIcon from "@mui/icons-material/Work";
import {
  Autocomplete,
  Box,
  Button,
  Stack,
  Divider,
  Paper,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import { PageHeader } from "../../../components/PageHeader";
import { useGetAllJobRoleQuery } from "../../../app/api/HCMSApi";
import { useGetJobRolesCountPerApprovalStatusQuery } from "../../../app/api/HCMSApi";
import { JobRoleTabs } from "./JobRoleGrids/JobRoleTabs";
import { Outlet, useNavigate } from "react-router-dom";
import { ArrowBackIosNew } from "@mui/icons-material";
import { JobRoleDialog } from "./JobRoleDialog";
import { usePermission } from "../../../hooks";

export const JobRoleHome = () => {
  const permissions = usePermission();
  const [dialogOpened, setDialogOpened] = useState(false);
  const { data: JobRoleCounts } = useGetJobRolesCountPerApprovalStatusQuery();
  const { data = [] } = useGetAllJobRoleQuery();

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoCompleteOpen, setAutoCompleteOpen] = useState(false);
  const navigate = useNavigate();
  const handleBackToHome = () => {
    navigate("/setup");
  };
  useEffect(() => {
    if (!searchInput) {
      setAutoCompleteOpen(false);
      setSearchQuery("");
    }
  }, [searchInput]);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <PageHeader
          title={"Job Role"}
          icon={<WorkIcon sx={{ fontSize: 15, color: "#1976d2" }} />}
        />

        {/* Button placed on the right side */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setDialogOpened(true);
          }}
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
          Add New Job Role
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
      {/* Search section in a new line */}
      <Box sx={{ marginTop: 2, display: "flex", justifyContent: "flex-start" }}>
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
            options={
              searchInput.length >= 3
                ? data
                    .map((option) => option.roleName)
                    .filter(
                      (name, index, newArray) =>
                        name != null && newArray.indexOf(name) === index
                    )
                    .filter((roleName) =>
                      roleName
                        ?.toLowerCase()
                        .includes(searchInput.toLowerCase())
                    )
                : []
            }
            open={autoCompleteOpen}
            renderInput={(params) => <TextField {...params} label="Search" />}
            sx={{ flex: 1 }}
          />

          <Button
            variant="outlined"
            onClick={() => {
              setSearchQuery(searchInput); // Trigger search logic
            }}
          >
            Search
          </Button>
        </Stack>
      </Box>

      <Paper sx={{ p: 2, flex: 1 }}>
        <JobRoleTabs counts={JobRoleCounts} />
        <Divider />
        <Outlet context={{ searchQuery }} />
      </Paper>
      {dialogOpened && (
        <JobRoleDialog
          onClose={() => {
            setDialogOpened(false);
          }}
        />
      )}
    </Box>
  );
};
