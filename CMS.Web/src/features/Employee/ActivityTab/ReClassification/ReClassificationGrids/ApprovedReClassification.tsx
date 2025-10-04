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
  useGetEmployeeReClassificationListQuery,
} from "../../../../../app/api";
import { EmployeeReClassificationDialog } from "../EmployeeReClassificationDialog";
import { ApproveReClassificationDialog } from "../ApproveReClassificationDialog";
import { RejectReClassificationDialog } from "../RejectReClassificationDialog";
import { EmployeeReClassificationUpdate } from "../EmployeeReClassificationUpdate";
import { usePermission } from "../../../../../hooks";
export const ApprovedReClassification = () => {
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
    data: EmployeeReClassificationList,
    isLoading,
    error,
    refetch,
  } = useGetAllReClassificationsQuery({
    pageNumber: pagination.pageNumber + 1,
    pageSize: pagination.pageSize,
    status: EmployeeTransactionStatus.Approved,
    employeeId: employeeId,
  });

  const [
    OpenEmployeeReClassificationDialog,
    setOpenEmployeeReClassificationDialog,
  ] = useState<boolean>(false);

  const [EmployeeReClassiifcationData, setEmployeeReClassificationData] =
    useState<number | undefined>();
  const [OpenUpdateDialog, setOpenUpdateDialog] = useState<boolean>();
  const [approvedId, setApprovedId] = useState<number | undefined>();
  const [EmployeeId, setEmployeeId] = useState<number | undefined>();
  const [openApproveDialog, setOpenApproveDialog] = useState<boolean>();
  const [openRejectDialog, setOpenRejectDialog] = useState<boolean>();
  const [rejectId, setRejectId] = useState<number | undefined>();
  const permissions = usePermission();
  //
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
  const ApproveReClassificationDilogOpen = (
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
  const RejectReClassifcationDialogOpen = (id: number, employeeId: number) => {
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
            Approved Employee ReClassification
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            {EmployeeReClassificationList && (
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
                          ReClassificationDate
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
                      {(EmployeeReClassificationList?.items || []).map(
                        (
                          EmployeeReClassificationList: EmployeeReClassificationDto
                        ) => (
                          <Fragment key={EmployeeReClassificationList.id}>
                            <TableRow>
                              <TableCell>
                                {EmployeeReClassificationList.jobRoleBefore}
                              </TableCell>

                              <TableCell>
                                {ReClassificationType[
                                  EmployeeReClassificationList?.reClassificationType as unknown as keyof typeof ReClassificationType
                                ] ?? "Unknown type"}
                              </TableCell>

                              <TableCell>
                                {EmployeeReClassificationList.reClassificationDate
                                  ? dayjs(
                                      EmployeeReClassificationList?.reClassificationDate
                                    ).format("MMMM D, YYYY")
                                  : "-"}
                              </TableCell>
                              <TableCell>
                                {EmployeeReClassificationList.reClassificationEndDate
                                  ? dayjs(
                                      EmployeeReClassificationList?.reClassificationEndDate
                                    ).format("MMMM D, YYYY")
                                  : "-"}
                              </TableCell>
                              <TableCell>
                                {EmployeeReClassificationList.jobRoleAfter}
                              </TableCell>

                              <TableCell>
                                {EmployeeTransactionStatus[
                                  EmployeeReClassificationList?.transactionStatus as unknown as keyof typeof EmployeeTransactionStatus
                                ] ?? "Unknown Status"}
                              </TableCell>

                              <TableCell>
                                {EmployeeReClassificationList.remark}
                              </TableCell>
                              {EmployeeReClassificationList.transactionStatus ==
                                EmployeeTransactionStatus.Draft && (
                                <TableCell>
                                  <Button
                                    onClick={() => {
                                      if (
                                        EmployeeReClassificationList.id !==
                                          undefined &&
                                        EmployeeReClassificationList.employeeId !==
                                          undefined
                                      ) {
                                        ApproveReClassificationDilogOpen(
                                          EmployeeReClassificationList.id,
                                          EmployeeReClassificationList.employeeId
                                        );
                                      }
                                    }}
                                    disabled={!permissions.CanApproveRejectEmployeeActivity}
                                  >
                                    Approve
                                  </Button>

                                  <Button
                                    onClick={() => {
                                      if (
                                        EmployeeReClassificationList.id !==
                                          undefined &&
                                        EmployeeReClassificationList.employeeId !==
                                          undefined
                                      ) {
                                        RejectReClassifcationDialogOpen(
                                          EmployeeReClassificationList.id,
                                          EmployeeReClassificationList.employeeId
                                        );
                                      }
                                    }}
                                    disabled={!permissions.CanApproveRejectEmployeeActivity}
                                  >
                                    Reject
                                  </Button>

                                  <Button
                                    onClick={() =>
                                      UpdateEmployeeReClassificationDialog(
                                        EmployeeReClassificationList.id
                                      )
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

            {!EmployeeReClassificationList && (
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
      {OpenUpdateDialog && EmployeeReClassiifcationData !== null && (
        <EmployeeReClassificationUpdate
          Id={EmployeeReClassiifcationData}
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
