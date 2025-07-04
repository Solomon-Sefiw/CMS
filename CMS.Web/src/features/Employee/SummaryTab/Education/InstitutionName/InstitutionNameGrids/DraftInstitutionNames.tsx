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
  TextField,
} from "@mui/material";
import { Fragment, useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { usePermission } from "../../../../../../hooks";
import {
  useGetInstitutionNameCountPerStatusQuery,
  useGetInstitutionNamesForPaginationQuery,
} from "../../../../../../app/store";
import { ApprovalStatus } from "../../../../../../app/api/enums";
import { SubmitApprovalButton } from "../SubmitApprovalButton";
import { ApproveOrRejectRequestButton } from "../ApproveOrRejectRequestButton";
import { Pagination } from "../../../../../../components/Pagination";
import { InstitutionNameDialog } from "../InstitutionNameDialog";

interface PaginationState {
  pageNumber: number;
  pageSize?: number;
}

export const DraftInstitutionNames = () => {
  const permissions = usePermission();
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageNumber: 0,
    pageSize: 10,
  });
  const [selectedInstitutionName, setSelectedInstitutionName] = useState<any>();
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();

  const {
    data: statusCounts,
    isLoading: isCountsLoading,
    error: countError,
  } = useGetInstitutionNameCountPerStatusQuery();

  const {
    data: institutionNamesData,
    isLoading: isListLoading,
    refetch: refetchInstitutionNames,
    error: listError,
  } = useGetInstitutionNamesForPaginationQuery({
    pageNumber: paginationState.pageNumber + 1,
    pageSize: paginationState.pageSize,
    status: ApprovalStatus.Draft,
  });

  const isDataLoading = isCountsLoading || isListLoading;
  const draftInstitutionNames = institutionNamesData?.items || [];

  const filteredDraftInstitutionNames = searchQuery
    ? draftInstitutionNames.filter(
        (institutionName) =>
          institutionName.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          institutionName.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    : draftInstitutionNames;

  const showNoMatchingResultsAlert =
    searchQuery && filteredDraftInstitutionNames.length === 0;

  const errors = countError || listError;

  const handlePaginationChange = useCallback(
    (newPaginationState: PaginationState) => {
      setPaginationState(newPaginationState);
    },
    [setPaginationState]
  );
  console.log(filteredDraftInstitutionNames);
  return (
    <Box>
      {!isDataLoading && !!statusCounts?.draft && (
        <Paper>
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDraftInstitutionNames.map((item: any) => (
                  <Fragment key={item.id}>
                    <TableRow hover={false} key={item.id}>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.name}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.description}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.approvalStatus &&
                          ApprovalStatus[item.approvalStatus]}
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
                                <SubmitApprovalButton id={item.id} />
                              )}
                              {item.approvalStatus ===
                                ApprovalStatus.Submitted && (
                                <ApproveOrRejectRequestButton id={item.id} />
                              )}
                              {(item.approvalStatus === ApprovalStatus.Draft ||
                                item.approvalStatus ===
                                  ApprovalStatus.Rejected) && (
                                <Button
                                  size="small"
                                  onClick={() =>
                                    setSelectedInstitutionName(item)
                                  }
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
      {showNoMatchingResultsAlert && (
        <Alert severity="info" sx={{ m: 2 }}>
          No matching institution names found
        </Alert>
      )}
      <Pagination
        pageNumber={paginationState.pageNumber}
        pageSize={paginationState.pageSize}
        onChange={handlePaginationChange}
        totalRowsCount={statusCounts?.draft}
        rowsPerPageOptions={[10, 20, 50]}
      />
      {selectedInstitutionName && (
        <InstitutionNameDialog
          initialInstitutionName={selectedInstitutionName}
          onClose={() => {
            setSelectedInstitutionName(undefined);
          }}
          title="Update Institution Name"
        />
      )}
      {!isDataLoading && !statusCounts?.draft && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Typography> No Data Available</Typography>
        </Box>
      )}
    </Box>
  );
};
