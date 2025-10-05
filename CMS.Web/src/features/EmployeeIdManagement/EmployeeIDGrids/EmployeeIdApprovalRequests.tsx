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
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Print } from "@mui/icons-material";
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
  useGetAllEmployeeIdListQuery,
  useGetEmployeeIdCountPerApprovalStatusQuery,
} from "../../../app/api/HCMSApi";
import { EmployeeIDApproveOrRejectRequestButton } from "../EmployeeIDApproveOrRejectRequestButton";
import { EmployeeIdCard } from "../EmployeeIdCard";
import { useEmployeeIdCardGivenMutation } from "../../../app/api/HCMSApi";
import { enums } from "../../../app/api";
export const EmployeeIdApprovalRequests = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDto | null>(
    null
  );
  const [idCardDialogOpen, setIdCardDialogOpen] = useState(false);
  const [issueDate, setIssueDate] = useState<string>("");

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
  const [EmployeeIdCardGiven, { error: employeeIdCradGivenError }] =
    useEmployeeIdCardGivenMutation();

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
    status: EmployeeIDCardStatus.IDCardApprovalRequest,
  });

  const handleGenerateIdCard = (employee: EmployeeDto) => {
    setSelectedEmployee(employee);
    setIssueDate(dayjs().format("YYYY-MM-DD"));
    setIdCardDialogOpen(true);
  };

  const IDCardGiven = async (employeeId: number | undefined) => {
    if (employeeId === undefined) {
      return;
    }

    const payload = {
      employeeId: employeeId,
      status: EmployeeIDCardStatus.IDGiven,
    };
    await EmployeeIdCardGiven({ employeeIdCardGivenCommand: payload });
  };

  const IdList = EmployeeIdList?.items ?? [];
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();
  const filteredEmployeeIDList = searchQuery
    ? (EmployeeIdList?.items || []).filter((option) =>
        option.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : EmployeeIdList?.items || [];

  const showNoMatchingAlert =
    searchQuery && filteredEmployeeIDList.length === 0;

  return (
    <Box>
      {!isListLoading && (
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
                    {employee?.employeeIDCardStatus !==
                      enums.EmployeeIDCardStatus.IDCardApproved && (
                      <TableCell align="center">
                        <EmployeeIDApproveOrRejectRequestButton
                          employee={employee}
                        />
                      </TableCell>
                    )}
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
        totalRowsCount={counts?.approvalRequests}
        rowsPerPageOptions={[10, 20, 50]}
      />

      {!isListLoading && !counts?.approvalRequests && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Typography> No ID Approval Requests Available</Typography>
        </Box>
      )}
      {showNoMatchingAlert && (
        <Alert severity="info" sx={{ m: 2 }}>
          No Employee found with name {searchQuery}!!
        </Alert>
      )}
    </Box>
  );
};
