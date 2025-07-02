import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useCallback, useState, useEffect } from "react";
import { DialogHeader } from "../../components";
import { useAuth } from "../../hooks"; // Now useAuth provides refetchUser
import { UserPhoto } from "./UserPhoto";
import { UserSignaturePad } from "./UserSignaturePad";
import { UserDto } from "../../app/store";

interface UserProfileDialogProps {
  onClose: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value !== index ? null : <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export const UserProfileDialog = ({ onClose }: UserProfileDialogProps) => {
  const { user, refetchUser } = useAuth(); // Destructure refetchUser here
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    if (user && !user.photoUrl && user.signatureId) {
      setCurrentTab(1);
    }
  }, [user]);

  const handleChangeTab = useCallback((_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  }, []);

  const handleUploadSuccess = useCallback(() => {
    if (refetchUser) {
      refetchUser(); // Call refetchUser to update the user data immediately
    }
  }, [refetchUser]);

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      fullWidth
      maxWidth={"sm"}
      open={true}
      onClose={onClose}
    >
      <DialogHeader title={"User Profile Media"} onClose={onClose} />
      <DialogContent dividers={true} sx={{ p: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={handleChangeTab} aria-label="profile media tabs" centered>
            <Tab label="Profile Photo" {...a11yProps(0)} />
            <Tab label="Signature" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={currentTab} index={0}>
          {user ? <UserPhoto user={user} onPhotoUploaded={handleUploadSuccess} /> : <Typography variant="body2" color="textSecondary">User data not available.</Typography>}
        </CustomTabPanel>
        <CustomTabPanel value={currentTab} index={1}>
          {user ? <UserSignaturePad user={user} onSignatureSaved={handleUploadSuccess} /> : <Typography variant="body2" color="textSecondary">User data not available.</Typography>}
        </CustomTabPanel>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button variant="contained" color="error" onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};