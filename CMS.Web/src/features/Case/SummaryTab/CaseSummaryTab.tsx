import { Box, Paper } from "@mui/material";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { CaseBasicInfo } from "./CaseBasicInfo";

export const CaseSummaryTab = () => {
  const params = useParams();
  const caseId = useMemo(() => +(params?.id || 0), [params?.id]);


  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 1,
      }}
    >
      {!!caseId && (
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
              <CaseBasicInfo id={caseId} />
            </Paper>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 1,
                padding: 0,
              }}
            >
              <CaseBasicInfo id={caseId} />
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
              <CaseBasicInfo id={caseId} />
            </Paper>

            <Paper
              elevation={0}
              sx={{
                borderRadius: 1,
              }}
            >
              <CaseBasicInfo id={caseId} />
            </Paper>
          </Box>
        </>
      )}
    </Box>
  );
};
