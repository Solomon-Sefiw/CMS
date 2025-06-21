import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Fragment, useState } from "react";
import { BusinessUnitDto } from "../../app/api";
import { BusinessUnitDialog } from "./BusinessUnitDialog";
import { ApproveOrRejectRequestButton } from "./ApproveOrRejectRequestButton";
import { RequestApprovalButton } from "./RequestApprovalButton";
import { ApprovalStatus } from "../../app/api/enums";

interface BusinessUnitListProps {
  items?: BusinessUnitDto[];
  hideWorkflowComment?: boolean;
  suppressActionColumn?: boolean;
}

export const BusinessUnitList = ({
  items = [],
  hideWorkflowComment,
  suppressActionColumn,
}: BusinessUnitListProps) => {
  const [selectedBusinessUnit, setSelectedBusinessUnit] =
    useState<BusinessUnitDto>();

  return (
    <Box>
      <Paper>
        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Parent BusinessUnit
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {" "}
                  BusinessUnit ID
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {" "}
                  BusinessUnit Type
                </TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(items || []).map((item) => (
                <Fragment key={item.id}>
                  <TableRow
                    hover={false}
                    key={item.id}
                    sx={
                      !hideWorkflowComment
                        ? {
                            cursor: "pointer",
                            "& > *": { borderBottom: "unset" },
                          }
                        : {}
                    }
                  >
                    <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                      {item.name}
                    </TableCell>
                    <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                      {item.parentBusinessUnitName}
                    </TableCell>
                    <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                      {item.businessUnitID}
                    </TableCell>
                    <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                      {item.type}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        {item.id && (
                          <>
                            {item.approvalStatus === ApprovalStatus.Draft && (
                              <RequestApprovalButton id={item.id} />
                            )}
                            {item.approvalStatus ===
                              ApprovalStatus.Submitted && (
                              <ApproveOrRejectRequestButton id={item.id} />
                            )}
                          </>
                        )}
                        {item.approvalStatus ===
                          (ApprovalStatus.Draft || ApprovalStatus.Rejected) && (
                          <Button
                            size="small"
                            onClick={() => setSelectedBusinessUnit(item)}
                          >
                            Edit
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {selectedBusinessUnit && (
        <BusinessUnitDialog
          businessUnit={selectedBusinessUnit}
          onClose={() => {
            setSelectedBusinessUnit(undefined);
          }}
          title="Edit BusinesUnit"
        />
      )}
    </Box>
  );
};
