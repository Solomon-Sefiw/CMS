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
import { Add, Description, Edit } from "@mui/icons-material";
import { useMemo, useState } from "react";
import { ContentCard } from "../../../../components/ContentCard";
import { usePermission } from "../../../../hooks";
import { useParams } from "react-router-dom";
import { JudgmentDto, useGetJudgmentsByCaseIdQuery } from "../../../../app/api/HCMSApi";
import { JudgmentDialog } from "./JudgmentDialog";

export const JudgmentHome = () => {
  const params = useParams();
  const caseId = useMemo(() => +(params?.id || 0), [params?.id]);
  const { data: judgments } = useGetJudgmentsByCaseIdQuery({ caseId }, { skip: !caseId });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedJudgment, setSelectedJudgment] = useState<JudgmentDto | undefined>();
  const [tabValue, setTabValue] = useState(0);
  const permissions = usePermission();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) =>
    setTabValue(newValue);

  const handleDialogOpen = () => setDialogOpen(true);
  const handleEdit = (judgment: JudgmentDto) => setSelectedJudgment(judgment);

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
          <Tab label="Judgments" />
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
            <Description /> Add Judgment
          </Button>
        )}
      </Box>

      {tabValue === 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {judgments?.map((judgment) => (
            <Card
              key={judgment.id}
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
                  <Description />
                </Avatar>
                <Typography fontWeight="bold">
                  Judgment #{judgment.id}
                </Typography>
              </Box>
              <Divider sx={{ mb: 1 }} />
              <Typography variant="body2">
                <strong>Signed By:</strong> {judgment.signedByName || "-"}
              </Typography>
              <Typography variant="body2">
                <strong>Signed At:</strong>{" "}
                {judgment.signedAt ? new Date(judgment.signedAt).toLocaleString() : "-"}
              </Typography>
              <Typography variant="body2">
                <strong>Published:</strong> {judgment.isPublished ? "Yes" : "No"}
              </Typography>
              <Typography variant="body2">
                <strong>Published At:</strong>{" "}
                {judgment.publishedAt ? new Date(judgment.publishedAt).toLocaleString() : "-"}
              </Typography>
              <Typography variant="body2">
                <strong>Notes:</strong> {judgment.htmlContent || "-"}
              </Typography>

              <Box sx={{ mt: 2, textAlign: "right" }}>
                <Button
                  onClick={() => handleEdit(judgment)}
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
        <JudgmentDialog
          onClose={() => setDialogOpen(false)}
          title="Add Judgment"
          caseId={caseId}
        />
      )}

      {selectedJudgment && (
        <JudgmentDialog
          onClose={() => setSelectedJudgment(undefined)}
          title="Update Judgment"
          judgment={selectedJudgment}
          caseId={caseId}
        />
      )}
    </ContentCard>
  );
};
