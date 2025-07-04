import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Fragment, useState } from "react";
import { JobCatagory, JobDto } from "../../../app/api";
import { useAlert } from "../../notification";
import axios from "axios";
import { JobCreationResponse } from "../../../app/api";

interface JobListProps {
  items?: JobDto[];
  hideWorkflowComment?: boolean;
  suppressActionColumn?: boolean;
}

export const JobList = ({
  items = [],
  hideWorkflowComment,
  suppressActionColumn,
}: JobListProps) => {
  const [selectedJobCatagory, setSelectedJobCatagory] = useState<JobCatagory>();
  const { showInfoAlert } = useAlert();

  const handleJobCreation = async (jobData: any) => {
    try {
      const response = await axios.post<JobCreationResponse>(
        "/api/jobs",
        jobData
      );
      if (response.data.jobCountExceeded) {
        showInfoAlert(
          "Job count has exceeded the staff strength for this business unit."
        );
      }
    } catch (error) {}
  };

  return (
    <Box>
      <Paper>
        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Business Unit</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Job Role</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Job Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Locked</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Vacant</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(items || []).map((item) => (
                <Fragment key={item.id}>
                  <TableRow
                    hover={false}
                    key={item.id}
                    sx={
                      !hideWorkflowComment
                        ? {
                            cursor: "pointer",
                            "& > *": { borderBottom: "unset" },
                          }
                        : {}
                    }
                  >
                    <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                      {item.businessUnit}
                    </TableCell>
                    <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                      {item.jobRole}
                    </TableCell>
                    <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                      {item.jobStatus}
                    </TableCell>
                    <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                      {item.locked}
                    </TableCell>
                    <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                      {item.vacant}
                    </TableCell>
                  </TableRow>
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
