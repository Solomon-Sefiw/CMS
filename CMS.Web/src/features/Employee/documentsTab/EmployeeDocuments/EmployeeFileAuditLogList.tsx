import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { useGetAuditEmployeeDocumentFileByEmployeeIdQuery } from "../../../../app/store";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
export const EmployeeFileAuditLogList = ({
  refetchLogs,
}: {
  refetchLogs?: () => void;
}) => {
  const { id } = useParams<{ id: string }>();
  const employeeId = Number(id);
  const {
    data: logs = [],
    isLoading,
    isError,
    refetch,
  } = useGetAuditEmployeeDocumentFileByEmployeeIdQuery({ employeeId });
  if (refetchLogs) refetchLogs = refetch;

  if (isLoading) return <CircularProgress />;
  if (isError)
    return <Typography color="error">Error loading audit logs.</Typography>;
  if (!logs || logs.length == 0)
    return <Typography>No audit logs found for this employee.</Typography>;

  return (
    <Box mt={2}>
      <Typography variant="h6" gutterBottom>
        Audit Logs
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Action</TableCell>
            <TableCell>New File name</TableCell>
            <TableCell>Action Done By</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Detail info</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log, index) => (
            <TableRow key={index}>
              <TableCell>{log.actionType}</TableCell>
              <TableCell>{log.newFileName}</TableCell>
              <TableCell>{log.performedBy}</TableCell>
              <TableCell>
                {dayjs(log.performedAt).format("DD MMM YYYY HH:mm")}
              </TableCell>
              <TableCell>{log.details}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};
