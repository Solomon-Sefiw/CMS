import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Autocomplete,
  Divider,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  useGetJobCountPerStatusQuery,
  useGetJobListByBusinessUnitAndJobRoleQuery,
} from "../../../app/api";
import { JobSearchResultByBUAndJR } from "./JobGrids/JobSearchResultByBUAndJR";
import SetupMenu from "../../../components/layouts/SetupMenu";
import { PageHeader } from "../../../components/PageHeader";
import { JobDialog } from "./JobDialog";
import { JobListTabs } from "./JobGrids/JobListTabs";
import { useBusinessUnitss } from "./useBusinessUnits ";
import { useJobTitles } from "./useJobTitles";
import { Outlet, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { ArrowBackIosNew } from "@mui/icons-material";
import { usePermission } from "../../../hooks";

interface SelectOption {
  label: string;
  value?: number;
}

interface SearchParams {
  businessUnit: SelectOption | null;
  jobRole: SelectOption | null;
  pageNumber: number;
  pageSize: number;
}

export const JobHome: React.FC = () => {
  const permissions = usePermission();
  const [dialogOpened, setDialogOpened] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    businessUnit: null,
    jobRole: null,
    pageNumber: 1,
    pageSize: 5,
  });
  const [searchTriggered, setSearchTriggered] = useState(false);
  const { data: jobCounts } = useGetJobCountPerStatusQuery();
  const { businessUnitLookups } = useBusinessUnitss();
  const { jobTitlesLookups } = useJobTitles();
  const {
    data: filteredJobs = { items: [], totalCount: 0 },
    isLoading,
    isError,
  } = useGetJobListByBusinessUnitAndJobRoleQuery(
    {
      businessUnit: searchParams.businessUnit?.value ?? 0,
      jobRole: searchParams.jobRole?.value ?? 0,
      pageNumber: searchParams.pageNumber,
      pageSize: searchParams.pageSize,
    },
    {
      skip: !searchTriggered,
    }
  );

  const handleSearchSubmit = () => {
    setSearchTriggered(true);
  };

  const handleBusinessUnitChange = (
    event: any,
    newValue: SelectOption | null
  ) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      businessUnit: newValue || null,
    }));
    setSearchTriggered(false)
  };

  const handleJobRoleChange = (event: any, newValue: SelectOption | null) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      jobRole: newValue || null,
    }));
    setSearchTriggered(false)
  };

  const handlePaginationChange = (newPagination: {
    pageNumber: number;
    pageSize?: number;
  }) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      pageNumber: newPagination.pageNumber,
      pageSize: newPagination.pageSize || prevParams.pageSize,
    }));
    setSearchTriggered(true);
  };

  const onDialogClose = useCallback(() => {
    setDialogOpened(false);
  }, []);

  const navigate = useNavigate();
  const handleBackToHome = () => {
    navigate("/setup");
  };
  const filterOptions = (
    options: SelectOption[],
    { inputValue }: { inputValue: string }
  ) => {
    if (inputValue.length >= 3) {
      return options.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    }
    return [];
  };

  return (
    <Box>
      <Box sx={{ display: "flex", mb: 2 }}>
        <PageHeader title={"Jobs"} icon={undefined} />
        <Box sx={{ flex: 1 }}></Box>
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
          Add New Job
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
      <Box sx={{ mb: 2 }}>
        {searchTriggered && filteredJobs.items && filteredJobs.items.length === 0 && (
             <Box sx={{ width: "100%", mb: 2 }}>
               <Alert
                 severity="error"
                 sx={{
                   width: "100%",
                   backgroundColor: "#f8d7da",
                   color: "#721c24",
                 }}
               >
                 No search results found. Please try different filters.
               </Alert>
             </Box>
           )}
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Autocomplete
              options={businessUnitLookups as SelectOption[]}
              getOptionLabel={(option: SelectOption) => option.label}
              value={searchParams.businessUnit || null}
              onChange={handleBusinessUnitChange}
              isOptionEqualToValue={(option, value) =>
                option.label === value?.label && option.value === value?.value
              }
              filterOptions={filterOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search by business unit"
                  variant="outlined"
                  placeholder="Type at least 3 character to search..."
                  sx={{
                    fontSize: "0.875rem",
                    "& .MuiInputBase-input": {
                      textAlign: "center",
                    },
                    "& .MuiInputBase-root": {
                      height: 36,
                    },
                    "& .MuiInputLabel-root": {
                      top: -6,
                    },
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Autocomplete
              options={jobTitlesLookups as SelectOption[]}
              getOptionLabel={(option: SelectOption) => option.label}
              value={searchParams.jobRole || null}
              onChange={handleJobRoleChange}
              isOptionEqualToValue={(option, value) =>
                option.label === value?.label && option.value === value?.value
              }
              filterOptions={filterOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search by job role"
                  variant="outlined"
                  placeholder="Type at least 3 character to search..."
                  sx={{
                    fontSize: "0.875rem",
                    "& .MuiInputBase-input": {
                      textAlign: "center",
                    },
                    "& .MuiInputBase-root": {
                      height: 36,
                    },
                    "& .MuiInputLabel-root": {
                      top: -6,
                    },
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={2} sx={{ display: "flex", alignItems: "center" }}>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearchSubmit}
              disabled={!searchParams.businessUnit && !searchParams.jobRole} 
              sx={{
                width: "auto",
                height: 36,
                fontSize: "0.75rem",
                backgroundColor: "#1976d2",
                color: "#fff",
                boxShadow: "0 3px 5px 2px rgba(25, 118, 210, .3)",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: "#1565c0",
                  transform: "scale(1.05)",
                },
                borderRadius: "8px",
              }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>

     
      <Paper sx={{ p: 2, flex: 1 }}>
  {searchTriggered && filteredJobs.items && filteredJobs.items.length > 0 ? (
    <JobSearchResultByBUAndJR
      filteredJobs={filteredJobs.items || []}
      pageNumber={searchParams.pageNumber}
      pageSize={searchParams.pageSize}
      totalCount={filteredJobs.totalCount || 0}
      onPageChange={handlePaginationChange}
    />
  ) : (
    <>
      <JobListTabs counts={jobCounts} />
      <Divider />
      <Outlet />
    </>
  )}
</Paper>

      {dialogOpened && <JobDialog onClose={onDialogClose} title="Add Job" />}
    </Box>
  );
};
