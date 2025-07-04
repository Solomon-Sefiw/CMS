// LanguageSkill.tsx
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  enums,
  LanguageSkillDto,
  useGetLanguageSkillByIdQuery,
} from "../../../../app/api";
import { ContentCard } from "../../../../components/ContentCard";
import { Add, Delete, Edit, Language } from "@mui/icons-material";
import { LanguageSkillLevel } from "../../../../app/api/enums";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { LanguageSkillDialog } from "./LanguageSkillDialog";
import { usePermission } from "../../../../hooks";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.common.black,
    fontWeight: "bold",
    padding: theme.spacing(1), // Reduce padding for smaller rows
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12, // Smaller font size
    padding: theme.spacing(0.5, 1), // Reduce padding for smaller rows
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.common.white,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export const LanguageSkill = () => {
  const params = useParams();
  const employeeId = useMemo(() => +(params?.id || 0), [params?.id]);

  const { data: languageskills, refetch } = useGetLanguageSkillByIdQuery(
    { employeeId },
    { skip: !employeeId }
  );
  const permissions = usePermission();
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageSkillDto>();
  const [languageDialogOpened, setLanguageDialogOpened] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [languageSkillToDeleteId, setLanguageSkillToDeleteId] = useState<
    number | undefined
  >();

  const handleLanguageDialogOpen = () => setLanguageDialogOpened(true);
  const handleLanguageSelect = (language: LanguageSkillDto) =>
    setSelectedLanguage(language);
  const closeLanguageDialog = () => setLanguageDialogOpened(false);
  const closeUpdateLanguageDialog = () => setSelectedLanguage(undefined);

  const openDeleteConfirmation = (id: number) => {
    setLanguageSkillToDeleteId(id);
    setDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setLanguageSkillToDeleteId(undefined);
    setDeleteConfirmationOpen(false);
  };

  const handleDeleteSuccess = () => {
    refetch();
  };

  return (
    <ContentCard>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" color="primary">
          Language Skills
        </Typography>
        <Button
          onClick={handleLanguageDialogOpen}
          variant="contained"
          startIcon={<Add />}
          size="small"
          color="success"
          disabled={!permissions.CanCreateOrUpdateEmployeeInfo}
        >
          <Language /> Add
        </Button>
      </Box>

      <Card sx={{ borderRadius: "8px", boxShadow: 1 }}>
        <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
          <Table size="small" aria-label="language skills table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Language</StyledTableCell>
                <StyledTableCell align="center">Speak</StyledTableCell>
                <StyledTableCell align="center">Listen</StyledTableCell>
                <StyledTableCell align="center">Write</StyledTableCell>
                <StyledTableCell align="center">Read</StyledTableCell>
                <StyledTableCell align="right">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {languageskills?.map((row: any) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell
                    component="th"
                    scope="row"
                    sx={{ fontWeight: "bold" }}
                  >
                    {row.language && enums.Language[row.language]}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {LanguageSkillLevel[row.speaking]}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {LanguageSkillLevel[row.listening]}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {LanguageSkillLevel[row.writing]}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {LanguageSkillLevel[row.reading]}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <IconButton
                      onClick={() => handleLanguageSelect(row)}
                      size="small"
                      color="primary"
                      disabled={!permissions.CanCreateOrUpdateEmployeeInfo}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => openDeleteConfirmation(row.id ?? 0)}
                      size="small"
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
              {!languageskills?.length && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    sx={{
                      textAlign: "center",
                      py: 1,
                      fontStyle: "italic",
                      color: "textSecondary",
                    }}
                  >
                    No language skills added yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {languageDialogOpened && (
        <LanguageSkillDialog
          requestId={employeeId}
          onClose={closeLanguageDialog}
          title="Add Language Skill"
        />
      )}

      {selectedLanguage && (
        <LanguageSkillDialog
          requestId={employeeId}
          language={selectedLanguage}
          onClose={closeUpdateLanguageDialog}
          title="Update Language Skill"
        />
      )}

      <DeleteConfirmationDialog
        open={deleteConfirmationOpen}
        onClose={closeDeleteConfirmation}
        languageSkillId={languageSkillToDeleteId}
        onSuccess={handleDeleteSuccess}
      />
    </ContentCard>
  );
};
