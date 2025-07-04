import AddIcon from "@mui/icons-material/Add";
import CategoryIcon from "@mui/icons-material/Category";
import { ArrowBackIosNew } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { PageHeader } from "../../../components/PageHeader";
import { JobCategoryDialog } from "./JobCategoryDialog";
import {
  useGetJobCatagoryListQueryQuery,
  useGetJobCategoryCountByApprovalStatusQuery,
} from "../../../app/api/HCMSApi";
import { JobCategoryTabs } from "./JobCatagoryGrids/JobCategoryTabs";
import { Outlet, useNavigate } from "react-router-dom";
import { usePermission } from "../../../hooks";

interface JobCategory {
  name: string;
}

export const JobCatagoryHome = () => {
  const permissions = usePermission();
  const [dialogOpened, setDialogOpened] = useState(false);
  const { data = [] } = useGetJobCatagoryListQueryQuery() as {
    data: JobCategory[];
  };
  const { data: JobCategoryCounts } =
    useGetJobCategoryCountByApprovalStatusQuery();

  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [autoCompleteOpen, setAutoCompleteOpen] = useState(false);

  const navigate = useNavigate();
  const handleBackToHome = () => navigate("/setup");

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
          title={"Job Category"}
          icon={<CategoryIcon sx={{ fontSize: 15, color: "#1976d2" }} />}
        />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpened(true)}
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
          disabled={!permissions.canCreateUpdateSetup}
        >
          Add Job Category
        </Button>
      </Box>

      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
        }}
      >
        <Button
          startIcon={<ArrowBackIosNew />}
          onClick={handleBackToHome}
          variant="contained"
          sx={{
            backgroundColor: "#1976d2",
            "&:hover": {
              backgroundColor: "#1976d2",
            },
          }}
        ></Button>
      </Box>

      {/* Search Field */}
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
            freeSolo
            value={
              data.map((d) => d.name).includes(searchInput) ? searchInput : null
            }
            onChange={(_, newValue) => setSearchInput(newValue ?? "")}
            onInputChange={(_, newInputValue) => {
              setSearchInput(newInputValue ?? "");
              setAutoCompleteOpen(!!newInputValue);
            }}
            options={
              searchInput.length >= 3
                ? data
                    .map((option) => option.name)
                    .filter((name): name is string => typeof name === "string")
                    .filter((name) =>
                      name.toLowerCase().includes(searchInput.toLowerCase())
                    )
                : []
            }
            open={autoCompleteOpen}
            onClose={() => setAutoCompleteOpen(false)}
            renderInput={(params) => <TextField {...params} label="Search" />}
            sx={{ flex: 1 }}
          />

          <Button
            variant="outlined"
            onClick={() => setSearchQuery(searchInput)}
          >
            Search
          </Button>
        </Stack>
      </Box>

      <Paper sx={{ p: 2, flex: 1 }}>
        <JobCategoryTabs counts={JobCategoryCounts} />
        <Divider />
        <Outlet context={{ searchQuery }} />
      </Paper>

      {dialogOpened && (
        <JobCategoryDialog onClose={() => setDialogOpened(false)} />
      )}
    </Box>
  );
};
