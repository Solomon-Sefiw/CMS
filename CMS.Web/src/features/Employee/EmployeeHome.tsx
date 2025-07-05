import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Add as AddIcon,
  BusinessCenter,
  DoubleArrow,
  ExpandLess,
  ExpandMore,
  Groups,
} from "@mui/icons-material";
import {
  BusinessUnitDto,
  EmployeeDto,
  useGetAllBuisnessUnitListsQuery,
  useGetAllEmployeesQuery,
  useGetEmployeeCountPerApprovalStatusQuery,
} from "../../app/api";
import { PageHeader } from "../../components/PageHeader";
import { usePermission } from "../../hooks";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { EmployeeDialog } from "./EmployeeDialog";
import {
  BusinessUnitContext,
  useSetBusinessUnitId,
} from "./EmployeeGrids/businessUnitContext/BusinessUnitContext";
import { EmployeeListTabs } from "./EmployeeGrids/EmployeeListTabs";
import { ApprovalStatus } from "../../app/api/enums";

interface BusinessUnitTreeItem extends BusinessUnitDto {
  children: BusinessUnitTreeItem[];
}

const buildBusinessUnitTree = (
  businessUnits: BusinessUnitDto[]
): BusinessUnitTreeItem[] => {
  const map: { [key: number]: BusinessUnitTreeItem } = {};
  const roots: BusinessUnitTreeItem[] = [];

  businessUnits.forEach((unit) => {
    map[unit.id!] = { ...unit, children: [] };
  });

  businessUnits.forEach((unit) => {
    if (unit.parentId === 1) {
      roots.push(map[unit.id!]!);
    } else {
      const parent = map[unit.parentId!];
      if (parent) {
        parent.children.push(map[unit.id!]!);
      }
    }
  });
  return roots;
};

const BusinessUnitList: React.FC<{
  businessUnitTree: BusinessUnitTreeItem[];
  onSelect: (unit: BusinessUnitDto) => void;
  selectedBusinessUnitId: number | null;
  expanded: Set<number>;
  onToggleExpand: (id: number) => void;
}> = ({
  businessUnitTree,
  onSelect,
  selectedBusinessUnitId,
  expanded,
  onToggleExpand,
}) => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"));
  const primaryColor = theme.palette.primary.main;

  const renderItem = (unit: BusinessUnitTreeItem) => (
    <Box key={unit.id} sx={{ ml: unit.parentId ? theme.spacing(2) : 0 }}>
      <ListItem
        button
        onClick={() => {
          onSelect(unit);
          if (unit.children.length > 0 || selectedBusinessUnitId !== unit.id) {
            onToggleExpand(unit.id!);
          }
        }}
        sx={{
          mr: theme.spacing(2),
          py: theme.spacing(0.75),
          border: 1,
          borderRadius: theme.shape.borderRadius,
          borderColor:
            selectedBusinessUnitId === unit.id ? primaryColor : "transparent",
          bgcolor:
            selectedBusinessUnitId === unit.id
              ? theme.palette.warning.light
              : "transparent",
          "&:hover": {
            border: 0,
            mr: theme.spacing(2),
            bgcolor:
              selectedBusinessUnitId === unit.id
                ? theme.palette.warning.main
                : theme.palette.action.hover,
          },
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          {selectedBusinessUnitId === unit.id && (
            <DoubleArrow sx={{ mr: 1, color: primaryColor, flexShrink: 0 }} />
          )}
          <ListItemText
            primary={unit.name}
            primaryTypographyProps={{
              fontWeight:
                selectedBusinessUnitId === unit.id ? "bold" : "normal",
              fontSize: isMd ? "1rem" : "0.875rem",
              color: theme.palette.text.secondary,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minWidth: 0,
            }}
            sx={{
              minWidth: 0,
            }}
          />
          {unit.id === 1 && (
            <Typography
              variant="body2"
              sx={{
                ml: theme.spacing(1),
                mr: theme.spacing(1),
                fontWeight: "bold",
                fontSize: isMd ? "0.875rem" : "0.75rem",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              (All Employees)
            </Typography>
          )}
        </Box>

        {unit.children.length > 0 && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(unit.id!);
            }}
            size="small"
            sx={{ flexShrink: 0 }}
          >
            {expanded.has(unit.id!) ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}
      </ListItem>

      <Collapse in={expanded.has(unit.id!)} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {unit.children.map(renderItem)}
        </List>
      </Collapse>
    </Box>
  );

  return (
    <Card
      sx={{
        boxShadow: theme.shadows[3],
        borderRadius: theme.shape.borderRadius,
        mb: theme.spacing(3),
        transition: "box-shadow 0.3s ease",
        "&:hover": {
          boxShadow: theme.shadows[5],
        },
      }}
    >
      <CardContent>
        <Paper sx={{ boxShadow: theme.shadows[2], pr: theme.spacing(1) }}>
          <List sx={{ padding: 0 }}>{businessUnitTree.map(renderItem)}</List>
        </Paper>
      </CardContent>
    </Card>
  );
};

export const EmployeesHome = () => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const [selectedBusinessUnit, setSelectedBusinessUnit] =
    useState<BusinessUnitDto | null>(null);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const setContextBusinessUnitId = useSetBusinessUnitId();
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"));
  const [key, setKey] = useState(0);
  const primaryColor = theme.palette.primary.main;

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoCompleteOpen, setAutoCompleteOpen] = useState(false);

  const [businessUnitSearchInput, setBusinessUnitSearchInput] = useState<string>('');


  const initialSidebarWidth = isMd ? 420 : "140%";
  const [sidebarWidth, setSidebarWidth] = useState<number | string>(
    initialSidebarWidth
  );
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    data: allEmployeesForSearch = [],
    isLoading: isEmployeesForSearchLoading,
  } = useGetAllEmployeesQuery();

  const selectedBusinessUnitId = selectedBusinessUnit
    ? selectedBusinessUnit.id
    : id
    ? parseInt(id)
    : 1; // Default to 1 (All Employees) if no ID is present

  const getSearchOptions = useCallback(() => {
    if (searchInput.length === 0) return [];

    const searchTerm = searchInput.toLowerCase();
    const options = new Set<string>();
    console.log(allEmployeesForSearch, selectedBusinessUnit);
    // Filter employees based on the selected business unit
    const filteredEmployees = allEmployeesForSearch.filter((employee: EmployeeDto) => {
      // If "All Employees" is selected (id 1), return all employees
      console.log(employee, selectedBusinessUnit);
      if (selectedBusinessUnitId === 1) {
        return true;
      }
      // Otherwise, return employees whose businessUnitId matches the selected one
      return employee.businessUnitID === selectedBusinessUnitId;
    });

    filteredEmployees.forEach((employee: EmployeeDto) => {
      if (employee.employeeId?.toString().includes(searchTerm)) {
        options.add(employee.employeeId.toString());
      }

      if (searchInput.length >= 3) {
        if (employee.displayName?.toLowerCase().includes(searchTerm)) {
          options.add(employee.displayName);
        }
        if (employee.amharicDisplayName?.toLowerCase().includes(searchTerm)) {
          options.add(employee.amharicDisplayName);
        }
        if (employee.jobTitle?.toLowerCase().includes(searchTerm)) {
          options.add(employee.jobTitle);
        }
        // Note: employee.businessUnit is a string name, not an ID.
        // The primary filter is by businessUnitId, so this is just for text search within filtered results.
        if (employee.businessUnit?.toLowerCase().includes(searchTerm)) {
          options.add(employee.businessUnit);
        }
      }
    });

    return Array.from(options);
  }, [searchInput, allEmployeesForSearch, selectedBusinessUnitId]); // Add selectedBusinessUnitId to dependencies

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleSearchSelect = (value: string | null) => {
    setSearchQuery(value || "");
  };

  useEffect(() => {
    const options = getSearchOptions();
    setAutoCompleteOpen(options.length > 0 && searchInput.length > 0);
  }, [searchInput, getSearchOptions]);

  const { data: items, isLoading: isListLoading } =
    useGetAllBuisnessUnitListsQuery({
      pageNumber: 1,
      pageSize: 1000,
      status: ApprovalStatus.Approved,
    });

  const { data: employeeCounts, isLoading: isCountsLoading } =
    useGetEmployeeCountPerApprovalStatusQuery({
      businssUnitId: selectedBusinessUnitId,
    });
  const isLoading = isCountsLoading || isListLoading || isEmployeesForSearchLoading;

  const businessUnitTree = buildBusinessUnitTree(items?.items || []);

  const handleBusinessUnitSelect = (unit: BusinessUnitDto) => {
    setSelectedBusinessUnit(unit);
    setKey((prevKey) => prevKey + 1);
    setSearchQuery("");
    setSearchInput("");
  };

  const handleBusinessUnitSearchSelect = (
    event: React.SyntheticEvent,
    value: string | BusinessUnitDto | null
  ) => {
    let selectedUnit: BusinessUnitDto | undefined;

    if (typeof value === "object" && value !== null) {
      selectedUnit = value;
    } else if (typeof value === "string" && value) {
      // Find the unit by name if a string is selected
      selectedUnit = items?.items?.find((item) => item.name === value);
    }

    if (selectedUnit) {
      setSelectedBusinessUnit(selectedUnit);
      setKey((prevKey) => prevKey + 1);
      setBusinessUnitSearchInput(""); // Clear input to close the dropdown and reset filter

      // Expand parents of the selected business unit
      let currentUnit = selectedUnit;
      while (currentUnit && currentUnit.parentId && currentUnit.parentId !== 1) {
        const parent = items?.items?.find((item) => item.id === currentUnit?.parentId);
        if (parent) {
          setExpanded((prev) => new Set(prev).add(parent.id!));
          currentUnit = parent;
        } else {
          break;
        }
      }
    } else {
      // If nothing is selected or it's cleared, ensure the input is clear
      setBusinessUnitSearchInput("");
    }
  };

  const handleToggleExpand = (id: number) => {
    setExpanded((prevExpanded) => {
      const newExpanded = new Set(prevExpanded);
      newExpanded.has(id) ? newExpanded.delete(id) : newExpanded.add(id);
      return newExpanded;
    });
  };
  const permissions = usePermission();
  // selectedBusinessUnitId is already defined above and used consistently

  useEffect(() => {
    if (selectedBusinessUnitId) {
      setSelectedBusinessUnit({
        id: selectedBusinessUnitId,
      } as BusinessUnitDto);
      // Ensure the 'All Employees' unit (id 1) is initially expanded if not already
      if (!expanded.has(1)) {
        setExpanded((prev) => new Set(prev).add(1));
      }
    }
  }, [location, selectedBusinessUnitId, expanded]); // Add expanded to dependency array

  // --- Draggable Line Fixes ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isMd) return;
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = useCallback( // Use useCallback for stable function reference
    (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      let newWidth = e.clientX - containerRect.left;

      const minWidth = 200;
      const maxWidth = containerRect.width - 300;

      if (newWidth < minWidth) newWidth = minWidth;
      if (newWidth > maxWidth) newWidth = maxWidth;

      setSidebarWidth(newWidth);
    },
    [isResizing] // Dependency for useCallback
  );

  const handleMouseUp = useCallback(() => { // Use useCallback for stable function reference
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      // Attach listeners to the window to capture mouse events even if cursor leaves the divider
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "ew-resize"; // Change cursor globally during resize
    } else {
      // Remove listeners when not resizing
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "default"; // Reset cursor
    }
    // Cleanup function: This runs when the component unmounts or before the effect re-runs
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "default"; // Ensure cursor is reset even on unmount
    };
  }, [isResizing, handleMouseMove, handleMouseUp]); // Dependencies for useEffect

  useEffect(() => {
    if (!isMd) {
      setSidebarWidth("140%");
    } else {
      setSidebarWidth(420);
    }
  }, [isMd]);

  return (
    <Box
      ref={containerRef}
      sx={{
        display: "flex",
        flexDirection: isMd ? "row" : "column",
        bgcolor: theme.palette.background.default,
        minHeight: "fit-content",
        height: "calc(100vh - 64px)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        sx={{
          width: isMd ? sidebarWidth : "140%",
          overflowY: "auto",
          p: theme.spacing(2),
          bgcolor: theme.palette.background.paper,
          boxShadow: isMd ? "none" : theme.shadows[1],
          zIndex: 1,
          minHeight: isMd ? "fit-content" : "auto",
          flexShrink: 0,
          transition: isResizing ? "none" : "width 0.1s ease", // Add transition: "none" during resize
          borderRight: isMd ? `1px solid ${theme.palette.divider}` : "none",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Autocomplete
          freeSolo
          size="small"
          // Filter options based on input when 3 or more characters are typed
          options={
            businessUnitSearchInput.length >= 3
              ? (items?.items || []).filter(unit =>
                  unit.name?.toLowerCase().includes(businessUnitSearchInput.toLowerCase())
                )
              : [] // Show no options if less than 3 characters
          }
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name || '')}
          loading={isListLoading}
          inputValue={businessUnitSearchInput}
          onInputChange={(_, newInputValue) => {
            setBusinessUnitSearchInput(newInputValue);
          }}
          onChange={handleBusinessUnitSearchSelect}
          // Only open the autocomplete dropdown if 3 or more characters are typed
          open={businessUnitSearchInput.length >= 3 && businessUnitSearchInput.length > 0}
          onOpen={() => {}}
          onClose={() => {}}
          sx={{ mb: 2 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Business Units"
              InputProps={{
                ...params.InputProps,
                endAdornment: isListLoading ? <CircularProgress color="inherit" size={20} /> : params.InputProps.endAdornment,
              }}
            />
          )}
        />
        <Typography
          sx={{ ml: 2, mb: 2, fontSize: 25, flexShrink: 0 }}
          variant="h4"
          color="primary.dark"
        >
          <BusinessCenter sx={{ fontSize: 20, color: "#1976d2" }} />
          Business Units
        </Typography>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", flexGrow: 1 }}>
            <CircularProgress size={40} color="primary" />
          </Box>
        ) : (
          <BusinessUnitList
            businessUnitTree={businessUnitTree}
            onSelect={handleBusinessUnitSelect}
            selectedBusinessUnitId={selectedBusinessUnitId ?? null}
            expanded={expanded}
            onToggleExpand={handleToggleExpand}
          />
        )}
      </Box>

      {isMd && (
        <Divider
          orientation="vertical"
          flexItem
          onMouseDown={handleMouseDown}
          sx={{
            width: "4px",
            cursor: "ew-resize",
            bgcolor: theme.palette.divider,
            transition: "background-color 0.1s ease",
            "&:hover": {
              bgcolor: theme.palette.primary.main,
            },
            zIndex: 2,
          }}
        />
      )}

      <Box
        sx={{
          flex: 1,
          p: theme.spacing(2),
          minHeight: "fit-content",
          overflowY: "auto",
          minWidth: isMd ? "300px" : "auto",
          zIndex: 1,
        }}
      >
        <PageHeader title="Employees" icon={<Groups />} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: theme.spacing(2),
            flexDirection: isMd ? "row" : "column-reverse",
            gap: isMd ? 0 : theme.spacing(2),
          }}
        >
          <Autocomplete
            freeSolo
            size="small"
            options={getSearchOptions()}
            loading={isEmployeesForSearchLoading}
            open={autoCompleteOpen}
            onOpen={() => {
              const options = getSearchOptions();
              setAutoCompleteOpen(options.length > 0);
            }}
            onClose={() => setAutoCompleteOpen(false)}
            inputValue={searchInput}
            onInputChange={(_, value) => handleSearchChange(value)}
            onChange={(_, value) => handleSearchSelect(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search by Name, Job Title, or Employee ID"
                sx={{ width: 400 }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isEmployeesForSearchLoading && searchInput.length === 0 ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          {selectedBusinessUnit?.id  && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setDialogOpened(true)}
              disabled={!permissions.CanCreateOrUpdateEmployeeInfo}
              sx={{
                color: "#fff",
                borderColor: "#1976d2",
                backgroundColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  borderColor: "#1976d2",
                },
              }}
            >
              Add New Employee
            </Button>
          )}
        </Box>

        <Paper
          sx={{
            p: theme.spacing(2),
            flex: 1,
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.shadows[1],
            mb: 0,
            minHeight: "fit-content",
          }}
        >
          <EmployeeListTabs counts={employeeCounts} />
          <Divider
            sx={{
              bgcolor: theme.palette.divider,
              mb: theme.spacing(2),
            }}
          />
          <BusinessUnitContext.Provider
            value={{
              businessUnitId: selectedBusinessUnitId || 1,
              setBusinessUnitId: setContextBusinessUnitId,
            }}
          >
            <Outlet key={key} context={{ searchQuery }} />
          </BusinessUnitContext.Provider>
        </Paper>

        {dialogOpened && (
          <EmployeeDialog
            onClose={() => setDialogOpened(false)}
            title="Add Employee"
            businessUnitId={selectedBusinessUnit?.id}
          />
        )}
      </Box>
    </Box>
  );
};