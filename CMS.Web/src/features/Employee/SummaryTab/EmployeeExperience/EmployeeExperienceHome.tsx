import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
import {
  AddressDto,
  EmployeeExperienceDto,
  JobCatagory,
  useGetEmployeeExperienceListOfEmployeeQuery,
} from "../../../../app/api";
import { KeyValuePair } from "../../../../components/KeyValuePair";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Add from "@mui/icons-material/Add";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { ContactType, Country, ExperienceType, Status } from "../../../../app/api/enums";
import { EmployeeExperienceUpdate } from "./EmployeeExperienceUpdate";
import { EmployeeExperience } from "./EmployeeExperience";

interface EmployeeExperienceProps {
  items?: EmployeeExperienceDto[];
  hideWorkflowComment?: boolean;
  suppressActionColumn?: boolean;
}

export const EmployeeExperienceHome = ({
  items = [],
  hideWorkflowComment,
  suppressActionColumn,
}: EmployeeExperienceProps) => {
  const [OpenEmployeeExperienceDialog, setOpenEmployeeExperienceDialog] =
    useState<boolean>(false);

  const [EmployeeExperienceData, setEmployeeExperienceData] = useState<
    number | undefined
  >();
  const [OpenUpdateDialog, setOpenUpdateDialog] = useState<boolean>();
  const { id } = useParams<{ id: string }>();
  const employeeId = id ? Number(id) : NaN;
  //
  const {
    data: EmployeeExperienceList,
    isLoading,
    error,
    refetch,
  } = useGetEmployeeExperienceListOfEmployeeQuery({ employeeId: employeeId });
  //
  const closeDialog = () => {
    setOpenEmployeeExperienceDialog(false);
    refetch();
  };
  //
  const UpdateDialogClose = () => {
    setEmployeeExperienceData(undefined);
    setOpenUpdateDialog(false);
    refetch();
  };
  //
  const UpdateExperienceDialog = (id: number | undefined) => {
    setEmployeeExperienceData(id);
    setOpenUpdateDialog(true);
  };
  //
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end", // Align button to the right
          width: "100%", // Full width of the modal
        }}
      >
        <Button
          onClick={() =>
            !OpenEmployeeExperienceDialog &&
            setOpenEmployeeExperienceDialog(true)
          }
          variant="contained"
          startIcon={<Add />}
          size="small"
          color="primary"
        >
          Add Experience
        </Button>
      </Box>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Employee Experience</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            {items && (
              <Paper>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          FirmName
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          JobTitle
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          StartDate
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          EndDate
                        </TableCell>
                       <TableCell sx={{ fontWeight: "bold" }}>
                          Experiance Type
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(EmployeeExperienceList || []).map(
                        (EmployeeExperienceList: EmployeeExperienceDto) => (
                          <Fragment key={EmployeeExperienceList.id}>
                            <TableRow>
                              <TableCell>
                                {EmployeeExperienceList.firmName}
                              </TableCell>
                              <TableCell>
                                {EmployeeExperienceList.jobTitle}
                              </TableCell>
                              <TableCell>
                                {EmployeeExperienceList.startDate
                                  ? dayjs(
                                      EmployeeExperienceList?.startDate
                                    ).format("MMMM D, YYYY")
                                  : "-"}
                              </TableCell>
                              <TableCell>
                                {EmployeeExperienceList.endDate
                                  ? dayjs(
                                      EmployeeExperienceList?.endDate
                                    ).format("MMMM D, YYYY")
                                  : "-"}
                              </TableCell>
                                  <TableCell>
                                { ExperienceType[EmployeeExperienceList.experienceType ? EmployeeExperienceList.experienceType : 0] }
                              </TableCell>
                              <TableCell>
                                <Button
                                  onClick={() =>
                                    UpdateExperienceDialog(
                                      EmployeeExperienceList.id
                                    )
                                  }
                                >
                                  Edit
                                </Button>
                              </TableCell>
                            </TableRow>
                          </Fragment>
                        )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}

            {!items && (
              <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                <Typography> No Data Available</Typography>
              </Box>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
      {OpenEmployeeExperienceDialog && (
        <EmployeeExperience onClose={closeDialog} />
      )}
      {OpenUpdateDialog && EmployeeExperienceData !== null && (
        <EmployeeExperienceUpdate
          Id={EmployeeExperienceData}
          onClose={UpdateDialogClose}
        />
      )}
    </Box>
  );
};
