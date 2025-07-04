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
import { Fragment, useState, useRef, useEffect } from "react";
import { EmployeeStatusEnum, ProbationResult } from "../../../app/api/enums";
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
import { ProbationActionDialog } from "../ProbationActionDialog";
import { enums } from "../../../app/store";
import { usePermission } from "../../../hooks";

export const DraftProbation = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
  } = useGetProbationCountPerApprovalStatusQuery();
  const {
    data: probation,
    isLoading: isListLoading,
    isFetching,
    isSuccess,
    isError,
    refetch,
  } = useGetProbationListQuery({
    pageNumber: pagination.pageNumber + 1,
    pageSize: pagination.pageSize,
    status: EmployeeStatusEnum.UnderProbation,
  });
  const probationList = probation?.items ?? [];

  const [ApproveProbationPassed, { error: ApproveProbationPassedError }] =
    useAllEmployeeApproveProbationMutation();
  const [Approved, setApproved] = useState<Boolean>(false);
  const ApiCallCountRef = useRef(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuEmployee, setMenuEmployee] = useState<EmployeeDto | null>(null);
  const [ActionType, setActionType] = useState<string>();
  const [selectedEmployee, setSelectedEmployee] = useState<
    EmployeeDto | undefined | null
  >(null);
  const [actionDialogOpen, setActionDialogOpen] = useState<boolean>(false);

  const openMenu = Boolean(anchorEl);
  const navigate = useNavigate();
  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    employee: EmployeeDto
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuEmployee(employee);
  };

  //
  const handleTakeAction = (
    employee: EmployeeDto | undefined | null,
    actionType: string
  ) => {
    setSelectedEmployee(employee);
    setActionType(actionType);
    setActionDialogOpen(true);
    handleMenuClose();
  };
  const Navigate = (
    employee: EmployeeDto | undefined | null,
    actionType: string
  ) => {
    setSelectedEmployee(employee);
    setActionType(actionType);
    if (actionType === "Extend") {
      navigate(`/employee-detail/${employee?.id}`);
    }
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuEmployee(null);
  };
  //
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getProbationStatus = (
    employee: EmployeeDto | undefined,
    probationDays: number | undefined | null
  ) => {
    const startDate = dayjs(employee?.employementDate);
    const today = dayjs();
    const daysPassed = today.diff(startDate, "day");

    if (probationDays != null) {
      const daysRemaining = probationDays - daysPassed;

      if (daysRemaining === 0) {
        return { status: "Completed Probation", color: "success" };
      } else if (daysRemaining > 0 && daysRemaining <= 7) {
        return {
          status: `Ending Probation in ${daysRemaining} days`,
          color: "warning",
        };
      } else if (daysRemaining < 0) {
        return {
          status: "Probation Period Passed and Activated By System",
          color: "error",
          needsApproval: true,
        };
      } else {
        return { status: "Probation In Progress", color: "info" };
      }
    } else {
      return { status: "Probation Date is not Settled", color: "info" };
    }
  };
  const paginatedData = probationList.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const isLoading = isCountsLoading || isListLoading;

  return (
    <Box>
      {!isLoading && !!counts?.probationState && (
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
                  <TableCell>Probation Due Date</TableCell>
                  <TableCell>Probation Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(probationList || []).map((employee: EmployeeDto) => {
                  const probationStatus = getProbationStatus(
                    employee,
                    employee?.job?.jobRole?.jobCatagory?.probationPeriodInDays
                  );
                  return (
                    <TableRow hover key={employee.id}>
                      <TableCell>{employee.employeeId}</TableCell>
                      <TableCell>{employee.displayName}</TableCell>
                      <TableCell>
                        {employee.job?.jobRole?.roleName || "-"}
                      </TableCell>
                      <TableCell>
                        {employee.businessUnits?.name || "-"}
                      </TableCell>
                      <TableCell>
                        {dayjs(employee.employementDate).format("DD MMM YYYY")}
                      </TableCell>
                      <TableCell>
                        {dayjs(employee.employementDate)
                          .add(
                            employee?.job?.jobRole?.jobCatagory
                              ?.probationPeriodInDays ?? 0,
                            "day"
                          ) // Use fallback value of 0 if probationPeriod is undefined or null
                          .format("DD MMM YYYY")}
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={probationStatus.status}
                          color={probationStatus.color as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Actions">
                          <IconButton
                            onClick={(event) =>
                              handleMenuClick(event, employee)
                            }
                          >
                            <MoreVert />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={() => handleTakeAction(menuEmployee, "Approve")}
         disabled={!permissions.CanSubmitEmployeeProbation}
        >
          <CheckCircleOutline color="success" sx={{ mr: 1 }} />
          Approve Probation
        </MenuItem>
        <MenuItem onClick={() => handleTakeAction(menuEmployee, "Terminate")}
        disabled={!permissions.CanTerminateEmployeeProbation}
        >
          <HighlightOff color="warning" sx={{ mr: 1 }} />
          Terminate Probation
        </MenuItem>
        <MenuItem onClick={() => Navigate(menuEmployee, "Extend")}>
          <ArrowForwardIosIcon color="info" sx={{ mr: 1 }} />
          Extend Probation
        </MenuItem>
      </Menu>

      {selectedEmployee && actionDialogOpen && (
        <ProbationActionDialog
          employee={selectedEmployee}
          actionType={ActionType}
          onClose={() => {
            setActionDialogOpen(false);
            refetch();
          }}
        />
      )}
      <Pagination
        pageNumber={pagination.pageNumber}
        pageSize={pagination.pageSize}
        onChange={setPagination}
        totalRowsCount={counts?.probationState}
        rowsPerPageOptions={[10, 20, 50]}
      />

      {!isLoading && !counts?.probationState && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Typography> No Data Available</Typography>
        </Box>
      )}
    </Box>
  );
};
