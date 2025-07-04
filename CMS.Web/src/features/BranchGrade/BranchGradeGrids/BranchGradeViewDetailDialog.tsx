import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  TextField,
  Stack,
  Paper,
  Divider,
} from "@mui/material";
import { BranchGradeDto } from "../../../app/api";
import { ApprovalStatus } from "../../../app/api/enums";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import {
  Description,
  Group,
  Info,
  Comment as CommentIcon,
} from "@mui/icons-material";

interface BranchGradeViewDetailDialogProps {
  branchGrade: BranchGradeDto;
  onClose: () => void;
}

export const BranchGradeViewDetailDialog = ({
  branchGrade,
  onClose,
}: BranchGradeViewDetailDialogProps) => (
  <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
    <DialogContent sx={{ p: 3 }}>
      <Typography
        variant="h5"
        align="center"
        sx={{ fontWeight: "bold", color: "#003366", mb: 3 }}
      >
        Branch Grade Details
      </Typography>

      <Paper
        elevation={1}
        sx={{ p: 3, backgroundColor: "#f9f9f9", borderRadius: 2 }}
      >
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <WorkspacePremiumIcon sx={{ color: "#003366" }} />
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", color: "#003366" }}
              >
                Grade
              </Typography>
            </Stack>
            <Typography sx={{ ml: 4 }}>{branchGrade.grade}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Group sx={{ color: "#003366" }} />
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", color: "#003366" }}
              >
                Staff Strength
              </Typography>
            </Stack>
            <Typography sx={{ ml: 4 }}>{branchGrade.staffLimit}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Info sx={{ color: "#003366" }} />
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", color: "#003366" }}
              >
                Status
              </Typography>
            </Stack>
            <Typography sx={{ ml: 4 }}>
              {ApprovalStatus[branchGrade.approvalStatus as ApprovalStatus] ??
                "N/A"}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 1 }}
            >
              <Description sx={{ color: "#003366" }} />
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", color: "#003366" }}
              >
                Description
              </Typography>
            </Stack>
            <TextField
              multiline
              fullWidth
              value={branchGrade.description || "No description available"}
              InputProps={{ readOnly: true }}
              rows={3}
              variant="outlined"
              sx={{ backgroundColor: "#f0f0f0", borderRadius: 1 }}
            />
          </Grid>

          <Grid item xs={12}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mt: 2, mb: 1 }}
            >
              <CommentIcon sx={{ color: "#003366" }} />
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", color: "#003366" }}
              >
                Remark
              </Typography>
            </Stack>
            <TextField
              multiline
              fullWidth
              value={branchGrade.remark || "No remarks available"}
              InputProps={{ readOnly: true }}
              rows={3}
              variant="outlined"
              sx={{ backgroundColor: "#f0f0f0", borderRadius: 1 }}
            />
          </Grid>
        </Grid>
      </Paper>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 3 }}>
      <Button onClick={onClose} variant="contained" fullWidth color="primary">
        Close
      </Button>
    </DialogActions>
  </Dialog>
);
