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
  Tooltip,
  Typography,
} from "@mui/material";
import { Fragment, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ApprovalStatus } from "../../../../app/api/enums";
import { Pagination } from "../../../../components/Pagination";
import Checkbox from "@mui/material/Checkbox";
import {
  BenefitDto,
  useGetBenefitCountPerStatusQuery,
  useGetBenefitListForPaginationQuery,
} from "../../../../app/api";
import { BenefitDialog } from "../BenefitDialog";
import { BenefitDetailDialog } from "./BenefitDetailDeialog";
export const ApprovedBenefits = () => {
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 10,
  });

  const { data: counts, isLoading: isCountsLoading } =
    useGetBenefitCountPerStatusQuery();
  const { data: items, isLoading: isListLoading } =
    useGetBenefitListForPaginationQuery({
      pageNumber: pagination.pageNumber + 1,
      pageSize: pagination.pageSize,
      status: ApprovalStatus.Approved,
    });

  const [selectedBenefit, setSelectedBenefit] = useState<BenefitDto>();
  const isLoading = isCountsLoading || isListLoading;
  return (
    <Box>
      {!isLoading && !!counts?.approved && (
        <Paper>
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Benefit Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Measurement Unit{" "}
                  </TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(items?.items || []).map((item) => (
                  <Fragment key={item.id}>
                    <TableRow hover={false}>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.name}
                      </TableCell>

                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.unitName}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                              color: "primary.main",
                            }}
                            onClick={() => setSelectedBenefit(item)}
                          >
                            <VisibilityIcon sx={{ fontSize: 16, mr: 0.5 }} />
                            View Detail
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Pagination
        pageNumber={pagination.pageNumber}
        pageSize={pagination.pageSize}
        onChange={setPagination}
        totalRowsCount={counts?.approved || 0}
        rowsPerPageOptions={[10, 20, 50]}
      />

      {selectedBenefit && (
        <BenefitDetailDialog
          open={!!selectedBenefit}
          onClose={() => setSelectedBenefit(undefined)}
          title={"Benefit Detail Page"}
          benefit={selectedBenefit}
        />
      )}

      {!isLoading && !counts?.approved && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Typography>No Data Available</Typography>
        </Box>
      )}
    </Box>
  );
};
