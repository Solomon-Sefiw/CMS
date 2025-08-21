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
import { EmployeePromotionDialog } from "../EmployeePromotionDialog";
import { EmployeePromotionUpdate } from "../EmployeePromotionUpdate";
import { SubmitPromotionDialog } from "../SubmitPromotionDialog";
import { AppShortcutOutlined, TextIncreaseOutlined } from "@mui/icons-material";
import { usePermission } from "../../../../../../hooks";

export const DraftPromotion = () => {
  const { id } = useParams<{ id: string }>();
  const employeeId = id ? Number(id) : NaN;
  const [pagination] = useState({
    pageNumber: 0,
    pageSize: 10,
  });

  const { data: EmployeePromotionList, refetch } = useGetAllPromotionsQuery({
    pageNumber: pagination.pageNumber + 1,
    pageSize: pagination.pageSize,
    status: EmployeeTransactionStatus.Draft,
    employeeId: employeeId,
  });

  const [selectedPromotion, setSelectedPromotion] = useState<EmployeePromotionDto | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [openEmployeePromotionDialog, setOpenEmployeePromotionDialog] = useState(false);
  const [employeePromotionData, setEmployeePromotionData] = useState<number | undefined>();
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
  const [submitId, setSubmitId] = useState<number | undefined>();

  const handleViewDetails = (promotion: EmployeePromotionDto) => {
    setSelectedPromotion(promotion);
    setViewModalOpen(true);
  };
const permissions = usePermission();
  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedPromotion(null);
  };

  const closeDialog = () => {
    setOpenEmployeePromotionDialog(false);
    refetch();
  };

  const updateDialogClose = () => {
    setEmployeePromotionData(undefined);
    setOpenUpdateDialog(false);
    refetch();
  };

  const updateEmployeePromotionDialog = (id: number | undefined) => {
    setEmployeePromotionData(id);
    setOpenUpdateDialog(true);
  };

  const submitPromotionDialogOpen = (id: number | undefined) => {
    setSubmitId(id);
    setOpenSubmitDialog(true);
  };

  const submitDialogClose = () => {
    setSubmitId(undefined);
    setOpenSubmitDialog(false);
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
            Draft Promotions
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
                                  variant="outlined" 
                                  size="small"
                                  onClick={() => updateEmployeePromotionDialog(promotion.id)}
                                  sx={{ textTransform: 'none' }}
                                  disabled={!permissions.CanCreateUpdateEmployeeActivity}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="contained" 
                                  size="small"
                                  color="primary"
                                  onClick={() => submitPromotionDialogOpen(promotion.id)}
                                  sx={{ textTransform: 'none' }}
                                  disabled={!permissions.CanSubmitEmployeeActivity}
                                >
                                  Submit
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
                <Typography color="textSecondary">No draft promotion records found</Typography>
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
          overflowY: 'auto',
          color: 'darkblue'
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
           
            <Typography variant="h6" fontWeight="bold" >
              Promotion Details
            </Typography>
            <IconButton onClick={closeViewModal}>
              <CloseIcon />
            </IconButton>
          </Box>

          {selectedPromotion && (
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <Card variant="outlined" sx={{ height: '100%', color:'darkblue' }}>
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
                <Card variant="outlined" sx={{ height: '100%' ,color:'darkblue' }}>
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
                <Card variant="outlined" sx={{color:'darkblue'}}>
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

      {/* Other Dialogs */}
      {openEmployeePromotionDialog && (
        <EmployeePromotionDialog onClose={closeDialog} />
      )}
      {openUpdateDialog && employeePromotionData !== undefined && (
        <EmployeePromotionUpdate
          Id={employeePromotionData}
          onClose={updateDialogClose}
        />
      )}
      {openSubmitDialog && submitId !== undefined && (
        <SubmitPromotionDialog
          Id={submitId}
          employeeId={employeeId}
          onClose={submitDialogClose}
        />
      )}
    </Box>
  );
};