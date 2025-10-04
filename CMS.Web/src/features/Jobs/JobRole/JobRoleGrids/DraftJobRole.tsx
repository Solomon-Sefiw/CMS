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
import { ApprovalStatus } from "../../../../app/api/enums";
import { JobRolequestApprovalButton } from "../JobRolequestApprovalButton";
import { JobRoleUpdateDialog } from "../JobRoleUpdateDialog";
import { JobRoleApproveOrRejectRequestButton } from "../JobRoleApproveOrRejectRequestButton";
import { Pagination } from "../../../../components/Pagination";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  JobRoleDto,
  useGetJobRolesCountPerApprovalStatusQuery,
  useGetJobRolesListsQuery,
} from "../../../../app/api";
import { JobRoleDetail } from "../JobRoleDetail";
import { usePermission } from "../../../../hooks";
import { JobGradeRomanId } from "../../../../app/api/enums";

export const DraftJobRole = () => {
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
    status: ApprovalStatus.Draft,
  });
  const [selectedJobRole, setSelectedJobRole] = useState<JobRoleDto>();
  const [dialogOpened, setDialogOpened] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();

  const filteredJobRoles = searchQuery
    ? (items?.items || []).filter((option) =>
        option.roleName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items?.items || [];

  const showNoMatchingAlert = searchQuery && filteredJobRoles.length === 0;

  const handleDialogClose = () => {
    setDialogOpened(false);
    setSelectedId(null);
    setSelectedJobRole(undefined);
  };
  const handleDialogOpen = (id: number) => {
    setDialogOpened(true);
    setSelectedId(id);
  };
  const isLoading = isCountsLoading || isListLoading;

  return (
    <Box>
      {!isLoading && !!counts?.drafts && (
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
                  <Fragment key={item.id}>
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
                              disabled={!permissions.canCreateUpdateSetup}
                            >
                              Edit
                            </Button>
                          )}

                          <Button
                            size="small"
                            startIcon={<VisibilityIcon />}
                            onClick={() => {
                              setSelectedJobRole(item);
                              setDialogOpened(true);
                            }}
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
          No Draft Job Role found with name {searchQuery}!!
        </Alert>
      )}
      <Pagination
        pageNumber={pagination.pageNumber}
        pageSize={pagination.pageSize}
        onChange={setPagination}
        totalRowsCount={counts?.drafts}
        rowsPerPageOptions={[10, 20, 50]}
      />
      {dialogOpened && selectedId !== null && (
        <JobRoleUpdateDialog onClose={handleDialogClose} Id={selectedId} />
      )}
      {dialogOpened && selectedJobRole && (
        <JobRoleDetail JobRoles={selectedJobRole} onClose={handleDialogClose} />
      )}

      {!isLoading && !counts?.drafts && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Typography> No Data Available</Typography>
        </Box>
      )}
    </Box>
  );
};
