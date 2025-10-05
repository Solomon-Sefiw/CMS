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
  useGetAllReClassificationsQuery,
} from "../../../../../app/api";
import { EmployeeReClassificationDialog } from "../EmployeeReClassificationDialog";
import { ApproveReClassificationDialog } from "../ApproveReClassificationDialog";
import { RejectReClassificationDialog } from "../RejectReClassificationDialog";
import { EmployeeReClassificationUpdate } from "../EmployeeReClassificationUpdate";
import { usePermission } from "../../../../../hooks";
export const RejectedReClassificationApprovalRequests = () => {
  const { id } = useParams<{ id: string }>();
  const employeeId = id ? Number(id) : NaN;
  const [pagination, setPagination] = useState<{
    pageNumber: number;
    pageSize?: number;
  }>({
    pageNumber: 0,
    pageSize: 10,
  });

  const {
    data: EmployeeReClassificationist,
    isLoading,
    error,
    refetch,
  } = useGetAllReClassificationsQuery({
    pageNumber: pagination.pageNumber + 1,
    pageSize: pagination.pageSize,
    status: EmployeeTransactionStatus.Rejected,
    employeeId: employeeId,
  });

  const [
    OpenEmployeeReClassificationDialog,
    setOpenEmployeeReClassificationDialog,
  ] = useState<boolean>(false);
const permissions = usePermission();
  const [EmployeeReClassificationData, setEmployeeReClassificationData] =
    useState<number | undefined>();
  const [OpenUpdateDialog, setOpenUpdateDialog] = useState<boolean>();
  const [approvedId, setApprovedId] = useState<number | undefined>();
  const [EmployeeId, setEmployeeId] = useState<number | undefined>();
  const [openApproveDialog, setOpenApproveDialog] = useState<boolean>();
  const [openRejectDialog, setOpenRejectDialog] = useState<boolean>();
  const [rejectId, setRejectId] = useState<number | undefined>();

  const closeDialog = () => {
    setOpenEmployeeReClassificationDialog(false);
    refetch();
  };
  //
  const UpdateDialogClose = () => {
    setEmployeeReClassificationData(undefined);
    setOpenUpdateDialog(false);
    refetch();
  };
  //
  const UpdateEmployeeReClassificationDialog = (id: number | undefined) => {
    setEmployeeReClassificationData(id);
    setOpenUpdateDialog(true);
  };
  //
  const ApproveReClassifcationDilogOpen = (
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
  const RejectReClassificationDialogOpen = (id: number, employeeId: number) => {
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
            Rejected Employee ReClassification
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            {EmployeeReClassificationist && (
              <Paper>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          JobRoleBefore
                        </TableCell>

                        <TableCell sx={{ fontWeight: "bold" }}>
                          ReClassification Type
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          ReClassification Date
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          ReClassification EndDate
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          JobRoleAfter
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
                      {(EmployeeReClassificationist?.items || []).map(
                        (
                          EmployeeReClassificationist: EmployeeReClassificationDto
                        ) => (
                          <Fragment key={EmployeeReClassificationist.id}>
                            <TableRow>
                              <TableCell>
                                {EmployeeReClassificationist.jobRoleBefore}
                              </TableCell>

                              <TableCell>
                                {ReClassificationType[
                                  EmployeeReClassificationist?.reClassificationType as unknown as keyof typeof ReClassificationType
                                ] ?? "Unknown type"}
                              </TableCell>

                              <TableCell>
                                {EmployeeReClassificationist.reClassificationDate
                                  ? dayjs(
                                      EmployeeReClassificationist?.reClassificationDate
                                    ).format("MMMM D, YYYY")
                                  : "-"}
                              </TableCell>
                              <TableCell>
                                {EmployeeReClassificationist.reClassificationEndDate
                                  ? dayjs(
                                      EmployeeReClassificationist?.reClassificationEndDate
                                    ).format("MMMM D, YYYY")
                                  : "-"}
                              </TableCell>
                              <TableCell>
                                {EmployeeReClassificationist.jobRoleAfter}
                              </TableCell>

                              <TableCell>
                                {EmployeeTransactionStatus[
                                  EmployeeReClassificationist?.transactionStatus as unknown as keyof typeof EmployeeTransactionStatus
                                ] ?? "Unknown Status"}
                              </TableCell>

                              <TableCell>
                                {EmployeeReClassificationist.remark}
                              </TableCell>
                              {EmployeeReClassificationist.transactionStatus ==
                                EmployeeTransactionStatus.Rejected && (
                                <TableCell>
                                  <Button
                                    onClick={() =>
                                      UpdateEmployeeReClassificationDialog(
                                        EmployeeReClassificationist.id
                                      )
                                    }
                                    disabled={
                                      !permissions.CanCreateUpdateEmployeeActivity
                                    }
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

            {!EmployeeReClassificationist && (
              <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                <Typography> No Data Available</Typography>
              </Box>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
      {OpenEmployeeReClassificationDialog && (
        <EmployeeReClassificationDialog onClose={closeDialog} />
      )}
      {OpenUpdateDialog && EmployeeReClassificationData !== null && (
        <EmployeeReClassificationUpdate
          Id={EmployeeReClassificationData}
          onClose={UpdateDialogClose}
        />
      )}
      {openRejectDialog && id !== undefined && employeeId !== undefined && (
        <RejectReClassificationDialog
          Id={rejectId}
          employeeId={employeeId}
          onClose={RejectDialogClose}
        />
      )}

      {openApproveDialog && id !== undefined && employeeId !== undefined && (
        <ApproveReClassificationDialog
          Id={approvedId}
          employeeId={employeeId}
          onClose={ApproveDialogClose}
        />
      )}
    </Box>
  );
};
