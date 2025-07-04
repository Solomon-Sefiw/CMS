// BusinessUnitHierarchy.tsx
import React, { useState } from "react";
import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

interface TreeNode {
  businessUnitID: string;
  name: string;
  children: TreeNode[];
}

const BusinessUnitNode = ({ node }: { node: TreeNode }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Box>
      <ListItem button onClick={handleClick}>
        <ListItemText primary={node.name} />
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding>
          {node.children.map((child) => (
            <BusinessUnitNode key={child.businessUnitID} node={child} />
          ))}
        </List>
      </Collapse>
    </Box>
  );
};

export const BusinessUnitHierarchy = ({ nodes }: { nodes: TreeNode[] }) => {
  return (
    <List>
      {nodes.map((node) => (
        <BusinessUnitNode key={node.businessUnitID} node={node} />
      ))}
    </List>
  );
};
