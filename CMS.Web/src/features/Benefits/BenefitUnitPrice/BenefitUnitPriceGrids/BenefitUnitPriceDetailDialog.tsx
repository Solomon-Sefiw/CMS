import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
  Grid,
  Typography,
  Box,
} from "@mui/material";
//   import { BenefitUnitPriceDto } from "../../../app/api";
import { BenefitUnitPriceDto } from "../../../../app/store";
import dayjs from "dayjs";

interface Props {
  open: boolean;
  onClose: () => void;
  benefitUnitPrice: BenefitUnitPriceDto;
}

export const BenefitUnitPriceDetailDialog = ({
  open,
  onClose,
  benefitUnitPrice,
}: Props) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Benefit Unit Price Details</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Benefit Name
            </Typography>
            <Typography>{benefitUnitPrice.benefitName}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Measurement Unit
            </Typography>
            <Typography>{benefitUnitPrice.unitOfMeasurementName}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Unit Price (ETB)
            </Typography>
            <Typography>{benefitUnitPrice.price}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Effective Date
            </Typography>
            <Typography>
              {dayjs(benefitUnitPrice.effectiveDate).format("DD-MMM-YYYY")}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Status
            </Typography>
            <Typography>
              {benefitUnitPrice.activationEnum === 1 ? "Active" : "Closed"}
            </Typography>
          </Grid>

          {benefitUnitPrice.remark && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary">
                Remark
              </Typography>
              <Typography>{benefitUnitPrice.remark}</Typography>
            </Grid>
          )}
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
