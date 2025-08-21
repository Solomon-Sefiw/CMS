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
  useEmployeeIdCardUpdateMutation,
  useGetEmployeeIdCountPerApprovalStatusQuery,
} from "../../../app/api/HCMSApi";
import { enums } from "../../../app/api";
import { EmployeeIDUpdateDialog } from "../EmployeeIDUpdateDialog";
import { usePermission } from "../../../hooks";
export const RejectedEmployeeID = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<
    EmployeeDto | undefined | null
  >(null);
  const [idCardDialogOpen, setIdCardDialogOpen] = useState(false);
  const [issueDate, setIssueDate] = useState<string>("");
  const [dialogOpened, setDialogOpened] = useState(false);
const permissions = usePermission();

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
    status: EmployeeIDCardStatus.IDCardApprovalRejected,
  });

  const IdList = EmployeeIdList?.items ?? [];
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();
  const filteredEmployeeIDList = searchQuery
    ? (EmployeeIdList?.items || []).filter((option) =>
        option.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : EmployeeIdList?.items || [];

  const showNoMatchingAlert =
    searchQuery && filteredEmployeeIDList.length === 0;

  const onDialogClose = useCallback(() => {
    setDialogOpened(false);
  }, []);
  const handleUpdate = (employee: EmployeeDto | undefined | null) => {
    setSelectedEmployee(employee);
    setDialogOpened(true);
  };

  return (
    <Box>
      {!isListLoading && !!counts?.rejected && (
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
                    <Button onClick={()=>handleUpdate(employee)}
                              disabled={!permissions.CanCreateUpdateEmployeeId}
                              >Edit</Button>
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
        totalRowsCount={counts?.rejected}
        rowsPerPageOptions={[10, 20, 50]}
      />

      {!isListLoading && !counts?.rejected && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Typography> No Data Available</Typography>
        </Box>
      )}
      {showNoMatchingAlert && (
        <Alert severity="info" sx={{ m: 2 }}>
          No Employee found with name {searchQuery}!!
        </Alert>
      )}
      {selectedEmployee && dialogOpened && (
        <EmployeeIDUpdateDialog
          employee={selectedEmployee}
          onClose={onDialogClose}
        />
      )}
    </Box>
  );
};
