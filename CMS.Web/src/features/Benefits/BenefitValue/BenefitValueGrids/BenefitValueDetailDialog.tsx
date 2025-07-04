import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { BenefitValueDto } from "../../../../app/api";

interface BenefitValueDetailDialogProps {
  benefitValue: BenefitValueDto;
  onClose: () => void;
  title?: string;
}

export const BenefitValueDetailDialog = ({
  benefitValue,
  onClose,
  title = "Benefit Value Details",
}: BenefitValueDetailDialogProps) => {
  return (
    <Dialog open={!!benefitValue} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>

      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2}>
          <Box>
            <Typography variant="subtitle2">Benefit Name</Typography>
            <Typography>{benefitValue.benefitName}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2">Value</Typography>
            <Typography>{benefitValue.value}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2">Measurement Unit</Typography>
            <Typography>{benefitValue.unitOfMeasurementName}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2">Is Unit Priced</Typography>
            <Typography>{benefitValue.isUnitPriced ? "Yes" : "No"}</Typography>
          </Box>

          {benefitValue.isUnitPriced && (
            <>
              <Box>
                <Typography variant="subtitle2">
                  Unit Price (ETB/Liter)
                </Typography>
                <Typography>{benefitValue.unitPrice}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2">
                  Calculated Amount (ETB)
                </Typography>
                <Typography>{benefitValue.calculatedBenefitAmount}</Typography>
              </Box>
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
