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
  Tooltip,
} from "@mui/material";
import { Fragment, useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { LetterStatus } from "../../../app/api/enums";
import { ApproveOrRejectRequestButton } from "../ApproveOrRejectRequestButton";
import { Pagination } from "../../../components/Pagination";
import { LetterDialog } from "../LetterDialog";
import { useAuth, usePermission } from "../../../hooks";
import { DocumentType } from "../../../app/api/enums";
import {
  LetterDto,
  useGetLetterCountPerStatusQuery,
  useGetLettersForPaginationQuery,
} from "../../../app/store";
import { LetterApprovalButton } from "../LetterApprovalButton";
import { DocumentDownload } from "../../../components/DocumentDownload";

interface PaginationState {
  pageNumber: number;
  pageSize?: number;
}

export const ArchivedLetters = () => {
  const permissions = usePermission();
   const { user } = useAuth();
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageNumber: 0,
    pageSize: 10,
  });
  const [selectedLetter, setSelectedLetter] = useState<LetterDto>();
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();

  const { data: statusCounts, isLoading: isCountsLoading } =
    useGetLetterCountPerStatusQuery({userId: user?.id || ''});

  const {
    data: lettersData,
    isLoading: isListLoading,
    refetch: refetchLetters,
  } = useGetLettersForPaginationQuery({
    pageNumber: paginationState.pageNumber + 1,
    pageSize: paginationState.pageSize,
    status: LetterStatus.archived,
    userId: user?.id || ''
  });

  const isDataLoading = isCountsLoading || isListLoading;
  const archivedLetters = lettersData?.items || [];

  const filteredArchivedLetters = searchQuery
    ? archivedLetters.filter(
        (letter) =>
          letter.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          letter.referenceNumber
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          letter.sender?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          letter.recipient?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          letter.businessUnits?.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    : archivedLetters;

  const showNoMatchingResultsAlert =
    searchQuery && filteredArchivedLetters.length === 0 && !isDataLoading;

  const handlePaginationChange = useCallback(
    (newPaginationState: PaginationState) => {
      setPaginationState(newPaginationState);
    },
    []
  );

  return (
    <Box>
      {isDataLoading ? (
        <Typography sx={{ textAlign: "center", mt: 4 }}>Loading letters...</Typography>
      ) : (
        <>
          {showNoMatchingResultsAlert && (
            <Alert severity="info" sx={{ m: 2 }}>
              No matching letters found
            </Alert>
          )}

          {filteredArchivedLetters.length > 0 ? (
            <Paper>
              <TableContainer>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Reference No.</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Subject</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Sender</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Recipient</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Business Unit</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Sent Date</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Document</TableCell>
                      {/* New Document column */}
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredArchivedLetters.map((item: LetterDto) => (
                      <Fragment key={item.id}>
                        <TableRow hover={false} key={item.id}>
                          <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                            {item.referenceNumber}
                          </TableCell>
                          <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                            {item.subject}
                          </TableCell>
                          <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                            {item.sender?.firstName} {item.sender?.lastName}
                          </TableCell>
                          <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                            {item.recipient?.firstName} {item.recipient?.lastName}
                          </TableCell>
                          <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                            {item.businessUnits?.name || 'N/A'}
                          </TableCell>
                          <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                            {item.sentDate ? new Date(item.sentDate).toLocaleDateString() : 'N/A'}
                          </TableCell>
                                                    <TableCell sx={{ verticalAlign: "top", width: 150 }}>
                            {item.letterDocuments &&
                              item.letterDocuments
                                .filter(
                                  (doc) =>
                                    doc.documentType === DocumentType.LetterDocument &&
                                    !doc.isDeleted
                                )
                                .map((doc) => (
                                  <Tooltip key={doc.id} title={doc.fileName || ""}>
                                    <Box
                                      sx={{
                                        mb: 0.5,
                                        maxWidth: '100%', // Ensure it respects the cell width
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                      }}
                                    >
                                      <DocumentDownload
                                        documentId={doc.documentId!}
                                        label={doc.fileName || "Download"}
                                      />
                                    </Box>
                                  </Tooltip>
                                ))}
                            {(!item.letterDocuments || item.letterDocuments.filter(d => !d.isDeleted).length === 0) && (
                               <Typography variant="body2" color="textSecondary">No Attachment</Typography>
                            )}
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
                                 {item.status === LetterStatus.pending && (
                                    <>
                                      <LetterApprovalButton id={item.id} />
                                    </>
                                  )}
                                  {item.status === LetterStatus.received && (
                                    <>
                                      <ApproveOrRejectRequestButton id={item.id} />
                                    </>
                                  )}

                                  {(item.status === LetterStatus.pending ||
                                    item.status === LetterStatus.archived) && (
                                    <Button
                                      size="small"
                                      onClick={() => setSelectedLetter(item)}
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
          ) : (
            !showNoMatchingResultsAlert && (
              <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                <Typography> No Data Available</Typography>
              </Box>
            )
          )}
        </>
      )}

      {!isDataLoading && (
        <Pagination
          pageNumber={paginationState.pageNumber}
          pageSize={paginationState.pageSize}
          onChange={handlePaginationChange}
          totalRowsCount={statusCounts?.received || 0}
          rowsPerPageOptions={[10, 20, 50]}
        />
      )}

      {selectedLetter && (
        <LetterDialog
          initialLetter={selectedLetter}
          onClose={() => {
            setSelectedLetter(undefined);
            refetchLetters();
          }}
          title="Letter Details"
        />
      )}
    </Box>
  );
};