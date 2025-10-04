import React, { Fragment, useState } from "react";
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Modal,
  Grid,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
  Badge,
  Chip,
  Stack
} from "@mui/material";
import { useParams } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { EmployeeTransactionStatus, PromotionType } from "../../../../../../app/api/enums";
import dayjs from "dayjs";
import { EmployeePromotionDto, useGetAllPromotionsQuery } from "../../../../../../app/api";
import { ApprovePromotionDialog } from "../ApprovePromotionDialog";
import { RejectPromotionDialog } from "../RejectPromotionDialog";
import { usePermission } from "../../../../../../hooks";

export const PromotionApprovalRequests = () => {
  const { id } = useParams<{ id: string }>();
  const employeeId = id ? Number(id) : NaN;
  const [pagination] = useState({
    pageNumber: 0,
    pageSize: 10,
  });

  const { data: EmployeePromotionList, refetch } = useGetAllPromotionsQuery({
    pageNumber: pagination.pageNumber + 1,
    pageSize: pagination.pageSize,
    status: EmployeeTransactionStatus.Submitted,
    employeeId: employeeId
  });
const permissions = usePermission();
  const [selectedPromotion, setSelectedPromotion] = useState<EmployeePromotionDto | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [approvedId, setApprovedId] = useState<number | undefined>();
  const [employeeIdState, setEmployeeIdState] = useState<number | undefined>();
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectId, setRejectId] = useState<number | undefined>();

  const handleViewDetails = (promotion: EmployeePromotionDto) => {
    setSelectedPromotion(promotion);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedPromotion(null);
  };

  const approvePromotionDialogOpen = (id: number | undefined, empId: number | undefined) => {
    setEmployeeIdState(empId);
    setApprovedId(id);
    setOpenApproveDialog(true);
  };

  const approveDialogClose = () => {
    setEmployeeIdState(undefined);
    setApprovedId(undefined);
    setOpenApproveDialog(false);
    refetch();
  };

  const rejectPromotionDialogOpen = (id: number | undefined, empId: number | undefined) => {
    setEmployeeIdState(empId);
    setRejectId(id);
    setOpenRejectDialog(true);
  };

  const rejectDialogClose = () => {
    setEmployeeIdState(undefined);
    setRejectId(undefined);
    setOpenRejectDialog(false);
    refetch();
  };

  const getStatusColor = (status: EmployeeTransactionStatus) => {
    switch (status) {
      case EmployeeTransactionStatus.Approved:
        return { bgcolor: '#e8f5e9', color: '#2e7d32' };
      case EmployeeTransactionStatus.Submitted:
        return { bgcolor: '#e3f2fd', color: '#1565c0' };
      case EmployeeTransactionStatus.Rejected:
        return { bgcolor: '#ffebee', color: '#c62828' };
      case EmployeeTransactionStatus.Draft:
        return { bgcolor: '#fff8e1', color: '#ff8f00' };
      default:
        return { bgcolor: '#f5f5f5', color: '#424242' };
    }
  };

  return (
    <Box>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" fontWeight="bold">
            Promotion Approval Requests
          </Typography>
          {EmployeePromotionList?.items && EmployeePromotionList.items.length > 0 && (
            <Badge
              badgeContent={EmployeePromotionList.items.length}
              color="primary"
              sx={{ ml: 2 }}
            />
          )}
        </AccordionSummary>
        <AccordionDetails>
          <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <TableContainer>
              <Table size="small" sx={{ minWidth: 800 }}>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Business Unit</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Job Role</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Salary</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: 180 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(EmployeePromotionList?.items || []).map(
                    (promotion: EmployeePromotionDto) => {
                      const statusColors = getStatusColor(promotion.transactionStatus as any);
                      return (
                        <Fragment key={promotion.id}>
                          <TableRow hover>
                            <TableCell>
                              {PromotionType[promotion?.promotionType as unknown as keyof typeof PromotionType] ?? "-"}
                            </TableCell>
                            <TableCell>
                              {promotion.promotionDate
                                ? dayjs(promotion.promotionDate).format("MMM D, YYYY")
                                : "-"}
                            </TableCell>
                            <TableCell>
                              {promotion.businessUnitAfter || promotion.businessUnitBefore || "-"}
                            </TableCell>
                            <TableCell>
                              {promotion.jobRoleAfter || promotion.jobRoleBefore || "-"}
                            </TableCell>
                            <TableCell>
                              {promotion.afterGradeSalaryStepId !== undefined 
                                ? `Step ${promotion.afterGradeSalaryStepId}`
                                : promotion.beforeGradeSalaryStepId !== undefined
                                  ? `Step ${promotion.beforeGradeSalaryStepId}`
                                  : "-"}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={
                                  EmployeeTransactionStatus[
                                    promotion?.transactionStatus as unknown as keyof typeof EmployeeTransactionStatus
                                  ] ?? "-"
                                }
                                sx={{
                                  backgroundColor: statusColors.bgcolor,
                                  color: statusColors.color,
                                  fontWeight: 500
                                }}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={1}>
                                <Tooltip title="View Details">
                                  <IconButton 
                                    size="small" 
                                    color="primary"
                                    onClick={() => handleViewDetails(promotion)}
                                  >
                                    <VisibilityIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Button 
                                  variant="contained" 
                                  size="small"
                                  color="success"
                                  onClick={() => {
                                    if (promotion.id !== undefined && promotion.employeeId !== undefined) {
                                      approvePromotionDialogOpen(promotion.id, promotion.employeeId);
                                    }
                                  }}
                                  sx={{ textTransform: 'none' }}
                                  disabled={!permissions.CanApproveRejectEmployeeActivity}  
                                >
                                  Approve
                                </Button>
                                <Button 
                                  variant="outlined" 
                                  size="small"
                                  color="error"
                                  onClick={() => {
                                    if (promotion.id !== undefined && promotion.employeeId !== undefined) {
                                      rejectPromotionDialogOpen(promotion.id, promotion.employeeId);
                                    }
                                  }}
                                  sx={{ textTransform: 'none' }}
                                  disabled={!permissions.CanApproveRejectEmployeeActivity}
                                >
                                  Reject
                                </Button>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        </Fragment>
                      );
                    }
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {!EmployeePromotionList?.items?.length && (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="textSecondary">No pending approval promotion records found</Typography>
              </Box>
            )}
          </Paper>
        </AccordionDetails>
      </Accordion>

      {/* View Details Modal */}
      <Modal open={viewModalOpen} onClose={closeViewModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxWidth: 1000,
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight="bold">
              Promotion Details
            </Typography>
            <IconButton onClick={closeViewModal}>
              <CloseIcon />
            </IconButton>
          </Box>

          {selectedPromotion && (
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Before Promotion
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3}>
                      <div>
                        <Typography variant="caption" color="textSecondary">Business Unit</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedPromotion.businessUnitBefore || '-'}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="caption" color="textSecondary">Job Role</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedPromotion.jobRoleBefore || '-'}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="caption" color="textSecondary">Salary Step</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedPromotion.beforeGradeSalaryStepId === 0
                            ? "Base Salary"
                            : selectedPromotion.beforeGradeSalaryStepId === 10
                              ? "Ceiling Salary"
                              : `Step ${selectedPromotion.beforeGradeSalaryStepId}`}
                        </Typography>
                      </div>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={6}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      After Promotion
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3}>
                      <div>
                        <Typography variant="caption" color="textSecondary">Business Unit</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedPromotion.businessUnitAfter || '-'}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="caption" color="textSecondary">Job Role</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedPromotion.jobRoleAfter || '-'}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="caption" color="textSecondary">Salary Step</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedPromotion.afterGradeSalaryStepId === 0
                            ? "Base Salary"
                            : selectedPromotion.afterGradeSalaryStepId === 10
                              ? "Ceiling Salary"
                              : `Step ${selectedPromotion.afterGradeSalaryStepId}`}
                        </Typography>
                      </div>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Promotion Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={3}>
                      <div>
                        <Typography variant="caption" color="textSecondary">Type</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {PromotionType[selectedPromotion?.promotionType as unknown as keyof typeof PromotionType] ?? '-'}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="caption" color="textSecondary">Promotion Date</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedPromotion.promotionDate
                            ? dayjs(selectedPromotion.promotionDate).format("MMM D, YYYY")
                            : '-'}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="caption" color="textSecondary">End Date</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedPromotion.promotionEndDate
                            ? dayjs(selectedPromotion.promotionEndDate).format("MMM D, YYYY")
                            : '-'}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="caption" color="textSecondary">Status</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {EmployeeTransactionStatus[selectedPromotion?.transactionStatus as unknown as keyof typeof EmployeeTransactionStatus] ?? '-'}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="caption" color="textSecondary">Remark</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedPromotion.remark || '-'}
                        </Typography>
                      </div>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>
      </Modal>

      {/* Approve Dialog */}
      {openApproveDialog && approvedId !== undefined && employeeIdState !== undefined && (
        <ApprovePromotionDialog
          Id={approvedId}
          employeeId={employeeIdState}
          onClose={approveDialogClose}
        />
      )}

      {/* Reject Dialog */}
      {openRejectDialog && rejectId !== undefined && employeeIdState !== undefined && (
        <RejectPromotionDialog
          Id={rejectId}
          employeeId={employeeIdState}
          onClose={rejectDialogClose}
        />
      )}
    </Box>
  );
};