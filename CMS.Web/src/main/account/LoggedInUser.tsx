import {
  Avatar,
  Box,
  Fade,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useLogoutMutation } from "../../app/api";
import { useAuth } from "../../hooks";
import { ChangePasswordDialog } from "./ChangePassword";
import { UserProfileDialog } from "./UserProfile";

export const LoggedInUser = () => {
  const [logout] = useLogoutMutation();
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openChangePwdDialog, setOpenChangePwdDialog] = useState(false);
  const [openUserProfileDialog, setOpenUserProfileDialog] = useState(false);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {" "}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography sx={{ fontStyle: "italic", mr: 1 }} variant="body2">
          {user?.firstName}
        </Typography>
        <Box>
<IconButton onClick={handleClick}>
  <Avatar 
    src={user?.photoUrl || undefined}
    alt={`${user?.firstName} ${user?.lastName}`}
    sx={{ 
      width: 32, 
      height: 32, 
      mr: 0.5, 
      fontSize: 16,
      // Add any additional styling you want for the avatar
    }}
  />
</IconButton>
          <Menu
            id="fade-menu"
            MenuListProps={{
              "aria-labelledby": "fade-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={closeMenu}
            TransitionComponent={Fade}
          >
          <MenuItem
              onClick={() => {
                setOpenUserProfileDialog(true);
                closeMenu();
              }}
            >
             Manage Profile
            </MenuItem>
            <MenuItem
              onClick={() => {
                setOpenChangePwdDialog(true);
                closeMenu();
              }}
            >
              Change Password
            </MenuItem>
            <MenuItem
              onClick={() => {
                logout();
                closeMenu();
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Box>
      {openChangePwdDialog && (
        <ChangePasswordDialog
          onClose={() => {
            setOpenChangePwdDialog(false);
          }}
        />
      )}
      {openUserProfileDialog && (
        <UserProfileDialog
          onClose={() => {
            setOpenUserProfileDialog(false);
          }}
        />
      )}
    </>
  );
};
