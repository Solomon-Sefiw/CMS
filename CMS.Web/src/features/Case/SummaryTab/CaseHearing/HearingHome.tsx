import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Typography,
  Tab,
  Tabs,
} from "@mui/material";
import { Add, Edit, GavelOutlined } from "@mui/icons-material";
import { useMemo, useState } from "react";
import { ContentCard } from "../../../../components/ContentCard";
import { usePermission } from "../../../../hooks";
import { useParams } from "react-router-dom";
import { HearingDialog } from "./HearingDialog";
import { HearingDto, useGetHearingByCaseIdQuery } from "../../../../app/api/HCMSApi";

export const HearingHome = () => {
  const params = useParams();
  const caseId = useMemo(() => +(params?.id || 0), [params?.id]);

  const { data: hearings } = useGetHearingByCaseIdQuery({ caseId }, { skip: !caseId });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedHearing, setSelectedHearing] = useState<HearingDto | undefined>();
  const [tabValue, setTabValue] = useState(0);
  const permissions = usePermission();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) =>
    setTabValue(newValue);

  const handleDialogOpen = () => setDialogOpen(true);
  const handleEdit = (hearing: HearingDto) => setSelectedHearing(hearing);

  return (
    <ContentCard>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Hearings" />
        </Tabs>

        {tabValue === 0 && (
          <Button
            onClick={handleDialogOpen}
            variant="contained"
            startIcon={<Add />}
            color="success"
            size="small"
            disabled={!permissions.CanCreateOrUpdateEmployeeInfo}
          >
            <GavelOutlined /> Add Hearing
          </Button>
        )}
      </Box>

      {tabValue === 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {hearings?.map((hearing) => (
            <Card
              key={hearing.id}
              sx={{
                p: 2,
                borderRadius: 2,
                boxShadow: 1,
                flex: "1 1 300px",
                minWidth: "300px",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}>
                <Avatar>
                  <GavelOutlined />
                </Avatar>
                <Typography fontWeight="bold">
                  Hearing #{hearing.id}
                </Typography>
              </Box>
              <Divider sx={{ mb: 1 }} />
              <Typography variant="body2">
                <strong>Scheduled At:</strong>{" "}
                {hearing.scheduledAt ? new Date(hearing.scheduledAt).toLocaleString() : "-"}
              </Typography>
              <Typography variant="body2">
                <strong>Type:</strong> {hearing.hearingType}
              </Typography>
              <Typography variant="body2">
                <strong>Location:</strong> {hearing.locationOrUrl || "-"}
              </Typography>
              <Typography variant="body2">
                <strong>Responsible Judge:</strong> {hearing.responsibleJudgeName || "-"}
              </Typography>
              <Typography variant="body2">
                <strong>Chilot:</strong> {hearing.chilotName || "-"}
              </Typography>
              <Typography variant="body2">
                <strong>Business Unit:</strong> {hearing.businessUnitName || "-"}
              </Typography>
              <Typography variant="body2">
                <strong>Notes:</strong> {hearing.notes || "-"}
              </Typography>

              <Box sx={{ mt: 2, textAlign: "right" }}>
                <Button
                  onClick={() => handleEdit(hearing)}
                  variant="contained"
                  color="primary"
                  size="small"
                  disabled={!permissions.CanCreateOrUpdateEmployeeInfo}
                >
                  <Edit fontSize="small" />
                </Button>
              </Box>
            </Card>
          ))}
        </Box>
      )}

      {dialogOpen && (
        <HearingDialog
          onClose={() => setDialogOpen(false)}
          title="Add Hearing"
          caseId={caseId}
        />
      )}

      {selectedHearing && (
        <HearingDialog
          onClose={() => setSelectedHearing(undefined)}
          title="Update Hearing"
          hearing={selectedHearing}
          caseId={caseId}
        />
      )}
    </ContentCard>
  );
};
