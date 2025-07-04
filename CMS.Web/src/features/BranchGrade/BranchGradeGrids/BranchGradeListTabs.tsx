import { Badge, Box, Tab, Tabs, Typography } from "@mui/material";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { BranchGradeCountsByStatus, BranchGradeDto } from "../../../app/store";
interface TabProps {
  label: string;
  href: string;
  counts?: number;
  color: "primary" | "success" | "error" | "info";
}

const getTabs = (
  {
    approved,
    approvalRequests,
    rejected,
    drafts,
  }: BranchGradeCountsByStatus = {},
  filteredBranchGrades: BranchGradeDto[]
): TabProps[] => [
  {
    label: "Branch Grade",
    href: "/branch-grade",
    counts: approved,
    color: "success",
  },
  {
    label: "Approval Requests",
    href: "/branch-grade/approval-requests",
    counts: approvalRequests,
    color: "primary",
  },
  {
    label: "Rejected",
    href: "/branch-grade/rejected-approval-requests",
    counts: rejected,
    color: "error",
  },
  {
    label: "Draft",
    href: "/branch-grade/draft",
    counts: drafts,
    color: "info",
  },
];

export const BranchGradeListTabs = ({
  counts,
  filteredBranchGrades = [],
}: {
  counts?: BranchGradeCountsByStatus;
  filteredBranchGrades?: BranchGradeDto[];
}) => {
  const tabs = useMemo(
    () => getTabs(counts, filteredBranchGrades),
    [counts, filteredBranchGrades]
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
