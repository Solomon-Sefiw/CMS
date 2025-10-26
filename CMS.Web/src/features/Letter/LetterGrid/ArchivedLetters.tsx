// src/components/ArchivedLetters.tsx
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
  Chip,
  Stack,
  Button,
  IconButton,
  Tooltip,
  Collapse,
} from "@mui/material";
import { useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { LetterStatus } from "../../../app/api/enums";
import { Pagination } from "../../../components/Pagination";
import { LetterDialog } from "../LetterDialog";
import { useAuth, usePermission } from "../../../hooks";
import {
  LetterDto,
  useGetLetterCountPerStatusQuery,
  useGetLettersForPaginationQuery,
} from "../../../app/store";
import { LetterApprovalButton } from "../LetterApprovalButton";
import { ApproveOrRejectRequestButton } from "../ApproveOrRejectRequestButton";
import { LetterAttachmentPreviewModal } from "../LetterAttachmentPreviewModal";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface PaginationState {
  pageNumber: number;
  pageSize: number;
}

/* Helper: extract valid main document */
const getMainLetterDocument = (letter: LetterDto) => {
  return letter.letterDocument ? letter.letterDocument : null;
};

export const ArchivedLetters = () => {
  const { user } = useAuth();
  const permissions = usePermission();
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageNumber: 0,
    pageSize: 10,
  });
  const [selectedLetter, setSelectedLetter] = useState<LetterDto>();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();

  const { data: statusCounts, isLoading: isCountsLoading } =
    useGetLetterCountPerStatusQuery({ userId: user?.id ?? "" });

  const { data: lettersData, isLoading: isLettersLoading, refetch } =
    useGetLettersForPaginationQuery({
      pageNumber: paginationState.pageNumber + 1,
      pageSize: paginationState.pageSize,
      status: LetterStatus.archived,
      userId: user?.id ?? "",
    });

  const isLoading = isCountsLoading || isLettersLoading;
  const letters = lettersData?.items ?? [];

  /* Search filter */
  const filteredLetters = searchQuery
    ? letters.filter((letter) => {
        const q = searchQuery.toLowerCase();
        return (
          letter.subject?.toLowerCase().includes(q) ||
          letter.referenceNumber?.toLowerCase().includes(q) ||
          `${letter.sender?.firstName} ${letter.sender?.lastName}`
            .toLowerCase()
            .includes(q) ||
          letter.recipients?.some((r) =>
            `${r.recipient?.firstName} ${r.recipient?.lastName}`
              .toLowerCase()
              .includes(q)
          ) ||
          letter.ccUsers?.some((c) =>
            `${c.ccUser?.firstName} ${c.ccUser?.lastName}`
              .toLowerCase()
              .includes(q)
          ) ||
          letter.ccDepartments?.some((c) =>
            c.ccDepartment?.name?.toLowerCase().includes(q)
          ) ||
          letter.businessUnits?.name?.toLowerCase().includes(q)
        );
      })
    : letters;

  const showNoResults = searchQuery && filteredLetters.length === 0 && !isLoading;

  const handlePaginationChange = useCallback(
    (newState: PaginationState) => setPaginationState(newState),
    []
  );

  // Toggle the expanded state of a letter's recipients/CC
  const handleToggleExpand = (letterId: string) => {
    setExpandedRows((prev) => {
      const newExpandedRows = new Set(prev);
      if (newExpandedRows.has(letterId)) {
        newExpandedRows.delete(letterId);
      } else {
        newExpandedRows.add(letterId);
      }
      return newExpandedRows;
    });
  };

  console.log(lettersData?.items, "ArchivedLetters render");

  /* UI Render */
  return (
    <Box>
      {isLoading ? (
        <Typography align="center" sx={{ mt: 4 }}>
          Loading letters...
        </Typography>
      ) : (
        <>
          {showNoResults && (
            <Alert severity="info" sx={{ m: 2 }}>
              No matching letters found
            </Alert>
          )}

          {filteredLetters.length > 0 ? (
            <Paper>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><b>Reference No.</b></TableCell>
                      <TableCell><b>Subject</b></TableCell>
                      <TableCell><b>Sender</b></TableCell>
                      <TableCell><b>Recipients</b></TableCell>
                      <TableCell><b>CC</b></TableCell>
                      <TableCell><b>Business Unit</b></TableCell>
                      <TableCell><b>Sent Date</b></TableCell>
                      <TableCell><b>Document</b></TableCell>
                      <TableCell align="center"><b>Actions</b></TableCell>
                      <TableCell /> {/* Expand icon column */}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filteredLetters.map((letter) => {
                      const doc = getMainLetterDocument(letter);
                      const open = expandedRows.has(letter.id?.toString() ?? "");

                      // Prepare first recipient
                      const firstRecipient = letter.recipients?.[0]
                        ? `${letter.recipients[0].recipient?.firstName ?? ""} ${
                            letter.recipients[0].recipient?.lastName ?? ""
                          }`.trim()
                        : "-";
                      const recipientTooltip = letter.recipients
                        ?.map((r) =>
                          `${r.recipient?.firstName ?? ""} ${r.recipient?.lastName ?? ""}`.trim()
                        )
                        .join(", ") || "-";

                      // Prepare first CC (user or department)
                      const firstCC =
                        letter.ccUsers?.[0]
                          ? `${letter.ccUsers[0].ccUser?.firstName ?? ""} ${
                              letter.ccUsers[0].ccUser?.lastName ?? ""
                            }`.trim()
                          : letter.ccDepartments?.[0]
                          ? letter.ccDepartments[0].ccDepartment?.name ?? "-"
                          : "-";
                      const ccTooltip = [
                        ...(letter.ccUsers?.map((c) =>
                          `CC: ${c.ccUser?.firstName ?? ""} ${c.ccUser?.lastName ?? ""}`.trim()
                        ) || []),
                        ...(letter.ccDepartments?.map((c) =>
                          `CC: ${c.ccDepartment?.name ?? ""}`
                        ) || []),
                      ].join(", ") || "-";

                      return (
                        <>
                          <TableRow key={letter.id}>
                            <TableCell>{letter.referenceNumber}</TableCell>
                            <TableCell>{letter.subject}</TableCell>
                            <TableCell>
                              {letter.sender
                                ? `${letter.sender.firstName} ${letter.sender.lastName}`
                                : "-"}
                            </TableCell>
                            <TableCell>
                              <Tooltip title={recipientTooltip} placement="top">
                                <Chip
                                  size="small"
                                  label={firstRecipient}
                                  sx={{ height: 24 }}
                                />
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <Tooltip title={ccTooltip} placement="top">
                                <Chip
                                  size="small"
                                  label={`CC: ${firstCC}`}
                                  color={letter.ccUsers?.[0] ? "warning" : "info"}
                                  sx={{ height: 24 }}
                                />
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              {letter.businessUnits?.name ?? "N/A"}
                            </TableCell>
                            <TableCell>
                              {letter.sentDate
                                ? new Date(letter.sentDate).toLocaleDateString()
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              {doc ? (
                                <LetterAttachmentPreviewModal
                                  documentId={doc.id ?? ""}
                                  fileName={doc.fileName!}
                                  onView={() => {}}
                                />
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  No Attachment
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <Stack direction="row" spacing={1} justifyContent="center">
                                {letter.status === LetterStatus.pending && (
                                  <LetterApprovalButton id={letter.id!} />
                                )}
                                {letter.status === LetterStatus.received && (
                                  <ApproveOrRejectRequestButton id={letter.id!} />
                                )}
                                {(letter.status === LetterStatus.pending ||
                                  letter.status === LetterStatus.archived) && (
                                  <Button
                                    size="small"
                                    onClick={() => setSelectedLetter(letter)}
                                    disabled={!permissions.CanCreateUpdateLetter}
                                  >
                                    Edit
                                  </Button>
                                )}
                              </Stack>
                            </TableCell>
                            <TableCell>
                              {(letter.recipients?.length ?? 0) > 1 ||
                              (letter.ccUsers?.length ?? 0) > 0 ||
                              (letter.ccDepartments?.length ?? 0) > 0 ? (
                                <Tooltip
                                  title={open ? "Collapse Details" : "Expand Details"}
                                  placement="top"
                                >
                                  <IconButton
                                    size="small"
                                    onClick={() => handleToggleExpand(letter.id!.toString())}
                                  >
                                    {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                  </IconButton>
                                </Tooltip>
                              ) : null}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell colSpan={10} style={{ padding: 0 }}>
                              <Collapse in={open} timeout="auto" unmountOnExit>
                                <Box sx={{ pl: 4, pt: 1, pb: 2 }}>
                                  <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
                                    Recipients
                                  </Typography>
                                  {letter.recipients?.length ? (
                                    letter.recipients.map((r) => (
                                      <Typography
                                        key={r.id}
                                        variant="body2"
                                        sx={{ color: "#555", ml: 2 }}
                                      >
                                        {`${r.recipient?.firstName ?? ""} ${r.recipient?.lastName ?? ""}`.trim()}
                                      </Typography>
                                    ))
                                  ) : (
                                    <Typography variant="body2" sx={{ color: "#555", ml: 2 }}>
                                      None
                                    </Typography>
                                  )}
                                  <Typography variant="body2" sx={{ fontWeight: "bold", mt: 2, mb: 1 }}>
                                    CC
                                  </Typography>
                                  {letter.ccUsers?.length || letter.ccDepartments?.length ? (
                                    <>
                                      {letter.ccUsers?.map((c) => (
                                        <Typography
                                          key={`u-${c.id}`}
                                          variant="body2"
                                          sx={{ color: "#555", ml: 2 }}
                                        >
                                          CC: {`${c.ccUser?.firstName ?? ""} ${c.ccUser?.lastName ?? ""}`.trim()}
                                        </Typography>
                                      ))}
                                      {letter.ccDepartments?.map((c) => (
                                        <Typography
                                          key={`d-${c.id}`}
                                          variant="body2"
                                          sx={{ color: "#555", ml: 2 }}
                                        >
                                          CC: {c.ccDepartment?.name ?? ""}
                                        </Typography>
                                      ))}
                                    </>
                                  ) : (
                                    <Typography variant="body2" sx={{ color: "#555", ml: 2 }}>
                                      None
                                    </Typography>
                                  )}
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        </>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ) : (
            !showNoResults && (
              <Typography align="center" sx={{ mt: 2 }}>
                No Data Available
              </Typography>
            )
          )}
        </>
      )}

      {!isLoading && (
        <Pagination
          pageNumber={paginationState.pageNumber}
          pageSize={paginationState.pageSize}
          onChange={handlePaginationChange}
          totalRowsCount={statusCounts?.archived ?? 0}
          rowsPerPageOptions={[10, 20, 50]}
        />
      )}

      {selectedLetter && (
        <LetterDialog
          initialLetter={selectedLetter}
          title="Letter Details"
          onClose={() => {
            setSelectedLetter(undefined);
            refetch();
          }}
        />
      )}
    </Box>
  );
};