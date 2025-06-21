import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Collapse,
  IconButton,
  Divider,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Button,
  useTheme,
  Tooltip,
  Alert,
  useMediaQuery,
} from "@mui/material";
import {
  BusinessUnitDto,
  useGetAddressByRequestIdQuery,
  useGetAllBuisnessUnitListsQuery,
  useGetBusinessUnitCountPerApprovalStatusQuery,
} from "../../../app/api";
import {
  AddressType,
  ApprovalStatus,
  ContactCategory,
  Country,
  Status,
} from "../../../app/api/enums";
import {
  Business,
  ExpandLess,
  ExpandMore,
  DoubleArrow,
  Edit as EditIcon,
  BusinessCenter,
} from "@mui/icons-material";
import {
  AccountBalanceWallet as WalletIcon,
  AddLocationAlt as AddLocationIcon,
  ContactEmergency as ContactIcon,
  AccountCircle as SupervisorIcon,
  Factory as FactoryIcon,
  Fingerprint as CodeIcon,
  People as StaffIcon,
} from "@mui/icons-material";
import { DeactivateBusinessUnit } from "./Status/DeactivateBusinessUnit";
import { ActivateBusinessUnit } from "./Status/ActivateBusinessUnit";
import { AddressDialog } from "../../Address/AddressDialog";
import { ContactDialogNew } from "../../Contact/ContactDialogNew";
import { BusinessUnitDialog } from "../BusinessUnitDialog";
import ContactList from "../../Contact/ContactsList";
import { SelectedBusinessUnitAddress } from "../SelectedBusinessUnitDetail/SelectedBusinessUnitAddress";
import { useOutletContext } from "react-router-dom";
import { usePermission } from "../../../hooks";

// Helper function to build tree structure from the flat list
const buildBusinessUnitTree = (
  businessUnits: BusinessUnitDto[],
  searchQuery: string
) => {
  const map: { [key: number]: any } = {};
  const roots: any[] = [];

  businessUnits.forEach((unit) => {
    const matchesSearch =
      unit.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.parentBusinessUnitName ?.toLowerCase().includes(searchQuery.toLowerCase())

    map[unit.id!] = {
      ...unit,
      children: [],
      _matchesSearch: matchesSearch, // Store if the unit itself matches the search
    };
  });

  // Populate children
  businessUnits.forEach((unit) => {
    if (unit.parentId === 1) {
      // Assuming 1 is the root parent ID
      roots.push(map[unit.id!]);
    } else {
      const parent = map[unit.parentId!];
      if (parent) {
        // Ensure parent exists
        parent.children.push(map[unit.id!]!);
      }
    }
  });

  // Function to filter and keep only matching nodes and their ancestors
  const filterAndKeepAncestors = (node: any): boolean => {
    let hasMatchingChildren = false;
    if (node.children) {
      // Recursively filter children
      node.children = node.children.filter(filterAndKeepAncestors);
      // Check if any child (or its descendant) matched
      hasMatchingChildren = node.children.some(
        (child: any) => child._matchesSearch || child.hasMatchingChildren
      );
    }
    node.hasMatchingChildren = hasMatchingChildren; // Store for parent check

    return node._matchesSearch || hasMatchingChildren;
  };

  // Start filtering from the roots
  const filteredRoots = roots.filter(filterAndKeepAncestors);

  return filteredRoots;
};

export const ApprovedBusinessUnits = () => {
  const permissions = usePermission();
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"));
  const primaryColor = theme.palette.primary.main;

  const [pagination] = useState({ pageNumber: 0, pageSize: 1000 });
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [selectedAddress, setSelectedAddress] = useState<number>();
  const [selectedContact, setSelectedContact] = useState<number>();
  const [selectedBU, setSelectedBU] = useState<BusinessUnitDto>();
  const [editBU, setEditBU] = useState<BusinessUnitDto>();

  const { searchQuery } = useOutletContext<{ searchQuery: string }>();

  // Draggable Divider Logic
  const initialSidebarWidth = isMd ? 420 : "140%";
  const [sidebarWidth, setSidebarWidth] = useState<number | string>(
    initialSidebarWidth
  );
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: counts, isLoading: isCountsLoading } =
    useGetBusinessUnitCountPerApprovalStatusQuery();
  const { data: items, isLoading: isListLoading } =
    useGetAllBuisnessUnitListsQuery(
      {
        pageNumber: pagination.pageNumber + 1,
        pageSize: pagination.pageSize,
        status: ApprovalStatus.Approved,
      },
      { refetchOnMountOrArgChange: true }
    );

  const isLoading = isCountsLoading || isListLoading;

  // Function to expand all ancestors of a matched node
  const expandAncestors = (
    nodeId: number,
    tree: any[],
    currentExpanded: Set<number>
  ) => {
    const findAndExpand = (nodes: any[], targetId: number): boolean => {
      for (const node of nodes) {
        if (node.id === targetId) {
          return true; // Found the target node
        }
        if (node.children && node.children.length > 0) {
          if (findAndExpand(node.children, targetId)) {
            currentExpanded.add(node.id!); // Add current node to expanded set
            return true;
          }
        }
      }
      return false;
    };

    findAndExpand(tree, nodeId);
  };

  useEffect(() => {
    // When searchQuery changes, re-evaluate expanded state
    if (searchQuery) {
      const newExpanded = new Set<number>();
      const filteredTree = buildBusinessUnitTree(items?.items || [], searchQuery);
      filteredTree.forEach(root => {
        const traverseAndExpand = (node: any) => {
          if (node._matchesSearch) {
            expandAncestors(node.id!, buildBusinessUnitTree(items?.items || [], ""), newExpanded); // Expand ancestors based on original tree structure
            newExpanded.add(node.id!);
          }
          node.children.forEach(traverseAndExpand);
        };
        traverseAndExpand(root);
      });
      setExpanded(newExpanded);
    } else {
      setExpanded(new Set()); // Collapse all if search is cleared
    }
  }, [searchQuery, items]);


  const renderBusinessUnit = (unit: any) => (
    <Box key={unit.id} sx={{ ml: unit.parentId ? theme.spacing(2) : 0 }}>
      <ListItem
        button
        onClick={() => {
          setSelectedBU(unit); // Always set the selected Business Unit

          // If the unit has children, toggle its expanded state
          if (unit.children && unit.children.length > 0) {
            setExpanded((prev) => {
              const newExpanded = new Set(prev);
              newExpanded.has(unit.id!)
                ? newExpanded.delete(unit.id!)
                : newExpanded.add(unit.id!);
              return newExpanded;
            });
          }
        }}
        sx={{
          mr: theme.spacing(2),
          py: theme.spacing(0.75),
          border: 1,
          borderRadius: theme.shape.borderRadius,
          borderColor:
            selectedBU?.id === unit.id ? primaryColor : "transparent",
          bgcolor:
            selectedBU?.id === unit.id
              ? theme.palette.warning.light
              : "transparent",
          "&:hover": {
            border: 0,
            mr: theme.spacing(2),
            bgcolor:
              selectedBU?.id === unit.id
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
          {selectedBU?.id === unit.id && (
            <DoubleArrow sx={{ mr: 1, color: primaryColor, flexShrink: 0 }} />
          )}
          <ListItemText
            primary={unit.name}
            primaryTypographyProps={{
              fontWeight: selectedBU?.id === unit.id ? "bold" : "normal",
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
        </Box>

        {/* Removed the separate IconButton for expand/collapse as per new requirement */}
        {unit.children.length > 0 && (
          <IconButton
            size="small"
            sx={{ flexShrink: 0, pointerEvents: "none" }} // Disable pointer events so it doesn't interfere with ListItem click
          >
            {expanded.has(unit.id!) ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}
      </ListItem>

      <Collapse in={expanded.has(unit.id!)} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {unit.children.map(renderBusinessUnit)}
        </List>
      </Collapse>
    </Box>
  );

  const { data: businessUnitAddress } = useGetAddressByRequestIdQuery(
    { requestId: selectedBU?.id, addressType: AddressType.BusinessUnitAddress },
    { skip: !selectedBU?.id }
  );

  const getCountryName = (countryCode?: Country): string => {
    return countryCode ? Country[countryCode] : "-- Not Selected --";
  };

  // Draggable Divider Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isMd) return;
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      let newWidth = e.clientX - containerRect.left;

      const minWidth = 200;
      const maxWidth = containerRect.width - 300; // Adjust as needed
      if (newWidth < minWidth) newWidth = minWidth;
      if (newWidth > maxWidth) newWidth = maxWidth;

      setSidebarWidth(newWidth);
    },
    [isResizing]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "ew-resize";
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "default";
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "default";
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (!isMd) {
      setSidebarWidth("140%"); // Full width on small screens
    } else {
      setSidebarWidth(420); // Default width on medium/large screens
    }
  }, [isMd]);

  const businessUnitTree = buildBusinessUnitTree(
    items?.items || [],
    searchQuery
  );

  return (
    <Box
      ref={containerRef}
      sx={{
        display: "flex",
        flexDirection: isMd ? "row" : "column",
        bgcolor: theme.palette.background.default,
        minHeight: "fit-content",
        height: "calc(100vh - 64px)", // Adjust as needed
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Left side: Business Unit Tree (Sidebar) */}
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
          transition: isResizing ? "none" : "width 0.1s ease",
          borderRight: isMd ? `1px solid ${theme.palette.divider}` : "none",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          sx={{ ml: 2, mb: 2, fontSize: 25, flexShrink: 0 }}
          variant="h4"
          color="primary.dark"
        >
          <BusinessCenter sx={{ fontSize: 20, color: "#1976d2" }} /> Business
          Units
        </Typography>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexGrow: 1,
            }}
          >
            <CircularProgress size={40} color="primary" />
          </Box>
        ) : businessUnitTree.length > 0 ? (
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
                <List sx={{ padding: 0 }}>
                  {businessUnitTree.map(renderBusinessUnit)}
                </List>
              </Paper>
            </CardContent>
          </Card>
        ) : (
          <Alert severity="info" sx={{ m: 2 }}>
            No Approved Business Units found with the search criteria!
          </Alert>
        )}
      </Box>

      {/* Draggable Divider */}
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

      {/* Right side: Details of selected Business Unit & Address/Contact */}
      <Box
        sx={{
          flex: 1,
          p: theme.spacing(2),
          overflowY: "auto",
          minWidth: isMd ? "300px" : "auto",
          zIndex: 1,
        }}
      >
        {selectedBU ? (
          <Grid container spacing={2}>
            {/* Business Unit Details Card */}
            <Grid item xs={12} md={6}>
              <Card sx={{ width: "100%", boxShadow: theme.shadows[3] }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: theme.spacing(2),
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{
                        fontWeight: "bold",
                        color: theme.palette.primary.dark,
                        flexGrow: 1,
                      }}
                    >
                      {selectedBU.name}
                    </Typography>
                    {selectedBU.status === Status.Active && (
                      <Tooltip title="Edit Business Unit">
                        <Button
                          variant="contained"
                          startIcon={<EditIcon />}
                          size="small"
                          color="primary"
                          onClick={() => setEditBU(selectedBU)}
                          disabled={!permissions.canCreateUpdateSetup}
                        >
                          Edit
                        </Button>
                      </Tooltip>
                    )}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: theme.spacing(1),
                      mb: theme.spacing(1),
                    }}
                  >
                    {selectedBU?.status === Status.Active && (
                      <DeactivateBusinessUnit id={selectedBU.id} />
                    )}
                    {selectedBU?.status === Status.Closed && (
                      <ActivateBusinessUnit id={selectedBU.id} />
                    )}
                  </Box>

                  <Divider sx={{ mb: theme.spacing(1) }} />

                  <Grid
                    container
                    spacing={2}
                    marginBlockStart={theme.spacing(3)}
                  >
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <FactoryIcon color="action" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="textSecondary">
                          Parent Name:
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ ml: 1, fontWeight: "bold" }}
                        >
                          {selectedBU.parentBusinessUnitName || "-"}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Business color="action" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="textSecondary">
                          Business Unit Type:
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ ml: 1, fontWeight: "bold" }}
                        >
                          {selectedBU.businessUnitTypeName || "-"}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CodeIcon color="action" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="textSecondary">
                          Business Unit Codes:
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ ml: 1, fontWeight: "bold" }}
                        >
                          {selectedBU.businessUnitID || "-"}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <StaffIcon color="action" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="textSecondary">
                          Staff Strength:
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ ml: 1, fontWeight: "bold" }}
                        >
                          {selectedBU.staffStrength ?? "-"}
                        </Typography>
                      </Box>
                    </Grid>


                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Address and Contact Details */}
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  boxShadow: theme.shadows[2],
                  mb: theme.spacing(2),
                  p: theme.spacing(2),
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: theme.spacing(1),
                  }}
                >
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      color: theme.palette.primary.dark,
                      fontWeight: "bold",
                    }}
                  >
                    Address Information
                  </Typography>
                  {selectedBU.status === Status.Active && (
                    <Tooltip title="Edit Address">
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={() => setSelectedAddress(selectedBU.id)}
                        startIcon={<AddLocationIcon />}
                        disabled={!permissions.CanCreateUpdateAddressAndContact}
                      >
                        Edit
                      </Button>
                    </Tooltip>
                  )}
                </Box>
                <Divider sx={{ mb: theme.spacing(1) }} />
                <Tooltip
                  title={
                    <>
                      <Box
                        sx={{
                          p: 1.5,
                          maxWidth: 300,
                          bgcolor: "background.paper",
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 1,
                          boxShadow: theme.shadows[4],
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: "bold",
                            color: theme.palette.primary.main,
                            mb: 1,
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            pb: 0.5,
                          }}
                        >
                          Business Unit Address Details
                        </Typography>
                        <Box sx={{ display: "grid", gap: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold", color: "text.secondary" }}
                          >
                            Country:{" "}
                            {getCountryName(businessUnitAddress?.country) ||
                              "-- Not Specified --"}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold", color: "text.secondary" }}
                          >
                            Region/State:{" "}
                            {businessUnitAddress?.regionName ||
                              "-- Not Specified --"}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold", color: "text.secondary" }}
                          >
                            Sub City/Zone:{" "}
                            {businessUnitAddress?.subCityName ||
                              "-- Not Specified --"}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold", color: "text.secondary" }}
                          >
                            City:{" "}
                            {businessUnitAddress?.city || "-- Not Specified --"}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold", color: "text.secondary" }}
                          >
                            Woreda:{" "}
                            {businessUnitAddress?.woreda || "-- Not Specified --"}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold", color: "text.secondary" }}
                          >
                            Kebele:{" "}
                            {businessUnitAddress?.kebele || "-- Not Specified --"}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold", color: "text.secondary" }}
                          >
                            House Number:{" "}
                            {businessUnitAddress?.houseNumber ||
                              "-- Not Specified --"}
                          </Typography>
                        </Box>
                      </Box>
                    </>
                  }
                  placement="top"
                  arrow
                  enterTouchDelay={0}
                  leaveTouchDelay={2000}
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: "background.paper",
                        p: 0,
                        boxShadow: theme.shadows[6],
                      },
                    },
                    arrow: {
                      sx: {
                        color: theme.palette.background.paper,
                        "&:before": {
                          border: `1px solid ${theme.palette.divider}`,
                        },
                      },
                    },
                  }}
                >
                  <Box>
                    <SelectedBusinessUnitAddress businessUnit={selectedBU} />
                  </Box>
                </Tooltip>
              </Paper>

              <Paper sx={{ boxShadow: theme.shadows[2], p: theme.spacing(2) }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: theme.spacing(1),
                  }}
                >
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      color: theme.palette.primary.dark,
                      fontWeight: "bold",
                    }}
                  >
                    Contact
                  </Typography>
                  {selectedBU.status === Status.Active && (
                    <Tooltip title="Add New Contact">
                      <Button
                        size="small"
                        color="primary"
                        variant="contained"
                        onClick={() => setSelectedContact(selectedBU.id)}
                        startIcon={<ContactIcon />}
                        disabled={!permissions.CanCreateUpdateAddressAndContact}
                      >
                        Add
                      </Button>
                    </Tooltip>
                  )}
                </Box>
                <Divider sx={{ mb: theme.spacing(1) }} />
                <ContactList
                  requestId={selectedBU?.id}
                  contactCategory={ContactCategory.BusinessUnitContact}
                />
              </Paper>
            </Grid>
          </Grid>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography variant="h6" color="textSecondary">
              Select a Business Unit to see details
            </Typography>
          </Box>
        )}
      </Box>

      {selectedAddress && (
        <AddressDialog
          requestId={selectedAddress}
          onClose={() => setSelectedAddress(undefined)}
          title="Edit Address"
          addressType={AddressType.BusinessUnitAddress}
        />
      )}
      {selectedContact && (
        <ContactDialogNew
          requestId={selectedBU?.id}
          contactCategory={ContactCategory.BusinessUnitContact}
          onClose={() => setSelectedContact(undefined)}
          title="Add New Contact"
        />
      )}
      {editBU && (
        <BusinessUnitDialog
          businessUnit={editBU}
          onClose={() => setEditBU(undefined)}
          title="Edit Business Unit"
        />
      )}
    </Box>
  );
};