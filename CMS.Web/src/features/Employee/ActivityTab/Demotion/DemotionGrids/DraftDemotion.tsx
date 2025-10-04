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
import { EmployeeTransactionStatus, DemotionType } from "../../../../../app/api/enums";
import dayjs from "dayjs";
import { EmployeeDemotionDto, useGetAllDemotionsQuery } from "../../../../../app/api/HCMSApi";
import { EmployeeDemotionUpdate } from '../EmployeeDemotionUpdate';
import { SubmitDemotionDialog } from "../SubmitDemotionDialog";
import { usePermission } from "../../../../../hooks";

export const DraftDemotion = () => {
  const { id } = useParams<{ id: string }>();
  const employeeId = id ? Number(id) : NaN;
  const [pagination] = useState({
    pageNumber: 0,
    pageSize: 10,
  });

  const { data: EmployeeDemotionList, refetch } = useGetAllDemotionsQuery({
    pageNumber: pagination.pageNumber + 1,
    pageSize: pagination.pageSize,
    status: EmployeeTransactionStatus.Draft,
    employeeId: employeeId,
  });
const permissions = usePermission();
  const [selectedDemotion, setSelectedDemotion] = useState<EmployeeDemotionDto | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [employeeDemotionData, setEmployeeDemotionData] = useState<number | undefined>();
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
  const [submitId, setSubmitId] = useState<number | undefined>();

  const handleViewDetails = (demotion: EmployeeDemotionDto) => {
    setSelectedDemotion(demotion);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedDemotion(null);
  };

  const updateDialogClose = () => {
    setEmployeeDemotionData(undefined);
    setOpenUpdateDialog(false);
    refetch();
  };

  const updateEmployeeDemotionDialog = (id: number | undefined) => {
    setEmployeeDemotionData(id);
    setOpenUpdateDialog(true);
  };

  const submitDemotionDialogOpen = (id: number | undefined) => {
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
            Draft Demotions
          </Typography>
          {EmployeeDemotionList?.items && EmployeeDemotionList.items.length > 0 && (
            <Badge
              badgeContent={EmployeeDemotionList.items.length}
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
                  {(EmployeeDemotionList?.items || []).map(
                    (demotion: EmployeeDemotionDto) => {
                      const statusColors = getStatusColor(demotion.transactionStatus as any);
                      return (
                        <Fragment key={demotion.id}>
                          <TableRow hover>
                            <TableCell>
                              {DemotionType[demotion?.demotionType as unknown as keyof typeof DemotionType] ?? "-"}
                            </TableCell>
                            <TableCell>
                              {demotion.demotionDate
                                ? dayjs(demotion.demotionDate).format("MMM D, YYYY")
                                : "-"}
                            </TableCell>
                            <TableCell>
                              {demotion.businessUnitAfter || demotion.businessUnitBefore || "-"}
                            </TableCell>
                            <TableCell>
                              {demotion.jobRoleAfter || demotion.jobRoleBefore || "-"}
                            </TableCell>
                            <TableCell>
                              {demotion.afterGradeSalaryStepId !== undefined 
                                ? `Step ${demotion.afterGradeSalaryStepId}`
                                : demotion.beforeGradeSalaryStepId !== undefined
                                  ? `Step ${demotion.beforeGradeSalaryStepId}`
                                  : "-"}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={
                                  EmployeeTransactionStatus[
                                    demotion?.transactionStatus as unknown as keyof typeof EmployeeTransactionStatus
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
                                    onClick={() => handleViewDetails(demotion)}
                                  >
                                    <VisibilityIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Button 
                                  variant="outlined" 
                                  size="small"
                                  onClick={() => updateEmployeeDemotionDialog(demotion.id)}
                                  sx={{ textTransform: 'none' }}
                                  disabled={!permissions.CanCreateUpdateEmployeeActivity}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="contained" 
                                  size="small"
                                  color="primary"
                                  onClick={() => submitDemotionDialogOpen(demotion.id)}
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

            {!EmployeeDemotionList?.items?.length && (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="textSecondary">No draft demotion records found</Typography>
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
            <Typography variant="h6" fontWeight="bold">
              Demotion Details
            </Typography>
            <IconButton onClick={closeViewModal}>
              <CloseIcon />
            </IconButton>
          </Box>

          {selectedDemotion && (
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <Card variant="outlined" sx={{ height: '100%', color:'darkblue' }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Before Demotion
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3}>
                      <div>
                        <Typography variant="caption" color="textSecondary">Business Unit</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedDemotion.businessUnitBefore || '-'}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="caption" color="textSecondary">Job Role</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedDemotion.jobRoleBefore || '-'}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="caption" color="textSecondary">Salary Step</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedDemotion.beforeGradeSalaryStepId === 0
                            ? "Base Salary"
                            : selectedDemotion.beforeGradeSalaryStepId === 10
                              ? "Ceiling Salary"
                              : `Step ${selectedDemotion.beforeGradeSalaryStepId}`}
                        </Typography>
                      </div>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={6}>
                <Card variant="outlined" sx={{ height: '100%', color:'darkblue' }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      After Demotion
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3}>
                      <div>
                        <Typography variant="caption" color="textSecondary">Business Unit</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedDemotion.businessUnitAfter || '-'}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="caption" color="textSecondary">Job Role</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedDemotion.jobRoleAfter || '-'}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="caption" color="textSecondary">Salary Step</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedDemotion.afterGradeSalaryStepId === 0
                            ? "Base Salary"
                            : selectedDemotion.afterGradeSalaryStepId === 10
                              ? "Ceiling Salary"
                              : `Step ${selectedDemotion.afterGradeSalaryStepId}`}
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
                      Demotion Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={3}>
                      <div>
                        <Typography variant="caption" color="textSecondary">Type</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {DemotionType[selectedDemotion?.demotionType as unknown as keyof typeof DemotionType] ?? '-'}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="caption" color="textSecondary">Demotion Date</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedDemotion.demotionDate
                            ? dayjs(selectedDemotion.demotionDate).format("MMM D, YYYY")
                            : '-'}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="caption" color="textSecondary">End Date</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedDemotion.demotionEndDate
                            ? dayjs(selectedDemotion.demotionEndDate).format("MMM D, YYYY")
                            : '-'}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="caption" color="textSecondary">Status</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {EmployeeTransactionStatus[selectedDemotion?.transactionStatus as unknown as keyof typeof EmployeeTransactionStatus] ?? '-'}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="caption" color="textSecondary">Remark</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedDemotion.remark || '-'}
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
      {openUpdateDialog && employeeDemotionData !== undefined && (
        <EmployeeDemotionUpdate
          Id={employeeDemotionData}
          onClose={updateDialogClose}
        />
      )}
      {openSubmitDialog && submitId !== undefined && (
        <SubmitDemotionDialog
          Id={submitId}
          employeeId={employeeId}
          onClose={submitDialogClose}
        />
      )}
    </Box>
  );
};