import { useState } from "react";
import {
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Box,
  Button,
} from "@mui/material";
import { NotificationBell } from "./NotificationBell";
import { Link } from "react-router-dom";
import { usePermission } from "../hooks";

export const NotificationsDropdown = ({
  notifications,
}: {
  notifications: any[];
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const maxVisibleNotifications = 10;
  const permissions = usePermission();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "notifications-popover" : undefined;
  const hasMoreNotifications = notifications.length > maxVisibleNotifications;
  const visibleNotifications = hasMoreNotifications
    ? notifications.slice(0, maxVisibleNotifications)
    : notifications;

  return (
    <>
      <NotificationBell count={notifications.length} onClick={handleClick} />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Paper sx={{ width: 360 }}>
          <Box sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}>
            <Button
              component={Link}
              to="/probation"
              fullWidth
              onClick={handleClose}
             disabled={!permissions.CanViewEmployeeProbation}
            >
              <Typography variant="h6" component="span">
                Probation Notifications{" "}
              </Typography>
            </Button>
          </Box>

          {notifications.length === 0 ? (
            <Typography sx={{ p: 2 }}>No new notifications</Typography>
          ) : (
            <>
              <List
                sx={{
                  maxHeight: 300,
                  overflow: "auto",
                  "&::-webkit-scrollbar": {
                    width: "0.4em",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#f1f1f1",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#888",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "#555",
                  },
                }}
              >
                {visibleNotifications.map((notification, index) => (
                  <ListItem key={index} divider>
                    
                    <ListItemText
                      primary={notification.title}
                      secondary={notification.message}
                    />
                  </ListItem>
                ))}
              </List>

              {hasMoreNotifications && (
                <Box
                  sx={{
                    textAlign: "center",
                    borderTop: "1px solid rgba(0, 0, 0, 0.12)",
                  }}
                >
                  <Button
                    component={Link}
                    to="/probation"
                    fullWidth
                    onClick={handleClose}
                    disabled={!permissions.CanViewEmployeeProbation}

                  >
                    View All Notifications
                  </Button>
                </Box>
              )}
            </>
          )}
        </Paper>
      </Popover>
    </>
  );
};
