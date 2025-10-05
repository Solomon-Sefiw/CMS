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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dayjs from "dayjs";
import { EmployeeDemotionDialog } from "../EmployeeDemotionDialog";
import { EmployeeDemotionUpdate } from "../EmployeeDemotionUpdate";
import {
  EmployeeDemotionDto,
  useGetAllDemotionsQuery,
  useGetDemotionCountPerApprovalStatusQuery,
} from "../../../../../app/api/HCMSApi";
import { useGetEmployeeDemotionByIdQuery } from "../../../../../app/api/HCMSApi";
import { useGetEmployeeDemotionListQuery } from "../../../../../app/api/HCMSApi";
import { getEnumOptions } from "../../../../../components/form-controls/get-enum-list";
import {
  DemotionType,
  EmployeeTransactionStatus,
  PromotionType,
} from "../../../../../app/api/enums";
import { RejectDemotionDialog } from "../RejectDemotionDialog";
import { ApproveDemotionDialog } from "../ApproveDemotionDialog";
import { usePermission } from "../../../../../hooks";

export const RejectedDemotionApprovalRequests = () => {
  const { id } = useParams<{ id: string }>();
  const employeeId = id ? Number(id) : NaN;
  const { data: counts, isLoading: isCountsLoading } =
    useGetDemotionCountPerApprovalStatusQuery();
  const [pagination, setPagination] = useState<{
    pageNumber: number;
    pageSize?: number;
  }>({
    pageNumber: 0,
    pageSize: 10,
  });
const permissions = usePermission();
  const {
    data: EmployeeDemotionList,
    isLoading,
    error,
    refetch,
  } = useGetAllDemotionsQuery({
    pageNumber: pagination.pageNumber + 1,
    pageSize: pagination.pageSize,
    status: EmployeeTransactionStatus.Rejected,
    employeeId: employeeId,
  });

  const [OpenEmployeeDemotionDialog, setOpenEmployeeDemotionDialog] =
    useState<boolean>(false);

  const [EmployeeDemotionData, setEmployeeDemotionData] = useState<
    number | undefined
  >();
  const [OpenUpdateDialog, setOpenUpdateDialog] = useState<boolean>();
  const [approvedId, setApprovedId] = useState<number | undefined>();
  const [EmployeeId, setEmployeeId] = useState<number | undefined>();
  const [openApproveDialog, setOpenApproveDialog] = useState<boolean>();
  const [openRejectDialog, setOpenRejectDialog] = useState<boolean>();
  const [rejectId, setRejectId] = useState<number | undefined>();

  const closeDialog = () => {
    setOpenEmployeeDemotionDialog(false);
    refetch();
  };
  //
  const UpdateDialogClose = () => {
    setEmployeeDemotionData(undefined);
    setOpenUpdateDialog(false);
    refetch();
  };
  //
  const UpdateEmployeeDemotionDialog = (id: number | undefined) => {
    setEmployeeDemotionData(id);
    setOpenUpdateDialog(true);
  };
  //
  const ApproveDemotionDilogOpen = (
    id: number | undefined,
    employeeId: number | undefined
  ) => {
    setEmployeeId(employeeId);
    setApprovedId(id);
    setOpenApproveDialog(true);
  };
  const ApproveDialogClose = () => {
    setEmployeeId(undefined);
    setApprovedId(undefined);
    setOpenApproveDialog(false);
  };
  const RejectPromotionDialogOpen = (id: number, employeeId: number) => {
    setEmployeeId(employeeId);
    setRejectId(id);
    setOpenRejectDialog(true);
  };
  const RejectDialogClose = () => {
    setEmployeeId(undefined);
    setApprovedId(undefined);
    setOpenRejectDialog(false);
  };
  //
  return (
    <Box>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            Rejected Employee Demotion
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            {EmployeeDemotionList && (
              <Paper>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          BusinessUnitBefore
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          JobRoleBefore
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Salary Before
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Demotion Type
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Demotion Date
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Demotion End Date
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          JobRoleAfter
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          SalaryAfter
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          BusinessUnitAfter
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
                      {(EmployeeDemotionList?.items || []).map(
                        (EmployeeDemotionList: EmployeeDemotionDto) => (
                          <Fragment key={EmployeeDemotionList.id}>
                            <TableRow>
                              <TableCell>
                                {EmployeeDemotionList.businessUnitBefore}
                              </TableCell>
                              <TableCell>
                                {EmployeeDemotionList.jobRoleBefore}
                              </TableCell>
                              <TableCell>
                                {EmployeeDemotionList?.beforeGradeSalaryStepId ===
                                0
                                  ? "Base Salary of Job Grade"
                                  : EmployeeDemotionList?.beforeGradeSalaryStepId ===
                                    10
                                  ? "Ceiling Salary of Job Grade"
                                  : `Step Salary - Step ${EmployeeDemotionList?.beforeGradeSalaryStepId}`}
                              </TableCell>
                              <TableCell>
                                {DemotionType[
                                  EmployeeDemotionList?.demotionType as unknown as keyof typeof DemotionType
                                ] ?? "Unknown type"}
                              </TableCell>

                              <TableCell>
                                {EmployeeDemotionList.demotionDate
                                  ? dayjs(
                                      EmployeeDemotionList?.demotionDate
                                    ).format("MMMM D, YYYY")
                                  : "-"}
                              </TableCell>
                              <TableCell>
                                {EmployeeDemotionList.demotionEndDate
                                  ? dayjs(
                                      EmployeeDemotionList?.demotionEndDate
                                    ).format("MMMM D, YYYY")
                                  : "-"}
                              </TableCell>
                              <TableCell>
                                {EmployeeDemotionList.jobRoleAfter}
                              </TableCell>
                              <TableCell>
                                {EmployeeDemotionList?.afterGradeSalaryStepId ===
                                0
                                  ? "Base Salary of Job Grade"
                                  : EmployeeDemotionList?.afterGradeSalaryStepId ===
                                    10
                                  ? "Ceiling Salary of Job Grade"
                                  : `Step Salary - Step ${EmployeeDemotionList?.afterGradeSalaryStepId}`}
                              </TableCell>
                              <TableCell>
                                {EmployeeDemotionList.businessUnitAfter}
                              </TableCell>
                              <TableCell>
                                {EmployeeTransactionStatus[
                                  EmployeeDemotionList?.transactionStatus as unknown as keyof typeof EmployeeTransactionStatus
                                ] ?? "Unknown Status"}
                              </TableCell>

                              <TableCell>
                                {EmployeeDemotionList.remark}
                              </TableCell>
                              {EmployeeDemotionList.transactionStatus ==
                                EmployeeTransactionStatus.Rejected && (
                                <TableCell>
                                  <Button
                                    onClick={() =>
                                      UpdateEmployeeDemotionDialog(
                                        EmployeeDemotionList.id
                                      )
                                    }
                                    disabled={!permissions.CanCreateUpdateEmployeeActivity}

                                  >
                                    Edit
                                  </Button>
                                </TableCell>
                              )}
                            </TableRow>
                          </Fragment>
                        )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}

            {!EmployeeDemotionList && (
              <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                <Typography> No Data Available</Typography>
              </Box>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
      {OpenEmployeeDemotionDialog && (
        <EmployeeDemotionDialog onClose={closeDialog} />
      )}
      {OpenUpdateDialog && EmployeeDemotionData !== null && (
        <EmployeeDemotionUpdate
          Id={EmployeeDemotionData}
          onClose={UpdateDialogClose}
        />
      )}
    </Box>
  );
};
