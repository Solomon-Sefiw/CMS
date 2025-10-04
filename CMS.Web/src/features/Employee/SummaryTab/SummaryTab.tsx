import { Box, Paper } from "@mui/material";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { EmployeeInfo } from "./EmployeeBasicInfo";
import { JobCatagoryListTest } from "./JobCategoryListTest";
import { EmployeeFamily } from "./EmployeeFamily/EmployeeFamily";
import { LanguageSkill } from "./LanguageSkill/LanguageSkill";

export const SummaryTab = () => {
  const params = useParams();
  const employeeId = useMemo(() => +(params?.id || 0), [params?.id]);


  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 1,
      }}
    >
      {!!employeeId && (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              gap: 1,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                borderRadius: 1,
                padding: 0,
              }}
            >
              <EmployeeInfo id={employeeId} />
            </Paper>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 1,
                padding: 0,
              }}
            >
              <LanguageSkill />
            </Paper>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              gap: 1,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                borderRadius: 1,
              }}
            >
              <EmployeeFamily employeeId={employeeId} />
            </Paper>

            <Paper
              elevation={0}
              sx={{
                borderRadius: 1,
              }}
            >
              <JobCatagoryListTest employeeId={employeeId} />
            </Paper>
          </Box>
        </>
      )}
    </Box>
  );
};
