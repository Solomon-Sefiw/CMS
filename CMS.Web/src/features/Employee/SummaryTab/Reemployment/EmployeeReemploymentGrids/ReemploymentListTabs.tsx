import { Badge, Box, Tab, Tabs } from "@mui/material";
import { useMemo } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ReemploymentCountsByStatus } from "../../../../../app/api";

interface TabProps {
  label: string;
  href: string;
  counts?: number;
  color: "primary" | "success" | "error" | "info";
}

const getTabs = (
  basePath: string,
  {
    approved,
    approvalRequests,
    rejected,
    drafts,
  }: ReemploymentCountsByStatus = {}
): TabProps[] => [
  {
    label: "Reemployments",
    href: `${basePath}`, // Base = approved list
    counts: approved,
    color: "success",
  },
  {
    label: "Approval Requests",
    href: `${basePath}/approval-requests`,
    counts: approvalRequests,
    color: "primary",
  },
  {
    label: "Rejected",
    href: `${basePath}/rejected-approval-requests`,
    counts: rejected,
    color: "error",
  },
  {
    label: "Draft",
    href: `${basePath}/draft`,
    counts: drafts,
    color: "info",
  },
];

export const ReemploymentListTabs = ({
  counts,
}: {
  counts?: ReemploymentCountsByStatus;
}) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const tabs = useMemo(() => {
    if (!id) return [];
    const basePath = `/employee-detail/${id}/activities/reemployment`;
    return getTabs(basePath, counts);
  }, [id, counts]);

  const currentIndex = useMemo(() => {
    const path = location.pathname.replace(/\/$/, "");
    const sorted = [...tabs].sort((a, b) => b.href.length - a.href.length);
    const matched = sorted.find((t) => path.startsWith(t.href));
    return matched ? tabs.findIndex((t) => t.href === matched.href) : 0;
  }, [location.pathname, tabs]);

  return (
    <Box>
      <Tabs value={currentIndex}>
        {tabs.map(({ href, color, label, counts }) => (
          <Tab
            key={label}
            component={Link}
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
