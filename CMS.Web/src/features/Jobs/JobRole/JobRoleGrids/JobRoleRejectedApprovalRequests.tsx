import {
  Alert,
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
import { useOutletContext } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility"; // <-- Import the icon
import { JobGradeRomanId } from "../../../../app/api/enums";

import {
  JobRoleDto,
  useGetJobRolesListsQuery,
  useGetJobRolesCountPerApprovalStatusQuery,
} from "../../../../app/api/HCMSApi";
import { ApprovalStatus } from "../../../../app/api/enums";
import { JobRoleUpdateDialog } from "../JobRoleUpdateDialog";
import { Pagination } from "../../../../components/Pagination";
import { JobRoleDetail } from "../JobRoleDetail"; // <-- Import the detail component
import { usePermission } from "../../../../hooks";

export const JobRoleRejectedApprovalRequests = () => {
  const permissions = usePermission();
  const [pagination, setPagination] = useState<{
    pageNumber: number;
    pageSize?: number;
  }>({
    pageNumber: 0,
    pageSize: 10,
  });

  const { data: counts, isLoading: isCountsLoading } =
    useGetJobRolesCountPerApprovalStatusQuery();
  const { data: items, isLoading: isListLoading } = useGetJobRolesListsQuery({
    pageNumber: pagination.pageNumber + 1,
    pageSize: pagination.pageSize,
    status: ApprovalStatus.Rejected,
  });

  const isLoading = isCountsLoading || isListLoading;
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();

  const [dialogOpened, setDialogOpened] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [selectedJobRoleDetail, setSelectedJobRoleDetail] =
    useState<JobRoleDto | null>(null);

  const filteredJobRoles = searchQuery
    ? (items?.items || []).filter((option) =>
        option.roleName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items?.items || [];

  const showNoMatchingAlert = searchQuery && filteredJobRoles.length === 0;

  const handleDialogOpen = (id: number) => {
    setDialogOpened(true);
    setSelectedId(id);
  };
  const handleDialogClose = () => {
    setDialogOpened(false);
    setSelectedId(null);
  };

  const handleViewDetailDialog = (item: JobRoleDto) => {
    setOpenViewDetail(true);
    setSelectedJobRoleDetail(item);
  };

  const handleDetailViewClose = () => {
    setOpenViewDetail(false);
    setSelectedJobRoleDetail(null);
  };

  return (
    <Box>
      {!isLoading && !!counts?.rejected && (
        <Paper>
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Job Category
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Job Role Category
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Job Grade</TableCell>
                  <TableCell
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(filteredJobRoles || []).map((item: JobRoleDto) => (
                  <Fragment key={item.id}>
                    <TableRow hover={false}>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.roleName}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.jobCatagory}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.jobRoleCatagory}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.jobGrade !== undefined
                          ? JobGradeRomanId[item.jobGrade]
                          : "N/A"}{" "}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                          }}
                        >
                          {item.approvalStatus === ApprovalStatus.Rejected && (
                            <Button
                              size="small"
                              onClick={() => handleDialogOpen(item.id!)}
                              disabled={!permissions.canCreateUpdateSetup}
                            >
                              Edit
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

      {showNoMatchingAlert && (
        <Alert severity="info" sx={{ m: 2 }}>
          No Rejected Job Role found with name "{searchQuery}"!
        </Alert>
      )}

      <Pagination
        pageNumber={pagination.pageNumber}
        pageSize={pagination.pageSize}
        onChange={setPagination}
        totalRowsCount={counts?.rejected}
        rowsPerPageOptions={[10, 20, 50]}
      />

      {dialogOpened && selectedId !== null && (
        <JobRoleUpdateDialog onClose={handleDialogClose} Id={selectedId} />
      )}

      {openViewDetail && selectedJobRoleDetail !== null && (
        <JobRoleDetail
          onClose={handleDetailViewClose}
          JobRoles={selectedJobRoleDetail}
        />
      )}

      {!isLoading && !counts?.rejected && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Typography>No Data Available</Typography>
        </Box>
      )}
    </Box>
  );
};
