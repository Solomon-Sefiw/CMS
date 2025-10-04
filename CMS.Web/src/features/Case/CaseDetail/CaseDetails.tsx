import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import {
  useGetCaseInfoQuery,
} from "../../../app/api/HCMSApi";
import { CaseDetailHeader } from "./CaseDetailHeader";
import { CaseDetailTabs } from "./CaseDetailTabs";
import { useCaseId } from "./useCaseId";

export const CaseDetail = () => {
  const { id: caseId, version } = useCaseId();
  const skipFetching = { skip: !caseId };


  const { data: caseInfo } = useGetCaseInfoQuery(
    {
      id: caseId,
      version,
    },
    skipFetching
  );

  // useEffect(() => {
  //   if (employeeId && employeeInfo) {
  //     refetchChangeLogs();
  //   }
  // }, [employeeId, employeeInfo, refetchChangeLogs]);

  // if (!employeeInfo) {
  //   return null;
  // }

  return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ flex: 1 }}>
        <Grid container rowSpacing={4.5}>
          <Grid item xs={12} sx={{ mb: -4 }}>
            <CaseDetailHeader />
          </Grid>
          {/* {!!changeLabels?.length && (
            <Grid item xs={12}>
              <EmployeeChangeLog changeLabels={changeLabels} />
            </Grid>
          )} */}
          <Grid item xs={12} sx={{ mt: 1 }}>
            <Paper sx={{ p: 2, flex: 1 }}>
              <CaseDetailTabs />
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