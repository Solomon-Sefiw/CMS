import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Button,
  ButtonBase,
  Divider,
  IconButton,
  Link,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import { useLogoutMutation } from "../app/api";
import { useAuth, useModal, usePermission } from "../hooks";
import { LoggedInUser } from "./account";
import { NotificationsDropdown } from "./NotificationDropDown";
import dayjs from "dayjs";

const noop = () => {};

export const Header = ({
  onMenuClick,
  opened,
}: {
  onMenuClick: () => void;
  opened: boolean;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [logout] = useLogoutMutation();
  const { loggedIn } = useAuth();
  const { isOpen, toggle } = useModal();
  const navigate = useNavigate();
  const permissions = usePermission();

  const NavigateToList = () => {
    navigate(`/Probation/underProbation`);
  };

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
              <Typography component="span" fontWeight="bold" onClick={NavigateToList}>
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
              <Typography component="span" fontWeight="bold" onClick={NavigateToList}>
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
              <Typography component="span" fontWeight="bold" onClick={NavigateToList}>
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
              <Typography component="span" fontWeight="bold" onClick={NavigateToList}>
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

  return (
    <AppBar position="static" color="inherit" elevation={2} sx={{ backgroundColor: "#0a3d52" }}>
      <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
        {/* Left Section: Logo and Menu Button */}
        <Box sx={{ display: "flex", alignItems: "center", color: "#ffffff" }}>
          {loggedIn && (
            <IconButton edge="start" onClick={onMenuClick} sx={{ mr: 1, color: "#ffffff" }}>
              {opened ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
          )}
          <Link
            variant="h6"
            component={RouterLink}
            to="/home"
            sx={{ textDecoration: "none", color: "#ffffff", fontWeight: "bold" }}
          >
            CMS
          </Link>
        </Box>

        {/* Center: Logo */}
        {!isMobile && (
          <Box sx={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
            <ButtonBase disableRipple sx={{ width: 260 }} onClick={noop}>
              <Logo />
            </ButtonBase>
          </Box>
        )}

        {/* Right Section */}
        {loggedIn && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button sx={{ textTransform: "none",color: "#ffffff" }} onClick={() => logout()}>
              Logout
            </Button>
            {/* Uncomment to show notifications */}
            {/* {permissions.CanViewEmployeeProbation && (
              <NotificationsDropdown
                notifications={transformProbationListToNotifications([])}
              />
            )} */}
            <Divider orientation="vertical" flexItem />
            <LoggedInUser />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};
