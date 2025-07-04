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
} from "@mui/material";
import { Fragment, useState } from "react";
import { JobGrade, JobGradeDto, JobGradeStep } from "../../../app/api";
import { JobGradeRomanId } from "../../../app/api/enums";
import { JobGradeDetail } from "./JobGradeDetail";
import { JobGradeDialog } from "./JobGradeDialog";

interface JobGradeListProps {
  items?: JobGradeDto[];
  hideWorkflowComment?: boolean;
  suppressActionColumn?: boolean;
}

export const JobGradeList = ({
  items = [],
  hideWorkflowComment,
  suppressActionColumn,
}: JobGradeListProps) => {
  const [selectedJobGrade, setSelectedJobGrade] = useState<JobGrade>();
  const [OpenDialog, setOpenDialog] = useState<boolean>(false);
  const [updatedJobGrade, setUpdatedJobGrade] = useState<
    JobGradeDto | undefined
  >(undefined);

  const [ViewDetailJobGrade, setViewDetailJobGrade] = useState<
    JobGradeDto | undefined
  >(undefined);
  const [OpenViewDetail, setOpenViewDetail] = useState<boolean>(false);

  const UpdateJobGrade = (jobGrade: JobGradeDto | undefined) => {
    setOpenDialog(true);
    setUpdatedJobGrade(jobGrade);
  };

  const ViewDetail = (jobGrade: JobGradeDto | undefined) => {
    setOpenViewDetail(true);
    setViewDetailJobGrade(jobGrade);
  };

  return (
    <Box>
      <Paper>
        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>
                  JobGrade Roman ID
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Base Salary</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Step Coefficient
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>CeilingSalary</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(items || []).map((item) => (
                <Fragment key={item.jobGradeId}>
                  <TableRow
                    hover={false}
                    key={item.jobGradeId}
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
                      {item.jobGradeId !== undefined
                        ? JobGradeRomanId[item.jobGradeId]
                        : "N/A"}{" "}
                    </TableCell>
                    <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                      {item.name}
                    </TableCell>
                    <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                      {item.baseSalary}
                    </TableCell>
                    <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                      {item.stepCoefficient}
                    </TableCell>
                    <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                      {item.ceilingSalary}
                    </TableCell>
                    <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                      {item.description}
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => UpdateJobGrade(item)}>Edit</Button>
                      <Button onClick={() => ViewDetail(item)}>
                        View Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {OpenDialog && updatedJobGrade && (
        <JobGradeDialog
          onClose={() => {
            setOpenDialog(false);
          }}
          JobGrade={updatedJobGrade}
        />
      )}
      {OpenViewDetail && ViewDetailJobGrade && (
        <JobGradeDetail
          onClose={() => {
            setOpenViewDetail(false);
          }}
          JobGrades={ViewDetailJobGrade}
        />
      )}
    </Box>
  );
};
