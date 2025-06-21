import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { Box, Divider, Paper, Tab, Tabs } from "@mui/material";
import { useMemo } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { PageHeader } from "../../components";

interface TabProps {
  label: string;
  href: string;
}

const getTabs = (): TabProps[] => [
  {
    label: "Users",
    href: "/sys-admin/users",
  },
  {
    label: "Roles",
    href: "/sys-admin/roles",
  },
];

export const SysAdminDashboard = () => {
  const tabs = useMemo(() => getTabs(), []);
  const location = useLocation();

  // Determine the current tab index based on the current path
  const getCurrentTabIndex = () => {
    const tabIndex = tabs.findIndex((t) =>
      location.pathname.startsWith(t.href)
    );
    return tabIndex >= 0 ? tabIndex : 0; // Default to the first tab if not found
  };

  return (
    <Box>
      <PageHeader
        icon={
          <AdminPanelSettingsIcon
            sx={{ fontSize: "inherit", verticalAlign: "middle" }}
          />
        }
        title={"System Admin"}
      />
      <Paper sx={{ p: 2, flex: 1 }}>
        {/* Set the active tab based on the current route */}
        <Tabs value={getCurrentTabIndex()}>
          {tabs.map(({ href, label }) => (
            <Tab
              key={label}
              component={Link}
              color="inherit"
              to={href}
              label={label}
            />
          ))}
        </Tabs>
        <Divider />
        {/* Render the nested routes based on the active tab */}
        <Outlet />
      </Paper>
    </Box>
  );
};
