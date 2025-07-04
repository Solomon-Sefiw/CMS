import { Badge, Box, Tab, Tabs, Typography } from "@mui/material";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { JobCountsByStatus, JobDto } from "../../../../app/api";

interface TabProps {
  label: string;
  href: string;
  counts?: number;
  color: "primary" | "success" | "error" | "info";
}

const getTabs = (
  { approved, approvalRequests, rejected, drafts }: JobCountsByStatus = {},
  filteredJobs: JobDto[]
): TabProps[] => [
  {
    label: "Job",
    href: "/job",
    counts: approved,
    color: "success",
  },
  {
    label: "Approval Requests",
    href: "/job/approval-requests",
    counts: approvalRequests,
    color: "primary",
  },
  {
    label: "Rejected",
    href: "/job/rejected-approval-requests",
    counts: rejected,
    color: "error",
  },
  {
    label: "Draft",
    href: "/job/draft",
    counts: drafts,
    color: "info",
  },
];

export const JobListTabs = ({
  counts,
  filteredJobs = [],
}: {
  counts?: JobCountsByStatus;
  filteredJobs?: JobDto[];
}) => {
  const tabs = useMemo(
    () => getTabs(counts, filteredJobs),
    [counts, filteredJobs]
  );
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
