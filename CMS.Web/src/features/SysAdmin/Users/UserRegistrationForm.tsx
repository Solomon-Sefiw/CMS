import {
  Box,
  Button,
  Divider,
  Grid,
  Typography,
  Card,       
  CardContent,
  useTheme,    
} from "@mui/material";
import { Form, Formik } from "formik";
import { useCallback } from "react";
import * as yup from "yup";
import {
  Errors,
  FormSelectField,
  FormTextField,
  SelectOption,
} from "../../../components";
import { YupShape } from "../../../utils";
import { RegisterDto } from "../../../app/store";
import { FormCheckboxList } from "../../../components/form-controls/form-checkbox-list";
import { useBusinessUnit } from "../../BusinessUnit";

const initialValues = {
  email: "",
  password: "",
  firstName: "",
  middleName: "",
  lastName: "",
  branchId: "",
  roles: [],
};

const validationSchema = yup.object<YupShape<RegisterDto>>({
  email: yup.string().email().required("Email is required"),
  firstName: yup.string().required("First Name is required"),
  middleName: yup.string().required("Middle Name is required"),
  lastName: yup.string().required("Last Name is required"),
  branchId: yup.number().required("Branch is required."),
});

interface Props {
  user?: RegisterDto;
  roles?: SelectOption[];
  onCancel?: () => void;
  onSubmit: (User: RegisterDto) => void;
  errors?: any;
}

export const UserRegistrationForm = ({
  onCancel,
  user,
  onSubmit,
  roles,
  errors,
}: Props) => {
  const handleSubmit = useCallback(
    async (user: RegisterDto) => {
      onSubmit(user);
    },
    [onSubmit]
  );

  const { businessUnitLookups } = useBusinessUnit();
  const theme = useTheme(); 

  return (
    <Formik
      initialValues={{ ...initialValues, ...user } as any} 
      enableReinitialize={true}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      validateOnChange={true}
    >
      {() => (
        <Form>
          <Card
            variant="outlined"
            // Consistent card styling from profile pages
            sx={{ mt: 3, p: 2, backgroundColor: theme.palette.background.paper }}
            elevation={1}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {/* Dynamic title for registration vs. edit */}
                {user ? "Edit User Details" : "Register New User"}
              </Typography>
              <Divider sx={{ mb: 2 }} /> {/* Divider for visual separation */}

              <Grid container spacing={2}>
                {errors && (
                  <Grid item xs={12}>
                    <Errors errors={errors as any} />
                  </Grid>
                )}

                {/* First Name, Middle Name, Last Name in the first row */}
                <Grid item xs={12} sm={4}>
                  <FormTextField
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    label="First Name"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormTextField
                    name="middleName"
                    type="text"
                    placeholder="Middle Name"
                    label="Middle Name"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormTextField
                    name="lastName"
                    type="text"
                    placeholder="Last Name"
                    label="Last Name"
                  />
                </Grid>

                {/* Email and Branch in the second row */}
                <Grid item xs={12} sm={6}>
                  <FormTextField
                    name="email"
                    type="text"
                    placeholder="Email"
                    label="Email"
                    autoComplete="off"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormSelectField
                    name="branchId"
                    type="number"
                    placeholder="Branch"
                    label="Branch"
                    options={businessUnitLookups}
                  />
                </Grid>

              </Grid> 

              {/* Roles section as "Role Claims" presentation */}
              <Card
                variant="outlined"
                sx={{ mt: 4, p: 2, backgroundColor: theme.palette.background.default }} // Slightly different background for nested card
                elevation={0} // No shadow for inner card
              >
                <CardContent>
                  <Typography sx={{ mb: 1 }} variant="h6"> {/* Consistent heading style */}
                     Roles
                  </Typography>
                  <Grid container spacing={1}> {/* Use Grid for role checkboxes */}
                    {roles?.map((roleOption) => (
                      <Grid item xs={12} sm={6} md={4} key={roleOption.label}>
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          borderRadius: 1,
                          p: 0.5,
                          transition: "background-color 0.2s",
                          "&:hover": {
                            backgroundColor: theme.palette.action.hover,
                            cursor: "pointer",
                          },
                        }}>
                          <FormCheckboxList
                            name="roles"
                            options={[roleOption]} 
                            orientation="horizontal" 
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>

              <Grid item xs={12} sx={{ py: 2 }}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", my: 2, gap: 1 }}>
                  <Button
                    color="primary"
                    variant="contained" // Primary action button
                    type="submit"
                    sx={{ mr: 1 }}
                  >
                    {user ? "Update User" : "Register User"}
                  </Button>
                  <Button onClick={onCancel} variant="outlined"> {/* Secondary button */}
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </CardContent>
          </Card>
        </Form>
      )}
    </Formik>
  );
};