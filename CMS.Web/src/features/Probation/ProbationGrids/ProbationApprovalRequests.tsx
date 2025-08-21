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
import { Fragment, useState, useRef } from "react";
import { ProbationResult, EmployeeStatusEnum } from "../../../app/api/enums";
import {
  EmployeeDto,
  useGetProbationCountPerApprovalStatusQuery,
} from "../../../app/api/HCMSApi";
import { useGetProbationListQuery } from "../../../app/api/HCMSApi";
import dayjs from "dayjs";
import { Pagination } from "../../../components/Pagination";
import { useSnackbar } from "@mui/base/useSnackbar";
import { ProbationActionDialog } from "../ProbationActionDialog";
import { ProbationWorkflowActionDialog } from "../ProbationWorkflowActionDialog";
import { ProbationApproveOrRejectRequestButton } from "../ProbationApproveOrRejectRequestButton";

export const ProbationApprovalRequests = () => {
  const [pagination, setPagination] = useState<{
    pageNumber: number;
    pageSize?: number;
  }>({
    pageNumber: 0,
    pageSize: 10,
  });

  const { data: counts, isLoading: isCountsLoading } =
    useGetProbationCountPerApprovalStatusQuery();

  const {
    data: items,
    isLoading: isListLoading,
    refetch,
  } = useGetProbationListQuery({
    pageNumber: pagination.pageNumber + 1,
    pageSize: pagination.pageSize,
    status: EmployeeStatusEnum.ProbationApprovalRequest,
  });
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
  const handleTakeAction = (
    employee: EmployeeDto | undefined | null,
    actionType: string
  ) => {
    setSelectedEmployee(employee);
    setActionType(actionType);
    setActionDialogOpen(true);
    handleMenuClose();
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuEmployee(null);
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
  //
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();

  const filteredProbation = searchQuery
    ? (items?.items || []).filter((option) =>
        option.firstName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items?.items || [];

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
  const isLoading = isCountsLoading || isListLoading;

  return (
    <Box>
      {!isLoading && !!counts?.approvalRequests && (
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
                  <TableCell>Probation Result</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(filteredProbation || []).map((employee: EmployeeDto) => {
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
                          .add(
                            employee?.job?.jobRole?.jobCatagory
                              ?.probationPeriodInDays ?? 0,
                            "day"
                          ) // Use fallback value of 0 if probationPeriod is undefined or null
                          .format("DD MMM YYYY")}
                      </TableCell>

                      {employee.probationResult !==
                        ProbationResult.BecomePermanent && (
                        <TableCell sx={{ color: "red" }}>
                          Contract Terminated
                        </TableCell>
                      )}
                      {employee.probationResult ===
                        ProbationResult.BecomePermanent && (
                        <TableCell>
                          <Box sx={{ color: "green" }}>
                            <Typography>Become Permanent</Typography>
                          </Box>
                        </TableCell>
                      )}

                      <TableCell>
                        <ProbationApproveOrRejectRequestButton
                          employee={employee}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
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

      {!isLoading && !counts?.approvalRequests && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Typography> No Data Available</Typography>
        </Box>
      )}
    </Box>
  );
};
