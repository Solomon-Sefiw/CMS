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
import { RequestApprovalButton } from "../RequestApprovalButton";
import { ApproveOrRejectRequestButton } from "../ApproveOrRejectRequestButton";
import { ApprovalStatus } from "../../../../app/api/enums";
import { useAlert } from "../../../notification";
import { Pagination } from "../../../../components/Pagination";
import { BenefitValueDialog } from "../BenefitValueDialog";
import { BenefitValueDto, useGetBenefitValueCountPerStatusQuery, useGetBenefitValueListForPaginationQuery } from "../../../../app/api";
import { usePermission } from "../../../../hooks";



export const DraftBenefitValues = () => {
  const [pagination, setPagination] = useState<{
    pageNumber: number;
    pageSize?: number;
  }>({
    pageNumber: 0,
    pageSize: 10,
  });
  const { data: counts, isLoading: isCountsLoading } =
    useGetBenefitValueCountPerStatusQuery();
  const { data: items, isLoading: isListLoading } =
    useGetBenefitValueListForPaginationQuery({
      pageNumber: pagination.pageNumber + 1,
      pageSize: pagination.pageSize,
      status: ApprovalStatus.Draft,
    });
  const [selectedBenefitValue, setSelectedBenefitValue] =
    useState<BenefitValueDto>();
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
                  <TableCell sx={{ fontWeight: "bold" }}>Value </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Measurement Unit{" "}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Unit Price(ETB)
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
                    <TableRow hover={false} key={item.id}>
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
                              onClick={() => setSelectedBenefitValue(item)}
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
      {selectedBenefitValue && (
        <BenefitValueDialog
          benefitValue={selectedBenefitValue}
          onClose={() => {
            setSelectedBenefitValue(undefined);
          }}
          title="Edit Benefit value"
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
