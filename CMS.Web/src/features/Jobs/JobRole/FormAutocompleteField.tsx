import { Autocomplete, SxProps, TextField } from "@mui/material";
import { useField, useFormikContext } from "formik";

interface FormAutocompleteFieldProps {
  name: string;
  label: string;
  options: { id: number; name: string }[];
  sx?: SxProps;
}

export const FormAutocompleteField = ({
  name,
  label,
  options,
  sx,
}: FormAutocompleteFieldProps) => {
  const { setFieldValue } = useFormikContext<any>();
  const [field, meta] = useField(name);

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.name}
      value={options.find((o) => o.id === field.value) || null}
      onChange={(_, value) => setFieldValue(name, value ? value.id : "")}
      sx={{ width: "100%", ...sx }} 
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={meta.touched && Boolean(meta.error)}
          helperText={meta.touched && meta.error}
        />
      )}
    />
  );
};
