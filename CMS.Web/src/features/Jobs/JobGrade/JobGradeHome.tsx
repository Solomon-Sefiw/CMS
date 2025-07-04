import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  TextField,
  Stack,
  Autocomplete,
  Paper,
  Divider,
} from "@mui/material";
import { useState } from "react";
import { PageHeader } from "../../../components/PageHeader";
import { Outlet, useNavigate } from "react-router-dom";
import { JobGradeDialog } from "./JobGradeDialog";
import {
  useGetAllJobGradeQuery,
  useGetJobGradesCountPerApprovalStatusQuery,
} from "../../../app/api/HCMSApi";
import GradeIcon from "@mui/icons-material/Grade";
import { ArrowBackIosNew } from "@mui/icons-material";
import { useEffect } from "react";
import { JobGradeTabs } from "./JobGradeGrids/JobGradeTabs";
import { usePermission } from "../../../hooks";

export const JobGradeHome = () => {
  const permissions = usePermission();
  const [dialogOpened, setDialogOpened] = useState(false);

  const { data: JobGradeCounts } = useGetJobGradesCountPerApprovalStatusQuery();
  const { data = [] } = useGetAllJobGradeQuery();

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
      <Box sx={{ display: "flex" }}>
        <PageHeader
          title={"Job Grade"}
          icon={<GradeIcon sx={{ fontSize: 15, color: "#1976d2" }} />}
        />
        <Box sx={{ flex: 1 }}></Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setDialogOpened(true);
          }}
          disabled={!permissions.canCreateUpdateSetup}
          sx={{
            color: "#fff", // Text color
            borderColor: "#1976d2", // Border color
            backgroundColor: "#1976d2",
            "&:hover": {
              backgroundColor: "#1976d2", // Background color on hover
              color: "#fff", // Text color on hover
              borderColor: "#1976d2", // Border color on hover
            },
          }}
        >
          Add New Job Grade
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
                    .map((option) => option.name)
                    .filter(
                      (name, index, newArray) =>
                        name != null && newArray.indexOf(name) === index
                    )
                    .filter((name) =>
                      name?.toLowerCase().includes(searchInput.toLowerCase())
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
        <JobGradeTabs counts={JobGradeCounts} />
        <Divider />
        <Outlet context={{ searchQuery }} />
      </Paper>
      {dialogOpened && (
        <JobGradeDialog
          onClose={() => {
            setDialogOpened(false);
          }}
        />
      )}
    </Box>
  );
};
