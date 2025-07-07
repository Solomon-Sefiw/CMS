import { Box, useTheme } from "@mui/material";
import { useField, useFormikContext } from "formik";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

interface FormRichTextProps {
  name: string;
  alwaysShowError?: boolean;
  placeholder?: string;
}

export const FormRichLetterTextField = ({
  name,
  alwaysShowError,
  placeholder = "Enter Here...",
  ...others
}: FormRichTextProps) => {
  const theme = useTheme(); // Access MUI theme for dynamic dark mode support
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (value: string) => {
    setFieldValue(name, value); // Update Formik's field value when Quill content changes
  };

  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Box sx={{ width: "100%", mt: 1 }}>
      <ReactQuill
        value={field.value || ""}
        onChange={handleChange}
        theme="snow"
        placeholder={placeholder}
        {...others}
        style={{
          backgroundColor: isDarkMode ? "#1E1E1E" : "#fff", // Adaptive background
          color: isDarkMode ? "#fff" : "#000", // Adaptive text color
          borderRadius: "8px",
          border: `1px solid ${isDarkMode ? "#555" : "#ccc"}`, // Border for better visibility
          minHeight: "150px", // Ensures a good text area height
        }}
        modules={{
          toolbar: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["bold", "italic", "underline"],
            ["link"],
            [{ align: [] }],
            ["image"],
          ],
        }}
      />
      {(meta.touched || alwaysShowError) && meta.error && (
        <Box sx={{ color: "red", mt: 1, fontSize: "0.875rem" }}>
          {meta.error}
        </Box>
      )}
    </Box>
  );
};
