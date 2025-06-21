import {
  Grid,
  Box,
  Typography,
} from "@mui/material";
const HomePage = () => {
  return (

    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container spacing={2}>
          {/* <DashboardCards />
          <DashboardGraphs />
          <ApprovalDashboard /> */}
          <Typography variant="h2">Hello World</Typography>
      </Grid>
    </Box>
  );
};

export default HomePage;
