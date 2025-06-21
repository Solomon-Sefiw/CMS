import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
  Box,
  Button,
  Card, // Added for consistency
  CardContent, // Added for consistency
  Checkbox,
  Divider, // Added for consistency
  FormControlLabel,
  Grid, // Added for consistency
  Typography,
  useTheme, // Added for consistency
} from "@mui/material";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ApplicationRole, UserDetail } from "../../../app/api";
import { ActivateDeactivateUser } from "./ActivateDeactivateUserConfirmationDialog";

interface Props {
  userDetail: UserDetail;
  onRoleChange: (role: ApplicationRole, selected: boolean) => void;
  applicationRoles?: ApplicationRole[];
}

export const UserProfile = ({
  userDetail,
  applicationRoles = [],
  onRoleChange,
}: Props) => {
  const navigate = useNavigate();
  const theme = useTheme(); // Initialize useTheme

  const handleRoleChange =
    (role: ApplicationRole) => (_: React.SyntheticEvent, selected: boolean) => {
      onRoleChange(role, selected);
      // Removed window.location.reload() for better UX.
      // The parent component should handle state updates based on onRoleChange.
    };

  const onBackClick = useCallback(() => {
    navigate("/sys-admin/users");
  }, [navigate]);

  const { firstName, middleName, lastName, roles, isDeactivated } =
    userDetail || {};

  return (
    <Box>
      {/* Back Button */}
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", py: 2 }}>
        <Button
          startIcon={<ChevronLeftIcon />}
          onClick={onBackClick}
          size="large"
          variant="outlined" // Added variant for consistency
        >
          All Users
        </Button>
      </Box>

      {/* User Header */}
      <Box
        sx={{
          flex: 1,
          p: 2,
          display: "flex",
          gap: 2,
          alignItems: "center",
          borderRadius: 1, // Added for consistency
          ...(isDeactivated && {
            backgroundColor: "rgba(255, 99, 70, 0.15)", // Consistent alpha value
          }),
          mb: 3, // Added margin-bottom for consistency
        }}
      >
        <Typography variant="h5" fontWeight="bold"> {/* Consistent variant and font weight */}
          {`${firstName} ${middleName} ${lastName} `}
          {isDeactivated && (
            <Typography component="span" color="error" fontWeight="bold">
              (DEACTIVATED)
            </Typography>
          )}
        </Typography>
        <ActivateDeactivateUser user={userDetail} />
      </Box>

      <Divider sx={{ mt: 2 }} /> {/* Divider for consistency */}

      {/* Roles Section */}
      <Card
        variant="outlined"
        sx={{ mt: 3, p: 2, backgroundColor: theme.palette.background.paper }} // Consistent card styling
        elevation={1} // Consistent elevation
      >
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}> {/* Consistent variant for section title */}
            Roles
          </Typography>
          <Grid container spacing={2}> {/* Use Grid for role layout */}
            {applicationRoles.map((appRole) => {
              const isChecked = roles?.some((r) => r.name === appRole.name);
              return (
                <Grid
                  key={appRole.name}
                  item
                  xs={12}
                  sm={6}
                  md={4} // Consistent grid sizing
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    borderRadius: 1,
                    p: 1,
                    transition: "background-color 0.2s",
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => onRoleChange(appRole, !isChecked)} // Clickable grid item
                >
                  <FormControlLabel
                    label={
                      <Typography
                        noWrap
                        sx={{ maxWidth: "100%", userSelect: "none" }}
                      >
                        {appRole.displayName}
                      </Typography>
                    }
                    control={
                      <Checkbox
                        checked={isChecked}
                        onChange={handleRoleChange(appRole)}
                        onClick={(e) => e.stopPropagation()} // Prevent parent click from firing twice
                        inputProps={{
                          "aria-label": appRole.displayName ?? "role checkbox",
                        }}
                      />
                    }
                    sx={{ flexGrow: 1 }}
                  />
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};