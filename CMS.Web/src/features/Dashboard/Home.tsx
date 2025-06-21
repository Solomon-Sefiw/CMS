import {
  Grid,
  Box,
} from "@mui/material";
import LetterDashboardDemo from "./ApprovalDashboard";
const HomePage = () => {
  return (

    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container spacing={2}>
          {/* <DashboardCards />
          <DashboardGraphs />
          <ApprovalDashboard /> */}
          <LetterDashboardDemo />
      </Grid>
    </Box>
  );
};

export default HomePage;
