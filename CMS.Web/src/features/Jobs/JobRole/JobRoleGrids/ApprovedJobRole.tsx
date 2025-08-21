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
  Alert,
} from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { Fragment, useState } from "react";
import {
  JobRoleDto,
  useGetJobRolesListsQuery,
  useGetJobRolesCountPerApprovalStatusQuery,
} from "../../../../app/api/HCMSApi";
import { ApprovalStatus, Activation } from "../../../../app/api/enums";
import { JobRoleUpdateDialog } from "../JobRoleUpdateDialog";
import { JobRoleDeactivateButton } from "../JobRoleDeactivateButton";
import { Pagination } from "../../../../components/Pagination";
import { JobRoleActivateButton } from "../JobRoleActivateButton";
import { JobRoleDetail } from "../JobRoleDetail";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { JobGradeRomanId } from "../../../../app/api/enums";
export const ApprovedJobRole = () => {
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 10,
  });

  const { data: counts, isLoading: isCountsLoading } =
    useGetJobRolesCountPerApprovalStatusQuery();

  const { data: items, isLoading: isListLoading } = useGetJobRolesListsQuery({
    pageNumber: pagination.pageNumber + 1,
    pageSize: pagination.pageSize,
    status: ApprovalStatus.Approved,
  });

  const { searchQuery } = useOutletContext<{ searchQuery: string }>();

  const filteredJobRoles = searchQuery
    ? (items?.items || []).filter((option) =>
        option.roleName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items?.items || [];

  const showNoMatchingAlert = searchQuery && filteredJobRoles.length === 0;

  const [dialogOpened, setDialogOpened] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [JobRoleDetailVew, setJobRoleDetailView] = useState<JobRoleDto>();

  const handleDialogClose = () => {
    setDialogOpened(false);
    setSelectedId(null);
  };

  const handleDialogOpen = (id: number) => {
    setDialogOpened(true);
    setSelectedId(id);
  };
  const handleViewDetailDialog = (item: JobRoleDto) => {
    setOpenViewDetail(true);
    setJobRoleDetailView(item);
  };
  const handleDetailViewClose = () => {
    setOpenViewDetail(false);
    setJobRoleDetailView(undefined);
  };

  const isLoading = isCountsLoading || isListLoading;

  return (
    <Box>
      {!isLoading && !!counts?.approved && (
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
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(filteredJobRoles || []).map((item: JobRoleDto) => (
                  <Fragment key={item.id}>
                    <TableRow>
                      <TableCell
                        sx={{
                          verticalAlign: "top",
                          width: 200,
                          backgroundColor:
                            item.isActive === Activation.InActive
                              ? "#e8eaf6"
                              : "inherit",
                          opacity:
                            item.isActive === Activation.InActive ? 0.5 : 1,
                        }}
                      >
                        {item.roleName}
                      </TableCell>
                      <TableCell>{item.jobCatagory}</TableCell>
                      <TableCell>{item.jobRoleCatagory}</TableCell>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.jobGrade !== undefined
                          ? JobGradeRomanId[item.jobGrade]
                          : "N/A"}{" "}
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                          }}
                        >
                          {/*  Activate/Deactivate logic */}
                          {item.isActive === Activation.Active ? (
                            <JobRoleDeactivateButton id={item.id!} />
                          ) : (
                            <JobRoleActivateButton id={item.id!} />
                          )}
                          {/*  View Detail Button */}

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
          No Approved Job Role found with name "{searchQuery}"!
        </Alert>
      )}

      <Pagination
        pageNumber={pagination.pageNumber}
        pageSize={pagination.pageSize}
        onChange={setPagination}
        totalRowsCount={counts?.approved}
        rowsPerPageOptions={[10, 20, 50]}
      />

      {dialogOpened && selectedId !== null && (
        <JobRoleUpdateDialog onClose={handleDialogClose} Id={selectedId} />
      )}

      {/* Render JobRoleDetail dialog */}
      {openViewDetail && JobRoleDetailVew !== undefined && (
        <JobRoleDetail
          onClose={handleDetailViewClose}
          JobRoles={JobRoleDetailVew}
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
