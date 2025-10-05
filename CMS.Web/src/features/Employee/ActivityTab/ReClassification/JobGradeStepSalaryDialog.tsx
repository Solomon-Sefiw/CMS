import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import { useState } from "react";

type Step = {
  id: number;
  stepNumber: number;
  salaryAmount: number;
};

interface Props {
  open: boolean;
  onClose: () => void;
  steps: Step[];
  onConfirm: (step: { stepId: number; salary: number }) => void;
}

export const JobGradeStepSalaryDialog = ({
  open,
  onClose,
  steps,
  onConfirm,
}: Props) => {
  const [selectedStepId, setSelectedStepId] = useState<number | null>(0);

  const handleConfirm = () => {
    const selectedStep = steps.find((s) => s.id === selectedStepId);
    if (selectedStep) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      // Optionally focus an external element here if you have one
      // document.getElementById('someButtonOutsideDialog')?.focus();

      onConfirm({ stepId: selectedStep.id, salary: selectedStep.salaryAmount });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} disableRestoreFocus>
      <DialogTitle>Select Step Salary</DialogTitle>
      <DialogContent>
        <RadioGroup
          value={selectedStepId}
          onChange={(e) => setSelectedStepId(Number(e.target.value))}
        >
          {steps.map((step) => (
            <FormControlLabel
              key={step.id}
              value={step.id}
              control={<Radio />}
              label={`Step ${
                step.stepNumber
              } - ${step.salaryAmount.toLocaleString()} ETB`}
            />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleConfirm}
          disabled={selectedStepId === null}
          variant="contained"
          color="primary"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
