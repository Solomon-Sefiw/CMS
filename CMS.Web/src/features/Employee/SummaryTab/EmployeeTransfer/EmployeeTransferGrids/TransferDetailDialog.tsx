import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Typography,
  Button,
  Divider,
  Stack,
} from "@mui/material";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import VerifiedIcon from "@mui/icons-material/Verified";
import PersonIcon from "@mui/icons-material/Person";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import ApartmentIcon from "@mui/icons-material/Apartment";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NotesIcon from "@mui/icons-material/Notes";
import { EmployeeTransferDto } from "../../../../../app/api";

interface TransferDetailProps {
  transfer: EmployeeTransferDto;
  onClose: () => void;
}

const approvalStatusLabels: Record<number, string> = {
  1: "Draft",
  2: "Submitted",
  3: "Rejected",
  4: "Approved",
};
const transferTypeLabels: Record<number, string> = {
  1: "Business Unit Change",
  2: "Job Role Change",
  3: "Business Unit & Job Role Change",
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const labelStyle = {
  color: "darkblue",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0.5,
  textTransform: "uppercase",
  display: "flex",
  alignItems: "center",
  gap: 0.5,
};

const valueStyle = {
  fontSize: 14,
  fontWeight: 500,
  color: "#333",
};

export const TransferDetail = ({ transfer, onClose }: TransferDetailProps) => {
  const approvalStatusLabel =
    approvalStatusLabels[transfer.approvalStatus as number] ?? "Unknown";
  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "darkblue",
          fontWeight: "bold",
          fontSize: 20,
        }}
      >
        <TransferWithinAStationIcon sx={{ color: "darkblue" }} />
        Transfer Details
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography sx={labelStyle}>
              <PersonIcon fontSize="small" />
              Employee Name
            </Typography>
            <Typography sx={valueStyle}>{transfer.employeeName}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography sx={labelStyle}>
              <CompareArrowsIcon fontSize="small" />
              Transfer Type
            </Typography>
            <Typography sx={valueStyle}>
              {transferTypeLabels[
                transfer.transferType as keyof typeof transferTypeLabels
              ] ?? "Unknown"}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          <Grid item xs={6}>
            <Typography sx={labelStyle}>
              <ApartmentIcon fontSize="small" />
              From Business Unit
            </Typography>
            <Typography sx={valueStyle}>
              {transfer.fromBusinessUnitName}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography sx={labelStyle}>
              <BusinessIcon fontSize="small" />
              To Business Unit
            </Typography>
            <Typography sx={valueStyle}>
              {transfer.toBusinessUnitName}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography sx={labelStyle}>
              <WorkIcon fontSize="small" />
              From Job Role
            </Typography>
            <Typography sx={valueStyle}>{transfer.fromJobRoleName}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography sx={labelStyle}>
              <TrendingFlatIcon fontSize="small" />
              To Job Role
            </Typography>
            <Typography sx={valueStyle}>{transfer.toJobRoleName}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <Typography sx={labelStyle}>
              <NotesIcon fontSize="small" />
              Transfer Reason
            </Typography>
            <Typography sx={valueStyle}>{transfer.transferReason}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography sx={labelStyle}>
              <CalendarMonthIcon fontSize="small" />
              Transfer Date
            </Typography>
            <Typography sx={valueStyle}>
              {formatDate(transfer.transferDate)}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography sx={labelStyle}>
              <VerifiedIcon fontSize="small" sx={{ mr: 0.5 }} />
              Approval Status
            </Typography>
            <Typography sx={valueStyle}>{approvalStatusLabel}</Typography>
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button
            variant="contained"
            size="small"
            onClick={onClose}
            sx={{
              backgroundColor: "darkblue",
              "&:hover": { backgroundColor: "#00008b" },
              textTransform: "none",
            }}
          >
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
