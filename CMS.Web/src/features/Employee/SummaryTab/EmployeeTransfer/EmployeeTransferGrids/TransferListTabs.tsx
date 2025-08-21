import { Box } from "@mui/material";
import { TransferCountsByStatus } from "../../../../../app/api";

export const TransferListTabs = ({
  counts,
}: {
  counts?: TransferCountsByStatus;
}) => {
  // This component is now simplified since most logic moved to TransferHome
  return <Box />;
};