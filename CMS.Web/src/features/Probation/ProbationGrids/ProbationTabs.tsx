import { Badge, Box, Tab, Tabs } from "@mui/material";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { GetProbationCountsByStatus } from "../../../app/api/HCMSApi";

interface TabProps {
  label: string;
  href: string;
  counts?: number;
  color: "primary" | "success" | "error" | "info";
}

const getTabs = ({
  approvalRequests,
  probationState,
  rejected,
}: GetProbationCountsByStatus = {}): TabProps[] => [
  {
    label: "Approval Requests",
    href: "/Probation",
    counts: approvalRequests,
    color: "info",
  },

  {
    label: "Rejected Probation List",
    href: "/Probation/Rejected",
    counts: rejected,
    color: "primary",
  },
  {
    label: "Under Probation List",
    href: "/Probation/underProbation",
    counts: probationState,
    color: "success",
  },
];

export const ProbationTabs = ({
  counts,
}: {
  counts?: GetProbationCountsByStatus;
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
