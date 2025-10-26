import React, { useState, useEffect } from "react"; // Import useEffect
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Badge,
  Tooltip,
  CircularProgress,
  TablePagination,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import MarkAsUnreadIcon from '@mui/icons-material/MarkAsUnread';
import SendIcon from '@mui/icons-material/Send';
import DescriptionIcon from '@mui/icons-material/Description';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArchiveIcon from '@mui/icons-material/Archive';

import {
  LetterCountsByStatus,
  LetterDto,
  useGetLetterCountPerStatusForDashboardQuery,
  useSearchAllLettersForDashboardQuery,
} from "../../app/store";

import { LetterStatus } from "../../app/api/enums";
import { useAuth, usePermission } from "../../hooks";
import { useTranslation } from "react-i18next";

// Define a type for the card configuration to ensure type safety
interface DashboardCard {
  type: keyof LetterCountsByStatus;
  label: string;
  icon: React.ElementType; // Use React.ElementType for component types
  color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'default'; // Explicitly define MUI color types
  subText: string;
  route: string;
}

const LetterDashboardDemo = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const permissions = usePermission();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
const { t } = useTranslation();
  // State to hold the current time, updated every second
  const [currentTime, setCurrentTime] = useState(new Date());

  // Effect to update the current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every 1 second

    // Cleanup the interval when the component unmounts
    return () => clearInterval(timer);
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  // Calculate the time 6 hours late from current
  const sixHoursLateTime = new Date(currentTime.getTime() - (6 * 60 * 60 * 1000));
  const formattedDateTime = sixHoursLateTime.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true, // Use 12-hour format with AM/PM
  });


  const { data: letterCounts, isLoading: areCountsLoading, error: countsError } =
    useGetLetterCountPerStatusForDashboardQuery({ userId: user?.id || '' });

  const { data: allLetters = [], isLoading: areLettersLoading, error: lettersError } =
    useSearchAllLettersForDashboardQuery({ userId: user?.id || '' });

  const getCountByType = (type: keyof LetterCountsByStatus): number => {
    if (areCountsLoading || countsError || !letterCounts) return 0;
    return letterCounts[type] ?? 0;
  };
  const getStatusChip = (status: number): JSX.Element => {
    switch (status) {
      case LetterStatus.pending:
        return (
          <Chip
            icon={<AccessTimeIcon />}
            label="Pending"
            color="warning"
            variant="outlined"
            size="small"
            sx={{ fontWeight: 'bold' }} // Added bold font weight
          />
        );
      case LetterStatus.received:
        return (
          <Chip
            icon={<ForwardToInboxIcon />}
            label="Received"
            color="primary"
            variant="outlined"
            size="small"
            sx={{ fontWeight: 'bold' }} // Added bold font weight
          />
        );
      case LetterStatus.responded:
        return (
          <Chip
            icon={<CheckCircleIcon />}
            label="Responded"
            color="success"
            variant="outlined"
            size="small"
            sx={{ fontWeight: 'bold' }} // Added bold font weight
          />
        );
      case LetterStatus.archived:
        return (
          <Chip
            icon={<ArchiveIcon />}
            label="Archived"
            color="default"
            variant="outlined"
            size="small"
            sx={{ fontWeight: 'bold' }} // Added bold font weight
          />
        );
      default:
        return <Chip label={`Status ${status}`} variant="outlined" size="small" sx={{ fontWeight: 'bold' }} />; // Added bold font weight
    }
  };

  // Modified handleLetterAction to navigate based on status
  const handleLetterAction = (status: LetterStatus | undefined) => {
    let route = '/letters'; // Default route

    if (status !== undefined) {
      switch (status) {
        case LetterStatus.pending:
          route = '/letters/pending';
          break;
        case LetterStatus.received:
          route = '/letters/received';
          break;
        case LetterStatus.responded:
          route = '/letters'; // Or keep as '/letters' if no specific responded list
          break;
        case LetterStatus.archived:
          route = '/letters/archived';
          break;
        default:
          route = '/letters'; // Fallback for unknown status
          break;
      }
    }
    navigate(route);
  };

  const handleCardClick = (path: string) => {
    navigate(`/letters/${path}`);
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedLetters = allLetters.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const totalLettersCount = allLetters.length;

  // Define the dashboard cards with the new DashboardCard type
  const dashboardCards: DashboardCard[] = [
    { type: 'pending', label: 'Pending Letters', icon: MarkAsUnreadIcon, color: 'warning', subText: 'Requires action', route: 'pending' },
    { type: 'received', label: 'Received Letters', icon: ForwardToInboxIcon, color: 'primary', subText: 'This month', route: 'received' },
    { type: 'responded', label: 'Responded Letters', icon: SendIcon, color: 'success', subText: 'Successfully handled', route: '' },
    { type: 'archived', label: 'Archived Letters', icon: ArchiveIcon, color: 'default', subText: 'For historical reference', route: 'archived' },
  ];

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2, md: 4 },
        backgroundColor: '#f5f7fa',
        minHeight: '100vh', // Ensure it takes full viewport height
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: { xs: 2, md: 4 },
          flexDirection: { xs: 'column', sm: 'row' }, // Stack on small screens
          textAlign: { xs: 'center', sm: 'left' }, // Center text on small screens
          gap: { xs: 1, sm: 0 }, // Gap between elements when stacked
        }}
      >
        <Typography variant="h5" sx={{ color: 'primary.dark', fontWeight: 'bold', fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' } }}>
           {t('welcome')}
        </Typography>
        <Typography variant="subtitle1" color="#ffffff" sx={{fontWeight: 'bold',backgroundColor: "#0a3d52", textAlign: { xs: 'center', sm: 'right' }, fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
          {formattedDateTime} {/* Updated to display real-time, 6 hours late */}
        </Typography>
      </Box>

      {(areCountsLoading || countsError) && (
        <Box sx={{ my: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          {areCountsLoading && <CircularProgress color="primary" />} {/* Added color */}
          {countsError && (
            <Alert severity="error" sx={{ width: 'fit-content' }}>
              Error fetching letter counts: {typeof countsError === "string" ? countsError : JSON.stringify(countsError)}
            </Alert>
          )}
        </Box>
      )}

      {permissions.CanViewLetterCountBoard &&
        <Grid container spacing={{ xs: 2, md: 4 }} sx={{ mb: { xs: 2, md: 4 } }}>
          {dashboardCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out', // Added background-color transition
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                    cursor: 'pointer',
                    backgroundColor: '#e3f2fd', // Light blue on hover
                  },
                  minHeight: { xs: '120px', md: '150px' },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
                onClick={() => handleCardClick(card.route)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1,
                    }}
                  >
                    <Box>
                      <Typography sx={{ color: `${card.color}.main`, fontSize: { xs: '0.8rem', sm: '0.9rem' }, fontWeight: 'medium' }}>{card.label}</Typography>
                      <Typography variant="h5" fontWeight="bold" sx={{ mt: 0.5 }}>
                        {areCountsLoading
                          ? <CircularProgress size={24}  /> // Spinner color matches card
                          : getCountByType(card.type)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                        {card.subText}
                      </Typography>
                    </Box>
                    <Badge
                      badgeContent={getCountByType(card.type)}
                      color={card.color}
                      max={999}
                      sx={{
                        '.MuiBadge-badge': {
                          fontSize: { xs: 10, sm: 12 }, // Responsive badge font size
                          height: { xs: 18, sm: 20 },
                          minWidth: { xs: 18, sm: 20 },
                          borderRadius: '50%',
                        }
                      }}
                    >
                      {React.createElement(card.icon, { sx: { fontSize: { xs: 30, sm: 35, md: 45 }, color: `${card.color}.main` } })}
                    </Badge>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      }

      {permissions.CanViewRecentLettersBoard && <Grid container>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, p: { xs: 1, md: 2 } }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 2, sm: 0 },
                }}
              >
                <Typography variant="h6" fontWeight="bold" color={"primary.dark"}>
                  {t('recent_letters')}
                </Typography>
              </Box>

              <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
                <Table stickyHeader aria-label="recent letters table">
                  <TableHead sx={{ backgroundColor: 'primary.light' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Reference</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Subject</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Department</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Sender</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Recipient</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {areLettersLoading ? (
                      <TableRow>
                        <TableCell colSpan={9} align="center" sx={{ py: 5 }}>
                          <CircularProgress color="primary" />
                          <Typography variant="body1" sx={{ mt: 2 }}>Loading letters...</Typography>
                        </TableCell>
                      </TableRow>
                    ) : lettersError ? (
                      <TableRow>
                        <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                          <Alert severity="error" sx={{ mx: 'auto', width: 'fit-content' }}>
                            Error loading letters: {typeof lettersError === "string"
                              ? lettersError
                              : lettersError && "message" in lettersError
                                ? (lettersError as any).message
                                : JSON.stringify(lettersError) || 'Unknown error'}
                          </Alert>
                        </TableCell>
                      </TableRow>
                    ) : paginatedLetters.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} align="center" sx={{ py: 5 }}>
                          <DescriptionIcon color="action" sx={{ fontSize: 60 }} />
                          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                            No recent letters to display.
                          </Typography>
                          <Typography variant="body2" color="text.disabled">
                            Your letter activity will appear here.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedLetters.map((item: LetterDto, index: number) => (
                        <TableRow
                          key={item.id}
                          hover
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                            backgroundColor: index % 2 === 0 ? '#fcfdff' : 'inherit',
                            '&:hover': {
                              backgroundColor: '#e3f2fd !important', // Light blue on hover
                            },
                          }}
                        >
                          <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                            <Typography fontWeight="bold" variant="body2" sx={{ fontSize: 'inherit' }}>{item.referenceNumber}</Typography>
                          </TableCell>
                          <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                            <Typography variant="body2" sx={{ fontSize: 'inherit' }}>{item.subject}</Typography>
                          </TableCell>
                          <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                            <Typography variant="body2" sx={{ fontSize: 'inherit' }}>{item.businessUnits?.name || 'N/A'}</Typography>
                          </TableCell>
                          <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                            <Typography variant="body2" sx={{ fontSize: 'inherit' }}>{`${item.sender?.firstName || ''} ${item.sender?.lastName || ''}`.trim() || 'N/A'}</Typography>
                          </TableCell>
                          <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                            <Typography variant="body2" sx={{ fontSize: 'inherit' }}>{`${item.recipientIds || ''} ${item.recipientIds || ''}`.trim() || 'N/A'}</Typography>
                          </TableCell>
                          <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                            <Typography variant="body2" sx={{ fontSize: 'inherit' }}>
                              {item.receivedDate ? new Date(item.receivedDate).toLocaleDateString("en-GB") :
                                item.sentDate ? new Date(item.sentDate).toLocaleDateString("en-GB") : 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>{getStatusChip(item.status ?? LetterStatus.pending)}</TableCell>
                          <TableCell>
                            <Tooltip
                              title={`View All ${LetterStatus[item.status ?? LetterStatus.pending]} Letters`}
                              arrow
                              componentsProps={{
                                tooltip: {
                                  sx: {
                                    bgcolor: 'info.main',
                                    color: 'white',
                                    fontSize: 13,
                                  },
                                },
                              }}
                            >
                              <IconButton
                                onClick={() => handleLetterAction(item.status ?? LetterStatus.pending)} // Call the new handler
                                aria-label="view details"
                                sx={{ color: 'primary.main', '&:hover': { color: 'primary.dark' } }}
                              >
                                <SendIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalLettersCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      }
    </Box>
  );
};

export default LetterDashboardDemo;