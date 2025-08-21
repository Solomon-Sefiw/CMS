import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  MoreVert,
  CheckCircleOutline,
  HighlightOff,
  Edit,
  Refresh,
  LineAxis,
} from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import {
  EmployeeDto,
  useGetAllEmployeeOnProbationQuery,
} from "../../app/api/HCMSApi";
//import { ProbationActionDialog } from "./ProbationActionDialog";
import { useSnackbar } from "notistack";
import { PageHeader } from "../../components";
import { ProbationActionDialog } from "./ProbationActionDialog";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { AllEmployeeApproveCommand } from "../../app/api/HCMSApi";
import { useAllEmployeeApproveProbationMutation } from "../../app/api/HCMSApi";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../notification";
import { enums } from "../../app/api";
import { ProbationResult } from "../../app/api/enums";

export const EmployeesOnProbationList = () => {
  // State management
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const {
    data: probationList = [],
    isLoading,
    isFetching,
    isError,
    isSuccess,
    refetch,
  } = useGetAllEmployeeOnProbationQuery();
  const [actionDialogOpen, setActionDialogOpen] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<
    EmployeeDto | undefined | null
  >(null);
  const [Approved, setApproved] = useState<Boolean>(false);
  const ApiCallCountRef = useRef(0);
  const { enqueueSnackbar } = useSnackbar();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuEmployee, setMenuEmployee] = useState<EmployeeDto | null>(null);
  const [ActionType, setActionType] = useState<string>();
  const openMenu = Boolean(anchorEl);
  const navigate = useNavigate();
  const { showSuccessAlert, showErrorAlert } = useAlert();

  const approveProbationForEmployees = async () => {
    for (let employee of probationList) {
      const probationPeriod =
        employee?.job?.jobRole?.jobCatagory?.probationPeriodInDays;
      const status = getProbationStatus(employee, probationPeriod);
      console.log(status.needsApproval);
      if (status.needsApproval) {
        const command = {
          allEmployeeApproveCommand: {
            id: employee?.id,
            employeeId: employee?.id,
            probationResult: ProbationResult.BecomePermanent,
          },
        };
        try {
          await ApproveProbationPassed(command);
        } catch (error) {}
      }
    }
  };

  useEffect(() => {
    const fetchDataAndApproveProbation = async () => {
      if (probationList.length > 0 && !isLoading && !isError) {
        await approveProbationForEmployees();
      }
    };
    if (ApiCallCountRef.current < 3) {
      fetchDataAndApproveProbation();
      ApiCallCountRef.current += 1;
    }
    if (isSuccess && !isFetching) {
      refetch();
    }
  }, [probationList, isFetching, refetch]);

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

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    employee: EmployeeDto
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuEmployee(employee);
  };

  const handleTakeAction = (
    employee: EmployeeDto | undefined | null,
    actionType: string
  ) => {
    setSelectedEmployee(employee);
    setActionType(actionType); // Set the action type (Approve, Extend, Update)
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
    if (actionType === "Update") {
      navigate(`/employee-detail/${employee?.id}`);
    }
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuEmployee(null);
  };

  const handleActionComplete = (success: boolean) => {
    setActionDialogOpen(false);
    if (success) {
      enqueueSnackbar("Action completed successfully", { variant: "success" });
      refetch();
    }
  };

  const [ApproveProbationPassed, { error: ApproveProbationPassedError }] =
    useAllEmployeeApproveProbationMutation();
  const getProbationStatus = (
    employee: EmployeeDto | undefined,
    ProbationDayes: number | undefined | null
  ) => {
    const startDate = dayjs(employee?.employementDate);
    const today = dayjs();
    const daysPassed = today.diff(startDate, "day");

    if (ProbationDayes != null) {
      const daysRemaining = ProbationDayes - daysPassed;

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

  // Filter and paginate data
  const paginatedData = probationList.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box p={4} textAlign="center">
        <Typography color="error">Failed to load probation list</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => refetch()}
          startIcon={<Refresh />}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        mb={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <PageHeader title="Employees on Probation" icon={<LineAxis />} />
        <Button
          variant="contained"
          color="primary"
          onClick={() => refetch()}
          startIcon={<Refresh />}
        >
          Refresh
        </Button>
      </Box>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table size="medium" stickyHeader>
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
              {paginatedData.length > 0 ? (
                paginatedData.map((employee) => {
                  const probationStatus = getProbationStatus(
                    employee,
                    employee?.job?.jobRole?.jobCatagory?.probationPeriodInDays
                  );
                  return (
                    <TableRow hover key={employee.id}>
                      <TableCell>{employee.id}</TableCell>
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
                          .add(10, "day")
                          .format("DD MMM YYYY")}{" "}
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
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No employees currently on probation
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 20, 30]}
          component="div"
          count={probationList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={() => handleTakeAction(menuEmployee, "Approve")}>
          <CheckCircleOutline color="success" sx={{ mr: 1 }} />
          Approve Probation
        </MenuItem>
        <MenuItem onClick={() => handleTakeAction(menuEmployee, "Terminate")}>
          <HighlightOff color="warning" sx={{ mr: 1 }} />
          Terminate Probation
        </MenuItem>
        <MenuItem onClick={() => Navigate(menuEmployee, "Extend")}>
          <ArrowForwardIosIcon color="info" sx={{ mr: 1 }} />
          Extend Probation
        </MenuItem>
        <MenuItem onClick={() => Navigate(menuEmployee, "Update")}>
          <Edit color="info" sx={{ mr: 1 }} />
          Update Details
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
    </Box>
  );
};
