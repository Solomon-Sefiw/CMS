import {
  Box,
  Button,
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
import {
  EmployeeTransferDto,
  useGetTransferCountPerStatusQuery,
  useGetTransferListForPaginationQuery,
} from "../../../../../app/api";
import { ApprovalStatus } from "../../../../../app/api/enums";
import { Pagination } from "../../../../../components/Pagination";
import { TransferDetail } from "./TransferDetailDialog";
import VisibilityIcon from "@mui/icons-material/Visibility"; // 👈 Eye icon
import { useParams } from "react-router-dom";

const transferTypeLabels: Record<number, string> = {
  1: "Business Unit Change",
  2: "Job Role Change",
  3: "Business Unit & Job Role Change",
};

export const ApprovedTransfers = () => {
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 10,
  });
const params=useParams();
  const { data: counts, isLoading: isCountsLoading } =
    useGetTransferCountPerStatusQuery({employeeId: params.id as any});

  const { data: items, isLoading: isListLoading } =
    useGetTransferListForPaginationQuery({
      pageNumber: pagination.pageNumber + 1,
      pageSize: pagination.pageSize,
      status: ApprovalStatus.Approved,
      employeeId:params.id as any
    });

  const [selectedTransfer, setSelectedTransfer] =
    useState<EmployeeTransferDto>();

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
                    Business Unit
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Job Role</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Transfer Type
                  </TableCell>
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
                      <TableCell>{item.toBusinessUnitName}</TableCell>
                      <TableCell>{item.toJobRoleName}</TableCell>
                      <TableCell>
                        {transferTypeLabels[
                          item.transferType as keyof typeof transferTypeLabels
                        ] ?? "Unknown"}
                      </TableCell>
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
                            aria-label="view transfer details"
                            onClick={() => setSelectedTransfer(item)}
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

      {selectedTransfer && (
        <TransferDetail
          transfer={selectedTransfer}
          onClose={() => setSelectedTransfer(undefined)}
        />
      )}

      {!isLoading && !counts?.approved && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Typography>No Transfer Requests Available</Typography>
        </Box>
      )}
    </Box>
  );
};
