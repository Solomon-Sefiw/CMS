import { useState, useCallback } from "react";
import { useGetCaseInfoQuery, useGetEmployeeInfoQuery } from "../../../app/api";
import dayjs from "dayjs";
import { Box, Button, Grid, Typography } from "@mui/material";
import { ContentCard } from "../../../components/ContentCard";
import { KeyValuePair } from "../../../components/KeyValuePair";
import {
  Edit,
  Person,
  AssuredWorkload,
  AssignmentInd,
  Bolt,
  Cake,
  HowToReg,
  Wc,
} from "@mui/icons-material";
import { Gender, MartialStatus } from "../../../app/api/enums";
import { usePermission } from "../../../hooks";
import { CaseDialog } from "../CaseDialog";

const formatDate = (date: string) =>
  date ? dayjs(date).format("MMMM D, YYYY") : "-";

export const CaseBasicInfo = ({
  id,
  version,
}: {
  id: number;
  version?: string;
}) => {
  const permissions = usePermission();
  // Destructure refetch from the RTK Query hook
  const { data: caseInfo, refetch } = useGetCaseInfoQuery(
    { id, version },
    { skip: !id }
  );
  const [caseInfoDialogOpened, setEmployeeInfoDialogOpened] =
    useState(false);

  const handleOpenDialog = useCallback(() => {
    setEmployeeInfoDialogOpened(true);
  }, []); // No need for employeeInfoDialogOpened in dependency array, just setting true

  // Callback to close the dialog and trigger a refetch
  const handleCloseDialog = useCallback(() => {
    setEmployeeInfoDialogOpened(false);
    refetch(); // Trigger refetch of employee info after dialog closes
  }, [refetch]);

  return (
    <>
      <ContentCard>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" color="primary">
            Employee Information
          </Typography>
          <Button
            onClick={handleOpenDialog}
            variant="contained"
            startIcon={<Edit />}
            size="small"
            color="primary"
            disabled={!permissions.CanCreateOrUpdateEmployeeInfo}
          >
            Edit
          </Button>
        </Box>

        <Box sx={{ p: 2, backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
          <Grid container spacing={2}>
            <KeyValuePair
              label="Employee Name:"
              value={caseInfo?.caseNumber || "-"}
              icon={<Person />}
            />
            <KeyValuePair
              label="Business Unit:"
              value={caseInfo?.caseNumber || "-"}
              icon={<AssuredWorkload />}
            />
            <KeyValuePair
              label="Job Title:"
              value={caseInfo?.caseNumber || "-"}
              icon={<AssignmentInd />}
            />
            <KeyValuePair
              label="Marital Status:"
              value={
                (caseInfo?.caseNumber &&
                  caseInfo?.caseNumber) ||
                "-"
              }
              icon={<Bolt />}
            />
            <KeyValuePair
              label="Gender:"
              value={
                (caseInfo?.caseNumber &&caseInfo.caseNumber) || "-"
              }
              icon={<Wc />}
            />
            <KeyValuePair
              label="Birth Date:"
              value={dayjs(caseInfo?.filedAt).format("DD MMM YYYY") || "-"}
              icon={<Cake />}
            />    
            <KeyValuePair
              label="Employment Date:"
              value={dayjs(caseInfo?.closedAt).format("DD MMM YYYY") || "-"}
              icon={<HowToReg />}
            />
          </Grid>
        </Box>

        {caseInfoDialogOpened && (
          <CaseDialog
            onClose={handleCloseDialog} 
            caseData={caseInfo}
            title="Update Employee"
          />
        )}
      </ContentCard>
    </>
  );
};