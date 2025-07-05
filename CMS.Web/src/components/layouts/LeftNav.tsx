import {
  EmailRounded,
  PermIdentityOutlined,
  TimelapseOutlined,
} from "@mui/icons-material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import GroupsIcon from "@mui/icons-material/Groups";
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import {
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { usePermission } from "../../hooks/usePermission";

interface NavMenuItem {
  label: string;
  icon: any;
  url?: string;
  subGroup?: NavMenuItem[];
  subMenu?: NavMenuItem[];
}
const navMenuItems: NavMenuItem[] = [
  {
    label: "Dashboard",
    icon: <DashboardIcon color="primary" />,
    url: "/",
  },

  {
    label: "HCMS Setups",
    icon: <AccountBalanceIcon color="primary" />,
    url: "/setup",
  },

  {
    label: "System Admin",
    icon: <AdminPanelSettingsIcon color="primary" />,
    url: "/sys-admin",
  },
  {
    label: "Employees",
    icon: <GroupsIcon color="primary" />,
    url: "/employees",
  },
  {
    label: "Probation",
    icon: <TimelapseOutlined color="primary" />,
    url: "/probation",
  },
  {
    label: "ID Management",
    icon: <PermIdentityOutlined color="primary" />,
    url: "/employeeid",
  },
      {
    label: "Letters",
    icon: <EmailRounded color="primary" />,
    url: "/letters",
  },
];

interface Props {
  opened: boolean;
  onClose: () => void;
}

const NavItem = ({
  menuItem,
  sx,
  opened,
  onClose,
}: {
  menuItem: NavMenuItem;
  onClose: () => void;
  sx?: SxProps<Theme> | undefined;
  opened: boolean;
}) => {
  const navigator = useNavigate();
  const [subMenuOpened, setSubMenuOpened] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const navigateToPage = useCallback(
    (url: string) => {
      navigator(url);
    },
    [navigator]
  );

  const onNavItemClick = useCallback(
    (item: NavMenuItem): MouseEventHandler<HTMLDivElement> =>
      (event) => {
        if (menuItem?.subGroup?.length) {
          setSubMenuOpened(!subMenuOpened);
          setAnchorEl(event.currentTarget);
        } else {
          item?.url && navigateToPage(item.url);
        }
      },
    [menuItem?.subGroup?.length, navigateToPage, subMenuOpened]
  );

  useEffect(() => {
    !opened && setAnchorEl(null);
  }, [opened]);

  useEffect(() => {
    opened && setSubMenuOpened(false);
  }, [opened]);

  return (
    <ListItem key={menuItem.label} disablePadding sx={{ display: "block" }}>
      <ListItemButton
        sx={{
          minHeight: 48,
          justifyContent: opened ? "initial" : "center",
          px: 2.5,
          ...sx,
        }}
        onClick={onNavItemClick(menuItem)}
      >
        <ListItemIcon
          sx={{
            my: "auto",
            minWidth: "36px",
            mr: opened ? 3 : "auto",
            justifyContent: "center",
            color: "black",
          }}
        >
          {menuItem.icon}
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography variant={"body1"} color="inherit">
              {menuItem.label}
            </Typography>
          }
          sx={{ opacity: opened ? 1 : 0 }}
        />
        {!menuItem?.subGroup?.length || !opened ? null : subMenuOpened ? (
          <ExpandLess />
        ) : (
          <ExpandMore />
        )}
      </ListItemButton>

      {!!menuItem?.subGroup?.length && (
        <>
          {opened && (
            <Collapse in={subMenuOpened} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {menuItem.subGroup.map((item, label) => (
                  <NavItem
                    key={label}
                    sx={{ pl: 4 }}
                    menuItem={item}
                    onClose={onClose}
                    opened={true}
                  />
                ))}
              </List>
            </Collapse>
          )}
          {!opened && anchorEl && (
            <Popover
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "center",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "center",
                horizontal: "left",
              }}
              open={Boolean(anchorEl)}
              onClose={() => {
                setAnchorEl(null);
              }}
            >
              <List component="div" disablePadding>
                {menuItem.subGroup.map((item, label) => (
                  <NavItem
                    key={label}
                    sx={{ pl: 4 }}
                    menuItem={item}
                    onClose={onClose}
                    opened={true}
                  />
                ))}
              </List>
            </Popover>
          )}
        </>
      )}
    </ListItem>
  );
};
export const LeftNav = ({ opened, onClose }: Props) => {
  const permissions = usePermission();

  const menuItems = useMemo(() => {
    return navMenuItems.filter(item => {
      if (item.label === "HCMS Admin") {
        return permissions.canCreateUpdateSetup || permissions.canApproveRejectSetup;
      }
      if (item.label === "System Admin") {
        return permissions.canCreateUpdateUser;
      }
      if (item.label === "Employees") {
        return  permissions.canViewEmployeePersonalInfo;
      }
      if (item.label === "ID Management") {
        return permissions.CanViewEmployeeId;
      }
      if (item.label === "Probation") {
        return permissions.CanViewEmployeeProbation;
      }
      return true;
    }).filter(
      (item) =>
        (item.url !== "/sys-admi" || permissions.canCreateUpdateUser) &&
        item.url !== "/home"
    );
  }, [permissions.canCreateUpdateUser, permissions.canCreateUpdateSetup, permissions.canApproveRejectSetup]);

  return (
    <List>
      {menuItems.map((item, label) => (
        <NavItem
          menuItem={item}
          key={label}
          onClose={onClose}
          opened={opened}
        />
      ))}
    </List>
  );
};
