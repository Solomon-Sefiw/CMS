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
  BranchGradeDto,
  useGetBranchGradeCountPerStatusQuery,
  useGetBranchGradeForPaginationQuery,
} from "../../../app/store";
import { ApprovalStatus } from "../../../app/api/enums";
import { Pagination } from "../../../components/Pagination";
import { BranchGradeViewDetailDialog } from "./BranchGradeViewDetailDialog";
import VisibilityIcon from "@mui/icons-material/Visibility";
export const ApprovedBranchGrades = () => {
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 10,
  });

  const { data: counts, isLoading: isCountsLoading } =
    useGetBranchGradeCountPerStatusQuery();
  const { data: items, isLoading: isListLoading } =
    useGetBranchGradeForPaginationQuery({
      pageNumber: pagination.pageNumber + 1,
      pageSize: pagination.pageSize,
      status: ApprovalStatus.Approved,
    });

  const [selectedBranchGrade, setSelectedBranchGrade] =
    useState<BranchGradeDto>();
  const isLoading = isCountsLoading || isListLoading;
  return (
    <Box>
      {!isLoading && !!counts?.approved && (
        <Paper>
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Branch Grade
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Staff Strength
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(items?.items || []).map((item) => (
                  <Fragment key={item.id}>
                    <TableRow hover={false}>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.grade}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.staffLimit}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.description}
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
                            item.approvalStatus === ApprovalStatus.Approved && (
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<VisibilityIcon />}
                                onClick={() => setSelectedBranchGrade(item)}
                              >
                                View
                              </Button>
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

      {selectedBranchGrade && (
        <BranchGradeViewDetailDialog
          branchGrade={selectedBranchGrade}
          onClose={() => setSelectedBranchGrade(undefined)}
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
