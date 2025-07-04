import React, { useState } from "react";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import NumbersIcon from '@mui/icons-material/Numbers';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import ApartmentIcon from '@mui/icons-material/Apartment';
import GroupIcon from '@mui/icons-material/Group';
import BadgeIcon from '@mui/icons-material/Badge';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SchoolIcon from '@mui/icons-material/School';
import CategoryIcon from '@mui/icons-material/Category';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Tooltip } from "@mui/material";
import LaunchIcon from '@mui/icons-material/Launch';

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Badge,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  PendingActions,
  Business,
  Work,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useGetAllApprovalItemsListQuery, useGetAllEmployeesByStatusQuery, useGetApprovalStatusSummaryQuery, useGetAwardCountPerStatusQuery, useGetBenefitCountPerStatusQuery, useGetBenefitUnitPriceCountPerStatusQuery, useGetBenefitValueCountPerStatusQuery, useGetBusinessUnitCountPerApprovalStatusQuery, useGetEducationLevelCountPerStatusQuery, useGetInstitutionNameCountPerStatusQuery, useGetJobCountPerStatusQuery, useGetJobRoleCategoryCountPerStatusQuery, useGetJobRolesCountPerApprovalStatusQuery, useGetSubCityCountPerStatusQuery } from "../../app/api/HCMSApi";
import { Pagination } from "../../components/Pagination";
import { usePermission } from "../../hooks";

const ApprovalDashboard = () => {
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 10,
  });

  const permissions = usePermission();

  type ApprovalStatusSummaryDto = {
    status: number;
    totalCount: number;
  };

  interface ApprovalItemDto {
    id: string;
    module: string;
    title: string;
    submittedBy: string;
    submittedDate: Date;
    status: number;
    details: string;
  }

  interface PaginatedApprovalResult {
    items: ApprovalItemDto[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  }

  const {
    data: approvalStatusSummaryData = [],
    isLoading: isApprovalStatusSummaryLoading,
  } = useGetApprovalStatusSummaryQuery() as {
    data: ApprovalStatusSummaryDto[];
    isLoading: boolean;
    error: unknown;
  };

   const {
    data: approvalItemsListData,
  } = useGetAllApprovalItemsListQuery({
    pageNumber: pagination.pageNumber + 1,
    pageSize: pagination.pageSize,
  }) as {
    data: PaginatedApprovalResult;
    isLoading: boolean;
    error: unknown;
  };

  const { data: BusinessUnitCounts } =
    useGetBusinessUnitCountPerApprovalStatusQuery();
  const { data: JobCounts } =
    useGetJobCountPerStatusQuery();
  const { data: JobRoleCounts } =
    useGetJobRolesCountPerApprovalStatusQuery();
  const { data: JobRoleCatagoriesCounts } =
    useGetJobRoleCategoryCountPerStatusQuery();
  const { data: UnitPriceCounts } =
    useGetBenefitUnitPriceCountPerStatusQuery();
  const { data: BenefitValueCounts } =
    useGetBenefitValueCountPerStatusQuery();
  const { data: BenefitCounts } =
    useGetBenefitCountPerStatusQuery();
  const { data: SubCityCounts } =
    useGetSubCityCountPerStatusQuery();
  const { data: InstitutionCounts } =
    useGetInstitutionNameCountPerStatusQuery();
  const { data: EducatonLevelCounts } =
    useGetEducationLevelCountPerStatusQuery();
  const { data: AwardCounts } =
    useGetAwardCountPerStatusQuery();
  const { data: EmployeeCounts } =
    useGetAllEmployeesByStatusQuery();

  const totalSubmittedEmployees = EmployeeCounts?.submitted?.length ?? 0;
  const totalApprovedEmployees = EmployeeCounts?.approved?.length ?? 0;
  const totalRejectedEmployees = EmployeeCounts?.rejected?.length ?? 0;

  const moduleStats = [
    { name: "Employee Profile", pending: totalSubmittedEmployees, approved: totalApprovedEmployees, rejected: totalRejectedEmployees, permission: permissions.canViewEmployeePersonalInfo },
    { name: "Business Unit", pending: BusinessUnitCounts?.approvalRequests, approved: BusinessUnitCounts?.approved, rejected: BusinessUnitCounts?.rejected, permission: permissions.canViewSetup && (permissions.canCreateUpdateSetup || permissions.canApproveRejectSetup) },
    { name: "Job", pending: JobCounts?.approvalRequests, approved: JobCounts?.approved, rejected: JobCounts?.rejected, permission: permissions.canViewSetup && (permissions.canCreateUpdateSetup || permissions.canApproveRejectSetup) },
    { name: "Job Role", pending: JobRoleCounts?.approvalRequests, approved: JobRoleCounts?.approved, rejected: JobRoleCounts?.rejected, permission: permissions.canViewSetup && (permissions.canCreateUpdateSetup || permissions.canApproveRejectSetup) },
    { name: "JobRole Cat", pending: JobRoleCatagoriesCounts?.submitted, approved: JobRoleCatagoriesCounts?.approved, rejected: JobRoleCatagoriesCounts?.rejected, permission: permissions.canViewSetup && (permissions.canCreateUpdateSetup || permissions.canApproveRejectSetup) },
    { name: "Unit Price", pending: UnitPriceCounts?.approvalRequests, approved: UnitPriceCounts?.approved, rejected: UnitPriceCounts?.rejected, permission: permissions.canViewSetup && (permissions.canCreateUpdateSetup || permissions.canApproveRejectSetup) },
    { name: "Benefit Value", pending: BenefitValueCounts?.approvalRequests, approved: BenefitValueCounts?.approved, rejected: BenefitValueCounts?.rejected, permission: permissions.canViewSetup && (permissions.canCreateUpdateSetup || permissions.canApproveRejectSetup) },
    { name: "Benefit", pending: BenefitCounts?.approvalRequests, approved: BenefitCounts?.approved, rejected: BenefitCounts?.rejected, permission: permissions.canViewSetup && (permissions.canCreateUpdateSetup || permissions.canApproveRejectSetup) },
    { name: "Sub-City", pending: SubCityCounts?.submitted, approved: SubCityCounts?.approved, rejected: SubCityCounts?.rejected, permission: permissions.canViewSetup && (permissions.canCreateUpdateSetup || permissions.canApproveRejectSetup) },
    { name: "Institiution", pending: InstitutionCounts?.submitted, approved: InstitutionCounts?.approved, rejected: InstitutionCounts?.rejected, permission: permissions.canViewSetup && (permissions.canCreateUpdateSetup || permissions.canApproveRejectSetup) },
    { name: "EducationLevel", pending: EducatonLevelCounts?.submitted, approved: EducatonLevelCounts?.approved, rejected: EducatonLevelCounts?.rejected, permission: permissions.canViewSetup && (permissions.canCreateUpdateSetup || permissions.canApproveRejectSetup) },
    { name: "Award", pending: AwardCounts?.submitted, approved: AwardCounts?.approved, rejected: AwardCounts?.rejected, permission: permissions.canViewSetup && (permissions.canCreateUpdateSetup || permissions.canApproveRejectSetup) },
  ];

  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Helper function to get permission for a module
  const getModulePermission = (module: string): boolean => {
    switch (module) {
      case "Employee Profile":
      case "Employees":
        return permissions.canViewEmployeePersonalInfo && permissions.CanCreateOrUpdateEmployeeInfo;
      case "Business Unit":
      case "BusinessUnit":
        return permissions.canViewSetup && permissions.canCreateUpdateSetup;
      case "Job":
        return permissions.canViewSetup && permissions.canCreateUpdateSetup;
      case "Job Role":
      case "JobRole":
        return permissions.canViewSetup && permissions.canCreateUpdateSetup;
      case "Job-role-category":
      case "JobRole Cat":
        return permissions.canViewSetup && permissions.canCreateUpdateSetup;
      case "Benefit-unit-price":
      case "Unit Price":
        return permissions.canViewSetup && permissions.canCreateUpdateSetup;
      case "Benefit-value":
      case "Benefit Value":
        return permissions.canViewSetup && permissions.canCreateUpdateSetup;
      case "Benefit":
        return permissions.canViewSetup && permissions.canCreateUpdateSetup;
      case "Sub-city":
      case "Sub-City":
        return permissions.canViewSetup && permissions.canCreateUpdateSetup;
      case "Institution-name":
      case "Institiution":
        return permissions.canViewSetup && permissions.canCreateUpdateSetup;
      case "Education-level":
      case "EducationLevel":
        return permissions.canViewSetup && permissions.canCreateUpdateSetup;
      case "Award":
        return permissions.canViewSetup;
      default:
        return false; // Default to no permission if module isn't explicitly handled
    }
  };


  const getModuleIcon = (module: string, hasPermission: boolean) => {
    const iconProps = {
      sx: {
        fontSize: 30,
        color: hasPermission ? "#3F51B9" : "text.disabled", 
        cursor: hasPermission ? "pointer" : "not-allowed", 
      },
      onClick: hasPermission ? () => handleNavigation(
        // Determine the correct path based on the module
        module === "Employee Profile" || module === "Employees" ? "/employees" :
          module === "Business Unit" || module === "BusinessUnit" ? "/businessunit" :
            module === "Job" ? "/job" :
              module === "Job Role" || module === "JobRole" ? "/jobrole" :
                module === "JobRole Cat" || module === "Job-role-category" ? "/job-role-category" :
                  module === "Unit Price" || module === "Benefit-unit-price" ? "/benefit-unit-price" :
                    module === "Benefit Value" || module === "Benefit-value" ? "/benefit-value" :
                      module === "Benefit" ? "/benefit" :
                        module === "Sub-City" || module === "Sub-city" ? "/sub-city" :
                          module === "Institiution" || module === "Institution-name" ? "/institution-name" :
                            module === "Education-level" || module === "EducationLevel" ? "/education-level" :
                              module === "Award" ? "/award" : ""
      ) : undefined, // No onClick if no permission
    };

    switch (module) {
      case "Employee Profile":
      case "Employees":
        return <GroupIcon {...iconProps} />;
      case "Business Unit":
      case "BusinessUnit":
        return <Business {...iconProps} />;
      case "Job":
        return <Work {...iconProps} />;
      case "Job Role":
      case "JobRole":
        return <BadgeIcon {...iconProps} />;
      case "JobRole Cat":
      case "Job-role-category":
        return <CategoryIcon {...iconProps} />;
      case "Unit Price":
      case "Benefit-unit-price":
        return <MonetizationOnIcon {...iconProps} />;
      case "Benefit Value":
      case "Benefit-value":
        return <NumbersIcon {...iconProps} />;
      case "Benefit":
        return <CardGiftcardIcon {...iconProps} />;
      case "Sub-City":
      case "Sub-city":
        return <ApartmentIcon {...iconProps} />;
      case "Institiution":
      case "Institution-name":
        return <AccountBalanceIcon {...iconProps} />;
      case "Education-level":
      case "EducationLevel":
        return <SchoolIcon {...iconProps} />;
      case "Award":
        return <EmojiEventsIcon {...iconProps} />;
      default:
        return <Work color="inherit" />;
    }
  };

  const getStatusChip = (status: number) => {
    switch (status) {
      case 2:
        return (
          <Chip
            icon={<PendingActions />}
            label="Pending"
            color="warning"
            variant="outlined"
          />
        );
      case 4:
        return (
          <Chip
            icon={<CheckCircle />}
            label="Approved"
            color="success"
            variant="outlined"
          />
        );
      case 3:
        return (
          <Chip
            icon={<Cancel />}
            label="Rejected"
            color="error"
            variant="outlined"
          />
        );
      default:
        return <Chip label={status} variant="outlined" />;
    }
  };

  const handleItemClick = (item: ApprovalItemDto) => {
    const hasPermission = getModulePermission(item.module); // Use the new helper function
    if (hasPermission) {
      navigate(`/${item.module.toLowerCase()}/approval-requests`);
    }
  };

  // Filter the approval items based on permissions
  const filteredApprovalItems = approvalItemsListData?.items?.filter(item =>
    getModulePermission(item.module)
  ) || [];

  return (
    <Box sx={{ p: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
      </Box>

      {permissions.CanViewAllApprovalSummaries && (
        <Grid>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography sx={{ color: '#3F51B9' }}>Pending Approvals</Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {isApprovalStatusSummaryLoading
                          ? "Loading..."
                          : approvalStatusSummaryData?.find((item) => item.status === 2)?.totalCount ?? 0}
                      </Typography>
                      <Typography variant="body2" color="warning.main">
                        Requires your attention
                      </Typography>
                    </Box>
                    <Badge
                      badgeContent={
                        isApprovalStatusSummaryLoading
                          ? 0
                          : approvalStatusSummaryData?.find((item) => item.status === 2)?.totalCount ?? 0
                      }
                      color="warning"
                      max={99}
                    >
                      <PendingActions sx={{ fontSize: 40, color: "#FFA726" }} />
                    </Badge>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography sx={{ color: '#3F51B9' }}>Approved Items</Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {isApprovalStatusSummaryLoading
                          ? "Loading..."
                          : approvalStatusSummaryData?.find((item) => item.status === 4)?.totalCount ?? 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        This month
                      </Typography>
                    </Box>
                    <Badge
                      badgeContent={
                        isApprovalStatusSummaryLoading
                          ? 0
                          : approvalStatusSummaryData?.find((item) => item.status === 4)?.totalCount ?? 0
                      }
                      color="success"
                      max={999}
                    >
                      <CheckCircle sx={{ fontSize: 40, color: "#66BB6A" }} />
                    </Badge>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography sx={{ color: '#3F51B9' }}>Rejected Items</Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {isApprovalStatusSummaryLoading
                          ? "Loading..."
                          : approvalStatusSummaryData?.find((item) => item.status === 3)?.totalCount ?? 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        This month
                      </Typography>
                    </Box>
                    <Badge
                      badgeContent={
                        isApprovalStatusSummaryLoading
                          ? 0
                          : approvalStatusSummaryData?.find((item) => item.status === 3)?.totalCount ?? 0
                      }
                      color="error"
                      max={99}
                    >
                      <Cancel sx={{ fontSize: 40, color: "#EF5350" }} />
                    </Badge>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold" color={"primary.dark"}>
                Approvals by Module
              </Typography>
              <Grid container spacing={2}>
                {moduleStats.map((stat, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
                    <Paper sx={{ p: 2, textAlign: "center" }}>
                      <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                        {getModuleIcon(stat.name, stat.permission)}
                      </Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {stat.name}
                      </Typography>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                        <Typography variant="body2" color="warning.main" sx={{ mr: 0.5 }} >
                          {stat.pending} Pending
                        </Typography>
                        <Typography variant="body2" color="success.main" sx={{ mr: 0.5 }}>
                          {stat.approved} Approved
                        </Typography>
                        <Typography variant="body2" color="error.main" sx={{ mr: 0.5 }} >
                          {stat.rejected} Rejected
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      )}

      {permissions.CanViewAllApprovalRequestGrid && (
        <Grid>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight="bold" color={"primary.dark"}>
                  Recent Approval Requests
                </Typography>
              </Box>

              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Module</TableCell>
                      <TableCell>Request</TableCell>
                      <TableCell>Submitted By</TableCell>
                      <TableCell>Submission Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Details</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Use the filteredApprovalItems here */}
                    {filteredApprovalItems.map((item) => (
                      <TableRow
                        key={item.id}
                        hover
                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      >
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {getModuleIcon(item.module, true)}
                            {item.module}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight="bold">{item.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.id}
                          </Typography>
                        </TableCell>
                        <TableCell>{item.submittedBy}</TableCell>
                        <TableCell>
                          {new Date(item.submittedDate).toLocaleDateString("en-GB")}
                        </TableCell>
                        <TableCell>{getStatusChip(item.status)}</TableCell>
                        <TableCell>
                          <Typography variant="body2">{item.details}</Typography>
                        </TableCell>
                        <TableCell>
                          <Tooltip
                            title="Go to approval page"
                            arrow
                            componentsProps={{
                              tooltip: {
                                sx: {
                                  bgcolor: 'info.main',
                                  color: 'white',
                                  fontSize: 13,
                                },
                              },
                            }}
                          >
                            <IconButton
                              onClick={() => handleItemClick(item)}
                              aria-label="view details"
                              // Disable the IconButton based on permission
                              disabled={!getModulePermission(item.module)} // Use the new helper function
                            >
                              <LaunchIcon sx={{ color: '#3F51B9' }} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Display a message if no items are visible after filtering */}
                    {filteredApprovalItems.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          No approval requests to display or you don't have permission to view them.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          <Pagination
            pageNumber={pagination.pageNumber}
            pageSize={pagination.pageSize}
            onChange={setPagination}
            totalRowsCount={filteredApprovalItems.length || 0} // Keep original totalCount for server-side pagination
            rowsPerPageOptions={[10, 20, 50]}
          />
        </Grid>
      )}
    </Box>
  );
};

export default ApprovalDashboard;