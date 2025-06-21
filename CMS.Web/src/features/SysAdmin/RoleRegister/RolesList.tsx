import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Collapse,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useCallback, useState } from "react";
import { RoleWithClaimsDto } from "../../../app/api";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface Props {
  roles: RoleWithClaimsDto[];
  onSelect: (role: RoleWithClaimsDto) => void;
}

export const RolesList = ({ roles, onSelect }: Props) => {
  // Local state to track the expanded state of each role's claims
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Toggle the expanded state of a role's claims
  const handleToggleClaims = (roleId: string) => {
    setExpandedRows((prev) => {
      const newExpandedRows = new Set(prev);
      if (newExpandedRows.has(roleId)) {
        newExpandedRows.delete(roleId);
      } else {
        newExpandedRows.add(roleId);
      }
      return newExpandedRows;
    });
  };

  const onRoleSelect = useCallback(
    (role: RoleWithClaimsDto) => () => {
      console.log(role);
      onSelect(role);
    },
    [onSelect]
  );

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Roles</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Claims</TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="center">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(roles || []).map((role) => {
            const { roleId, roleName, claims = [] } = role;

            // Check if the current role's claims are expanded
            const open = expandedRows.has(roleId as any);

            return (
              <TableRow
                hover={true}
                key={roleId}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": {
                    backgroundColor: "#f5f5f5", // Light hover effect
                  },
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ fontWeight: "bold" }}
                >
                  {roleName}
                </TableCell>
                <TableCell component="th" scope="row">
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    {/* Permissions Label */}
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        Permissions
                      </Typography>
                      {/* Button to toggle the claims section */}
                      <Tooltip
                        title={open ? "Collapse Claims" : "Expand Claims"}
                        arrow
                      >
                        <IconButton
                          onClick={() => handleToggleClaims(roleId as any)}
                        >
                          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Tooltip>
                    </Box>

                    {/* Collapsible claims */}
                    <Collapse in={open} timeout="auto" unmountOnExit>
                      <Box sx={{ pl: 2, pt: 1 }}>
                        {(claims || []).map((claim) => (
                          <Typography
                            key={claim.claimValue}
                            variant="body2"
                            sx={{ color: "#555" }}
                          >
                            {claim.claimValue ? `  ${claim.claimValue}` : ""}
                          </Typography>
                        ))}
                      </Box>
                    </Collapse>
                  </Box>
                </TableCell>
                <TableCell component="th" scope="row">
                  <Box
                    sx={{ display: "flex", gap: 1, justifyContent: "center" }}
                  >
                    <Button
                      onClick={onRoleSelect(role)}
                      variant="outlined"
                      sx={{
                        textTransform: "none",
                        color: "#1976d2", // Blue color
                        borderColor: "#1976d2", // Border color matches the button text
                        "&:hover": {
                          backgroundColor: "#1976d2",
                          color: "#fff",
                        },
                      }}
                    >
                      View Profile
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};