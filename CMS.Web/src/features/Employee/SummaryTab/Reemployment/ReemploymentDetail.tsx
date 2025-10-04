import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Button,
  Paper,
  Divider,
  Box,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import InfoIcon from "@mui/icons-material/Info";
import { useGetReemploymentByIdQuery } from "../../../../app/api";

type Props = {
  reemploymentId: number;
  open: boolean;
  onClose: () => void;
};

const reemploymentTypeLabels: Record<number, string> = {
  1: "Reinstate",
  2: "Rehire",
};
const approvalStatusLabels: Record<number, string> = {
  1: "Draft",
  2: "Submitted",
  3: "Rejected",
  4: "Approved",
};
const martialStatusLabels: Record<number, string> = {
  1: "Single",
  2: "Married",
  3: "Divorced",
  4: "Widowed",
};
const genderLabels: Record<number, string> = {
  0: "Unspecified",
  1: "Male",
  2: "Female",
};

const ReemploymentDetail: React.FC<Props> = ({
  reemploymentId,
  open,
  onClose,
}) => {
  const {
    data: reemployment,
    isLoading,
    isError,
  } = useGetReemploymentByIdQuery(
    { reemploymentId },
    { skip: !reemploymentId }
  );

  const renderField = (
    label: string,
    value?: string | number | null,
    Icon?: React.ElementType
  ) => (
    <Grid item xs={12} sm={6} md={4}>
      <Box display="flex" alignItems="center" mb={0.3}>
        {Icon && <Icon sx={{ mr: 0.8, color: "darkblue", fontSize: 20 }} />}
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ fontSize: 13 }}
        >
          {label}
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 14 }}>
        {value ?? "-"}
      </Typography>
    </Grid>
  );

  const sectionTitle = (title: string) => (
    <Typography
      variant="subtitle1"
      sx={{
        color: "darkblue",
        fontWeight: "bold",
        mb: 1,
        borderBottom: "2px solid darkblue",
        pb: 0.5,
        fontSize: 15,
      }}
    >
      {title}
    </Typography>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold", color: "darkblue", fontSize: 18 }}>
        Detail Page
      </DialogTitle>
      <DialogContent dividers sx={{ p: 2 }}>
        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ mt: 2, mb: 2 }}
          >
            <CircularProgress size={30} />
          </Box>
        ) : isError || !reemployment ? (
          <Alert severity="error">Failed to load reemployment details.</Alert>
        ) : (
          <Grid container spacing={1.5}>
            {/* Employee Info */}
            <Grid item xs={12}>
              <Paper sx={{ p: 1.5, mb: 1.5, borderRadius: 2, boxShadow: 1 }}>
                {sectionTitle("Employee Information")}
                <Grid container spacing={1.5}>
                  {renderField(
                    "Employee ID",
                    reemployment.employeeId,
                    PersonIcon
                  )}
                  {renderField(
                    "First Name",
                    reemployment.employeeFirstName,
                    PersonIcon
                  )}
                  {renderField("Middle Name", reemployment.employeeMiddleName)}
                  {renderField("Last Name", reemployment.employeeLastName)}
                  {renderField(
                    "Amharic First Name",
                    reemployment.amharicFirstName
                  )}
                  {renderField(
                    "Amharic Middle Name",
                    reemployment.amharicMiddleName
                  )}
                  {renderField(
                    "Amharic Last Name",
                    reemployment.amharicLastName
                  )}
                  {renderField(
                    "Birth Date",
                    reemployment.birthDate?.toString(),
                    CalendarTodayIcon
                  )}
                  {renderField(
                    "Employment Date",
                    reemployment.employementDate?.toString(),
                    CalendarTodayIcon
                  )}
                  {renderField(
                    "Gender",
                    genderLabels[reemployment.gender ?? 0] || "Unknown"
                  )}
                  {renderField(
                    "Marital Status",
                    martialStatusLabels[reemployment.martialStatus ?? 1] ||
                      "Unknown"
                  )}
                </Grid>
              </Paper>
            </Grid>

            {/* Job Info */}
            <Grid item xs={12}>
              <Paper sx={{ p: 1.5, mb: 1.5, borderRadius: 2, boxShadow: 1 }}>
                {sectionTitle("Job Information")}
                <Grid container spacing={1.5}>
                  {renderField(
                    "Business Unit",
                    reemployment.businessUnitName,
                    WorkIcon
                  )}
                  {renderField("Job Role", reemployment.jobRoleName, WorkIcon)}
                </Grid>
              </Paper>
            </Grid>

            {/* Reemployment Info */}
            <Grid item xs={12}>
              <Paper sx={{ p: 1.5, mb: 1.5, borderRadius: 2, boxShadow: 1 }}>
                {sectionTitle("Reemployment Details")}
                <Grid container spacing={1.5}>
                  {renderField(
                    "Reemployment Type",
                    reemploymentTypeLabels[
                      reemployment.reemploymentType ?? 1
                    ] || "Unknown",
                    AssignmentIcon
                  )}
                  {renderField(
                    "Approval Status",
                    approvalStatusLabels[reemployment.approvalStatus ?? 1] ||
                      "Unknown",
                    InfoIcon
                  )}
                  {renderField(
                    "Reemployment Date",
                    reemployment.reemploymentDate?.toString(),
                    CalendarTodayIcon
                  )}
                  {renderField(
                    "Reason for Reemployment",
                    reemployment.reasonForReemployment,
                    InfoIcon
                  )}
                  {renderField("Remark", reemployment.remark, InfoIcon)}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ReemploymentDetail;
