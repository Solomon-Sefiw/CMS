import React from "react";
import { Typography } from "@mui/material";
import { useFormikContext } from "formik";
import { useBenefits } from "./useBenefits";
import { BenefitRow } from "./BenefitRow";

interface BenefitSelectorProps {
  selectedBenefitsField: string;
}

export const BenefitSelector: React.FC<BenefitSelectorProps> = ({
  selectedBenefitsField,
}) => {
  const { jobRoleBenefits } = useBenefits();
  const { values } = useFormikContext<any>();
  return (
    <div>
      <Typography
        variant="h6"
        sx={{
          mt: 3,
          mb: 2,
          fontWeight: "bold",
          color: "primary.main",
          fontFamily: "Segoe UI, Roboto, sans-serif",
          borderBottom: "2px solid #1976d2",
          display: "inline-block",
          paddingBottom: "4px",
          letterSpacing: 1.1,
          fontSize: "1.1rem",
        }}
      >
        Grant Benefits
      </Typography>

      {jobRoleBenefits
        .filter(
          (benefit): benefit is { id: number; name: string } =>
            typeof benefit.id === "number"
        )
        .map((benefit) => (
          <BenefitRow
            key={benefit.id}
            benefit={benefit}
            selectedBenefitsField={selectedBenefitsField}
          />
        ))}
    </div>
  );
};
