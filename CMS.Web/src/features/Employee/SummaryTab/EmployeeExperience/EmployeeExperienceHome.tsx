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
import {
  ContactType,
  Country,
  ExperienceType,
  Status,
} from "../../../../app/api/enums";
import { EmployeeExperienceUpdate } from "./EmployeeExperienceUpdate";
import { EmployeeExperience } from "./EmployeeExperience";
import { usePermission } from "../../../../hooks";

const experianceTypeLabels: Record<number, string> = {
  1: "External",
  2: "NewHire",
  3: "Delegation",
  4: "Acting",
  5: "Promotion",
  6: "Demotion",
  7: "Transfer",
  8: "Reassignment",
};

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
const permissions = usePermission();
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
          disabled={!permissions.CanCreateOrUpdateEmployeeInfo}

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
                          Experience Type
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Reason
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          StartDate
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          EndDate
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
                                {experianceTypeLabels[
                                  EmployeeExperienceList.experienceType as keyof typeof experianceTypeLabels
                                ] ?? "Unknown"}
                              </TableCell>
                              <TableCell>
                                {EmployeeExperienceList.reasonForResignation}
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
        <EmployeeExperience
          onClose={closeDialog}
          experienceType={ExperienceType.External}
        />
      )}
      {OpenUpdateDialog && EmployeeExperienceData !== null && (
        <EmployeeExperienceUpdate
          Id={EmployeeExperienceData}
          onClose={UpdateDialogClose}
          experienceType={ExperienceType.External}
        />
      )}
    </Box>
  );
};
