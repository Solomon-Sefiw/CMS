import React from "react";
import {
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Box,
} from "@mui/material";
import { useFormikContext } from "formik";
import { useBenefitValues } from "./useBenefitValues";

interface BenefitRowProps {
  benefit: { id: number; name: string };
  selectedBenefitsField: string;
}

export const BenefitRow: React.FC<BenefitRowProps> = ({
  benefit,
  selectedBenefitsField,
}) => {
  const { setFieldValue, values } = useFormikContext<any>();
  const selectedBenefits = values[selectedBenefitsField] || [];

  const isChecked = selectedBenefits.some(
    (b: any) => b.benefitId === benefit.id
  );

  const { benefitValueLookups, isLoading } = useBenefitValues(benefit.id);

  React.useEffect(() => {
    console.log("BenefitRow Loaded:", benefit.name, selectedBenefits);
  }, [selectedBenefits]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setFieldValue(selectedBenefitsField, [
        ...selectedBenefits,
        { benefitId: benefit.id, benefitValueId: 0 },
      ]);
    } else {
      setFieldValue(
        selectedBenefitsField,
        selectedBenefits.filter((b: any) => b.benefitId !== benefit.id)
      );
    }
  };

  const handleDropdownChange = (event: SelectChangeEvent<any>) => {
    const updated = selectedBenefits.map((b: any) =>
      b.benefitId === benefit.id
        ? { ...b, benefitValueId: event.target.value }
        : b
    );
    setFieldValue(selectedBenefitsField, updated);
  };

  const getSelectedValue = () => {
    return (
      selectedBenefits.find((b: any) => b.benefitId === benefit.id)
        ?.benefitValueId || ""
    );
  };

  return (
    <Box display="flex" alignItems="center" gap={3} mb={2}>
      <FormControlLabel
        control={
          <Checkbox checked={isChecked} onChange={handleCheckboxChange} />
        }
        label={benefit.name}
        sx={{ minWidth: 200 }}
      />
      {isChecked && (
        <FormControl size="small" sx={{ minWidth: 250 }}>
          <InputLabel>Benefit Value(Liter/ETB)</InputLabel>
          <Select
            value={getSelectedValue()}
            onChange={handleDropdownChange}
            disabled={isLoading}
            label="Benefit Value"
          >
            {benefitValueLookups.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
};
