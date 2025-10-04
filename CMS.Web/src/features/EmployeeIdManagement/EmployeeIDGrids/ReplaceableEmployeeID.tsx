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
} from "@mui/material";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Fragment, useState, useRef, useEffect, useCallback } from "react";
import { EmployeeIDCardStatus } from "../../../app/api/enums";
import { EmployeeDto } from "../../../app/api/HCMSApi";
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
  enums,
  useGetAllEmployeesIdCardInfoQuery,
  useGetEmployeeIdCountPerApprovalStatusQuery,
} from "../../../app/store";
import { useGetAllEmployeeIdListQuery } from "../../../app/api/HCMSApi";
import { EmployeeIDReplaceDialog } from "../EmployeeIDReplaceDialog";
import { usePermission } from "../../../hooks";

export const ReplaceableEmployeeID = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<
    EmployeeDto | undefined | null
  >(null);
  const [dialogOpened, setDialogOpened] = useState(false);
const permissions = usePermission();

  const onDialogClose = useCallback(() => {
    setDialogOpened(false);
  }, []);
  const handleReplace = (employee: EmployeeDto | undefined | null) => {
    setSelectedEmployee(employee);
    setDialogOpened(true);
  };
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
    status: EmployeeIDCardStatus.IDGiven,
  });

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
                  {employee?.employeeIDCardStatus ===
                    enums.EmployeeIDCardStatus.IDGiven && (
                    <TableCell align="center">
                      <Button onClick={()=>handleReplace(employee)}
                                disabled={!permissions.CanReplaceEmployeeId}
                                >Replace</Button>
                    </TableCell>
                  )}
                  {employee?.employeeIDCardStatus ===
                    enums.EmployeeIDCardStatus.IDReplacedAndGiven && (
                    <TableCell align="center">
                      <Button onClick={()=>handleReplace(employee)}
                                disabled={!permissions.CanReplaceEmployeeId}
                                >Replace</Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Pagination
        pageNumber={pagination.pageNumber}
        pageSize={pagination.pageSize}
        onChange={setPagination}
        totalRowsCount={counts?.idGiven}
        rowsPerPageOptions={[10, 20, 50]}
      />
      {showNoMatchingAlert && (
        <Alert severity="info" sx={{ m: 2 }}>
          No Employee found with name {searchQuery}!!
        </Alert>
      )}
      {selectedEmployee && dialogOpened && (
        <EmployeeIDReplaceDialog
          employee={selectedEmployee}
          onClose={onDialogClose}
        />
      )}
    </Box>
  );
};
