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
} from "../../../../../app/api/enums";
import dayjs from "dayjs";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  EmployeeReClassificationDto,
  useGetAllPromotionsQuery,
  useGetEmployeePromotionListQuery,
  useGetPromotionCountPerApprovalStatusQuery,
} from "../../../../../app/api";
import { EmployeeReClassificationDialog } from "../EmployeeReClassificationDialog";
import { ApproveReClassificationDialog } from "../ApproveReClassificationDialog";
import { RejectReClassificationDialog } from "../RejectReClassificationDialog";
import { EmployeeReClassificationUpdate } from "../EmployeeReClassificationUpdate";
import { SubmitReClassificationDialog } from "../SubmitReClassificationDialog";
import { useGetAllReClassificationsQuery } from "../../../../../app/store";
import { ReClassificationType } from "../../../../../app/api/enums";
import { usePermission } from "../../../../../hooks";
export const DraftReClassification = () => {
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
    status: EmployeeTransactionStatus.Draft,
    employeeId: employeeId,
  });
const permissions = usePermission();
  const [
    OpenEmployeeReClassificationDialog,
    setOpenEmployeeReClassificationDialog,
  ] = useState<boolean>(false);
  const [EmployeeReClassificationData, setEmployeeReClassificationData] =
    useState<number | undefined>();
  const [OpenUpdateDialog, setOpenUpdateDialog] = useState<boolean>();
  const [openSubmitDialog, setOpenSubmitDialog] = useState<boolean>();
  const [Submitted, setSubmittedId] = useState<number | undefined>();

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
  const closeSubmit = () => {
    setSubmittedId(undefined);
    setOpenSubmitDialog(false);
  };
  //
  const submitEmployeeReClassificationDialog = (id: number | undefined) => {
    setSubmittedId(id);
    setOpenSubmitDialog(true);
  };
  //
  return (
    <Box>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">
            Employee ReClassification Draft
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
                          ReClassification EndDate
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          JobRoleAfter
                        </TableCell>

                        <TableCell>Status</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Remark
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", Width: "400" }}>
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
                                    onClick={() =>
                                      UpdateEmployeeReClassificationDialog(
                                        EmployeeReClassificationList.id
                                      )
                                    }
                                    disabled={
                                      !permissions.CanCreateUpdateEmployeeActivity
                                    }
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      submitEmployeeReClassificationDialog(
                                        EmployeeReClassificationList.id
                                      )
                                    }
                                    disabled={
                                      !permissions.CanSubmitEmployeeActivity
                                    }
                                  >
                                    Submit
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
      {OpenUpdateDialog && EmployeeReClassificationData !== null && (
        <EmployeeReClassificationUpdate
          Id={EmployeeReClassificationData}
          onClose={UpdateDialogClose}
        />
      )}
      {openSubmitDialog && (
        <SubmitReClassificationDialog
          Id={Submitted}
          employeeId={employeeId}
          onClose={closeSubmit}
        />
      )}
    </Box>
  );
};
