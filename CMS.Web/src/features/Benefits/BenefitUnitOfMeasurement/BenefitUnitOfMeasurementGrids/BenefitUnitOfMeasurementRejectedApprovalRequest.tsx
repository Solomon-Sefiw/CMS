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
import { RequestApprovalButton } from "../RequestApprovalButton";
import { ApproveOrRejectRequestButton } from "../ApproveOrRejectRequestButton";
import {
  BenefitUnitOfMeasurementDto,
  useGetBenefitUnitOfMeasurementCountPerStatusQuery,
  useGetBenefitUnitOfMeasurementListForPaginationQuery,
} from "../../../../app/api";
import { ApprovalStatus } from "../../../../app/api/enums";
import { useAlert } from "../../../notification";
import { Pagination } from "../../../../components/Pagination";
import { BenefitUnitOfMeasurementDialog } from "../BenefitUnitOfMeasurementDialog";
import Checkbox from "@mui/material/Checkbox";

export const BenefitUnitOfMeasurementRejectedApprovalRequest = () => {
  const [pagination, setPagination] = useState<{
    pageNumber: number;
    pageSize?: number;
  }>({
    pageNumber: 0,
    pageSize: 10,
  });

  const { data: counts, isLoading: isCountsLoading } =
    useGetBenefitUnitOfMeasurementCountPerStatusQuery();
  const { data: items, isLoading: isListLoading } =
    useGetBenefitUnitOfMeasurementListForPaginationQuery({
      pageNumber: pagination.pageNumber + 1,
      pageSize: pagination.pageSize,
      status: ApprovalStatus.Rejected,
    });
  const [
    selectedBenefitUnitOfMeasurement,
    setSelectedBenefitUnitOfMeasurement,
  ] = useState<BenefitUnitOfMeasurementDto>();
  const { showInfoAlert } = useAlert();

  const isLoading = isCountsLoading || isListLoading;

  return (
    <Box>
      {!isLoading && !!counts?.rejected && (
        <Paper>
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Is Unit Priced
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Description{" "}
                  </TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(items?.items || []).map((item) => (
                  <Fragment key={item.id}>
                    <TableRow hover={false} key={item.id}>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.name}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        <Checkbox checked={item.isUnitPriced} disabled />
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.description}
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
                          {
                            <Button
                              size="small"
                              onClick={() =>
                                setSelectedBenefitUnitOfMeasurement(item)
                              }
                            >
                              Edit
                            </Button>
                          }
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
        totalRowsCount={counts?.rejected}
        rowsPerPageOptions={[10, 20, 50]}
      />

      {selectedBenefitUnitOfMeasurement && (
        <BenefitUnitOfMeasurementDialog
          benefitUnitOfMeasurement={selectedBenefitUnitOfMeasurement}
          onClose={() => {
            setSelectedBenefitUnitOfMeasurement(undefined);
          }}
          title="Reject Branch Grade "
        />
      )}

      {!isLoading && !counts?.rejected && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Typography>No Data Available</Typography>
        </Box>
      )}
    </Box>
  );
};
