import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Claim, RoleDetail } from "../../../app/api";
import { ClaimCategory } from "../../../app/api/enums";

interface Props {
  roleDetail: RoleDetail;
  onClaimChange: (claim: Claim, selected: boolean) => void;
  applicationClaim?: Claim[];
}

export const RoleProfile = ({
  roleDetail,
  applicationClaim = [],
  onClaimChange,
}: Props) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleClaimChange = (claim: Claim) => (_: any, selected: boolean) => {
    onClaimChange(claim, selected);
  };

  const onBackClick = useCallback(() => {
    navigate("/sys-admin/roles");
  }, [navigate]);

  const { name, permissionClaims, isDeactivated } = roleDetail || {};

  // Group claims by category
  const groupedClaims = applicationClaim.reduce((acc, claim) => {
    const category = claim.claimCategory ?? 0; 
    if (!acc[category]) acc[category] = [];
    acc[category].push(claim);
    return acc;
  }, {} as Record<number, Claim[]>);

  const categories = Object.keys(groupedClaims)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <Box>
      {/* Back Button */}
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", py: 2 }}>
        <Button
          startIcon={<ChevronLeftIcon />}
          onClick={onBackClick}
          size="large"
          variant="outlined"
        >
          All Roles
        </Button>
      </Box>

      {/* Role Header */}
      <Box
        sx={{
          flex: 1,
          p: 2,
          display: "flex",
          gap: 2,
          alignItems: "center",
          borderRadius: 1,
          ...(isDeactivated && {
            backgroundColor: "rgba(255, 99, 70, 0.15)",
          }),
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          {name} {isDeactivated && <Typography component="span" color="error" fontWeight="bold">(DEACTIVATED)</Typography>}
        </Typography>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        {categories.map((category) => {
          const label =
            typeof category === "number" && ClaimCategory[category]
              ? ClaimCategory[category]
              : "Uncategorized";
          return <Tab key={category} label={label} />;
        })}
      </Tabs>

      <Divider sx={{ mt: 2 }} />

      {/* Claims Grid */}
      {categories.map((category, index) => {
        if (tabValue !== index) return null;

        const claims = groupedClaims[category];

        return (
          <Card
            key={category}
            variant="outlined"
            sx={{ mt: 3, p: 2, backgroundColor: theme.palette.background.paper }}
            elevation={1}
          >
            <CardContent>
              <Grid container spacing={2}>
                {claims.map((claim) => {
                  const isChecked = permissionClaims?.some(
                    (r) => r.claimValue === claim.claimValue
                  );

                  return (
                    <Grid
                      key={claim.claimValue}
                      item
                      xs={12}
                      sm={6}
                      md={4}
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
                      onClick={() => onClaimChange(claim, !isChecked)}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isChecked}
                            onChange={handleClaimChange(claim)}
                            onClick={(e) => e.stopPropagation()} 
                            inputProps={{
                              "aria-label": claim.claimValue ?? "claim checkbox",
                            }}
                          />
                        }
                        label={ 
                            <Typography
                              noWrap
                              sx={{ maxWidth: "100%", userSelect: "none" }}
                            >
                              {claim.claimValue}
                            </Typography>
                        }
                        sx={{ flexGrow: 1 }}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};
