// buildBusinessUnitTree.ts
export const buildBusinessUnitTree = (
  data: { BusinessUnitID: string; Name: string; ParentId: string }[]
) => {
  const map: { [key: string]: any } = {};
  const roots: any[] = [];

  // Create a map of BusinessUnitID to TreeNode
  data.forEach((unit) => {
    map[unit.BusinessUnitID] = {
      businessUnitID: unit.BusinessUnitID,
      name: unit.Name,
      children: [],
    };
  });

  // Build the tree structure
  data.forEach((unit) => {
    const treeNode = map[unit.BusinessUnitID];
    if (unit.ParentId === "1") {
      roots.push(treeNode); // This is a root node
    } else {
      const parent = map[unit.ParentId];
      if (parent) {
        parent.children.push(treeNode);
      }
    }
  });

  return roots;
};
