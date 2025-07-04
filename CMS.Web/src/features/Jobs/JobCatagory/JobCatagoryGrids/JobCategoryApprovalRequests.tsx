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
  JobCategoryDto,
  useGetJobCatagoryListQueryQuery,
  useGetJobCategoriesListForPaginationQueryQuery,
  useGetJobCategoryCountByApprovalStatusQuery,
} from "../../../../app/api/HCMSApi";
import { ApprovalStatus } from "../../../../app/api/enums";
import { JobRolequestApprovalButton } from "../../JobRole/JobRolequestApprovalButton";
import { RequestApprovalJobCategoryButton } from "../RequestApprovalJobCategoryButton";
import { JobCategoryUpdateDialog } from "../JobCategoryUpdateDialog";
import { JobCategoryApproveOrRejectRequestButton } from "../JobCategoryApproveOrRejectRequestButton.tsx";
import { Pagination } from "../../../../components/Pagination";
import { JobCategoryDetail } from "../JobCategoryDetail";

export const JobCategoryApprovalRequests = () => {
  const [pagination, setPagination] = useState<{
    pageNumber: number;
    pageSize?: number;
  }>({
    pageNumber: 0,
    pageSize: 10,
  });

  const { data: counts, isLoading: isCountsLoading } =
    useGetJobCategoryCountByApprovalStatusQuery();
  const [dialogOpened, setDialogOpened] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [selectedIdforDetail, setSelectedIdforDetail] = useState<number | null>(
    null
  );
  const [JobCategoryDetailView, setJobCategoryDetailView] =
    useState<JobCategoryDto>();
  const { data: items, isLoading: isListLoading } =
    useGetJobCategoriesListForPaginationQueryQuery({
      pageNumber: pagination.pageNumber + 1,
      pageSize: pagination.pageSize,
      status: ApprovalStatus.Submitted,
    });

  const { searchQuery } = useOutletContext<{ searchQuery: string }>();

  const filteredJobCategory = searchQuery
    ? (items?.items || []).filter((option) =>
        option.jobCategoryName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : items?.items || [];
  const isLoading = isCountsLoading || isListLoading;
  const showNoMatchingAlert = searchQuery && filteredJobCategory.length === 0;
  const handleDialogOpen = (id: number) => {
    setDialogOpened(true);
    setSelectedId(id);
  };
  const handleViewDetailDialog = (item: JobCategoryDto) => {
    setOpenViewDetail(true);
    setJobCategoryDetailView(item);
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
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Job Category Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Probation Period In Days
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Is Active</TableCell>

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
                {(filteredJobCategory || []).map((item: JobCategoryDto) => (
                  <Fragment key={item.id}>
                    <TableRow hover={false}>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.jobCategoryName}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.probationPeriodInDays}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
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
                          {item.approvalStatus === ApprovalStatus.Draft && (
                            <RequestApprovalJobCategoryButton
                              id={item.id || 0} // Fallback to 0 if id is undefined
                            />
                          )}

                          {item.approvalStatus === ApprovalStatus.Submitted && (
                            <JobCategoryApproveOrRejectRequestButton
                              id={item.id!} // Ensuring id is defined
                            />
                          )}

                          <Button
                            size="small"
                            onClick={() => handleViewDetailDialog(item)}
                          >
                            View Detail
                          </Button>
                          {(item.approvalStatus === ApprovalStatus.Draft ||
                            item.approvalStatus ===
                              ApprovalStatus.Rejected) && (
                            <Button
                              size="small"
                              onClick={() =>
                                handleDialogOpen(Number(item.id ?? 0))
                              }
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
          No submitted Job Category found with name {searchQuery}!!
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
        <JobCategoryUpdateDialog onClose={handleDialogClose} Id={selectedId} />
      )}
      {openViewDetail && JobCategoryDetailView !== null && (
        <JobCategoryDetail
          onClose={handleDetailViewClose}
          jobCategory={JobCategoryDetailView}
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
