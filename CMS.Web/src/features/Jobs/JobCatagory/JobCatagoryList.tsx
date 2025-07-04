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
import { Fragment } from "react";
import { JobCategoryDto } from "../../../app/api"; // make sure to use the correct import

interface JobCategoryListProps {
  items?: JobCategoryDto[];
  suppressActionColumn?: boolean;
}
export const JobCategoryList = ({
  items = [],
  suppressActionColumn,
}: JobCategoryListProps) => {
  return (
    <Box>
      <Paper>
        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>
                  JobCategory Name
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Approval Status
                </TableCell>
                {!suppressActionColumn && (
                  <TableCell align="center">Actions</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {(items || []).map((item) => (
                <Fragment key={item.id}>
                  <TableRow hover={false}>
                    <TableCell sx={{ verticalAlign: "top" }}>
                      {item.jobCategoryName}
                    </TableCell>
                    <TableCell sx={{ verticalAlign: "top" }}>
                      {item.isActive === true ? "Active" : "Inactive"}
                    </TableCell>
                    <TableCell sx={{ verticalAlign: "top" }}>
                      {item.approvalStatus}
                    </TableCell>
                    {!suppressActionColumn && (
                      <TableCell align="center">
                        {/* Add action buttons here if needed */}
                      </TableCell>
                    )}
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
