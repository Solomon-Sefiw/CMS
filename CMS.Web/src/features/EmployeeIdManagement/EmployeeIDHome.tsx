import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import {
  Box,
  Button,
  Grid,
  TextField,
  Stack,
  Typography,
  Autocomplete,
  Paper,
  Divider,
} from "@mui/material";
import { useState } from "react";
import GradeIcon from "@mui/icons-material/Grade";
import { ArrowBackIosNew } from "@mui/icons-material";
import { useEffect } from "react";
import {
  useGetAllEmployeeOnProbationQuery,
  useGetActiveEmployeeForIdManagementQuery,
  useGetEmployeeIdCountPerApprovalStatusQuery,
  useGetAllEmployeeIdListQuery,
  useGetAllEmployeesIdCardInfoQuery,
} from "../../app/api/HCMSApi";
import { useNavigate, Outlet } from "react-router-dom";
import { EmployeeIDTabs } from "./EmployeeIDGrids/EmployeeIDTabs";
export const EmployeeIDHome = () => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const { data: EmployeeIDCounts } =
    useGetEmployeeIdCountPerApprovalStatusQuery();
  const { data: searchfilter } = useGetActiveEmployeeForIdManagementQuery();
  const { data = [] } = useGetAllEmployeesIdCardInfoQuery();
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoCompleteOpen, setAutoCompleteOpen] = useState(false);
             console.log(searchfilter+"All Issues On it.");
  const safeSearchFilter = Array.isArray(searchfilter) ? searchfilter : [];

  const navigate = useNavigate();
  useEffect(() => {
    if (!searchInput) {
      setAutoCompleteOpen(false);
      setSearchQuery("");
    }
  }, [searchInput]);

  return (
    <Box>
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
                  setAutoCompleteOpen(!!newInputValue);
                  break;
                case "clear":
                case "reset":
                  setAutoCompleteOpen(false);
                  setSearchQuery("");
                  break;
                default:
              }
            }}
            options={
              searchInput.length >= 3
                ? data
                    .map((option) => option.displayName)
                    .filter(
                      (name, index, newArray) =>
                        name != null && newArray.indexOf(name) === index
                    )
                    .filter((displayName) =>
                      displayName
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
              setSearchQuery(searchInput);
            }}
          >
            Search
          </Button>
        </Stack>
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          cursor: "progress",
        }}
      ></Box>
      <Paper sx={{ p: 2, flex: 1 }}>
        <EmployeeIDTabs counts={EmployeeIDCounts} />
        <Divider />
        <Outlet context={{ searchQuery }} />
      </Paper>
    </Box>
  );
};
