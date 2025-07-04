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

import {
  JobCategoryDto,
  useGetJobCategoriesListForPaginationQueryQuery,
  useGetJobCategoryCountByApprovalStatusQuery,
} from "../../../../app/api/HCMSApi";
import { ApprovalStatus } from "../../../../app/api/enums";
import { Pagination } from "../../../../components/Pagination";
import { RequestApprovalJobCategoryButton } from "../RequestApprovalJobCategoryButton";
import { JobCategoryApproveOrRejectRequestButton } from "../JobCategoryApproveOrRejectRequestButton.tsx";
import { JobCategoryUpdateDialog } from "../JobCategoryUpdateDialog";
import { usePermission } from "../../../../hooks";

export const DraftJobCategory = () => {
  const [pagination, setPagination] = useState<{
    pageNumber: number;
    pageSize?: number;
  }>({
    pageNumber: 0,
    pageSize: 10,
  });
  const { data: counts, isLoading: isCountsLoading } =
    useGetJobCategoryCountByApprovalStatusQuery();
  const { data: items, isLoading: isListLoading } =
    useGetJobCategoriesListForPaginationQueryQuery({
      pageNumber: pagination.pageNumber + 1,
      pageSize: pagination.pageSize,
      status: ApprovalStatus.Draft,
    });
  const permissions = usePermission();
  const [dialogOpened, setDialogOpened] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();

  const filteredJobCategory = searchQuery
    ? (items?.items || []).filter((option) =>
        option.jobCategoryName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : items?.items || [];
  const showNoMatchingAlert = searchQuery && filteredJobCategory.length === 0;

  const handleDialogClose = () => {
    setDialogOpened(false);
    setSelectedId(null);
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
                          {typeof item.id !== "undefined" &&
                            item.approvalStatus && (
                              <>
                                {item.approvalStatus ===
                                  ApprovalStatus.Draft && (
                                  <>
                                    <RequestApprovalJobCategoryButton
                                      id={item.id}
                                    />
                                    <Button
                                      size="small"
                                      onClick={() => handleDialogOpen(item.id!)}
                                    >
                                      Edit
                                    </Button>
                                  </>
                                )}

                                {item.approvalStatus ===
                                  ApprovalStatus.Submitted && (
                                  <JobCategoryApproveOrRejectRequestButton
                                    id={item.id}
                                  />
                                )}

                                {item.approvalStatus ===
                                  ApprovalStatus.Rejected && (
                                  <Button
                                    size="small"
                                    onClick={() => handleDialogOpen(item.id!)}
                                    disabled={!permissions.canCreateUpdateSetup}
                                  >
                                    Edit
                                  </Button>
                                )}
                              </>
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
          No Draft Job Category found with name {searchQuery}!!
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
        <JobCategoryUpdateDialog onClose={handleDialogClose} Id={selectedId} />
      )}
      {!isLoading && !counts?.drafts && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Typography> No Data Available</Typography>
        </Box>
      )}
    </Box>
  );
};
