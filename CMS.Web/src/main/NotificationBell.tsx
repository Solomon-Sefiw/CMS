import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

interface NotificationBellProps {
  count: number;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

export const NotificationBell = ({ count, onClick }: NotificationBellProps) => (
  <Tooltip title="Notifications">
    <IconButton 
    sx={{color : "white"}}
   // color="primary" 
    onClick={onClick}>
      <Badge badgeContent={count} color="error">
        <NotificationsIcon />
      </Badge>
    </IconButton>
  </Tooltip>
);
