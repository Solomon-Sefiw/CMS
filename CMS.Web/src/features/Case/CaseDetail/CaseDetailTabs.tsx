import { Box, Tab, Tabs } from "@mui/material";
import { useMemo } from "react";
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";

interface TabProps {
  label: string;
  href: string;
}

export const CaseDetailTabs = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  // const permissions = usePermission(); // Use usePermission hook

  const getTabs = (caseId?: string) => {
    if (!caseId) return [];

    const tabs: TabProps[] = [
      {
        label: "Case Summary",
        href: `/case-detail/${caseId}`,
        // href: `/case-detail/${caseId}/summary`,
      },
      {
        label: "Judge Assignemt",
        href: `/case-detail/${caseId}/other`,
      },
      {
        label: "Hearing",
        href: `/case-detail/${caseId}/hearing`,
      },
     {
        label: "Payment",
        href: `/case-detail/${caseId}/activities`,
      },
      {
        label: "Case Documents",
        href: `/case-detail/${caseId}/documents`,
      },
    ];

    return tabs;
  };

  const tabs = useMemo(() => getTabs(params.id), [params.id]);
  const currentTabIndex = useMemo(() => {
    const tabIndex = tabs.findIndex((t) => t.href === location.pathname);
    return tabIndex >= 0 ? tabIndex : 0;
  }, [location.pathname, tabs]);

  const version = searchParams.get("version");

  return (
    <Box>
      <Tabs value={currentTabIndex}>
        {tabs.map(({ href, label }) => (
          <Tab
            key={label}
            component={Link}
            color="inherit"
            to={{
              pathname: href,
              search: version ? `?version=${version}` : undefined,
            }}
            label={label}
          />
        ))}
      </Tabs>
    </Box>
  );
};
