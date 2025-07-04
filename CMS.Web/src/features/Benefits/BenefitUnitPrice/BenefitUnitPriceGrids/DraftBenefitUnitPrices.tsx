import {
  Avatar,
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
  Tooltip,
} from "@mui/material";
import { Fragment, useState } from "react";
import dayjs from "dayjs";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { RequestApprovalButton } from "../RequestApprovalButton";
import { ApproveOrRejectRequestButton } from "../ApproveOrRejectRequestButton";
import { ApprovalStatus } from "../../../../app/api/enums";
import { useAlert } from "../../../notification";
import { Pagination } from "../../../../components/Pagination";
import { BenefitUnitPriceDialog } from "../BenefitUnitPriceDialog";
import { BenefitUnitPriceDto, useGetBenefitUnitPriceCountPerStatusQuery, useGetBenefitUnitPriceListForPaginationQuery } from "../../../../app/api";
import { usePermission } from "../../../../hooks";



export const DraftBenefitUnitPrices = () => {
  const [pagination, setPagination] = useState<{
    pageNumber: number;
    pageSize?: number;
  }>({
    pageNumber: 0,
    pageSize: 10,
  });
  const { data: counts, isLoading: isCountsLoading } =
    useGetBenefitUnitPriceCountPerStatusQuery();
  const { data: items, isLoading: isListLoading } =
    useGetBenefitUnitPriceListForPaginationQuery({
      pageNumber: pagination.pageNumber + 1,
      pageSize: pagination.pageSize,
      status: ApprovalStatus.Draft,
    });
  const [selectedBenefitUnitPrice, setSelectedBenefitUnitPrice] =
    useState<BenefitUnitPriceDto>();
  const { showInfoAlert } = useAlert();
  const isLoading = isCountsLoading || isListLoading;
  return (
    <Box>
      {!isLoading && !!counts?.drafts && (
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
                    <TableRow hover={false} key={item.id}>
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
                            (ApprovalStatus.Draft ||
                              ApprovalStatus.Rejected) && (
                            <Button
                              size="small"
                              onClick={() => setSelectedBenefitUnitPrice(item)}
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
      )}
      <Pagination
        pageNumber={pagination.pageNumber}
        pageSize={pagination.pageSize}
        onChange={setPagination}
        totalRowsCount={counts?.drafts}
        rowsPerPageOptions={[10, 20, 50]}
      />
      {selectedBenefitUnitPrice && (
        <BenefitUnitPriceDialog
          benefitUnitPrice={selectedBenefitUnitPrice}
          onClose={() => {
            setSelectedBenefitUnitPrice(undefined);
          }}
          title="Edit Unit Price "
        />
      )}

      {!isLoading && !counts?.drafts && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Typography> No Data Available</Typography>
        </Box>
      )}
    </Box>
  );
};
