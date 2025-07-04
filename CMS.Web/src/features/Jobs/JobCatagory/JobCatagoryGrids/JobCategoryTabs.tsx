import { Badge, Box, Tab, Tabs } from "@mui/material";
import { useMemo } from "react";
import { Link } from "react-router-dom";

interface JobCategoryCountsByStatus {
  approved?: number;
  approvalRequests?: number;
  rejected?: number;
  drafts?: number;
}

interface TabProps {
  label: string;
  href: string;
  counts?: number;
  color: "primary" | "success" | "error" | "info";
}

const getTabs = ({
  approved,
  approvalRequests,
  rejected,
  drafts,
}: JobCategoryCountsByStatus = {}): TabProps[] => [
  {
    label: "JobCategories",
    href: "/jobCategory",
    counts: approved,
    color: "success",
  },
  {
    label: "Approval Requests",
    href: "/jobCategory/approval-requests",
    counts: approvalRequests,
    color: "primary",
  },
  {
    label: "Rejected",
    href: "/jobCategory/rejected-approval-requests",
    counts: rejected,
    color: "error",
  },
  {
    label: "Drafts",
    href: "/jobCategory/draft",
    counts: drafts,
    color: "info",
  },
];

export const JobCategoryTabs = ({
  counts,
}: {
  counts?: JobCategoryCountsByStatus;
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
          />
        ))}
      </Tabs>
    </Box>
  );
};
