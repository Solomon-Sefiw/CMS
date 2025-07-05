import React from "react";
import { CircularProgress } from "@mui/material";
import MuiTooltip from '@mui/material/Tooltip';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Paper,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Business,
  Work,
  TrendingUp,
  TrendingDown,
  SwapHoriz,
  BarChart as BarChartIcon,
  TurnLeftOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  useGetEmployeeDistributionByStatusQuery,
  useGetEmployeeJobCategoryGroupCountQuery,
  useGetEmployeeRetentionRateQuery,
  useGetEmployeeTurnoverRateQuery,
  useGetMonthlyEmployeeCountQuery
} from "../../app/api";
import { usePermission } from "../../hooks";

const monthlyRatesData = [
  { month: "Jan", employment: 85, promotion: 5, demotion: 1, transfer: 3, turnover: 2 },
  { month: "Feb", employment: 87, promotion: 4, demotion: 0, transfer: 2, turnover: 1 },
  { month: "Mar", employment: 88, promotion: 6, demotion: 1, transfer: 4, turnover: 3 },
  { month: "Apr", employment: 90, promotion: 7, demotion: 2, transfer: 3, turnover: 2 },
  { month: "May", employment: 89, promotion: 5, demotion: 1, transfer: 5, turnover: 4 },
  { month: "Jun", employment: 91, promotion: 8, demotion: 0, transfer: 2, turnover: 1 },
  { month: "Jul", employment: 92, promotion: 6, demotion: 1, transfer: 4, turnover: 3 },
  { month: "Aug", employment: 93, promotion: 7, demotion: 2, transfer: 3, turnover: 2 },
  { month: "Sep", employment: 94, promotion: 9, demotion: 1, transfer: 5, turnover: 4 },
  { month: "Oct", employment: 95, promotion: 8, demotion: 0, transfer: 2, turnover: 1 },
  { month: "Nov", employment: 96, promotion: 10, demotion: 1, transfer: 4, turnover: 3 },
  { month: "Dec", employment: 97, promotion: 12, demotion: 2, transfer: 3, turnover: 2 },
];

const COLORS = ["#3F51B9", "#FFA726", "#29B6F6", "#F44336", "#8E24AA", "#66BB6A", "#BDBDBD"];

const DashboardGraphs = () => {
  const permissions = usePermission();
  const {
    data: employeeMonthlyDistributionData,
    isLoading: isEmployeeMonthlyDistributionDataLoading,
    error: EmployeeMonthlyDistributionDataError,
  } = useGetMonthlyEmployeeCountQuery();

  const {
    data: employeeTurnOverRateData,
    isLoading: isEmployeeTurnOverRateLoading,
  } = useGetEmployeeTurnoverRateQuery();

  const {
    data: employeeJobCategoryGroupData,
    isLoading: isEmployeeJobCategoryGroupLoading,
    error: employeeJobCategoryGroupError,
  } = useGetEmployeeJobCategoryGroupCountQuery();

  type ChiefGroupData = {
    chiefOfficeName: string;
    employees: number;
  };

  const {
    data: employeeDistributionByStatusData,
    isLoading: isEmployeeDistributionByStatusLoading,
    error: employeeDistributionByStatusError,
  } = useGetEmployeeDistributionByStatusQuery();

  const employeeDistributionByStatus = (employeeDistributionByStatusData ?? []) as { name: string; value: number }[];
  const positionData = (employeeJobCategoryGroupData ?? []) as { name: string; employees: number }[];

  const turnoverRate = (employeeTurnOverRateData as { rate: string })?.rate ?? (isEmployeeTurnOverRateLoading ? "Loading..." : "N/A");
  const turnoverRateChange = (employeeTurnOverRateData as { changeLabel: string })?.changeLabel ?? (isEmployeeTurnOverRateLoading ? "Loading..." : "N/A");

  const turnoverChangeStyle = {
    color: turnoverRateChange.startsWith("-") ? "red" : "#3F51B9",
    fontWeight: "italic",
  };

  const today = new Date();
  const currentYear = today.getFullYear();
  const fiscalStart = today.getMonth() >= 6 ? currentYear : currentYear - 1;
  const fiscalEnd = fiscalStart + 1;
  const fiscalYearLabel = `${fiscalStart}/${fiscalEnd}`;

  const renderMiddleLabel = (props: any) => {
    const { x, y, width, height, value } = props;
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    return (
      <text
        x={centerX}
        y={centerY}
        fill="#fff"
        fontSize={12}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {value}
      </text>
    );
  };

  const navigate = useNavigate();

  const handleNavigation = (route: string) => {
    navigate(route);
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 1 }}>
      {/* Grouping the first four graphs into a single Grid container */}
      <Grid container spacing={3} sx={{ marginTop: 3 }}>
        {permissions.CanViewEmployeeDistributionByStatusDoughnutChart && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <MuiTooltip
                  title={
                    <span style={{ color: "#3F51B9", textAlign: "center", display: "block" }}>
                      Shows the number of employees grouped by their status (e.g, Active, Resigned)
                    </span>
                  }
                  arrow
                  placement="top"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        backgroundColor: "#E3F2FD",
                      },
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "#3F51B9", fontFamily: "Neo Sans Pro, sans-serif", cursor: "help" }}
                  >
                    Employee Distribution By Status
                  </Typography>
                </MuiTooltip>

                {isEmployeeDistributionByStatusLoading ? (
                  <CircularProgress />
                ) : employeeDistributionByStatusError ? (
                  <Typography color="error">Failed to load data</Typography>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={employeeDistributionByStatus}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        labelLine={false}
                        label={({ name, percent }) =>
                          percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : ""
                        }
                      >
                        {employeeDistributionByStatus.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [`${value} employees`, name]}
                      />
                      <Legend align="center" verticalAlign="bottom" iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        {permissions.CanViewMonthlyNewEmployeesOfFiscalYearBarChart && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <MuiTooltip
                  title={
                    <span style={{ color: "#3F51B9", textAlign: "center", display: "block" }}>
                      Displays monthly hiring trends for the fiscal year {fiscalYearLabel}
                    </span>
                  }
                  arrow
                  placement="top"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        backgroundColor: "#E3F2FD",
                      },
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      color: "#3F51B9",
                      fontFamily: "Neo Sans Pro, sans-serif",
                      cursor: "help",
                    }}
                  >
                    Monthly New Employees of Fiscal Year {fiscalYearLabel}
                  </Typography>
                </MuiTooltip>

                {isEmployeeMonthlyDistributionDataLoading ? (
                  <CircularProgress />
                ) : EmployeeMonthlyDistributionDataError ? (
                  <Typography color="error">Failed to load data</Typography>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={Array.isArray(employeeMonthlyDistributionData) ? employeeMonthlyDistributionData : []}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="employees" fill="#3F51B9" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}


        {permissions.CanViewEmployeeDistributionByJobCategoryPieChart && (
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <MuiTooltip
                    title={
                      <span style={{ color: "#3F51B9", textAlign: "center", display: "block" }}>
                        Shows number of employees grouped by their job category
                      </span>
                    }
                    arrow
                    placement="top"
                    componentsProps={{
                      tooltip: {
                        sx: {
                          backgroundColor: "#E3F2FD",
                        },
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ color: "#3F51B9", fontFamily: "Neo Sans Pro, sans-serif", cursor: "help" }}
                    >
                      Employee Distribution By Job Category
                    </Typography>
                  </MuiTooltip>

                  <IconButton sx={{ color: "#3F51B9" }} disabled = {!permissions.canViewSetup} size="small" onClick={() => handleNavigation("/jobcategory")}>
                    <Work color="action" />
                  </IconButton>
                </Box>

                {isEmployeeJobCategoryGroupLoading ? (
                  <Typography variant="body2" color="text.secondary">
                    Loading chart...
                  </Typography>
                ) : employeeJobCategoryGroupError ? (
                  <Typography variant="body2" color="error">
                    Failed to load chart data.
                  </Typography>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={positionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#3F51B9"
                        dataKey="employees"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {positionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Monthly HR Metrics Line Graph (remains as is) */}
      {permissions.CanViewMonthlyHRMetricsLineGraph && (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Monthly HR Metrics (Last 12 Months)</Typography>
                  <IconButton size="small" onClick={() => handleNavigation("/hr-metrics")}>
                    <BarChartIcon />
                  </IconButton>
                </Box>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={monthlyRatesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="employment"
                      stroke="#4CAF50"
                      name="Employment Rate (%)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="promotion"
                      stroke="#2196F3"
                      name="Promotion Rate (%)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="demotion"
                      stroke="#FF9800"
                      name="Demotion Rate (%)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="transfer"
                      stroke="#9C27B0"
                      name="Transfer Rate (%)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="turnover"
                      stroke="#F44336"
                      name="Turnover Rate (%)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Metric Cards (remains as is) */}
      {permissions.CanViewMonthlyHRMetricsLineGraph && ( 
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {[
            {
              title: "Promotion Rate",
              value: "6.5%",
              change: "+1.2% from last year",
              Icon: TrendingUp,
              color: "#2196F3",
            },
            {
              title: "Demotion Rate",
              value: "1.2%",
              change: "-0.3% from last year",
              Icon: TrendingDown,
              color: "#FF9800",
            },
            {
              title: "Transfer Rate",
              value: "3.8%",
              change: "+0.5% from last year",
              Icon: SwapHoriz,
              color: "#9C27B0",
            },
            {
              title: "Turnover Rate",
              value: turnoverRate,
              change: <span style={turnoverChangeStyle}>{turnoverRateChange}</span>,
              route: "/turnover",
              Icon: TurnLeftOutlined,
              color: "#F44336",
              tooltip: "Percentage of employees who resigned this year",
            },
          ].map((metric, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundColor: metric.color,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mr: 2,
                      color: "white",
                    }}
                  >
                    <metric.Icon />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {metric.title}
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', ml: 6 }}>
                  {metric.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 6 }}>
                  {metric.change}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default DashboardGraphs;