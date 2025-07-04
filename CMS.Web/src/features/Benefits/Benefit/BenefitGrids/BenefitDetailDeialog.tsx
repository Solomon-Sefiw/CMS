import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { BenefitDto } from "../../../../app/api";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  benefit: BenefitDto;
}

// Mapping approval status values to readable labels
const approvalStatusLabels: Record<number, string> = {
  1: "Draft",
  2: "Submitted",
  3: "Rejected",
  4: "Approved",
};
export const BenefitDetailDialog = ({
  open,
  onClose,
  title,
  benefit,
}: Props) => {
  const approvalStatusLabel =
    approvalStatusLabels[benefit.approvalStatus as number] ?? "Unknown";

  const isActiveLabel = benefit.isActive ? "Active" : "Inactive";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Benefit Name
            </Typography>
            <Typography>{benefit.name}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Measurement Unit
            </Typography>
            <Typography>{benefit.unitName}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Is Active
            </Typography>
            <Typography>{isActiveLabel}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Approval Status
            </Typography>
            <Typography>{approvalStatusLabel}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
