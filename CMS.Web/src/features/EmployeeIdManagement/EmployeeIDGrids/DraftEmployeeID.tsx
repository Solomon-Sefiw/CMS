import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Fragment, useState, useRef, useEffect } from "react";
import {
  EmployeeIDCardStatus,
  EmployeeStatusEnum,
  ProbationResult,
} from "../../../app/api/enums";
import {
  EmployeeDto,
  useAllEmployeeApproveProbationMutation,
  useGetProbationCountPerApprovalStatusQuery,
} from "../../../app/api/HCMSApi";
import { useGetProbationListQuery } from "../../../app/api/HCMSApi";
import dayjs from "dayjs";
import { Pagination } from "../../../components/Pagination";
import {
  MoreVert,
  CheckCircleOutline,
  HighlightOff,
  Edit,
  Refresh,
  Padding,
  LineAxis,
  IceSkating,
  Timer,
} from "@mui/icons-material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useSnackbar } from "@mui/base/useSnackbar";
import {
  useEmployeeIdCardApprovalApprovalMutation,
  EmployeeIdCardApprovalApprovalCommand,
  useGetAllEmployeeIdListQuery,
  useGetEmployeeIdCountPerApprovalStatusQuery,
} from "../../../app/api/HCMSApi";
import { EmployeeIdCard } from "../EmployeeIdCard";
import { Print } from "@mui/icons-material";
import { enums } from "../../../app/api";
import { SubmitEmployeeId } from "../SubmitEmployeeId";
import { useEmployeeIdCardGivenMutation } from "../../../app/api/HCMSApi";
import {EmployeeIdCardGivenCommand} from "../../../app/api/HCMSApi";
import { usePermission } from "../../../hooks";

export const DraftEmployeeID = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const permissions = usePermission();
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDto | null>(null);
  const [idCardDialogOpen, setIdCardDialogOpen] = useState(false);
  const [issueDate, setIssueDate] = useState<string>("");
  const [OpenDialog, setOpenDialog] = useState<boolean>(false);
  const [Employee, setEmployee] = useState<number | null | undefined>(null);
  const [EmployeeIdCardGiven, { error: employeeIdCradGivenError }] =
    useEmployeeIdCardGivenMutation();
  const [pagination, setPagination] = useState<{
    pageNumber: number;
    pageSize?: number;
  }>({
    pageNumber: 0,
    pageSize: 10,
  });
  const {
    data: counts,
    isLoading: isCountsLoading,
    refetch: CountReftch,
  } = useGetEmployeeIdCountPerApprovalStatusQuery();

  const {
    data: EmployeeIdList,
    isLoading: isListLoading,
    isFetching,
    isSuccess,
    isError,
    refetch,
  } = useGetAllEmployeeIdListQuery({
    pageNumber: pagination.pageNumber + 1,
    pageSize: pagination.pageSize,
    status: EmployeeIDCardStatus.IDNotGiven,
  });
  const [SendtoApproval, { error: sendToApprovalError }] =
    useEmployeeIdCardApprovalApprovalMutation();

  const { searchQuery } = useOutletContext<{ searchQuery: string }>();
  const filteredEmployeeIDList = searchQuery
    ? (EmployeeIdList?.items || []).filter((option) =>
        option.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : EmployeeIdList?.items || [];

  const showNoMatchingAlert =
    searchQuery && filteredEmployeeIDList.length === 0;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleGenerateIdCard = (employee: EmployeeDto) => {
    setSelectedEmployee(employee);
    setIssueDate(dayjs().format("YYYY-MM-DD"));
    setIdCardDialogOpen(true);
  };
  const paginatedData = filteredEmployeeIDList.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const ApprovalRequest = (employee: EmployeeDto) => {
    setOpenDialog(true);
    setEmployee(employee.id);
  };

  const closeSubmitDialog = () => {
    setOpenDialog(false);
    setEmployee(null);
    refetch();
    CountReftch();
  };

  return (
    <Box>
      {!isListLoading && !!counts?.draft && (
        <Paper>
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell>Employee ID</TableCell>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Job Title</TableCell>
                  <TableCell>Business Unit</TableCell>
                  <TableCell>Employment Date</TableCell>
                  <TableCell>Employee ID Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(filteredEmployeeIDList || []).map((employee: EmployeeDto) => (
                  <TableRow hover key={employee.id}>
                    <TableCell>{employee.id}</TableCell>
                    <TableCell>{employee.displayName}</TableCell>
                    <TableCell>
                      {employee.job?.jobRole?.roleName || "-"}
                    </TableCell>
                    <TableCell>{employee.businessUnits?.name || "-"}</TableCell>
                    <TableCell>
                      {dayjs(employee.employementDate).format("DD MMM YYYY")}
                    </TableCell>
                    {employee?.employeeIDCardStatus && (
                      <TableCell>
                        {EmployeeIDCardStatus[employee?.employeeIDCardStatus] ??
                          "Unknown Status"}
                      </TableCell>
                    )}
                    {!employee?.employeeIDCardStatus && (
                      <TableCell>
                        <Typography>UnKnown Status</Typography>
                      </TableCell>
                    )}

                    <TableCell align="center">
                      <Button onClick={() => ApprovalRequest(employee)}
                      disabled={!permissions.CanSubmitEmployeeId}
                        >Submit for Approval</Button>
                    </TableCell>
                  </TableRow>
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
        totalRowsCount={counts?.draft}
        rowsPerPageOptions={[10, 20, 50]}
      />

      {!isListLoading && !counts?.draft && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Typography> No Data Available</Typography>
        </Box>
      )}
      {showNoMatchingAlert && (
        <Alert severity="info" sx={{ m: 2 }}>
          No Employee found with name {searchQuery}!!
        </Alert>
      )}
      {OpenDialog && Employee && (
        <SubmitEmployeeId
          employeeId={Employee}
          onDialogClose={closeSubmitDialog}
        />
      )}
    </Box>
  );
};
