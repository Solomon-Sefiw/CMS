import React, { Fragment, useState, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { JobDto, JobStatus } from "../../../../app/api";
import { JobDialog } from "../JobDialog";
import { RequestApprovalButton } from "../RequestApprovalButton";
import { ApproveOrRejectRequestButton } from "../ApproveOrRejectRequestButton";
import { Pagination } from "../../../../components/Pagination";
import { ApprovalStatus } from "../../../../app/api/enums";
import { ActivateOrDeActivateButton } from "../ActivateOrDeActivateButton";

interface JobSearchResultByBUAndJRProps {
  filteredJobs: JobDto[];
  pageNumber: number;
  pageSize: number;
  totalCount: number | undefined | null;
  onPageChange: (pagination: { pageNumber: number; pageSize?: number }) => void;
}

export const JobSearchResultByBUAndJR: React.FC<
  JobSearchResultByBUAndJRProps
> = ({ filteredJobs, pageNumber, pageSize, totalCount, onPageChange }) => {
  const [pagination, setPagination] = useState<{
    pageNumber: number;
    pageSize?: number;
  }>({
    pageNumber: 0,
    pageSize: 5,
  });

  useEffect(() => {
    setPagination({ pageNumber, pageSize });
  }, [pageNumber, pageSize]);

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

  const getRowStyle = (jobStatus: number | undefined) => {
    return jobStatus === 2 ? { backgroundColor: "#f2dede" } : {};
  };

  const [selectedJob, setSelectedJob] = useState<JobDto>();

  const isLoading = false;

  const items = filteredJobs || [];

  return (
    <Box>
      <Divider />
      {!isLoading && (
        <Paper>
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Business Unit
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Job Role</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Job Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Vacant</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Locked</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item: JobDto) => (
                  <Fragment key={item.id}>
                    <TableRow hover style={getRowStyle(item.jobStatus)}>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.businessUnit}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.jobRole}
                      </TableCell>

                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {getJobStatusLabel(item.jobStatus)}
                      </TableCell>

                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.vacant}
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
                          {item.approvalStatus === ApprovalStatus.Draft &&
                            item.id !== undefined && (
                              <RequestApprovalButton id={item.id} />
                            )}
                          {item.approvalStatus === ApprovalStatus.Submitted &&
                            item.id !== undefined && (
                              <ApproveOrRejectRequestButton id={item.id} />
                            )}
                          {item.id !== undefined && (
                            <Button
                              size="small"
                              onClick={() => setSelectedJob(item)}
                            >
                              Edit
                            </Button>
                          )}
                          {item.id !== undefined && (
                            <ActivateOrDeActivateButton
                              id={item.id}
                              initialStatus={item.jobStatus as JobStatus}
                            />
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
        onChange={(newPagination) => {
          setPagination(newPagination);
          onPageChange(newPagination);
        }}
        rowsPerPageOptions={[10, 20, 50]}
        totalRowsCount={totalCount}
      />

      {selectedJob && (
        <JobDialog
          job={selectedJob}
          onClose={() => setSelectedJob(undefined)}
          title="Approve Job"
        />
      )}

      {!isLoading && items.length === 0 && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Typography>No Data Available</Typography>
        </Box>
      )}
    </Box>
  );
};
