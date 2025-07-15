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
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const descendingComparator = (a: any, b: any, orderBy: string) => {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
};

const getComparator = (order: "asc" | "desc", orderBy: string) =>
  order === "desc"
    ? (a: any, b: any) => descendingComparator(a, b, orderBy)
    : (a: any, b: any) => -descendingComparator(a, b, orderBy);

const stableSort = (array: any[], comparator: any) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    return order !== 0 ? order : a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

// --- Interfaces ---
interface PaginationState {
  pageNumber: number;
  pageSize?: number;
}

export const DraftEmployees = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageNumber: 0,
    pageSize: 10,
  });
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("employeeId");

  const { searchQuery: rawSearchQuery } = useOutletContext<{ searchQuery: string }>();
  const debouncedSearchQuery = useDebounce(rawSearchQuery, 300);
  const contextBusinessUnitId = useBusinessUnitId();
  const { navigateToDetailPage } = useNavigateToDetailPage();

  const { data: itemsResponse, isLoading: isListLoading } = useGetAllEmployeetListsQuery({
    businessUnitId: contextBusinessUnitId ?? undefined,
    pageNumber: pagination.pageNumber + 1,
    pageSize: pagination.pageSize,
    status: ApprovalStatus.Draft,
    searchQuery: debouncedSearchQuery || undefined,
  });

  const { data: counts } = useGetEmployeeCountPerApprovalStatusQuery({
    businssUnitId: contextBusinessUnitId ?? undefined,
  });

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
  }, []);

  // ✅ SAFELY handle itemsResponse
  const items = Array.isArray(itemsResponse?.items) ? itemsResponse.items : [];
  const totalRowsFromApi = itemsResponse?.totalCount ?? 0;

  const showNoMatchingResultsAlert =
    debouncedSearchQuery && items.length === 0 && !isListLoading;
  const showNoDataAvailable =
    !debouncedSearchQuery && items.length === 0 && !isListLoading;

  const sortedItems = stableSort(items, getComparator(order, orderBy));

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
                      {["employeeId", "displayName", "businessUnit", "jobTitle", "employementDate"].map((key) => (
                        <TableCell key={key} sx={{ fontWeight: "bold" }}>
                          <TableSortLabel
                            active={orderBy === key}
                            direction={orderBy === key ? order : "asc"}
                            onClick={() => handleRequestSort(key)}
                            sx={{ "&:hover": { color: "primary.main" } }}
                          >
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </TableSortLabel>
                        </TableCell>
                      ))}
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
                        <TableCell>{item.employeeId}</TableCell>
                        <TableCell>{item.displayName}</TableCell>
                        <TableCell>{item.businessUnit}</TableCell>
                        <TableCell>{item.jobTitle}</TableCell>
                        <TableCell>{dayjs(item.employementDate).format("DD MMM YYYY")}</TableCell>
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
        totalRowsCount={totalRowsFromApi}
        rowsPerPageOptions={[10, 20, 50]}
      />
    </Box>
  );
};
