import { Badge, Box, Tab, Tabs } from "@mui/material";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { SubCityCountsByStatus } from "../../../../app/store";

interface TabProps {
  label: string;
  href: string;
  counts?: number;
  color: "primary" | "success" | "error" | "info";
}

const getTabs = ({
  submitted,
  rejected,
  draft,
}: SubCityCountsByStatus = {}): TabProps[] => [
  {
    label: "Sub Cities",
    href: "/sub-city",
    counts: undefined,
    color: "success",
  },
  {
    label: "Approval Requests",
    href: "/sub-city/approval-requests",
    counts: submitted,
    color: "success",
  },
  {
    label: "Rejected",
    href: "/sub-city/rejected-approval-requests",
    counts: rejected,
    color: "error",
  },
  {
    label: "Draft",
    href: "/sub-city/draft",
    counts: draft,
    color: "info",
  },
];

export const SubCityListTabs = ({
  counts,
}: {
  counts?: SubCityCountsByStatus;
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
