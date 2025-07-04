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
import dayjs from "dayjs";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ApprovalStatus } from "../../../../app/api/enums";
import { Pagination } from "../../../../components/Pagination";
import {
  BenefitValueDto,
  useGetBenefitValueCountPerStatusQuery,
  useGetBenefitValueListForPaginationQuery,
} from "../../../../app/api";
import { BenefitValueDialog } from "../BenefitValueDialog";
import { BenefitValueDetailDialog } from "./BenefitValueDetailDialog";
export const ApprovedBenefitValues = () => {
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 10,
  });

  const { data: counts, isLoading: isCountsLoading } =
    useGetBenefitValueCountPerStatusQuery();
  const { data: items, isLoading: isListLoading } =
    useGetBenefitValueListForPaginationQuery({
      pageNumber: pagination.pageNumber + 1,
      pageSize: pagination.pageSize,
      status: ApprovalStatus.Approved,
    });

  const [selectedBenefitValue, setSelectedBenefitValue] =
    useState<BenefitValueDto>();
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
                  <TableCell sx={{ fontWeight: "bold" }}>Value </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Measurement Unit{" "}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Unit Price(ETB/Liter)
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Calculated Amount(ETB)
                  </TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(items?.items || []).map((item) => (
                  <Fragment key={item.id}>
                    <TableRow hover={false}>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.benefitName}
                      </TableCell>

                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.value}
                      </TableCell>

                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.unitOfMeasurementName}
                      </TableCell>

                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.isUnitPriced ? item.unitPrice : "---"}
                      </TableCell>

                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.isUnitPriced
                          ? item.calculatedBenefitAmount
                          : item.value}
                      </TableCell>

                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                          }}
                        >
                          {item.id &&
                            item.approvalStatus === ApprovalStatus.Approved && (
                              <Typography
                                variant="body2"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  cursor: "pointer",
                                  color: "primary.main",
                                }}
                                onClick={() => setSelectedBenefitValue(item)}
                              >
                                <VisibilityIcon
                                  sx={{ fontSize: 16, mr: 0.5 }}
                                />
                                View Detail
                              </Typography>
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
      )}

      <Pagination
        pageNumber={pagination.pageNumber}
        pageSize={pagination.pageSize}
        onChange={setPagination}
        totalRowsCount={counts?.approved || 0}
        rowsPerPageOptions={[10, 20, 50]}
      />

      {selectedBenefitValue && (
        <BenefitValueDetailDialog
          benefitValue={selectedBenefitValue}
          onClose={() => setSelectedBenefitValue(undefined)}
          title="Benefit Value Detail page"
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
