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
import {
  BenefitUnitOfMeasurementDto,
  useGetBenefitUnitOfMeasurementCountPerStatusQuery,
  useGetBenefitUnitOfMeasurementListForPaginationQuery,
} from "../../../../app/api";
import { BenefitUnitOfMeasurementDialog } from "../BenefitUnitOfMeasurementDialog";
import { Pagination } from "../../../../components/Pagination";
import Checkbox from "@mui/material/Checkbox";

export const ApprovedBenefitUnitOfMeasurements = () => {
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 10,
  });

  const { data: counts, isLoading: isCountsLoading } =
    useGetBenefitUnitOfMeasurementCountPerStatusQuery();
  const { data: items, isLoading: isListLoading } =
    useGetBenefitUnitOfMeasurementListForPaginationQuery({
      pageNumber: pagination.pageNumber + 1,
      pageSize: pagination.pageSize,
      status: ApprovalStatus.Approved,
    });

  const [
    selectedBenefitUnitOfMeasurement,
    setSelectedBenefitUnitOfMeasurement,
  ] = useState<BenefitUnitOfMeasurementDto>();
  const isLoading = isCountsLoading || isListLoading;
  return (
    <Box>
      {!isLoading && !!counts?.approved && (
        <Paper>
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Is unit priced{" "}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
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
                          {/* {item.id && item.approvalStatus === ApprovalStatus.Approved && (
                             <Button
                             size="small"
                             variant="outlined"
                             startIcon={<VisibilityIcon />}
                             onClick={() => setSelectedBenefitUnitOfMeasurement(item)}
                           >
                             View
                           </Button>
                            )} */}
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

      {selectedBenefitUnitOfMeasurement && (
        <BenefitUnitOfMeasurementDialog
          benefitUnitOfMeasurement={selectedBenefitUnitOfMeasurement}
          onClose={() => setSelectedBenefitUnitOfMeasurement(undefined)}
          title={""}
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
