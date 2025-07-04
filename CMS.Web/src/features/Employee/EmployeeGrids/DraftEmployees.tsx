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
  useGetEmployeeCountPerApprovalStatusQuery, // Keeping this if used elsewhere
  EmployeeDto,
} from "../../../app/api";
import { useNavigateToDetailPage } from "../useNavigateToDetailPage";
import { ApprovalStatus } from "../../../app/api/enums";
import { Pagination } from "../../../components/Pagination";
import { useBusinessUnitId } from "./businessUnitContext/BusinessUnitContext";
import dayjs from "dayjs";

// --- Utility Functions ---

// Custom hook for debouncing a value
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function to cancel the timer if value changes before the delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

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

// --- Interfaces ---
interface PaginationState {
  pageNumber: number;
  pageSize?: number;
}

interface EmployeeListProps {}

// --- Main Component ---
export const DraftEmployees = ({}: EmployeeListProps) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageNumber: 0,
    pageSize: 10,
  });
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("employeeId");

  // Get raw search query from context and debounce it
  const { searchQuery: rawSearchQuery } = useOutletContext<{ searchQuery: string }>();
  const debouncedSearchQuery = useDebounce(rawSearchQuery, 300); // 300ms debounce

  const contextBusinessUnitId = useBusinessUnitId();
  const { navigateToDetailPage } = useNavigateToDetailPage();

  // Fetch employee lists, now passing the debounced search query to the API
  const { data: itemsResponse, isLoading: isListLoading } =
    useGetAllEmployeetListsQuery({
      businessUnitId: contextBusinessUnitId ?? undefined,
      pageNumber: pagination.pageNumber + 1, // API usually expects 1-based page numbers
      pageSize: pagination.pageSize,
      status: ApprovalStatus.Draft,
      searchQuery: debouncedSearchQuery || undefined, // Pass the debounced query for server-side search
    });

  // Keeping this query for counts if it's used elsewhere for display purposes
  // (e.g., dashboard cards showing total draft counts).
  // If not, it can be removed as totalRowsFromApi directly provides the count.
  const { data: counts } = useGetEmployeeCountPerApprovalStatusQuery({
    businssUnitId: contextBusinessUnitId ?? undefined,
  });

  // Reset pagination to the first page when business unit or debounced search query changes
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageNumber: 0 }));
  }, [contextBusinessUnitId, debouncedSearchQuery]);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handlePaginationChange = useCallback((newPagination: PaginationState) => {
    setPagination(newPagination);
  }, []); // Dependency array is empty as setPagination is stable

  const safeItems = Array.isArray(itemsResponse?.items)
    ? itemsResponse.items
    : [];
  const totalRowsFromApi = itemsResponse?.totalCount ?? 0; // Get total count directly from API response

  // 'displayItems' now directly uses the server-filtered, paginated data
  const displayItems = safeItems;

  const showNoMatchingResultsAlert =
    debouncedSearchQuery && displayItems.length === 0 && !isListLoading;
  const showNoDataAvailable =
    !debouncedSearchQuery && displayItems.length === 0 && !isListLoading;

  // Apply client-side sorting only to the current page of items
  const sortedItems = stableSort(displayItems, getComparator(order, orderBy));

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
              No Draft Data Available
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
                          direction={orderBy === "jobTitle" ? order : "asc"}
                          onClick={() => handleRequestSort("jobTitle")}
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
                          direction={
                            orderBy === "employementDate" ? order : "asc"
                          }
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
                    {sortedItems.map((item: EmployeeDto) => (
                      <TableRow
                        key={item.id}
                        hover
                        sx={{
                          cursor: "pointer",
                          "& > *": { borderBottom: "unset" },
                        }}
                        onClick={navigateToDetailPage({
                          id: item?.id as any,
                          versionNumber: item?.versionNumber as any,
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

      {/* Pagination component uses the total count from the API response */}
      <Pagination
        pageNumber={pagination.pageNumber}
        pageSize={pagination.pageSize}
        onChange={handlePaginationChange}
        totalRowsCount={totalRowsFromApi}
        rowsPerPageOptions={[10, 20, 50]}
      />
    </Box>
  );
};