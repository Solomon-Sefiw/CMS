import { DialogHeader } from "../../../components";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { JobGradeStepDto, JobGradeDto } from "../../../app/api/HCMSApi";

import FactoryIcon from "@mui/icons-material/Factory";
import {
  Category,
  CategoryTwoTone,
  Description,
  HomeMax,
} from "@mui/icons-material";
import { JobGradeRomanId } from "../../../app/api/enums";
import DescriptionIcon from "@mui/icons-material/Description";
const emptyJobGradeData = {
  name: "",
  baseSalary: 0.0,
  stepCoefficient: 0.0,
  ceilingSalary: 0.0,
  description: "",
  jobGradeSteps: [] as JobGradeStepDto[],
};

interface JobGradeDetailProps {
  onClose: () => void;
  JobGrades?: JobGradeDto;
}
export const JobGradeDetail = ({ onClose, JobGrades }: JobGradeDetailProps) => {
  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
      fullWidth
    >
      {!!JobGrades && (
        <>
          <DialogHeader title="JobGrade Detail " onClose={onClose} />
          <DialogContent dividers={true}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={5}>
                <Box display="flex" alignItems="center" gap={1}>
                  <FactoryIcon color="action" />
                  <Typography variant="body2" color="textSecondary" noWrap>
                    JobGrade ID:
                  </Typography>

                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    noWrap
                    sx={{ wordBreak: "break-all" }}
                  >
                    {JobGrades?.jobGradeRomanId !== undefined
                      ? JobGradeRomanId[JobGrades.jobGradeRomanId]
                      : "N/A"}{" "}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={5}>
                <Box display="flex" alignItems="center" gap={1}>
                  <FactoryIcon color="action" />
                  <Typography variant="body2" color="textSecondary" noWrap>
                    JobGrade Name:
                  </Typography>

                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    noWrap
                    sx={{ wordBreak: "break-all" }}
                  >
                    {JobGrades?.name}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={5}>
                <Box display="flex" alignItems="center" gap={1}>
                  <HomeMax color="action" />
                  <Typography variant="body2" color="textSecondary" noWrap>
                    JobGrade Step Coeffiecinet:
                  </Typography>

                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    noWrap
                    sx={{ wordBreak: "break-all" }}
                  >
                    {JobGrades?.stepCoefficient}
                    {"%"}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={5}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Category color="action" />
                  <Typography variant="body2" color="textSecondary" noWrap>
                    JobGrade Base Salary:
                  </Typography>

                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    noWrap
                    sx={{ wordBreak: "break-all" }}
                  >
                    {JobGrades?.baseSalary}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={5}>
                <Box display="flex" alignItems="center" gap={1}>
                  <CategoryTwoTone color="action" />
                  <Typography variant="body2" color="textSecondary" noWrap>
                    JobGrade Ceiling Salary:
                  </Typography>

                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    noWrap
                    sx={{ wordBreak: "break-all" }}
                  >
                    {JobGrades?.ceilingSalary}
                  </Typography>
                </Box>
              </Grid>
              <Grid>
                <Box></Box>
              </Grid>
              <Grid item xs={12} sm={5}>
                <Box>
                  <Typography variant="body2" color="textSecondary" noWrap>
                    JobGrade steps are:
                  </Typography>
                  <List
                    sx={{
                      display: "grid", // Use CSS Grid
                      gridTemplateColumns: "repeat(2, 1fr)", // Define two columns
                      gap: 2, // Space between items
                      padding: 0, // Remove default padding
                    }}
                  >
                    {JobGrades?.jobGradeSteps?.map((step, index) => (
                      <ListItem key={index}>
                        <Typography variant="body2">
                          Step {step.stepNumber}: {step.salaryAmount} Birr
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Grid>

              <Grid item xs={12} sm={5}>
                <Box display="flex" alignItems="center" gap={1}>
                  <DescriptionIcon color="action" />
                  <Typography variant="body2" color="textSecondary" noWrap>
                    JobGrade Description:
                  </Typography>

                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    noWrap
                    sx={{ wordBreak: "break-all" }}
                  >
                    {JobGrades?.description}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={onClose}>Close</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};
