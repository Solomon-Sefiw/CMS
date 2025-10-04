import { appBarClasses, Badge, Box, Tab, Tabs } from "@mui/material";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { CaseCountsByStatus } from "../../../app/store";

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
}: CaseCountsByStatus = {}): TabProps[] => [
  {
    label: "Cases",
    href: "/cases",
    counts: undefined,
    color: "success",
  },
  {
    label: "Received",
    href: "/cases/approval-requests",
    counts: approvalRequests,
    color: "success",
  },
  {
    label: "Archived",
    href: "/cases/rejected-approval-requests",
    counts: rejected,
    color: "error",
  },
  {
    label: "Pending",
    href: "/cases/draft",
    counts: drafts,
    color: "info",
  },
];

export const CaseListTabs = ({
  counts,
}: {
  counts?: CaseCountsByStatus;
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
