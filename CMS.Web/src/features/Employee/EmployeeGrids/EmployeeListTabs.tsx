import React, { useState, useEffect, useMemo } from "react";
import { Box, Tabs, Tab, Badge } from "@mui/material";
import { Link } from "react-router-dom";
import { EmployeeCountsByStatus } from "../../../app/api";

interface TabProps {
  label: string;
  href: string;
  counts?: number;
  color: "primary" | "success" | "error" | "info";
}

const getTabs = ({
  approvalRequests,
  rejected,
  drafts,
}: {
  approvalRequests?: number;
  rejected?: number;
  drafts?: number;
}) => {
  const tabs: TabProps[] = [
    {
      label: "employees",
      href: `/employees`,
      counts: undefined,
      color: "success",
    },
    {
      label: "Approval Requests",
      href: `/employees/approval-requests`,
      counts: approvalRequests,
      color: "success",
    },
    {
      label: "Rejected",
      href: `/employees/rejected-approval-requests`,
      counts: rejected,
      color: "error",
    },
    {
      label: "Draft",
      href: `/employees/draft`,
      counts: drafts,
      color: "info",
    },
  ];
  return tabs;
};

export const EmployeeListTabs = ({
  counts,
}: {
  counts?: EmployeeCountsByStatus;
}) => {
  const tabs = useMemo(() => getTabs({ ...counts }), [counts]);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const currentTabIndex = tabs.findIndex(
      (t) => t.href === window.location.pathname
    );
    if (currentTabIndex !== -1) {
      setValue(currentTabIndex);
    }
  }, [tabs]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Tabs value={value} onChange={handleChange}>
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
          />
        ))}
      </Tabs>
    </Box>
  );
};
