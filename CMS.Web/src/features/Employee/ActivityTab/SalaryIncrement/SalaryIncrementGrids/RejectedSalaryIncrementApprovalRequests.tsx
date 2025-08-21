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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useOutletContext, useParams } from "react-router-dom";
import { Fragment, useState } from "react";
import { Pagination } from "../../../../../components/Pagination";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  EmployeeTransactionStatus,
  PromotionType,
  ReClassificationType,
} from "../../../../../app/api/enums";
import dayjs from "dayjs";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  EmployeeReClassificationDto,
  EmployeeSalaryIncrementDto,
  useGetAllReClassificationsQuery,
  useGetAllSalaryIncrementListQuery,
} from "../../../../../app/api";
import { EmployeeSalaryIncrementDialog } from "../EmployeeSalaryIncrementDialog";
import { EmployeeSalaryIncrementUpdate } from "../EmployeeSalaryIncrementUpdate";
import { usePermission } from "../../../../../hooks";

export const RejectedSalaryIncrementApprovalRequests = () => {
  const { id } = useParams<{ id: string }>();
  const employeeId = id ? Number(id) : NaN;
  const [pagination, setPagination] = useState<{
    pageNumber: number;
    pageSize?: number;
  }>({
    pageNumber: 0,
    pageSize: 10,
  });
const permissions = usePermission();
  const {
    data: EmployeeSalaryIncrementList,
    isLoading,
    error,
    refetch,
  } = useGetAllSalaryIncrementListQuery({
    pageNumber: pagination.pageNumber + 1,
    pageSize: pagination.pageSize,
    status: EmployeeTransactionStatus.Rejected,
    employeeId: employeeId,
  });

  const [
    OpenEmployeeSalaryIncrementDialog,
    setOpenEmployeeSalaryIncrementDialog,
  ] = useState<boolean>(false);
  const [EmployeeSalaryIncrementData, setEmployeeSalaryIncrementData] =
    useState<number | undefined>();
  const [OpenUpdateDialog, setOpenUpdateDialog] = useState<boolean>();

  const closeDialog = () => {
    setOpenEmployeeSalaryIncrementDialog(false);
    refetch();
  };
  //
  const UpdateDialogClose = () => {
    setEmployeeSalaryIncrementData(undefined);
    setOpenUpdateDialog(false);
    refetch();
  };
  //
  const UpdateEmployeeSalaryIncrementDialog = (id: number | undefined) => {
    setEmployeeSalaryIncrementData(id);
    setOpenUpdateDialog(true);
  };
  //

  return (
    <Box>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            Rejected Employee Salary Increment
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            {EmployeeSalaryIncrementList && (
              <Paper>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          JobRole
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          SalaryIncrement Date
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          SalaryIncrement End Date
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Before Salary Settel On
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          After Salary Settel On
                        </TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Remark
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", Width: "300" }}>
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(EmployeeSalaryIncrementList?.items || []).map(
                        (
                          EmployeeSalaryIncrementList: EmployeeSalaryIncrementDto
                        ) => (
                          <Fragment key={EmployeeSalaryIncrementList.id}>
                            <TableRow>
                              <TableCell>
                                {EmployeeSalaryIncrementList.jobRole}
                              </TableCell>

                              <TableCell>
                                {EmployeeSalaryIncrementList.salaryIncrementDate
                                  ? dayjs(
                                      EmployeeSalaryIncrementList?.salaryIncrementDate
                                    ).format("MMMM D, YYYY")
                                  : "-"}
                              </TableCell>
                              <TableCell>
                                {EmployeeSalaryIncrementList.salaryIncrementEndDate
                                  ? dayjs(
                                      EmployeeSalaryIncrementList?.salaryIncrementEndDate
                                    ).format("MMMM D, YYYY")
                                  : "-"}
                              </TableCell>
                              <TableCell>
                                {EmployeeSalaryIncrementList?.beforeGradeSalaryStepId ===
                                0
                                  ? "Base Salary"
                                  : EmployeeSalaryIncrementList?.beforeGradeSalaryStepId ===
                                    10
                                  ? "Ceiling Salary"
                                  : `Step Salary - Step ${EmployeeSalaryIncrementList?.beforeGradeSalaryStepId}`}{" "}
                              </TableCell>
                              <TableCell>
                                {EmployeeSalaryIncrementList?.afterGradeSalaryStepId ===
                                0
                                  ? "Base Salary"
                                  : EmployeeSalaryIncrementList?.afterGradeSalaryStepId ===
                                    10
                                  ? "Ceiling Salary"
                                  : `Step Salary - Step ${EmployeeSalaryIncrementList?.afterGradeSalaryStepId}`}{" "}
                              </TableCell>
                              <TableCell>
                                {EmployeeTransactionStatus[
                                  EmployeeSalaryIncrementList?.transactionStatus as unknown as keyof typeof EmployeeTransactionStatus
                                ] ?? "Unknown Status"}
                              </TableCell>

                              <TableCell>
                                {EmployeeSalaryIncrementList.remark}
                              </TableCell>

                              <TableCell>
                                <Button
                                  onClick={() =>
                                    UpdateEmployeeSalaryIncrementDialog(
                                      EmployeeSalaryIncrementList.id
                                    )
                                  }
                                  disabled={
                                    !permissions.CanCreateUpdateEmployeeActivity
                                  }
                                >
                                  Edit
                                </Button>
                              </TableCell>
                            </TableRow>
                          </Fragment>
                        )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}

            {!EmployeeSalaryIncrementList && (
              <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                <Typography> No Data Available</Typography>
              </Box>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
      {OpenEmployeeSalaryIncrementDialog && (
        <EmployeeSalaryIncrementDialog onClose={closeDialog} />
      )}
      {OpenUpdateDialog && EmployeeSalaryIncrementData !== null && (
        <EmployeeSalaryIncrementUpdate
          Id={EmployeeSalaryIncrementData}
          onClose={UpdateDialogClose}
        />
      )}
    </Box>
  );
};
