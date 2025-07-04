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

export const EmployeeDetailTabs = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  // const permissions = usePermission(); // Use usePermission hook

  const getTabs = (employeeId?: string) => {
    if (!employeeId) return [];

    const tabs: TabProps[] = [
      {
        label: "Employee Profile Summary",
        href: `/employee-detail/${employeeId}/summary`,
      },
      {
        label: "Employee Details",
        href: `/employee-detail/${employeeId}/other`,
      },
      // {
      //   label: "Promotion",
      //   href: `/employee-detail/${employeeId}/promotion`,
      // },

      // {
      //   label: "Eployee Documents",
      //   href: `/employee-detail/${employeeId}/documents`,
      // },
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
