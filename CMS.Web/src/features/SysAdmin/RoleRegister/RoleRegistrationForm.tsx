import {
  Box,
  Button,
  Divider,
  Grid,
  Typography,
  Tab,
  Tabs,
  Card, // Added for consistency
  CardContent, // Added for consistency
  useTheme, // Added for theme access
} from "@mui/material";
import { Form, Formik } from "formik";
import { useCallback, useState } from "react";
import * as yup from "yup";
import {
  Errors,
  FormTextField,
} from "../../../components";
import { YupShape } from "../../../utils";
import { CreateRoleDto } from "../../../app/store";
import { FormCheckboxList } from "../../../components/form-controls/form-checkbox-list";
import { ClaimCategory } from "../../../app/api/enums";
import { SelectOptionRole } from "../../../types";

const initialValues = {
  name: "",
  description: "",
  displayName: "",
  claims: [],
};

const validationSchema = yup.object<YupShape<CreateRoleDto>>({
  name: yup.string().required("Role name is required"),
  description: yup.string().required("Description is required"),
  displayName: yup.string().required("Display Name is required"),
});

interface Props {
  roles?: CreateRoleDto;
  claims?: SelectOptionRole[];
  onCancel?: () => void;
  onSubmit: (User: CreateRoleDto) => void;
  errors?: any;
}

export const RoleRegistrationForm = ({
  onCancel,
  roles,
  onSubmit,
  claims,
  errors,
}: Props) => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme(); // Access the Material-UI theme

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSubmit = useCallback(
    async (roles: CreateRoleDto) => {
      onSubmit(roles);
    },
    [onSubmit]
  );

  const groupedClaims = (claims || []).reduce((acc, claim) => {
    const category = claim.claimCategory ?? 0;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(claim);
    return acc;
  }, {} as Record<number, SelectOptionRole[]>);

  const categories = Object.keys(groupedClaims)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <Formik
      initialValues={{ ...initialValues, ...roles } as any}
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
                {roles ? "Edit Role Details" : "Register New Role"}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                {errors && (
                  <Grid item xs={12}>
                    <Errors errors={errors as any} />
                  </Grid>
                )}

                {/* Input forms in one line */}
                <Grid item xs={12} sm={4}>
                  <FormTextField
                    name="name"
                    type="text"
                    placeholder="Role Name"
                    label="Role Name"
                    autoComplete="off"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormTextField
                    name="displayName"
                    type="text"
                    placeholder="Display Name"
                    label="Display Name"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormTextField
                    name="description"
                    type="text"
                    placeholder="Role Description"
                    label="Role Description"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={{ my: 2 }} variant="h6"> {/* Changed to h6 for consistency with UserRegistrationForm */}
                    Claims
                  </Typography>
                  {/* Tabs for Claim Categories */}
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
                  >
                    {categories.map((category) => {
                      const label =
                        typeof category === "number" && ClaimCategory[category]
                          ? ClaimCategory[category]
                          : `Category ${category}`;
                      return <Tab key={category} label={label} />;
                    })}
                  </Tabs>

                  {/* Display Claims based on active tab */}
                  {categories.map((category, index) => {
                    if (tabValue !== index) return null;

                    const claimsForCategory = groupedClaims[category];

                    return (
                      <Box key={category} sx={{ ml: 2 }}>
                        <FormCheckboxList
                          name="claims"
                          options={claimsForCategory || []}
                          orientation="horizontal"
                        />
                      </Box>
                    );
                  })}
                </Grid>
              </Grid> {/* End of main form fields grid */}
            </CardContent>
          </Card> {/* End of main Card */}

          {/* Action Buttons */}
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
                {!roles ? "Add Role" : "Update Role"} {/* Updated button text for clarity */}
              </Button>
              <Button onClick={onCancel} variant="outlined"> {/* Secondary button */}
                Cancel
              </Button>
            </Box>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};