import { Badge, Box, Tab, Tabs, Typography } from "@mui/material";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  BenefitValueCountsByStatus,
  BenefitValueDto,
} from "../../../../app/store";

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
  }: BenefitValueCountsByStatus = {},
  filteredBenefitValues: BenefitValueDto[]
): TabProps[] => [
  {
    label: "Benefit Value",
    href: "/benefit-value",
    counts: approved,
    color: "success",
  },
  {
    label: "Approval Requests",
    href: "/benefit-value/approval-requests",
    counts: approvalRequests,
    color: "primary",
  },
  {
    label: "Rejected",
    href: "/benefit-value/rejected-approval-requests",
    counts: rejected,
    color: "error",
  },
  {
    label: "Draft",
    href: "/benefit-value/draft",
    counts: drafts,
    color: "info",
  },
];

export const BenefitValueListTabs = ({
  counts,
  filteredBenefitValues = [],
}: {
  counts?: BenefitValueCountsByStatus;
  filteredBenefitValues?: BenefitValueDto[];
}) => {
  const tabs = useMemo(
    () => getTabs(counts, filteredBenefitValues),
    [counts, filteredBenefitValues]
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
