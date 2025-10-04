import React from "react";
import { useField, useFormikContext } from "formik";
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  FormControl,
} from "@mui/material";

interface Props {
  name: string;
  label: string;
  options: { label: string; value: number }[];
  orientation?: "horizontal" | "vertical";
}

export const FormRadioGroup = ({
  name,
  label,
  options,
  orientation = "vertical",
}: Props) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(name);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(name, Number(event.target.value)); // Convert back to number
  };

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup
        row={orientation === "horizontal"}
        value={field.value ?? ""}
        onChange={handleChange}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
