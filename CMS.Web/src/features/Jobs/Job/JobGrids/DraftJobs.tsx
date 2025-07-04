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
  Typography,
  Tooltip, // Import Tooltip for showing messages on hover
} from "@mui/material";
import { Fragment, useState } from "react";
import WarningIcon from "@mui/icons-material/Warning"; // Import WarningIcon
import {
  JobDto,
  useGetJobCountPerStatusQuery,
  useGetJobForPaginationQuery,
} from "../../../../app/api";
import { ApprovalStatus } from "../../../../app/api/enums";
import { JobDialog } from "../JobDialog";
import { RequestApprovalButton } from "../RequestApprovalButton";
import { ApproveOrRejectRequestButton } from "../ApproveOrRejectRequestButton";
import { Pagination } from "../../../../components/Pagination";
import { useAlert } from "../../../notification";
import { usePermission } from "../../../../hooks";

export const DraftJobs = () => {
  const permissions = usePermission();
  const [pagination, setPagination] = useState<{
    pageNumber: number;
    pageSize?: number;
  }>({
    pageNumber: 0,
    pageSize: 10,
  });
  const { data: counts, isLoading: isCountsLoading } =
    useGetJobCountPerStatusQuery();
  const { data: items, isLoading: isListLoading } = useGetJobForPaginationQuery(
    {
      pageNumber: pagination.pageNumber + 1,
      pageSize: pagination.pageSize,
      status: ApprovalStatus.Draft,
    }
  );
  const [selectedJob, setSelectedJob] = useState<JobDto>();
  const { showInfoAlert } = useAlert();
  const isLoading = isCountsLoading || isListLoading;
  const getJobStatusLabel = (status: number | undefined): string => {
    if (status === undefined) {
      return "Unknown";
    }
    switch (status) {
      case 1:
        return "Active";
      case 2:
        return "Inactive";
      default:
        return "Unknown";
    }
  };

  return (
    <Box>
      {!isLoading && !!counts?.drafts && (
        <Paper>
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Business Unit
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}> Job Role</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Vacant</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}> Job Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}> Locked</TableCell>

                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(items?.items || []).map((item) => (
                  <Fragment key={item.id}>
                    <TableRow hover={false} key={item.id}>
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
                        {item.locked}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                          }}
                        >
                          {item.id && (
                            <>
                              {item.approvalStatus === ApprovalStatus.Draft && (
                                <RequestApprovalButton id={item.id} />
                              )}
                              {item.approvalStatus ===
                                ApprovalStatus.Submitted && (
                                <ApproveOrRejectRequestButton id={item.id} />
                              )}
                            </>
                          )}
                          {/* Display the warning message if job count exceeds */}

                          {item.approvalStatus ===
                            (ApprovalStatus.Draft ||
                              ApprovalStatus.Rejected) && (
                            <Button
                              size="small"
                              onClick={() => setSelectedJob(item)}
                              disabled={!permissions.canCreateUpdateSetup}
                            >
                              Edit
                            </Button>
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
        totalRowsCount={counts?.drafts}
        rowsPerPageOptions={[10, 20, 50]}
      />
      {selectedJob && (
        <JobDialog
          job={selectedJob}
          onClose={() => {
            setSelectedJob(undefined);
          }}
          title="Edit Job"
        />
      )}

      {!isLoading && !counts?.drafts && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Typography> No Data Available</Typography>
        </Box>
      )}
    </Box>
  );
};
