// import { CardActionArea } from "@mui/material";
// import MuiTooltip from '@mui/material/Tooltip';
// import { VerifiedUser, WorkOutline, PersonOff, PersonAdd, People, Business, Work, SyncAlt } from "@mui/icons-material";

// import {
//     Grid,
//     Card,
//     CardContent,
//     Typography,
//     Box,
//     IconButton,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import {
//     useGetApprovedActiveBusinessCountQuery, useGetApprovedActiveEmployeeCountQuery, useGetApprovedActiveJobRoleCountQuery,
//     useGetEmployeeRetentionRateQuery, useGetEmployeeTurnoverRateQuery, useGetNewEmployeesThisYearQuery,
//     useGetResignedEmployeesThisYearQuery, useGetVacantJobsCountQuery
// } from "../../app/api";
// import { usePermission } from "../../hooks";


// const DashboardCards = () => {
//     const permissions = usePermission();
//     const {
//         data: employeeCountData,
//         isLoading: isEmployeeCountLoading,
//     } = useGetApprovedActiveEmployeeCountQuery();

//     const {
//         data: newEmployeeCountData,
//         isLoading: isNewEmployeeCountLoading,
//     } = useGetNewEmployeesThisYearQuery();

//     const {
//         data: resignedEmployeeCountData,
//         isLoading: isResignedEmployeeCountLoading,
//     } = useGetResignedEmployeesThisYearQuery();

//     const {
//         data: vacantJobCountData,
//         isLoading: isVacantJobCountLoading,
//     } = useGetVacantJobsCountQuery();

//     const {
//         data: businessUnitCountData,
//         isLoading: isBusinessUnitLoading,
//     } = useGetApprovedActiveBusinessCountQuery();

//     const {
//         data: jobRoleCountData,
//         isLoading: isjobRoleCountLoading,
//     } = useGetApprovedActiveJobRoleCountQuery();

//     const {
//         data: employeeTurnOverRateData,
//         isLoading: isEmployeeTurnOverRateLoading,
//     } = useGetEmployeeTurnoverRateQuery();

//     const {
//         data: employeeRetentionRateData,
//         isLoading: isEmployeeRetentionLoading,
//     } = useGetEmployeeRetentionRateQuery();


//     const employeeCount = (employeeCountData as { total: number })?.total?.toLocaleString() ?? (isEmployeeCountLoading ? 'Loading...' : '0');
//     const employeeCountChange = (employeeCountData as { changeLabel: string })?.changeLabel ?? (isEmployeeCountLoading ? 'Loading...' : 'N/A');
//     const newEmployeeCount = (newEmployeeCountData as { total: number })?.total?.toLocaleString() ?? (isNewEmployeeCountLoading ? 'Loading...' : '0');
//     const newEmployeeCountChange = (newEmployeeCountData as { changeLabel: string })?.changeLabel ?? (isNewEmployeeCountLoading ? 'Loading...' : 'N/A');

//     const vacantJobCount = (vacantJobCountData as { total: number })?.total?.toLocaleString() ?? (isVacantJobCountLoading ? 'Loading...' : '0');
//     const vacantJobCountChange = (vacantJobCountData as { changeLabel: string })?.changeLabel ?? (isVacantJobCountLoading ? 'Loading...' : 'N/A');

//     const resignedEmployeeCount = (resignedEmployeeCountData as { total: number })?.total?.toLocaleString() ?? (isResignedEmployeeCountLoading ? 'Loading...' : '0');
//     const resignedEmployeeCountChange = (resignedEmployeeCountData as { changeLabel: string })?.changeLabel ?? (isResignedEmployeeCountLoading ? 'Loading...' : 'N/A');

//     const businessUnitCount = (businessUnitCountData as { total: number })?.total?.toLocaleString() ?? (isBusinessUnitLoading ? 'Loading...' : '0');
//     const businessUnitCountChange = (businessUnitCountData as { changeLabel: string })?.changeLabel ?? (isBusinessUnitLoading ? 'Loading...' : 'N/A');
//     const jobRoleCount = (jobRoleCountData as { total: number })?.total?.toLocaleString() ?? (isjobRoleCountLoading ? 'Loading...' : '0');
//     const jobRoleCountChange = (jobRoleCountData as { changeLabel: string })?.changeLabel ?? (isjobRoleCountLoading ? 'Loading...' : 'N/A');
//     const turnoverRate = (employeeTurnOverRateData as { rate: string })?.rate ?? (isEmployeeTurnOverRateLoading ? "Loading..." : "N/A");
//     const retentionRate = (employeeRetentionRateData as { rate: string })?.rate ?? (isEmployeeRetentionLoading ? "Loading..." : "N/A")
//     const retentionRateChange = (employeeRetentionRateData as { changeLabel: string })?.changeLabel ?? (isEmployeeRetentionLoading ? "Loading..." : "N/A");
//     const turnoverRateChange = (employeeTurnOverRateData as { changeLabel: string })?.changeLabel ?? (isEmployeeTurnOverRateLoading ? "Loading..." : "N/A");

//     const retentionChangeStyle = {
//         color: retentionRateChange.startsWith("-") ? "red" : "#3F51B9",
//         fontWeight: "italic",
//     };
//     const turnoverChangeStyle = {
//         color: turnoverRateChange.startsWith("-") ? "red" : "#3F51B9",
//         fontWeight: "italic",
//     };

//     const employeeChangeStyle = { color: "#3F51B9", fontWeight: "italic" };
//     const newEmployeeChangeStyle = { color: "#3F51B9", fontWeight: "italic" };
//     const resignedEmployeeChangeStyle = { color: "#3F51B9", fontWeight: "italic" };
//     const businessUnitChangeStyle = { color: "#3F51B9", fontWeight: "italic" };
//     const vacantJobChangeStyle = { color: "#3F51B9", fontWeight: "italic" };
//     const jobRoleChangeStyle = { color: "#3F51B9", fontWeight: "italic" };


//     const navigate = useNavigate();

//     const handleNavigation = (route: string) => {
//         navigate(route);
//     };

//     return (
//         <Box sx={{ flexGrow: 1, padding: 1 }}>
//             <Box sx={{ width: "100%" }}>
//                 <Grid container spacing={2}>
//                     {[
//                         permissions.CanViewAllActiveEmployees &&
//                         {
//                             title: "All Active Employees",
//                             value: employeeCount,
//                             change: <span style={employeeChangeStyle}>{employeeCountChange}</span>,
//                             route: "/employees",
//                             Icon: People,
//                             color: "#2196F3", 
//                             tooltip: "Number of currently active employees in Berhan Bank",
//                             disabled: !permissions.canViewEmployeePersonalInfo
//                         },
//                         permissions.CanViewAllResignedEmployees &&
//                         {
//                             title: "Resigned Employees",
//                             value: resignedEmployeeCount,
//                             change: <span style={resignedEmployeeChangeStyle}>{resignedEmployeeCountChange}</span>,
//                             route: "/employees",
//                             Icon: PersonOff,
//                             color: "#F44336", 
//                             tooltip: "Employees who resigned in the current year",
//                             disabled: !permissions.canViewEmployeePersonalInfo
//                         },
//                         permissions.CanViewAllBusinessUnits &&
//                         {
//                             title: "Business Units",
//                             value: businessUnitCount,
//                             change: <span style={businessUnitChangeStyle}>{businessUnitCountChange}</span>,
//                             route: "/businessunit",
//                             Icon: Business,
//                             color: "#FFC107", // Amber
//                             tooltip: "Total number of Business Units ",
//                             disabled: !permissions.canViewSetup
//                         },
//                         permissions.CanViewAllVacantJobs &&
//                         {
//                             title: "Vacant Job",
//                             value: vacantJobCount,
//                             change: <span style={vacantJobChangeStyle}>{vacantJobCountChange}</span>,
//                             route: "/job",
//                             Icon: WorkOutline,
//                             color: "#9C27B0", // Purple
//                             tooltip: "Currently Vacant Jobs",
//                             disabled: !permissions.canViewSetup
//                         },
//                         permissions.CanViewAllNewEmployees &&
//                         {
//                             title: "New Employees",
//                             value: newEmployeeCount,
//                             change: <span style={newEmployeeChangeStyle}>{newEmployeeCountChange}</span>,
//                             route: "/employees",
//                             Icon: PersonAdd,
//                             color: "#4CAF50", // Green
//                             tooltip: "Employees hired this year",
//                             disabled: !permissions.canViewEmployeePersonalInfo
//                         },
//                         permissions.CanViewAllPositions &&
//                         {
//                             title: "Positions",
//                             value: jobRoleCount,
//                             change: <span style={jobRoleChangeStyle}>{jobRoleCountChange}</span>,
//                             route: "/jobRole",
//                             Icon: Work,
//                             color: "#00BCD4", // Cyan
//                             tooltip: "Total number of defined job positions",
//                             disabled: !permissions.canViewSetup
//                         },
//                         permissions.CanViewTurnoverRates &&
//                         {
//                             title: "Turnover Rate",
//                             value: turnoverRate,
//                             change: <span style={turnoverChangeStyle}>{turnoverRateChange}</span>,
//                             route: "/turnover",
//                             Icon: SyncAlt,
//                             color: "#FF9800", // Orange
//                             tooltip: "Percentage of employees who resigned this year",
//                             disabled: !permissions.canViewEmployeePersonalInfo
//                         },
//                         permissions.CanViewRetentionRates &&
//                         {
//                             title: "Retention Rate",
//                             value: retentionRate,
//                             change: <span style={retentionChangeStyle}>{retentionRateChange}</span>,
//                             route: "/turnover",
//                             Icon: VerifiedUser,
//                             color: "#673AB7", // Deep Purple
//                             tooltip: "Percentage of employees retained this year",
//                             disabled: !permissions.canViewEmployeePersonalInfo
//                         },
//                     ]
//                         .filter((card) => !!card)
//                         .map((card, index) => {
//                             // Type assertion is safe here because we filtered out falsy values
//                             const typedCard = card as {
//                                 title: string;
//                                 value: string;
//                                 change: React.ReactNode;
//                                 route: string;
//                                 Icon: React.ElementType;
//                                 color: string;
//                                 tooltip: string;
//                                 disabled: boolean;
//                             };
//                             return (
//                                 <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
//                                     <MuiTooltip
//                                         title={
//                                             <span style={{ color: "#3F51B9", textAlign: "center", display: "block" }}>
//                                                 {typedCard.tooltip}
//                                             </span>
//                                         }
//                                         arrow
//                                         placement="bottom"
//                                         componentsProps={{
//                                             tooltip: {
//                                                 sx: {
//                                                     backgroundColor: "#E3F2FD",
//                                                 }
//                                             }
//                                         }}
//                                     >
//                                         <CardActionArea onClick={() => handleNavigation(typedCard.route)} disabled={typedCard.disabled}>
//                                             <Card
//                                                 elevation={3}
//                                                 sx={{
//                                                     height: "100%",
//                                                     transition: "transform 0.2s ease-in-out, box-shadow 0.2s, background-color 0.2s",
//                                                     "&:hover": {
//                                                         transform: "scale(1.02)",
//                                                         boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
//                                                         backgroundColor: " rgba(240, 238, 238, 0.2)",
//                                                     },
//                                                 }}
//                                             >
//                                                 <CardContent>
//                                                     <Box
//                                                         sx={{
//                                                             display: "flex",
//                                                             alignItems: "center",
//                                                             justifyContent: "space-between",
//                                                             mb: 1,
//                                                         }}
//                                                     >
//                                                         <Box
//                                                             sx={{
//                                                                 width: "40px",
//                                                                 height: "40px",
//                                                                 borderRadius: "50%",
//                                                                 backgroundColor: typedCard.color,
//                                                                 display: "flex",
//                                                                 justifyContent: "center",
//                                                                 alignItems: "center",
//                                                                 marginRight: 2,
//                                                                 boxShadow: "0 8px 20px rgba(0, 0, 0.2, 0.2)",
//                                                             }}
//                                                         >
//                                                             <typedCard.Icon sx={{ color: "#fff", fontSize: 20 }} />
//                                                         </Box>
//                                                         <Typography variant="h6" sx={{ color: "#3F51B9", fontFamily: "Neo Sans Pro, sans-serif" }}>
//                                                             {typedCard.title}
//                                                         </Typography>
//                                                         <IconButton size="small" sx={{ color: typedCard.color }}>
//                                                             <typedCard.Icon />
//                                                         </IconButton>
//                                                     </Box>
//                                                     <Typography variant="h4" sx={{ fontWeight: "bold" }}>
//                                                         {typedCard.value}
//                                                     </Typography>
//                                                     <Typography variant="body2" color="text.secondary">
//                                                         {typedCard.change}
//                                                     </Typography>
//                                                 </CardContent>
//                                             </Card>
//                                         </CardActionArea>
//                                     </MuiTooltip>
//                                 </Grid>
//                             );
//                         })}
//                 </Grid>
//             </Box>
//         </Box>
//     );
// };

// export default DashboardCards;
