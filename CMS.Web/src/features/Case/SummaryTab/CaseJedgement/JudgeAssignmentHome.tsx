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
import { Add, Edit, GavelOutlined, BusinessOutlined } from "@mui/icons-material";
import { useMemo, useState } from "react";
import { ContentCard } from "../../../../components/ContentCard";
import { usePermission } from "../../../../hooks";
import { JudgeAssignmentDto, useGetJudgeAssignmentsByCaseIdQuery } from "../../../../app/store";
import { useParams } from "react-router-dom";
import { JudgeAssignmentDialog } from "./JudgeAssignmentDialog";

export const JudgeAssignmentHome = () => {
    const params = useParams();
    const caseId = useMemo(() => +(params?.id || 0), [params?.id]);

  const { data: assignments } = useGetJudgeAssignmentsByCaseIdQuery(    { caseId },
    { skip: !caseId });
    
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<
    JudgeAssignmentDto | undefined
  >();
  const [tabValue, setTabValue] = useState(0);
  const permissions = usePermission();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) =>
    setTabValue(newValue);

  const handleDialogOpen = () => setDialogOpen(true);
  const handleEdit = (assignment: JudgeAssignmentDto) =>
    setSelectedAssignment(assignment);

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
          <Tab label="Judge Assignments" />
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
            <GavelOutlined /> Assign Judge
          </Button>
        )}
      </Box>

      {tabValue === 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {assignments?.map((assignment) => (
            <Card
              key={assignment.id}
              sx={{
                p: 2,
                borderRadius: 2,
                boxShadow: 1,
                flex: "1 1 300px",
                minWidth: "300px",
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}
              >
                <Avatar>
                  <GavelOutlined />
                </Avatar>
                <Typography fontWeight="bold">
                  Judge Assignment #{assignment.id}
                </Typography>
              </Box>
              <Divider sx={{ mb: 1 }} />
              <Typography variant="body2">
                <strong>Judge:</strong> {assignment.judgeName || "Auto-assigned"}
              </Typography>
              <Typography variant="body2">
                <strong>Case ID:</strong> {assignment.caseId}
              </Typography>
              <Typography variant="body2">
                <strong>Chilot:</strong> {assignment.chilotName}
              </Typography>
              <Typography variant="body2">
                <strong>Business Unit:</strong> {assignment.businessUnitName}
              </Typography>
              <Typography variant="body2">
                <strong>Role:</strong> {assignment.role}
              </Typography>

              <Box sx={{ mt: 2, textAlign: "right" }}>
                <Button
                  onClick={() => handleEdit(assignment)}
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
        <JudgeAssignmentDialog
          onClose={() => setDialogOpen(false)}
          title="Assign Judge"
          caseId={caseId}

        />
      )}

      {selectedAssignment && (
        <JudgeAssignmentDialog
          onClose={() => setSelectedAssignment(undefined)}
          title="Update Judge Assignment"
          assignment={selectedAssignment}
          caseId={caseId}
        />
      )}
    </ContentCard>
  );
};
