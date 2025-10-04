import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Fragment, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  useGetReemploymentCountPerStatusQuery,
  useGetReemploymentListForPaginationQuery,
} from "../../../../../app/api";
import { ApprovalStatus } from "../../../../../app/api/enums";
import { Pagination } from "../../../../../components/Pagination";
import ReemploymentDetail from "../ReemploymentDetail";
import { usePagination } from "@mui/lab";
import { useParams } from "react-router-dom";

const reemploymentTypeLabels: Record<number, string> = {
  1: "Reinstate",
  2: "Rehire",
};

export const ApprovedReemployments = () => {
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 10,
  });
const params=useParams();
  const { data: counts, isLoading: isCountsLoading } =
    useGetReemploymentCountPerStatusQuery({employeeId:params.id as any});

  const { data: items, isLoading: isListLoading } =
    useGetReemploymentListForPaginationQuery({
      pageNumber: pagination.pageNumber + 1,
      pageSize: pagination.pageSize,
      status: ApprovalStatus.Approved,
      employeeId:params.id as any
    });

  const [selectedReemploymentId, setSelectedReemploymentId] = useState<
    number | undefined
  >();

  const isLoading = isCountsLoading || isListLoading;

  return (
    <Box>
      {!isLoading && !!counts?.approved && (
        <Paper>
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Employee Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Previous Business Unit
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Previous Job Role
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Reemployment Type
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Reason</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(items?.items || []).map((item) => (
                  <Fragment key={item.id}>
                    <TableRow>
                      <TableCell>{item.employeeName}</TableCell>
                      <TableCell>{item.businessUnitName}</TableCell>
                      <TableCell>{item.jobRoleName}</TableCell>
                      <TableCell>
                        {reemploymentTypeLabels[
                          item.reemploymentType as 1 | 2
                        ] || "Unknown"}
                      </TableCell>
                      <TableCell>{item.reasonForReemployment}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                          }}
                        >
                          <IconButton
                            size="small"
                            aria-label="view reemployment details"
                            onClick={() => setSelectedReemploymentId(item.id)}
                            sx={{
                              color: "darkblue",
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <VisibilityIcon />
                            <Typography
                              variant="body2"
                              sx={{ color: "darkblue", fontWeight: 500 }}
                            >
                              View
                            </Typography>
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Pagination
        pageNumber={pagination.pageNumber}
        pageSize={pagination.pageSize}
        onChange={setPagination}
        totalRowsCount={counts?.approved || 0}
        rowsPerPageOptions={[10, 20, 50]}
      />

      {selectedReemploymentId && (
        <ReemploymentDetail
          reemploymentId={selectedReemploymentId}
          open={!!selectedReemploymentId}
          onClose={() => setSelectedReemploymentId(undefined)}
        />
      )}

      {!isLoading && !counts?.approved && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Typography>No Reemployment Requests Available</Typography>
        </Box>
      )}
    </Box>
  );
};
