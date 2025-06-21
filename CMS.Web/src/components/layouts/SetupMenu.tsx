import { Box, Typography, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";

import {
  LocationCity,
  Public,
  SettingsSuggest,
} from "@mui/icons-material";

const SetupMenu: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: "#fff",
        minHeight: "50vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          color: "#3F51B5",
          fontWeight: "bold",
          marginBottom: 3,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <SettingsSuggest sx={{ fontSize: 20, color: "#3F51B9" }} />
        Setup Menu
      </Typography>

      <Grid
        container
        spacing={3}
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        {/* Business Unit Card */}
        <Grid item xs={12} sm={6} md={2}>
          <Paper
            onClick={() => navigate("/businessunit")}
            elevation={3}
            sx={{
              padding: 3,
              borderRadius: "12px",
              textAlign: "center",
              cursor: "pointer",
              backgroundColor: "#fff",
              border: "2px solid #1976d2",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            <BusinessCenterIcon sx={{ fontSize: 30, color: "#3F51B5" }} />
            <Typography
              variant="h6"
              sx={{
                mt: 2,
                fontWeight: "bold",
                color: "rgb(4, 18, 99)",
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              Business Unit
            </Typography>
          </Paper>
        </Grid>
                <Grid item xs={12} sm={6} md={2}>
          <Paper
            onClick={() => navigate("/region")}
            elevation={3}
            sx={{
              padding: 3,
              borderRadius: "12px",
              textAlign: "center",
              cursor: "pointer",
              backgroundColor: "#fff",
              border: "2px solid #1976d2",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            <Public sx={{ fontSize: 30, color: "#ff5722" }} />
            <Typography
              variant="h6"
              sx={{
                mt: 2,
                fontWeight: "bold",
                color: "rgb(4, 18, 99)",
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              Region
            </Typography>
          </Paper>
        </Grid>

        {/* Sub City Card */}
        <Grid item xs={12} sm={6} md={2}>
          <Paper
            onClick={() => navigate("/sub-city")}
            elevation={3}
            sx={{
              padding: 3,
              borderRadius: "12px",
              textAlign: "center",
              cursor: "pointer",
              backgroundColor: "#fff",
              border: "2px solid #1976d2",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            <LocationCity sx={{ fontSize: 30, color: "#ff5722" }} />
            <Typography
              variant="h6"
              sx={{
                mt: 2,
                fontWeight: "bold",
                color: "rgb(4, 18, 99)",
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              Sub City
            </Typography>
          </Paper>
        </Grid>



       
      </Grid>
    </Box>
  );
};

export default SetupMenu;
