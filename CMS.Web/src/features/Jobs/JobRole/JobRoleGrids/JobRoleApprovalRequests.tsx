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
import { useOutletContext } from "react-router-dom";

import { Fragment, useState } from "react";
import {
  JobRoleDto,
  useGetJobRolesListsQuery,
  useGetJobRolesCountPerApprovalStatusQuery,
} from "../../../../app/api/HCMSApi";
import { ApprovalStatus } from "../../../../app/api/enums";
import { JobRolequestApprovalButton } from "../JobRolequestApprovalButton";
import { JobRoleUpdateDialog } from "../JobRoleUpdateDialog";
import { JobRoleApproveOrRejectRequestButton } from "../JobRoleApproveOrRejectRequestButton";
import { Pagination } from "../../../../components/Pagination";
import { JobRoleDetail } from "../JobRoleDetail";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { JobGradeRomanId } from "../../../../app/api/enums";

export const JobRoleApprovalRequests = () => {
  const [pagination, setPagination] = useState<{
    pageNumber: number;
    pageSize?: number;
  }>({
    pageNumber: 0,
    pageSize: 10,
  });

  const { data: counts, isLoading: isCountsLoading } =
    useGetJobRolesCountPerApprovalStatusQuery();
  const [dialogOpened, setDialogOpened] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [selectedIdforDetail, setSelectedIdforDetail] = useState<number | null>(
    null
  );
  const [JobRoleDetailVew, setJobRoleDetailView] = useState<JobRoleDto>();
  const { data: items, isLoading: isListLoading } = useGetJobRolesListsQuery({
    pageNumber: pagination.pageNumber + 1,
    pageSize: pagination.pageSize,
    status: ApprovalStatus.Submitted,
  });

  console.log(items);
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();

  const filteredJobRoles = searchQuery
    ? (items?.items || []).filter((option) =>
        option.roleName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items?.items || [];
  const isLoading = isCountsLoading || isListLoading;
  const showNoMatchingAlert = searchQuery && filteredJobRoles.length === 0;
  const handleDialogOpen = (id: number) => {
    setDialogOpened(true);
    setSelectedId(id);
  };
  const handleViewDetailDialog = (item: JobRoleDto) => {
    setOpenViewDetail(true);
    setJobRoleDetailView(item);
  };
  const handleDialogClose = () => {
    setDialogOpened(false);
    setSelectedId(null);
  };
  const handleDetailViewClose = () => {
    setOpenViewDetail(false);
    setSelectedIdforDetail(null);
  };
  return (
    <Box>
      {!isLoading && !!counts?.approvalRequests && (
        <Paper>
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Job Catagory
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Job Role Catagory
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
                  <Fragment>
                    <TableRow hover={false} key={item.id}>
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
                          {item.id && (
                            <>
                              {item.approvalStatus === ApprovalStatus.Draft && (
                                <JobRolequestApprovalButton id={item.id} />
                              )}
                              {item.approvalStatus ===
                                ApprovalStatus.Submitted && (
                                <JobRoleApproveOrRejectRequestButton
                                  id={item.id}
                                />
                              )}
                            </>
                          )}

                          {item.approvalStatus ===
                            (ApprovalStatus.Draft ||
                              ApprovalStatus.Rejected) && (
                            <Button
                              size="small"
                              onClick={() => handleDialogOpen(item.id!)}
                            >
                              Edit
                            </Button>
                          )}
                          <Button
                            size="small"
                            startIcon={<VisibilityIcon />}
                            onClick={() => handleViewDetailDialog(item)}
                          >
                            View Detail
                          </Button>
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
          No Requested Job Role found with name {searchQuery}!!
        </Alert>
      )}
      <Pagination
        pageNumber={pagination.pageNumber}
        pageSize={pagination.pageSize}
        onChange={setPagination}
        totalRowsCount={counts?.approvalRequests}
        rowsPerPageOptions={[10, 20, 50]}
      />

      {dialogOpened && selectedId !== null && (
        <JobRoleUpdateDialog onClose={handleDialogClose} Id={selectedId} />
      )}
      {openViewDetail && JobRoleDetailVew !== null && (
        <JobRoleDetail
          onClose={handleDetailViewClose}
          JobRoles={JobRoleDetailVew}
        />
      )}
      {!isLoading && !counts?.approvalRequests && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Typography> No Data Available</Typography>
        </Box>
      )}
    </Box>
  );
};
