import { Grid, Typography, Box } from "@mui/material";
import { PropsWithChildren, ReactNode } from "react";

export const KeyValuePair = ({
  label,
  value,
  children,
  icon,
}: {
  label: string;
  value?: string | number | null;
  icon?: ReactNode; // Accepts an optional icon
} & PropsWithChildren) => (
  <Grid container sx={{ py: 0.1 }}>
    <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
      {icon && (
        <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>{icon}</Box>
      )}
      <Typography variant={"body2"}>{label}</Typography>
    </Grid>
    <Grid item xs={9} sx={{ display: "flex", alignItems: "center", px: 1 }}>
      {value && (
        <Typography variant={"subtitle2"} sx={{ mr: 2, flex: 1 }}>
          {value}
        </Typography>
      )}
      {children}
    </Grid>
  </Grid>
);
