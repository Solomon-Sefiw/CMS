import { Box, Typography, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import WorkIcon from "@mui/icons-material/Work";
import CategoryIcon from "@mui/icons-material/Category";
import GradeIcon from "@mui/icons-material/Grade";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import StraightenIcon from "@mui/icons-material/Straighten";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import NumbersIcon from "@mui/icons-material/Numbers";

import {
  CardGiftcard,
  CastForEducationRounded,
  ReadMoreOutlined,
  Public,
  LocationCity,
  School,
  SettingsSuggest,
  ClassSharp,
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

        {/* Job Role Category Card */}
        <Grid item xs={12} sm={6} md={2}>
          <Paper
            onClick={() => navigate("/job-role-category")}
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
            <ClassSharp sx={{ fontSize: 30, color: "#ccbb45" }} />
            <Typography
              variant="h6"
              sx={{
                mt: 2,
                fontWeight: "bold",
                color: "rgb(4, 18, 99)",
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              Job Role Category
            </Typography>
          </Paper>
        </Grid>

        {/* Job Category Card */}
        <Grid item xs={12} sm={6} md={2}>
          <Paper
            onClick={() => navigate("/jobcategory")}
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
            <CategoryIcon sx={{ fontSize: 30, color: "#28a745" }} />
            <Typography
              variant="h6"
              sx={{
                mt: 2,
                fontWeight: "bold",
                color: "rgb(4, 18, 99)",
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              Job Category
            </Typography>
          </Paper>
        </Grid>

        {/* Job Grade Card */}
        <Grid item xs={12} sm={6} md={2}>
          <Paper
            onClick={() => navigate("/jobgrade")}
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
            <GradeIcon sx={{ fontSize: 30, color: "#fbc02d" }} />
            <Typography
              variant="h6"
              sx={{
                mt: 2,
                fontWeight: "bold",
                color: "rgb(4, 18, 99)",
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              Job Grade
            </Typography>
          </Paper>
        </Grid>
 <Grid item xs={12} sm={6} md={2}>
          <Paper
            onClick={() => navigate("/measurement-unit")}
            elevation={3}
            sx={{
              padding: 3,
              borderRadius: "12px",
              textAlign: "center",
              cursor: "pointer",
              backgroundColor: "#fff",
              border: "2px solid #1976d2",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            <StraightenIcon sx={{ fontSize: 30, color: "#ff5722" }} />
            <Typography
              variant="h6"
              sx={{
                mt: 2,
                fontWeight: "bold",
                color: "rgb(4, 18, 99)",
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              Benefit Measurement
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Paper
            onClick={() => navigate("/benefit")}
            elevation={3}
            sx={{
              padding: 3,
              borderRadius: "12px",
              textAlign: "center",
              cursor: "pointer",
              backgroundColor: "#fff",
              border: "2px solid #1976d2",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            <CardGiftcardIcon sx={{ fontSize: 30, color: "#ff5722" }} />

            <Typography
              variant="h6"
              sx={{
                mt: 2,
                fontWeight: "bold",
                color: "rgb(4, 18, 99)",
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              Benefit
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Paper
            onClick={() => navigate("/benefit-unit-price")}
            elevation={3}
            sx={{
              padding: 3,
              borderRadius: "12px",
              textAlign: "center",
              cursor: "pointer",
              backgroundColor: "#fff",
              border: "2px solid #1976d2",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            <MonetizationOnIcon sx={{ fontSize: 30, color: "#ff5722" }} />
            <Typography
              variant="h6"
              sx={{
                mt: 2,
                fontWeight: "bold",
                color: "rgb(4, 18, 99)",
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              Unit Price
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Paper
            onClick={() => navigate("/benefit-value")}
            elevation={3}
            sx={{
              padding: 3,
              borderRadius: "12px",
              textAlign: "center",
              cursor: "pointer",
              backgroundColor: "#fff",
              border: "2px solid #1976d2",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            <NumbersIcon sx={{ fontSize: 30, color: "#ff5722" }} />

            <Typography
              variant="h6"
              sx={{
                mt: 2,
                fontWeight: "bold",
                color: "rgb(4, 18, 99)",
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              Benefit Value
            </Typography>
          </Paper>
        </Grid>
        {/* Job Role Card */}
        <Grid item xs={12} sm={6} md={2}>
          <Paper
            onClick={() => navigate("/jobrole")}
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
            <WorkIcon sx={{ fontSize: 30, color: "#af7060" }} />
            <Typography
              variant="h6"
              sx={{
                mt: 2,
                fontWeight: "bold",
                color: "rgb(4, 18, 99)",
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              Job Role
            </Typography>
          </Paper>
        </Grid>

        {/* New Job Card */}
        <Grid item xs={12} sm={6} md={2}>
          <Paper
            onClick={() => navigate("/job")}
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
            <WorkIcon sx={{ fontSize: 30, color: "#ff5722" }} />
            <Typography
              variant="h6"
              sx={{
                mt: 2,
                fontWeight: "bold",
                color: "rgb(4, 18, 99)",
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              New Job
            </Typography>
          </Paper>
        </Grid>

        {/* Education Level Card */}
        <Grid item xs={12} sm={6} md={2}>
          <Paper
            onClick={() => navigate("/education-level")}
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
            <CastForEducationRounded sx={{ fontSize: 30, color: "#ff5722" }} />
            <Typography
              variant="h6"
              sx={{
                mt: 2,
                fontWeight: "bold",
                color: "rgb(4, 18, 99)",
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              Education Level
            </Typography>
          </Paper>
        </Grid>

        {/* Awards Card */}
        <Grid item xs={12} sm={6} md={2}>
          <Paper
            onClick={() => navigate("/award")}
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
            <CardGiftcard sx={{ fontSize: 30, color: "#ff5722" }} />
            <Typography
              variant="h6"
              sx={{
                mt: 2,
                fontWeight: "bold",
                color: "rgb(4, 18, 99)",
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              Awards
            </Typography>
          </Paper>
        </Grid>

        {/* Field Of Study Card */}
        <Grid item xs={12} sm={6} md={2}>
          <Paper
            onClick={() => navigate("/field-of-study")}
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
            <ReadMoreOutlined sx={{ fontSize: 30, color: "#ff5722" }} />
            <Typography
              variant="h6"
              sx={{
                mt: 2,
                fontWeight: "bold",
                color: "rgb(4, 18, 99)",
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              Field Of Study
            </Typography>
          </Paper>
        </Grid>

        {/* Institution Card */}
        <Grid item xs={12} sm={6} md={2}>
          <Paper
            onClick={() => navigate("/institution-name")}
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
            <School sx={{ fontSize: 30, color: "#ff5722" }} />
            <Typography
              variant="h6"
              sx={{
                mt: 2,
                fontWeight: "bold",
                color: "rgb(4, 18, 99)",
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              Institution
            </Typography>
          </Paper>
        </Grid>

        {/* Region Card */}
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

        {/* Branch Grade Card */}
        <Grid item xs={12} sm={6} md={2}>
          <Paper
            onClick={() => navigate("/branch-grade")}
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
            <WorkspacePremiumIcon sx={{ fontSize: 30, color: "#ff5722" }} />
            <Typography
              variant="h6"
              sx={{
                mt: 2,
                fontWeight: "bold",
                color: "rgb(4, 18, 99)",
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              Branch Grade
            </Typography>
          </Paper>
        </Grid>

       
      </Grid>
    </Box>
  );
};

export default SetupMenu;
