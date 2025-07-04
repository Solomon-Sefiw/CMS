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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { ApprovalStatus } from "../../../../app/api/enums";
import { Pagination } from "../../../../components/Pagination";
import {
  BenefitUnitPriceDto,
  useGetBenefitUnitPriceCountPerStatusQuery,
  useGetBenefitUnitPriceListForPaginationQuery,
} from "../../../../app/store";
import { BenefitUnitPriceDialog } from "../BenefitUnitPriceDialog";
import { BenefitUnitPriceDetailDialog } from "./BenefitUnitPriceDetailDialog";

export const ApprovedBenefitUnitPrices = () => {
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 10,
  });

  const { data: counts, isLoading: isCountsLoading } =
    useGetBenefitUnitPriceCountPerStatusQuery();
  const { data: items, isLoading: isListLoading } =
    useGetBenefitUnitPriceListForPaginationQuery({
      pageNumber: pagination.pageNumber + 1,
      pageSize: pagination.pageSize,
      status: ApprovalStatus.Approved,
    });

  const [selectedBenefitUnitPrice, setSelectedBenefitUnitPrice] =
    useState<BenefitUnitPriceDto>();
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
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Unit Price(ETB)
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Effective Date{" "}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>IsActive </TableCell>
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
                        {item.unitOfMeasurementName}
                      </TableCell>

                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.price}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {dayjs(item.effectiveDate).format("DD-MMM-YYYY")}
                      </TableCell>
                      <Tooltip
                        title={
                          item.activationEnum === 0
                            ? "Closed benefit unit price"
                            : "Active benefit unit price"
                        }
                        arrow
                      >
                        <TableCell
                          sx={{
                            verticalAlign: "top",
                            width: 200,
                            color: item.activationEnum === 0 ? "gray" : "green",
                          }}
                        >
                          {item.activationEnum === 1 ? (
                            <CheckCircleIcon color="success" />
                          ) : (
                            <CancelIcon sx={{ color: "gray" }} />
                          )}
                        </TableCell>
                      </Tooltip>
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
                            color="primary"
                            sx={{ cursor: "pointer", textDecoration: "none" }}
                            onClick={() => setSelectedBenefitUnitPrice(item)}
                          >
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

      {selectedBenefitUnitPrice && (
        <BenefitUnitPriceDetailDialog
          open={!!selectedBenefitUnitPrice}
          benefitUnitPrice={selectedBenefitUnitPrice}
          onClose={() => setSelectedBenefitUnitPrice(undefined)}
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
