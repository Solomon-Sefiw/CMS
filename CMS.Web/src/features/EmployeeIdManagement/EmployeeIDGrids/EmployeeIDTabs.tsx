import { Badge, Box, Tab, Tabs } from "@mui/material";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { GetEmployeeIdCountsByStatus } from "../../../app/api/HCMSApi";
interface TabProps {
  label: string;
  href: string;
  counts?: number;
  color: "primary" | "success" | "error" | "info";
}

const getTabs = ({
  approvalRequests,
  draft,
  rejected,
}: GetEmployeeIdCountsByStatus = {}): TabProps[] => [
  {
    label: "Employee ID Approval Requests",
    href: "/employeeid/approvalrequest",
    counts: approvalRequests,
    color: "info",
  },

  {
    label: "Rejected Employee ID",
    href: "/employeeid/rejected",
    counts: rejected,
    color: "primary",
  },
  {
    label: "Employees No Given ID",
    href: "/employeeid",
    counts: draft,
    color: "success",
  },
  {
    label: "Repleace ID",
    href: "/employeeid/ReplaceId",
    color: "info",
  },
  {
    label: "Print ID",
    href: "/employeeid/employeePrint",
    color: "info",
  },
];

export const EmployeeIDTabs = ({
  counts,
}: {
  counts?: GetEmployeeIdCountsByStatus;
}) => {
  const tabs = useMemo(() => getTabs(counts), [counts]);

  const getCurrentTabIndex = () => {
    const tabIndex = tabs.findIndex((t) => t.href === window.location.pathname);
    return tabIndex >= 0 ? tabIndex : 0;
  };

  return (
    <Box>
      <Tabs value={getCurrentTabIndex()}>
        {tabs.map(({ href, color, label, counts }) => (
          <Tab
            key={label}
            component={Link}
            color="inherit"
            to={href}
            label={
              <Badge badgeContent={counts || 0} color={color} sx={{ px: 2 }}>
                <Box>{label}</Box>
              </Badge>
            }
          ></Tab>
        ))}
      </Tabs>
    </Box>
  );
};
