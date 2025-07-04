import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Typography,
} from "@mui/material";
import { DialogHeader } from "../../../components";
import { JobCategoryDto } from "../../../app/api/HCMSApi";
import {
  Category,
  CalendarToday,
  AccessTime,
  ErrorOutline,
} from "@mui/icons-material";

// Function to format date to MM/DD/YYYY
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US").format(date);
};

interface JobCategoryDetailProps {
  onClose: () => void;
  jobCategory?: JobCategoryDto;
}

export const JobCategoryDetail = ({
  onClose,
  jobCategory,
}: JobCategoryDetailProps) => {
  if (!jobCategory) {
    return (
      <Dialog scroll="paper" disableEscapeKeyDown maxWidth="sm" open fullWidth>
        <DialogHeader title="Job Category Detail" onClose={onClose} />
        <DialogContent>
          <Box display="flex" alignItems="center" gap={1}>
            <ErrorOutline color="error" />
            <Typography variant="body1">Job Category not available</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog scroll="paper" disableEscapeKeyDown maxWidth="sm" open fullWidth>
      <>
        <DialogHeader title="Job Category Detail" onClose={onClose} />
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Job Category Name */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={2}>
                <Category color="primary" />
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Category Name
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {jobCategory.jobCategoryName || "N/A"}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Probation Period */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={2}>
                <AccessTime color="primary" />
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Probation Period (Days)
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {jobCategory.probationPeriodInDays ?? "N/A"}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Last Modified At */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={2}>
                <CalendarToday color="primary" />
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Last Modified At
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {jobCategory.lastModifiedAt
                      ? formatDate(jobCategory.lastModifiedAt)
                      : "N/A"}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </>
    </Dialog>
  );
};
