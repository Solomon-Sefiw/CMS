import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { EducationDto, useGetEducationByIdQuery } from "../../../../app/api";
import { ContentCard } from "../../../../components/ContentCard";
import { useMemo, useState } from "react";
import { EducationDialog } from "./EducationDialog";
import {
  Add,
  Edit,
  SchoolOutlined,
  LocationOnTwoTone,
} from "@mui/icons-material";
import { EmployeeExperienceHome } from "../EmployeeExperience/EmployeeExperienceHome";
import { EmployeeGuaranter } from "../EmployeeGuaranters/EmployeeGuaranter";
import { useParams } from "react-router-dom";
import { usePermission } from "../../../../hooks";

export const EmployeeEducation = () => {
  const params = useParams();
  const employeeId = useMemo(() => +(params?.id || 0), [params?.id]);
console.log(employeeId)
  const { data: educations } = useGetEducationByIdQuery(
    { employeeId },
    { skip: !employeeId }
  );
  const [tabValue, setTabValue] = useState(0);
  const [selectedEducation, setSelectedEducation] = useState<EducationDto>();
  const permissions = usePermission();
  const [dialogOpened, setDialogOpened] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) =>
    setTabValue(newValue);

  const handleEducationDialogOpen = () => setDialogOpened(true);
  const handleEducationSelect = (education: EducationDto) =>
    setSelectedEducation(education);

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
          <Tab label="Education" />
          <Tab label="Experience" />
          <Tab label="Guaranter" />
        </Tabs>

        {tabValue === 0 && (
          <Button
            onClick={handleEducationDialogOpen}
            variant="contained"
            startIcon={<Add />}
            size="small"
            color="success"
            disabled={!permissions.CanCreateOrUpdateEmployeeInfo}
          >
            <SchoolOutlined /> Add Education
          </Button>
        )}
      </Box>

      {/* Education Tab Content */}
      {tabValue === 0 && (
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Card
            sx={{ p: 2, borderRadius: "8px", boxShadow: 1, flex: "1 1 300px" }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Avatar sx={{ mr: 1 }}>
                <SchoolOutlined />
              </Avatar>
              <Typography variant="subtitle1" fontWeight="bold">
                Educational Background
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            {educations?.map((education) => (
              <Box key={education.id}>
                <Divider />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 1,
                  }}
                >
                  <Box>
                    <Typography variant="body1">
                      {education?.fieldOfStudyName} (
                      {education.educationLevelName})
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      From {education?.startDate} - To {education?.endDate}
                    </Typography>
                  </Box>

                  <Box sx={{ flex: 1, textAlign: "center" }}>
                    {" "}
                    {/* Middle for Award */}
                    {education?.awardName && (
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        fontWeight="bold"
                      >
                        Award: {education.awardName}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ mr: 2 }}>
                    <Typography
                      variant="body2"
                      color="primary"
                      fontWeight="bold"
                    >
                      {education?.institutionName}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                        <LocationOnTwoTone />
                      </Avatar>
                      <Typography variant="body2">
                        {education.schoolCity}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Button
                      onClick={() => handleEducationSelect(education)}
                      variant="contained"
                      size="small"
                      color="primary"
                      disabled={!permissions.CanCreateOrUpdateEmployeeInfo}
                    >
                      <Edit />
                    </Button>
                  </Box>
                </Box>
              </Box>
            ))}
          </Card>
        </Box>
      )}

      {/* Tab 2: Experience */}
      {tabValue === 1 && <EmployeeExperienceHome />}

      {/* Tab 3: Guaranter */}
      {tabValue === 2 && <EmployeeGuaranter />}

      {/* Education Dialog */}
      {dialogOpened && (
        <EducationDialog
          requestId={employeeId}
          onClose={() => setDialogOpened(false)}
          title="Add Education"
        />
      )}
      {selectedEducation && (
        <EducationDialog
          requestId={employeeId}
          education={selectedEducation}
          onClose={() => setSelectedEducation(undefined)}
          title="Update Education"
        />
      )}
    </ContentCard>
  );
};
