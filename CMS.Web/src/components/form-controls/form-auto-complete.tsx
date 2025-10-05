import { Autocomplete, TextField } from "@mui/material";
import { useField } from "formik";
import { useState } from "react";

export const FormAutocomplete = ({ name, label, options }: any) => {
  const [field, meta, helpers] = useField(name);
  const [inputValue, setInputValue] = useState("");
  const filteredOptions = inputValue.length >= 2 ? options : [];
  return (
    <Autocomplete
      options={filteredOptions}
      getOptionLabel={(option: any) => option.label || ""}
      value={options.find((opt: any) => opt.value === field.value) || null}
      onChange={(_, newValue) => helpers.setValue(newValue ? newValue.value : null)}
      inputValue={inputValue}
      onInputChange={(_, value) => setInputValue(value)}
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