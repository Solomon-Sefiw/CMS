import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useOutletContext } from "react-router-dom";
import {
  useGetAllEmployeetListsQuery,
  useGetEmployeeCountPerApprovalStatusQuery,
  EmployeeDto,
} from "../../../app/api";
import { useNavigateToDetailPage } from "../useNavigateToDetailPage";
import { ApprovalStatus } from "../../../app/api/enums";
import { Pagination } from "../../../components/Pagination";
import { useBusinessUnitId } from "./businessUnitContext/BusinessUnitContext";
import dayjs from "dayjs";

// --- Utility Functions ---
const descendingComparator = (a: any, b: any, orderBy: string) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const getComparator = (order: "asc" | "desc", orderBy: string) => {
  return order === "desc"
    ? (a: any, b: any) => descendingComparator(a, b, orderBy)
    : (a: any, b: any) => -descendingComparator(a, b, orderBy);
};

const stableSort = (array: any[], comparator: any) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

// --- Interfaces ---
interface PaginationState {
  pageNumber: number;
  pageSize?: number;
}

interface EmployeeListProps {}

// --- Main Component ---
export const RejectedEmployees = ({}: EmployeeListProps) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageNumber: 0,
    pageSize: 10,
  });
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("employeeId");

  // Get raw search query from context
  const { searchQuery: rawSearchQuery } = useOutletContext<{ searchQuery: string }>();
  // Debounce the search query to prevent excessive API calls
  const debouncedSearchQuery = useDebounce(rawSearchQuery, 300); // 300ms debounce

  const contextBusinessUnitId = useBusinessUnitId();
  const { navigateToDetailPage } = useNavigateToDetailPage();

  // Fetch employee lists with pagination, sorting, and server-side search
  const {
    data: employeeListData, // Renamed to clarify it's the full response object
    isLoading: isListLoading,
  } = useGetAllEmployeetListsQuery({
    businessUnitId: contextBusinessUnitId ?? undefined,
    pageNumber: pagination.pageNumber + 1, // API usually expects 1-based page numbers
    pageSize: pagination.pageSize,
    status: ApprovalStatus.Rejected,
    searchQuery: debouncedSearchQuery, // Pass the debounced search query to the API
  });

  // Extract items and totalCount safely
  const safeItems = Array.isArray(employeeListData?.items) ? employeeListData.items : [];
  const totalItemsCount = employeeListData?.totalCount || 0;

  // Fetch counts separately (if they are global counts not affected by search)
  const { data: counts } = useGetEmployeeCountPerApprovalStatusQuery({
    businssUnitId: contextBusinessUnitId ?? undefined,
  });

  // Effect to reset pagination when the business unit ID changes
  useEffect(() => {
    setPagination({ pageNumber: 0, pageSize: 10 });
    // RTK Query will automatically refetch when contextBusinessUnitId changes
  }, [contextBusinessUnitId]);

  // Effect to reset pagination to page 0 when the debounced search query changes
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageNumber: 0 }));
  }, [debouncedSearchQuery]);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handlePaginationChange = useCallback(
    (newPagination: PaginationState) => {
      setPagination(newPagination);
    },
    [setPagination]
  );

  // Sorting is applied to the data fetched from the API (which is already filtered by the server)
  const sortedItems = stableSort(safeItems, getComparator(order, orderBy));

  const showNoMatchingResultsAlert = debouncedSearchQuery && sortedItems.length === 0 && !isListLoading;
  const showNoDataAvailable = !debouncedSearchQuery && sortedItems.length === 0 && !isListLoading;

  return (
    <Box>
      {isListLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 200,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {showNoMatchingResultsAlert && (
            <Alert severity="info" sx={{ m: 2 }}>
              No matching employees found for "{rawSearchQuery}"
            </Alert>
          )}

          {showNoDataAvailable && (
            <Alert severity="info" sx={{ m: 2 }}>
              No Rejected Data Available
            </Alert>
          )}

          {!showNoMatchingResultsAlert && !showNoDataAvailable && (
            <Paper>
              <TableContainer>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        <TableSortLabel
                          active={orderBy === "employeeId"}
                          direction={orderBy === "employeeId" ? order : "asc"}
                          onClick={() => handleRequestSort("employeeId")}
                          sx={{
                            width: 60,
                            "&:hover": {
                              color: "primary.main",
                            },
                          }}
                        >
                          ID
                        </TableSortLabel>
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        <TableSortLabel
                          active={orderBy === "displayName"}
                          direction={orderBy === "displayName" ? order : "asc"}
                          onClick={() => handleRequestSort("displayName")}
                          sx={{
                            "&:hover": {
                              color: "primary.main",
                            },
                          }}
                        >
                          Name
                        </TableSortLabel>
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        <TableSortLabel
                          active={orderBy === "businessUnit"}
                          direction={
                            orderBy === "businessUnit" ? order : "asc"
                          }
                          onClick={() => handleRequestSort("businessUnit")}
                          sx={{
                            "&:hover": {
                              color: "primary.main",
                            },
                          }}
                        >
                          BusinessUnit
                        </TableSortLabel>
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        <TableSortLabel
                          active={orderBy === "jobTitle"}
                          direction={
                            orderBy === "jobTitle" ? order : "asc"
                          }
                          onClick={() =>
                            handleRequestSort("jobTitle")
                          }
                          sx={{
                            "&:hover": {
                              color: "primary.main",
                            },
                          }}
                        >
                          Job Title
                        </TableSortLabel>
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        <TableSortLabel
                          active={orderBy === "employementDate"}
                          direction={orderBy === "employementDate" ? order : "asc"}
                          onClick={() => handleRequestSort("employementDate")}
                          sx={{
                            "&:hover": {
                              color: "primary.main",
                            },
                          }}
                        >
                          EmploymentDate
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedItems.map((item: EmployeeDto) => ( // Explicitly type item as EmployeeDto
                      <TableRow
                        key={item.id}
                        hover
                        sx={{
                          cursor: "pointer",
                          "& > *": { borderBottom: "unset" },
                        }}
                        onClick={navigateToDetailPage({
                          id: item?.id as any, // Ensure these are correctly typed in EmployeeDto
                          versionNumber: item?.versionNumber as any, // Ensure these are correctly typed in EmployeeDto
                        })}
                      >
                        <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                          {item.employeeId}
                        </TableCell>
                        <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                          {item.displayName}
                        </TableCell>
                        <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                          {item.businessUnit}
                        </TableCell>
                        <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                          {item.jobTitle}
                        </TableCell>
                        <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                          {dayjs(item.employementDate).format("DD MMM YYYY")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </>
      )}

      <Pagination
        pageNumber={pagination.pageNumber}
        pageSize={pagination.pageSize}
        onChange={handlePaginationChange}
        // Use totalItemsCount from the API response when a search query is active,
        // otherwise use the general count for rejected employees.
        totalRowsCount={debouncedSearchQuery ? totalItemsCount : counts?.rejected}
        rowsPerPageOptions={[10, 20, 50]}
      />
    </Box>
  );
};