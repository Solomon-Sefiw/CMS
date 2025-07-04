import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Typography,
  Snackbar,
  Alert,
  TextField,
  MenuItem,
} from "@mui/material";
import { Formik, Form, useField } from "formik";
import { useCallback, useEffect, useState } from "react";
import * as Yup from "yup";
import { Errors } from "../../components/Errors";
import {
  AddBranchGradeCommand,
  BranchGradeDto,
  UpdateBranchGradeCommand,
  useAddBranchGradeMutation,
  useUpdateBranchGradeMutation,
} from "../../app/api";
import { DialogHeader } from "../../components";
import { useAlert } from "../notification";

interface BranchGradeDialogProps {
  branchGrade?: BranchGradeDto;
  title: string;
  onClose: () => void;
}

const emptyBranchGradeData: BranchGradeDto = {
  id: undefined,
  grade: "",
  staffLimit: 0,
  description: "",
  remark: "",
};
const gradeOptions = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
];

const validationSchema = Yup.object({
  grade: Yup.string()
    .required("Branch Grade is required")
    .oneOf(
      gradeOptions,
      "Branch Grade must be a valid Roman numeral between I and X"
    ),
  staffLimit: Yup.number()
    .typeError("Staff Strength must be a number")
    .required("Staff Strength is required")
    .min(1, "Staff Strength must be at least 1"),
  description: Yup.string()
    .required("Description is required")
    .max(200, "Branch grade description exceeds 200 characters")
    .min(5,"Description must contain at least 5 characters"),
});

export const BranchGradeDialog = ({
  onClose,
  branchGrade,
  title,
}: BranchGradeDialogProps) => {
  const [branchGradeData, setBranchGradeData] =
    useState<BranchGradeDto>(emptyBranchGradeData);
  const [addBranchGrade, { error: addBranchGradeError }] =
    useAddBranchGradeMutation();
  const [updateBranchGrade, { error: updateBranchGradeError }] =
    useUpdateBranchGradeMutation();
  const [notification, setNotification] = useState<string>("");
  const [severity, setSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("info");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const { showSuccessAlert, showErrorAlert } = useAlert();

  useEffect(() => {
    setBranchGradeData({
      ...emptyBranchGradeData,
      ...branchGrade,
    });
  }, [branchGrade]);

  const handleSubmit = useCallback(
    async (values: BranchGradeDto) => {
      try {
        if (values.id) {
          const updateCommand: UpdateBranchGradeCommand = {
            id: values.id,
            grade: values.grade,
            staffLimit: values.staffLimit,
            description: values.description,
          };

          const response = await updateBranchGrade({
            updateBranchGradeCommand: updateCommand,
          }).unwrap();
          if (response) {
            showSuccessAlert("Branch Grade updated successfully!");
            setSeverity("info");
          }
        } else {
          const addCommand: AddBranchGradeCommand = {
            grade: values.grade,
            staffLimit: values.staffLimit,
            description: values.description,
          };

          const response = await addBranchGrade({
            addBranchGradeCommand: addCommand,
          }).unwrap();
          if (response) {
            showSuccessAlert("Branch Grade created successfully!");
            setSeverity("info");
          }
        }
        onClose();
        
      } catch (error) {
        setOpenSnackbar(true);
      }
    },
    [addBranchGrade, updateBranchGrade, onClose]
  );

  const errors =
    (addBranchGradeError as any)?.data?.errors ||
    (updateBranchGradeError as any)?.data?.errors;

  return (
    <Dialog
      scroll="paper"
      open={true}
      maxWidth="lg"
      fullWidth
      sx={{ "& .MuiDialog-paper": { width: "50%", maxHeight: "90vh" } }}
    >
      <Formik
        initialValues={branchGradeData}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        enableReinitialize
      >
        {() => (
          <Form>
            <DialogHeader title={title} onClose={onClose} />

            {notification && (
              <Box sx={{ p: 2 }}>
                <Alert severity={severity}>{notification}</Alert>
              </Box>
            )}

            <DialogContent dividers={true}>
              <Grid container spacing={2}>
                {errors && (
                  <Grid item xs={12}>
                    <Errors errors={errors as any} />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <FormikSelectField
                    name="grade"
                    label="Branch Grade"
                    options={gradeOptions}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormikTextField
                    name="staffLimit"
                    label="Staff Strength"
                    type="number"
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormikTextField
                    name="description"
                    label="Description"
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button color="primary" variant="outlined" type="submit">
                Save
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity={severity}>{notification}</Alert>
      </Snackbar>
    </Dialog>
  );
};

// 🟦 Helper component to reduce repetition
const FormikTextField = ({ name, label, ...props }: any) => {
  const [field, meta] = useField(name);
  return (
    <TextField
      fullWidth
      label={label}
      {...field}
      {...props}
      error={Boolean(meta.touched && meta.error)}
      helperText={meta.touched && meta.error}
    />
  );
};
// the implementation for the grade
const FormikSelectField = ({ name, label, options }: any) => {
  const [field, meta] = useField(name);
  return (
    <TextField
      select
      fullWidth
      label={label}
      {...field}
      error={Boolean(meta.touched && meta.error)}
      helperText={meta.touched && meta.error}
    >
      {options.map((option: string) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
};
