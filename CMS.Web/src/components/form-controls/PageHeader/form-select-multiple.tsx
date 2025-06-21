import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { useField, useFormikContext } from "formik";
import { MultipleSelectOption } from "../../../types"; // Import your updated type

interface FormMultipleSelectFieldProps {
  name: string;
  label: string;
  options: MultipleSelectOption[]; // Use updated type
}

export const FormMultipleSelectField = ({
  name,
  label,
  options,
}: FormMultipleSelectFieldProps) => {
  const { handleChange } = useFormikContext();
  const [field, meta] = useField(name);

  // Ensure the value is always an array of string or number
  const value: (string | number)[] = Array.isArray(field.value)
    ? field.value
    : [];

  const error = !!(meta.touched && meta.error);

  return (
    <FormControl fullWidth error={error}>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        name={field.name}
        value={value}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) =>
          (selected as (string | number)[])
            .map((val) => {
              const match = options.find((opt) => opt.value === val);
              return match?.label ?? val;
            })
            .join(", ")
        }
      >
        {options.map((item) => (
          <MenuItem
            key={String(item.value)} // Ensure key is string
            value={item.value}
            disabled={item.isInactive}
          >
            <Checkbox checked={value.includes(item.value)} />
            <ListItemText primary={item.label} />
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{meta.error}</FormHelperText>}
    </FormControl>
  );
};
