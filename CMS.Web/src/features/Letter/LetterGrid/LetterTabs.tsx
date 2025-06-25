import { Badge, Box, Tab, Tabs } from "@mui/material";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { LetterCountsByStatus } from "../../../app/store";

interface TabProps {
  label: string;
  href: string;
  counts?: number;
  color: "primary" | "success" | "error" | "info";
}

const getTabs = ({
  received,
  archived,
  pending,
}: LetterCountsByStatus = {}): TabProps[] => [
  {
    label: "Sub Cities",
    href: "/letters",
    counts: undefined,
    color: "success",
  },
  {
    label: "Received",
    href: "/letters/received",
    counts: received,
    color: "success",
  },
  {
    label: "Archived",
    href: "/letters/archived",
    counts: archived,
    color: "error",
  },
  {
    label: "Pending",
    href: "/letters/pending",
    counts: pending,
    color: "info",
  },
];

export const LetterTabs = ({
  counts,
}: {
  counts?: LetterCountsByStatus;
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
