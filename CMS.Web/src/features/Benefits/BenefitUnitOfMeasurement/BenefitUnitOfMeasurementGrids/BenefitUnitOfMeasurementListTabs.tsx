import { Badge, Box, Tab, Tabs, Typography } from "@mui/material";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  BenefitUnitOfMeasurementCountsByStatus,
  BenefitUnitOfMeasurementDto,
} from "../../../../app/api";
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
  }: BenefitUnitOfMeasurementCountsByStatus = {},
  filteredBenefitUnitOfMeasurements: BenefitUnitOfMeasurementDto[]
): TabProps[] => [
  {
    label: "Measurement Unit",
    href: "/measurement-unit",
    counts: approved,
    color: "success",
  },
  {
    label: "Approval Requests",
    href: "/measurement-unit/approval-requests",
    counts: approvalRequests,
    color: "primary",
  },
  {
    label: "Rejected",
    href: "/measurement-unit/rejected-approval-requests",
    counts: rejected,
    color: "error",
  },
  {
    label: "Draft",
    href: "/measurement-unit/draft",
    counts: drafts,
    color: "info",
  },
];

export const BenefitUnitOfMeasurementListTabs = ({
  counts,
  filteredBenefitUnitOfMeasurements = [],
}: {
  counts?: BenefitUnitOfMeasurementCountsByStatus;
  filteredBenefitUnitOfMeasurements?: BenefitUnitOfMeasurementDto[];
}) => {
  const tabs = useMemo(
    () => getTabs(counts, filteredBenefitUnitOfMeasurements),
    [counts, filteredBenefitUnitOfMeasurements]
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
