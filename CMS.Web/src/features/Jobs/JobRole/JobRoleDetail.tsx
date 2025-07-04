import { useCallback, useEffect, useState } from "react";
import {
  DialogHeader,
  FormSelectField,
  FormTextField,
  Errors,
} from "../../../components";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Typography,
  Paper,
  Stack,
  Divider,
} from "@mui/material";
import {
  JobRoleDto,
  useUpdateJobRoleMutation,
  useGetJobRoleByIdQuery,
  JobRole,
} from "../../../app/api/HCMSApi";
import { useJobGrade } from "../JobGrade/useJobGrade";
import { useJobRoleCategories } from "./useJobRoleCatagories";
import { FormRichTextField } from "../../../components/form-controls/from-reach-text";
import { useAlert } from "../../notification";
import * as Yup from "yup";
// Icons
import FactoryIcon from "@mui/icons-material/Factory";
import CategoryIcon from "@mui/icons-material/Category";
import CategoryTwoToneIcon from "@mui/icons-material/CategoryTwoTone";
import DescriptionIcon from "@mui/icons-material/Description";
import HomeMaxIcon from "@mui/icons-material/HomeMax";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import React from "react";
import { JobGradeRomanId } from "../../../app/api/enums";

const emptyjobRoleData = {
  roleName: "",
  jobCatagoryId: "",
  jobRoleCategoryId: "",
  jobGradeId: "",
  description: "",
} as any;

interface JobRoleDetailProps {
  onClose: () => void;
  JobRoles?: JobRoleDto;
}

export const JobRoleDetail = ({ onClose, JobRoles }: JobRoleDetailProps) => {
  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
      fullWidth
    >
      {!!JobRoles && (
        <>
          <DialogHeader title="Job Role Detail" onClose={onClose} />
          <DialogContent dividers={true}>
            <Grid container spacing={2}>
              {/* Job Role Name */}
              <Grid item xs={12} sm={5}>
                <Box display="flex" alignItems="center" gap={1}>
                  <FactoryIcon color="action" />
                  <Typography variant="body2" color="textSecondary" noWrap>
                    Job Role Name:
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    noWrap
                    sx={{ wordBreak: "break-all" }}
                  >
                    {JobRoles?.roleName}
                  </Typography>
                </Box>
              </Grid>

              {/* Job Role Grade */}
              <Grid item xs={12} sm={5}>
                <Box display="flex" alignItems="center" gap={1}>
                  <HomeMaxIcon color="action" />
                  <Typography variant="body2" color="textSecondary" noWrap>
                    Job Role Grade:
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    noWrap
                    sx={{ wordBreak: "break-all" }}
                  >
  {JobGradeRomanId[JobRoles?.jobGrade as unknown as keyof typeof JobGradeRomanId]}
                  </Typography>
                </Box>
              </Grid>

              {/* Job Category */}
              <Grid item xs={12} sm={5}>
                <Box display="flex" alignItems="center" gap={1}>
                  <CategoryIcon color="action" />
                  <Typography variant="body2" color="textSecondary" noWrap>
                    Job Category:
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    noWrap
                    sx={{ wordBreak: "break-all" }}
                  >
                    {JobRoles?.jobCatagory}
                  </Typography>
                </Box>
              </Grid>

              {/* Job Role Category */}
              <Grid item xs={12} sm={5}>
                <Box display="flex" alignItems="center" gap={1}>
                  <CategoryTwoToneIcon color="action" />
                  <Typography variant="body2" color="textSecondary" noWrap>
                    Job Role Category:
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    noWrap
                    sx={{ wordBreak: "break-all" }}
                  >
                    {JobRoles?.jobRoleCatagory}
                  </Typography>
                </Box>
              </Grid>

              {/* Job Description */}
              <Grid item xs={12} sm={5}>
                <Box display="flex" alignItems="center" gap={1}>
                  <DescriptionIcon color="action" />
                  <Typography variant="body2" color="textSecondary" noWrap>
                    Job Description:
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    noWrap
                    sx={{ wordBreak: "break-all" }}
                  >
                    {(JobRoles?.description || "").replace(/<[^>]+>/g, "")}
                  </Typography>
                </Box>
              </Grid>

              {/* Benefits Section */}
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" gap={1} pt={2}>
                  <MonetizationOnIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    Allocated Benefits
                  </Typography>
                </Box>

                {JobRoles.benefits?.length ? (
                  <Grid container spacing={2} pl={4} pt={2}>
                    {JobRoles.benefits.map((benefit, index) => (
                      <React.Fragment key={index}>
                        {/* Divider before each benefit except the first */}
                        {index > 0 && (
                          <Grid item xs={12}>
                            <Divider sx={{ my: 2 }} />
                          </Grid>
                        )}

                        {/* Benefit Name */}
                        <Grid item xs={12} sm={5}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <LocalOfferIcon color="action" />
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              noWrap
                            >
                              Benefit:
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              noWrap
                              sx={{ wordBreak: "break-word" }}
                            >
                              {benefit.benefitName}
                            </Typography>
                          </Box>
                        </Grid>

                        {/* Value and Unit */}
                        <Grid item xs={12} sm={5}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              noWrap
                            >
                              Value:
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              noWrap
                              sx={{ wordBreak: "break-word" }}
                            >
                              {benefit.value ?? 0}{" "}
                              {benefit.unitOfMeasurementName ?? ""}
                            </Typography>
                          </Box>
                        </Grid>

                        {/* Unit Price and Calculated Amount */}
                        {benefit.isUnitPriced &&
                          typeof benefit.unitPrice === "number" &&
                          typeof benefit.value === "number" && (
                            <>
                              <Grid item xs={12} sm={5}>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    noWrap
                                  >
                                    Unit Price (ETB):
                                  </Typography>
                                  <Typography
                                    variant="body1"
                                    fontWeight="bold"
                                    noWrap
                                    sx={{ wordBreak: "break-word" }}
                                  >
                                    {benefit.unitPrice}
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={5}>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    noWrap
                                  >
                                    Calculated Amount (ETB):
                                  </Typography>
                                  <Typography
                                    variant="body1"
                                    fontWeight="bold"
                                    noWrap
                                    sx={{ wordBreak: "break-word" }}
                                  >
                                    {benefit.unitPrice * benefit.value}
                                  </Typography>
                                </Box>
                              </Grid>
                            </>
                          )}
                      </React.Fragment>
                    ))}
                  </Grid>
                ) : (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mt: 1, pl: 4 }}
                  >
                    No benefits defined.
                  </Typography>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={onClose}>Close</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};
