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
import { ProbationTabs } from "./ProbationGrids/ProbationTabs";
import {
  useGetAllEmployeeOnProbationQuery,
  useGetProbationCountPerApprovalStatusQuery,
} from "../../app/api/HCMSApi";
import { useNavigate, Outlet } from "react-router-dom";
export const ProbationHome = () => {
  const [dialogOpened, setDialogOpened] = useState(false);

  const { data: ProbationCounts } =
    useGetProbationCountPerApprovalStatusQuery();
  const {
    data = [],
    isLoading,
    isFetching,
    isError,
    isSuccess,
    refetch,
  } = useGetAllEmployeeOnProbationQuery();
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoCompleteOpen, setAutoCompleteOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!searchInput) {
      setAutoCompleteOpen(false);
      setSearchQuery("");
    }
  }, [searchInput]);

  return (
    <Box>
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          cursor: "progress",
        }}
      ></Box>
      <Paper sx={{ p: 2, flex: 1 }}>
        <ProbationTabs counts={ProbationCounts} />
        <Divider />
        <Outlet context={{ searchQuery }} />
      </Paper>
    </Box>
  );
};
