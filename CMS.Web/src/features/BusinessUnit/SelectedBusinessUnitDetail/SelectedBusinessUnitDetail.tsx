import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import { BusinessUnitDto } from "../../../app/api";
import { DialogHeader } from "../../../components/dialog/DialogHeader";
import FactoryIcon from "@mui/icons-material/Factory";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import PeopleIcon from "@mui/icons-material/People";
import LabelIcon from "@mui/icons-material/Label";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { ApprovalStatus, ContactCategory } from "../../../app/api/enums";
import { SelectedBusinessUnitAddress } from "./SelectedBusinessUnitAddress";
import ContactList from "../../Contact/ContactsList";

interface SelectedBusinessUnitDetailProps {
  onClose: () => void;
  title: string;
  businessUnit?: BusinessUnitDto;
}

export const SelectedBusinessUnitDetail: React.FC<
  SelectedBusinessUnitDetailProps
> = ({ onClose, title, businessUnit }) => {
  const [businessUnitData, setBusinessUnit] = useState<
    BusinessUnitDto | undefined
  >(businessUnit);
  const theme = useTheme();

  useEffect(() => {
    setBusinessUnit(businessUnit);
  }, [businessUnit]);

  if (!businessUnitData) {
    return (
      <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogHeader title={title} onClose={onClose} />
        <DialogContent>
          <Typography>No business unit details available.</Typography>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
    >
      <DialogHeader title={title} onClose={onClose} />
      <DialogContent dividers={true}>
        <Typography
          variant="h6"
          fontWeight="bold"
          color={theme.palette.primary.main}
          gutterBottom
        >
          Business Unit Information
        </Typography>
        {/* <Typography
          variant="h6"
          fontWeight="bold"
          color={theme.palette.primary.main}
          gutterBottom
        >
          Basic Information
        </Typography> */}

        <Grid container spacing={2}>
          <Grid item xs={12} sm={7}>
            <Box>
              <Box display="flex" alignItems="center" gap={1}>
                <FactoryIcon color="action" />
                <Typography variant="body2" color="textSecondary" noWrap>
                  Parent Business Unit:
                </Typography>

                <Typography
                  variant="body1"
                  fontWeight="bold"
                  noWrap
                  sx={{ wordBreak: "break-all" }}
                >
                  {businessUnitData.parentBusinessUnitName || "-- Top Level --"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={5}>
            <Box>
              <Box display="flex" alignItems="center" gap={1}>
                <FingerprintIcon color="action" />
                <Typography variant="body2" color="textSecondary" noWrap>
                  Business Unit ID:
                </Typography>

                <Typography
                  variant="body1"
                  fontWeight="bold"
                  noWrap
                  sx={{ wordBreak: "break-all" }}
                >
                  {businessUnitData.businessUnitID}
                </Typography>
              </Box>
            </Box>
          </Grid>


          <Grid item xs={12} sm={5}>
            <Box>
              <Box display="flex" alignItems="center" gap={1}>
                <PeopleIcon color="action" />
                <Typography variant="body2" color="textSecondary" noWrap>
                  Staff Strength:
                </Typography>

                <Typography
                  variant="body1"
                  fontWeight="bold"
                  noWrap
                  sx={{ wordBreak: "break-all" }}
                >
                  {businessUnitData.staffStrength !== null &&
                  businessUnitData.staffStrength !== undefined
                    ? businessUnitData.staffStrength
                    : "--"}
                </Typography>
              </Box>
            </Box>
          </Grid>


          {businessUnitData.businessUnitTypeName && (
            <Grid item xs={12} sm={7}>
              <Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <LabelIcon color="action" />
                  <Typography variant="body2" color="textSecondary" noWrap>
                    Business Unit Type:
                  </Typography>

                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    noWrap
                    sx={{ wordBreak: "break-all" }}
                  >
                    {businessUnitData.businessUnitTypeName}
                  </Typography>
                </Box>{" "}
              </Box>
            </Grid>
          )}

          {businessUnitData.approvalStatus && (
            <Grid item xs={12} sm={5}>
              <Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <CheckCircleOutlineIcon color="success" />
                  <Typography variant="body2" color="textSecondary" noWrap>
                    Approval Status:
                  </Typography>

                  <Chip
                    label={
                      businessUnitData.approvalStatus &&
                      ApprovalStatus[businessUnitData.approvalStatus]
                    }
                    color={
                      businessUnitData.approvalStatus ===
                      ApprovalStatus.Approved
                        ? "success"
                        : "warning"
                    }
                    size="small"
                    sx={{ fontWeight: "bold" }}
                  />
                </Box>{" "}
              </Box>
            </Grid>
          )}
        </Grid>
        <Divider sx={{ mb: 2, paddingTop: 1 }} />
        <Typography
          variant="h6"
          fontWeight="bold"
          color={theme.palette.primary.main}
          gutterBottom
        >
          Address Information
        </Typography>

        <SelectedBusinessUnitAddress businessUnit={businessUnitData} />
        <Divider sx={{ mb: 2, paddingTop: 1 }} />
        <Typography
          variant="h6"
          fontWeight="bold"
          color={theme.palette.primary.main}
          gutterBottom
        >
          Contact Information
        </Typography>

        <ContactList
          requestId={businessUnit?.id}
          contactCategory={ContactCategory.BusinessUnitContact}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
