import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { Fragment, useState } from "react";
import {
  JobDto,
  JobStatus,
  useGetJobCountPerStatusQuery,
  useGetJobForPaginationQuery,
} from "../../../../app/api";
import { ApprovalStatus } from "../../../../app/api/enums";
import { JobDialog } from "../JobDialog";
import { RequestApprovalButton } from "../RequestApprovalButton";
import { ApproveOrRejectRequestButton } from "../ApproveOrRejectRequestButton";
import { Pagination } from "../../../../components/Pagination";
import { ActivateOrDeActivateButton } from "../ActivateOrDeActivateButton";
import { border } from "@material-ui/system";
import WarningIcon from "@mui/icons-material/Warning";
export const ApprovedJobs = () => {
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 10,
  });

  const { data: counts, isLoading: isCountsLoading } =
    useGetJobCountPerStatusQuery();
  const { data: items, isLoading: isListLoading } = useGetJobForPaginationQuery(
    {
      pageNumber: pagination.pageNumber + 1,
      pageSize: pagination.pageSize,
      status: ApprovalStatus.Approved,
    }
  );

  const [selectedJob, setSelectedJob] = useState<JobDto>();
  const isLoading = isCountsLoading || isListLoading;

  const getJobStatusLabel = (jobStatus: number | undefined): string => {
    switch (jobStatus) {
      case 1:
        return "Active";
      case 2:
        return "Inactive";
      default:
        return "Unknown";
    }
  };

  const getRowStyle = (jobStatus: number | undefined) => {
    return {
      backgroundColor: jobStatus === 2 ? "#f0f4c3" : "white",
    };
  };

  return (
    <Box>
      {!isLoading && !!counts?.approved && (
        <Paper>
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Business Unit
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Job Role</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Vacant</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Job Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Locked</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(items?.items || []).map((item) => (
                  <Fragment key={item.id}>
                    <TableRow hover={false} style={getRowStyle(item.jobStatus)}>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.businessUnit}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.jobRole}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.vacant}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {getJobStatusLabel(item.jobStatus)}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.isLocked ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                          }}
                        >
                          {item.id &&
                            item.approvalStatus === ApprovalStatus.Draft && (
                              <RequestApprovalButton id={item.id} />
                            )}
                          {item.id &&
                            item.approvalStatus ===
                              ApprovalStatus.Submitted && (
                              <ApproveOrRejectRequestButton id={item.id} />
                            )}
                          {/* {item.id &&
                            item.approvalStatus !== ApprovalStatus.Submitted &&
                            item.jobStatus !== 2 && (
                              <Button
                                size="small"
                                onClick={() => setSelectedJob(item)}
                              >
                                Edit
                              </Button>
                            )} */}
                          {item.id && (
                            <ActivateOrDeActivateButton
                              id={item.id}
                              initialStatus={item.jobStatus as JobStatus}
                            />
                          )}
                          {item.isJobCountExceed && (
                            <Tooltip title="The job is exceeding the Business Unit Staff Strength Limit">
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <WarningIcon color="warning" />
                              </Box>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Pagination
        pageNumber={pagination.pageNumber}
        pageSize={pagination.pageSize}
        onChange={setPagination}
        totalRowsCount={counts?.approved || 0}
        rowsPerPageOptions={[10, 20, 50]}
      />

      {selectedJob && (
        <JobDialog
          job={selectedJob}
          onClose={() => setSelectedJob(undefined)}
          title="Edit Job"
        />
      )}

      {!isLoading && !counts?.approved && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Typography>No Data Available</Typography>
        </Box>
      )}
    </Box>
  );
};
