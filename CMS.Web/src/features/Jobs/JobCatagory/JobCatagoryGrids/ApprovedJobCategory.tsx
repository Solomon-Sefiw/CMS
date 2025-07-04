import {
  Alert,
  Box,
  Button,
  CircularProgress,
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
  JobCategoryDto,
  useGetJobCategoryCountByApprovalStatusQuery,
  useGetJobCategoriesListForPaginationQueryQuery,
} from "../../../../app/api";
import { ApprovalStatus } from "../../../../app/api/enums";
import { Pagination } from "../../../../components/Pagination";
import { JobCategoryUpdateDialog } from "../JobCategoryUpdateDialog";
import { JobCategoryDetail } from "../JobCategoryDetail";
import { JobCategoryActivateButton } from "../JobCategoryActivateButton";
import { JobCategoryDeactivateButton } from "../JobCatagoryDeactivateButton";
import { useOutletContext } from "react-router-dom";
import { usePermission } from "../../../../hooks";

export const ApprovedJobCategories = () => {
  const permissions = usePermission();
  const [pagination, setPagination] = useState({ pageNumber: 0, pageSize: 10 });
  const [JobCategoryDetailView, setJobCategoryDetailView] =
    useState<JobCategoryDto | null>(null);
  const [selectedJobCategoryId, setSelectedJobCategoryId] = useState<
    number | null
  >(null);

  const { data: counts, isLoading: isCountsLoading } =
    useGetJobCategoryCountByApprovalStatusQuery();
  const { data: items, isLoading: isListLoading } =
    useGetJobCategoriesListForPaginationQueryQuery({
      pageNumber: pagination.pageNumber + 1,
      pageSize: pagination.pageSize,
      status: ApprovalStatus.Approved,
    });

  const { searchQuery } = useOutletContext<{ searchQuery: string }>();

  const filteredJobCategory = searchQuery
    ? (items?.items || []).filter((option) =>
        option.jobCategoryName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : items?.items || [];

  const showNoMatchingAlert = searchQuery && filteredJobCategory.length === 0;
  const isLoading = isCountsLoading || isListLoading;

  const handleViewDetailDialog = (item: JobCategoryDto) => {
    setJobCategoryDetailView(item);
  };

  const handleDetailViewClose = () => {
    setJobCategoryDetailView(null);
  };

  return (
    <Box>
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {!!counts?.approved && (
            <Paper>
              <TableContainer>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Job Category Name
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Probation Period In Days
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Is Active
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredJobCategory.map((item) => (
                      <Fragment key={item.id}>
                        <TableRow>
                          <TableCell sx={{ opacity: item.isActive ? 1 : 0.5 }}>
                            {item.jobCategoryName}
                          </TableCell>
                          <TableCell sx={{ opacity: item.isActive ? 1 : 0.5 }}>
                            {item.probationPeriodInDays}
                          </TableCell>
                          <TableCell sx={{ opacity: item.isActive ? 1 : 0.5 }}>
                            {item.isActive ? "Yes" : "No"}
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
                                (item.isActive ? (
                                  <Tooltip title="Deactivate this Job Category">
                                    <span>
                                      <JobCategoryDeactivateButton
                                        id={item.id}
                                      />
                                    </span>
                                  </Tooltip>
                                ) : (
                                  <Tooltip title="Reactivate this Job Category">
                                    <span>
                                      <JobCategoryActivateButton id={item.id} />
                                    </span>
                                  </Tooltip>
                                ))}
                              <Tooltip
                                title={
                                  item.isActive
                                    ? "View Details"
                                    : "Disabled for inactive Job Category"
                                }
                              >
                                <span>
                                  <Button
                                    size="small"
                                    onClick={() => handleViewDetailDialog(item)}
                                    disabled={!item.isActive}
                                  >
                                    View Detail
                                  </Button>
                                </span>
                              </Tooltip>
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
              No Approved Job Category found with name{" "}
              <strong>{searchQuery}</strong>!
            </Alert>
          )}

          <Pagination
            pageNumber={pagination.pageNumber}
            pageSize={pagination.pageSize}
            onChange={setPagination}
            totalRowsCount={counts?.approved || 0}
            rowsPerPageOptions={[10, 20, 50]}
          />

          {selectedJobCategoryId !== null && (
            <JobCategoryUpdateDialog
              Id={selectedJobCategoryId}
              onClose={() => setSelectedJobCategoryId(null)}
            />
          )}

          {JobCategoryDetailView && (
            <JobCategoryDetail
              onClose={handleDetailViewClose}
              jobCategory={JobCategoryDetailView}
            />
          )}

          {!counts?.approved && (
            <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
              <Typography>No Job Categories Available</Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
