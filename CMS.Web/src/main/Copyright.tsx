import { Typography, Link } from "@mui/material";

export const Copyright = () => (
  <Typography variant="body2" color="text.secondary" align="center">
    {"Copyright © "}
    <Link color="inherit" href="https://????">
     
    </Link>
    {` ${new Date().getFullYear()}`}.
  </Typography>
);
