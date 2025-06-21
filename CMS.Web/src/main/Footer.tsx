import { Box, Divider } from "@mui/material";
import { Copyright } from "./Copyright";

export const Footer = () => (
  <Box sx={{ mt: 3, paddingTop: 40 }}>
    <Divider />
    <Box sx={{ p: 2 }}>
      <Copyright />
    </Box>
  </Box>
);
