import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Print } from "@mui/icons-material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  EmployeeDto,
  useEmployeeIdCardGivenMutation,
  useGetActiveEmployeeForIdManagementQuery,
  useGetAllEmployeeOnProbationQuery,
} from "../../app/api/HCMSApi";
import { useSnackbar } from "notistack";
import { green } from "@mui/material/colors";
import { PageHeader } from "../../components";
import { EmployeeIdCard } from "./EmployeeIdCard";
import { EmployeeIDCardStatus } from "../../app/api/enums";
import { useOutletContext } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { usePermission } from "../../hooks";

export const EmployeesIdManagementList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const {
    data: idList = [],
    isLoading,
    isError,
    refetch,
  } = useGetActiveEmployeeForIdManagementQuery();
  const permissions = usePermission();

  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDto | null>(
    null
  );
  const [idCardDialogOpen, setIdCardDialogOpen] = useState(false);
  const [issueDate, setIssueDate] = useState<string>("");
  const [EmployeeIdCardGiven, { error: employeeIdCradGivenError }] =
    useEmployeeIdCardGivenMutation();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleGenerateIdCard = (employee: EmployeeDto) => {
    setSelectedEmployee(employee);
    setIssueDate(dayjs().format("YYYY-MM-DD"));
    setIdCardDialogOpen(true);
  };

  const handlePrintIdCard = async (
    employee: EmployeeDto | undefined | null
  ) => {
    const element = document.getElementById("id-card-content");
    if (!element) return;

    if (employee && employee.id) {
      await IDCardGiven(employee.id);
      const opt = {
        margin: 0,
        filename: `${employee?.displayName}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 4 },
        jsPDF: { unit: "mm", format: [210, 297], orientation: "portrait" },
      };
      html2pdf().set(opt).from(element).save();
      refetch();
      setIdCardDialogOpen(false);
    }
  };

  const IDCardGiven = async (employeeId: number | undefined) => {
    if (employeeId === undefined) {
      return;
    }

    const payload = {
      employeeId: employeeId,
      status: EmployeeIDCardStatus.IDGiven,
    };
    await EmployeeIdCardGiven({ employeeIdCardGivenCommand: payload });
  };

  const { searchQuery } = useOutletContext<{ searchQuery: string }>();
  const filteredList = searchQuery
    ? idList.filter((item) =>
        (item.displayName ?? "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : idList;

  const paginatedData = filteredList.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table size="medium" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Employee ID</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Job Title</TableCell>
                <TableCell>Business Unit</TableCell>
                <TableCell>Employment Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((employee) => (
                  <TableRow hover key={employee.id}>
                    <TableCell>{employee.id}</TableCell>
                    <TableCell>{employee.displayName}</TableCell>
                    <TableCell>
                      {employee.job?.jobRole?.roleName || "-"}
                    </TableCell>
                    <TableCell>{employee.businessUnits?.name || "-"}</TableCell>
                    <TableCell>
                      {dayjs(employee.employementDate).format("DD MMM YYYY")}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Generate ID Card">
                        <IconButton
                          onClick={() => handleGenerateIdCard(employee)}
                                  disabled={!permissions.CanGiveEmployeeId}
                        >
                          <Print color="primary" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No employees found for ID management
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 20, 30]}
          component="div"
          count={idList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* ID Card Dialog */}
      <Dialog
        open={idCardDialogOpen}
        onClose={() => setIdCardDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Employee ID Card</DialogTitle>
        <DialogContent>
          {selectedEmployee && idCardDialogOpen && (
            <EmployeeIdCard employee={selectedEmployee} issueDate={issueDate} />
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setIdCardDialogOpen(false)}>Close</Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Print />}
            onClick={() => {
              handlePrintIdCard(selectedEmployee);
            }} 
                    disabled={!permissions.CanGiveEmployeeId}
         >
            Print ID Card
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
