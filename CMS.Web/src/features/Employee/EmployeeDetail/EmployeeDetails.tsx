import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useEmployeeId } from "./useEmployeeId";
import {
  useGetEmployeeInfoQuery,
} from "../../../app/api/HCMSApi";
import { EmployeeDetailHeader } from "./EmployeeDetailHeader";
import { EmployeeDetailTabs } from "./EmployeeDetailTabs";
import { EmployeeChangeLog, useEmployeeChangeLogs } from "./employeeChangeLog";

export const EmployeeDetail = () => {
  const { id: employeeId, version } = useEmployeeId();
  const skipFetching = { skip: !employeeId };

  const { changeLabels, refetchChangeLogs } = useEmployeeChangeLogs();

  const { data: employeeInfo } = useGetEmployeeInfoQuery(
    {
      id: employeeId,
      version,
    },
    skipFetching
  );

  useEffect(() => {
    if (employeeId && employeeInfo) {
      refetchChangeLogs();
    }
  }, [employeeId, employeeInfo, refetchChangeLogs]);

  if (!employeeInfo) {
    return null;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ flex: 1 }}>
        <Grid container rowSpacing={4.5}>
          <Grid item xs={12} sx={{ mb: -4 }}>
            <EmployeeDetailHeader />
          </Grid>
          {!!changeLabels?.length && (
            <Grid item xs={12}>
              <EmployeeChangeLog changeLabels={changeLabels} />
            </Grid>
          )}
          <Grid item xs={12} sx={{ mt: 1 }}>
            <Paper sx={{ p: 2, flex: 1 }}>
              <EmployeeDetailTabs />
              <Divider />
              <Box
                sx={{
                  backgroundColor: "#fafafb",
                  padding: 1,
                  paddingBottom: 2,
                }}
              >
                <Outlet />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Typography
              variant="h5"
              sx={{ lineHeight: 2, flex: 1, pt: 3 }}
              color="textSecondary"
            >
              Notes & Comments
            </Typography>

          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: { sm: "none", md: "block", lg: "none" } }}
          />
        </Grid>
        <Grid item xs={12}></Grid>
      </Box>
    </Box>
  );
};