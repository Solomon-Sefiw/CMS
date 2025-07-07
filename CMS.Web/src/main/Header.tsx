import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Button,
  ButtonBase,
  Divider,
  Link,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import {
  useGetAllProbationForNotificationQuery,
  useLogoutMutation,
} from "../app/api";
import { useAuth, useModal, usePermission } from "../hooks";
import { LoggedInUser } from "./account";
import { NotificationsDropdown } from "./NotificationDropDown";
import dayjs from "dayjs";
import LanguageSwitcher from "../components/LanguageSwitcher";

const noop = () => {};

export const Header = ({
  onMenuClick,
  opened,
}: {
  onMenuClick: () => void;
  opened: boolean;
}) => {
  const [logout] = useLogoutMutation();
  const { loggedIn } = useAuth();
  const { isOpen, toggle } = useModal();
  const navigate = useNavigate();

  const NavigateToList = () => {
    navigate(`/Probation/underProbation`);
  };

  const {
    data: probationList = [],
    isLoading,
    isError,
    refetch,
  } = useGetAllProbationForNotificationQuery();
const permissions = usePermission();
  const transformProbationListToNotifications = (probationList: any[]) => {
    if (!probationList || probationList.length === 0) return [];

    return probationList.map((employee) => {
      const startDate = dayjs(employee.employementDate);
      const probationDays =
        employee?.job?.jobRole?.jobCatagory?.probationPeriodInDays || 0;
      const today = dayjs();
      const daysPassed = today.diff(startDate, "day");
      const daysRemaining = probationDays - daysPassed;

      if (daysRemaining === 0) {
        return {
          title: "Completed Probation",
          message: (
            <>
              <Typography
                component="span"
                fontWeight="bold"
                onClick={NavigateToList}
              >
                {employee.displayName}
              </Typography>
              's probation period ended
            </>
          ),
          severity: "info",
        };
      } else if (daysRemaining > 0 && daysRemaining <= 7) {
        return {
          title: "Probation Ending Soon",
          message: (
            <>
              <Typography
                component="span"
                fontWeight="bold"
                onClick={NavigateToList}
              >
                {employee.displayName}
              </Typography>
              's probation ending in{" "}
              <Typography component="span" fontWeight="bold">
                {daysRemaining} days
              </Typography>
            </>
          ),
          severity: "warning",
        };
      } else if (daysRemaining < 0) {
        return {
          title: "Probation Review Due",
          message: (
            <>
              Review needed for{" "}
              <Typography
                component="span"
                fontWeight="bold"
                onClick={NavigateToList}
              >
                {employee.displayName}
              </Typography>
              's probation (
              <Typography component="span" fontWeight="bold">
                {Math.abs(daysRemaining)} days overdue
              </Typography>
              )
            </>
          ),
          severity: "error",
        };
      } else {
        return {
          title: "Probation In Progress",
          message: (
            <>
              <Typography
                component="span"
                fontWeight="bold"
                onClick={NavigateToList}
              >
                {employee.displayName}
              </Typography>
              's probation in progress ({daysRemaining} days remaining)
            </>
          ),
          severity: "info",
        };
      }
    });
  };

  const probationNotifications =
    transformProbationListToNotifications(probationList);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flex: 1,
          position: "relative",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {loggedIn && (
            <Button
              sx={{ px: 2 }}
              startIcon={opened ? <ChevronLeftIcon /> : <MenuIcon />}
              onClick={onMenuClick}
            >
              Menu
            </Button>
          )}
          <Link
            variant="h6"
            component={RouterLink}
            to="/Home"
            sx={{ cursor: "pointer", textDecoration: "none", color: "#002a73" }}
          >
            HCMS
          </Link>
        </Box>
         <LanguageSwitcher />
        <Box sx={{ flex: 1 }}></Box>
        <Box
          component="span"
          sx={{
            display: "flex",
            flexGrow: 1,
            justifyContent: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <ButtonBase disableRipple sx={{ width: "260px" }} onClick={noop}>
            <Logo />
          </ButtonBase>
        </Box>
        {loggedIn && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button sx={{ textTransform: "none" }} onClick={() => logout()}>
                Logout
              </Button>
              <Divider
                orientation="vertical"
                sx={{ height: "auto", alignSelf: "stretch", mx: 2 }}
              />
              <Box sx={{ mr: 2 }}>
               {permissions.canViewSetup && <NotificationsDropdown notifications={probationNotifications} />}
              </Box>
              <Divider
                orientation="vertical"
                sx={{ height: "auto", alignSelf: "stretch", mx: 2 }}
              />
              <LoggedInUser />
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};
