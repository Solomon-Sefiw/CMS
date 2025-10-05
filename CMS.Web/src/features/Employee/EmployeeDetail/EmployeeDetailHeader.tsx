import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"; // Import the checkmark icon
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Icon,
  Link,
  Typography,
} from "@mui/material";
import Dayjs from "dayjs";
import { Fragment, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useEmployeeId } from "./useEmployeeId";
import {
  EmployeeRecordVersions,
  useGetActiveResignationQuery,
  useGetActiveSuspentionQuery,
  useGetEmployeeInfoQuery,
  useGetEmployeeRecordVersionsQuery,
} from "../../../app/api";
import { EmployeePhoto } from "./EmployeePhoto";
import {
  AssignmentInd,
  AssuredWorkload,
  Badge,
  Bolt,
  Cake,
  CardGiftcard,
  DynamicFeed,
  HowToReg,
  LocationOn,
  Money,
  NewReleases,
  Person,
  Person2,
  Wc,
} from "@mui/icons-material";
import { usePrevious } from "../../../hooks";
import { useCurrentVersion } from "../useCurrentVersion";
import { ApprovalStatus, Gender, MartialStatus } from "../../../app/api/enums"; // Assuming these are still valid
import { getDetailPageUrl } from "../useNavigateToDetailPage";
import { ChipComponent } from "../../../components/chipComponent";
import {
  ApproveRequestButton,
  RejectRequestButton,
  SubmitForApprovalButton,
} from "../workflow"; // Your workflow buttons
import { ApprovalStatusChip } from "../../../components/approvalStatusChip";
import dayjs from "dayjs";

export const EmployeeDetailHeader = () => {
  const { id, version } = useEmployeeId();
  const [searchParams, setSearchParams] = useSearchParams();
  const { loadCurrentVersion } = useCurrentVersion();

  const { data: employee, refetch } = useGetEmployeeInfoQuery(
    {
      id,
      version,
    },
    {
      skip: !id,
    }
  );
  const { data: versions } = useGetEmployeeRecordVersionsQuery(
    {
      id,
    },
    {
      skip: !id,
    }
  );
const { data: isResigned } = useGetActiveResignationQuery({ id: employee?.id });
const { data: isSuspended } = useGetActiveSuspentionQuery({ id: employee?.id });
  const prevVersions = usePrevious(versions);
  useEffect(() => {
    const shouldSwitchToDraft =
      prevVersions?.current && prevVersions.current !== versions?.current;

    shouldSwitchToDraft && loadCurrentVersion();
  }, [loadCurrentVersion, prevVersions, versions]);

  useEffect(() => {
    if (employee?.isCurrent && version) {
      searchParams.delete("version");
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams, employee?.isCurrent, version]);

  const otherVersions = useMemo(() => {
    if (
      !(
        versions?.approved ||
        versions?.current ||
        versions?.draft ||
        versions?.rejected ||
        versions?.submitted
      )
    )
      return [];

    const versionsKeys = Object.keys(versions) as Array<
      keyof EmployeeRecordVersions
    >;

    if (version && employee?.approvalStatus) {
      const latestVersion = versionsKeys
        .filter((key) => key !== "current")
        .find((key) => versions[key] && versions[key] === versions["current"]);

      const isStaleVersion = !versionsKeys.some(
        (key) => versions[key] === version
      );

      if (
        latestVersion ===
          ApprovalStatus[employee.approvalStatus]?.toLowerCase() ||
        isStaleVersion
      ) {
        searchParams.delete("version");
        setSearchParams(searchParams);
      }
    }

    if (versions) {
      const result: {
        version: keyof typeof versions;
        href?: string;
        color: "success" | "error" | "info";
        isLatest?: boolean;
      }[] = [];

      versionsKeys.forEach((key) => {
        const _version = versions[key] as string;

        if (
          _version &&
          !(_version === employee?.versionNumber || key === "current")
        ) {
          result.push({
            version: key,
            href: getDetailPageUrl({
              id,
              versionNumber: _version,
            }),
            isLatest: _version === versions?.current,
            color:
              (key === "draft" && "info") ||
              (key === "rejected" && "error") ||
              "success",
          });
        }
      });

      return result;
    }
  }, [id, searchParams, setSearchParams, employee, version, versions]);

  // Determine if all required fields are complete for submission
  const areRequiredFieldsComplete = useMemo(() => {
    if (!employee) return false;
    return (
      employee.hasAddressInfo &&
      employee.hasEmployeeFamilyInfo &&
      employee.hasEmergencyContactInfo &&
      employee.hasLanguageSkillInfo
    );
  }, [employee]);

  return (
    <>
      {employee && (
        <Box
          sx={{ pb: 2, display: "flex", position: "relative", height: "100%" }}
        >
          {/* Employee Photo Box */}
          <Box
            sx={{
              mr: 1,
              paddingRight: 1,
              paddingTop: 2,
              width: 180,
              height: 150,
              overflow: "hidden",
              borderRadius: 1,
              boxShadow: 3,
            }}
          >
            <EmployeePhoto employee={employee} />
          </Box>

          {/* First Info Box: Personal Details */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              mr: 1,
              flex: 1,
              p: 1,
              borderRadius: 1,
              backgroundColor: "background.paper",
            }}
          >
            <Box sx={{ display: "flex", mb: 1 }}>
              <Typography
                variant="h5"
                component="div"
                sx={{ mr: 1 }}
                color="primary.dark"
              >
                {employee?.amharicDisplayName}
              </Typography>
              <Typography sx={{ paddingTop: 0.5 }}>
                {!!employee?.isNew && (
                  <ChipComponent color="success" label="New" variant="filled" />
                )}
              </Typography>
            </Box>
            <Box
              sx={{ display: "flex", alignItems: "center", paddingBottom: 1 }}
            >
              <Icon
                component={Person}
                sx={{ marginRight: 1, color: "primary.dark" }}
              />
              <Typography variant="body1" color="primary.dark">
                {employee?.displayName ? employee.displayName : " -"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Icon
                component={Cake}
                sx={{ marginRight: 1, color: "primary.dark" }}
              />
              <Typography variant="body1" color="primary.dark">
                Birth Date:{" "}
                {employee?.birthDate
                  ? dayjs(employee?.birthDate).format("DD MMM YYYY")
                  : " -"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Icon
                component={HowToReg}
                sx={{ marginRight: 1, color: "primary.dark" }}
              />
              <Typography variant="subtitle2" color="text.secondary">
                Registration Date:{" "}
                <Typography
                  component="span"
                  variant="caption"
                  color="text.primary"
                >
                  {!employee?.employementDate
                    ? " - "
                    : Dayjs(employee?.employementDate).format("MMMM D, YYYY")}
                </Typography>
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Icon
                component={Badge}
                sx={{ marginRight: 1, color: "primary.dark" }}
              />
              <Typography variant="subtitle2" color="text.secondary">
                Employee #:{" "}
                {!employee?.id ? " - " : employee?.id}
              </Typography>
            </Box>
          </Box>

          {/* Divider */}
          <Box
            sx={{
              borderLeft: "3px dashed",
              borderColor: "divider",
              height: "100%",
              mx: 2,
            }}
          />

          {/* Second Info Box: Job Details */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              mr: 1,
              flex: 1,
              pt: 4,
              p: 2,
              borderRadius: 2,
              backgroundColor: "background.paper",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Icon
                component={AssuredWorkload}
                sx={{ marginRight: 1, color: "primary.dark" }}
              />
              <Typography variant="subtitle2" color="text.secondary">
                Business Unit :{" "}
                {!employee?.businessUnit ? " - " : employee?.businessUnit}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Icon
                component={AssignmentInd}
                sx={{ marginRight: 1, color: "primary.dark" }}
              />
              <Typography variant="subtitle2" color="text.secondary">
                Job Title : {!employee?.jobTitle ? " - " : employee?.jobTitle}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Icon
                component={Bolt}
                sx={{ marginRight: 1, color: "primary.dark" }}
              />
              <Typography variant="subtitle2" color="text.secondary">
                Marital Status :{" "}
                {!employee?.martialStatus
                  ? " - "
                  : MartialStatus[employee?.martialStatus]}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Icon
                component={Wc}
                sx={{ marginRight: 1, color: "primary.dark" }}
              />
              <Typography variant="subtitle2" color="text.secondary">
                Gender : {!employee?.gender ? " - " : Gender[employee?.gender]}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Icon
                component={Money}
                sx={{ marginRight: 1, color: "primary.dark" }}
              />
              <Typography variant="subtitle2" color="text.secondary">
                Salary On:
                {employee?.salaryOnGradeStepId === 0
                  ? "Base Salary"
                  : employee?.salaryOnGradeStepId === 10
                  ? "Ceiling Salary"
                  : `Step Salary - Step ${employee?.salaryOnGradeStepId}`}
              </Typography>
            </Box>
          </Box>

          {/* Divider */}
          <Box
            sx={{
              borderLeft: "3px dashed",
              borderColor: "divider",
              height: "100%",
              mx: 2,
            }}
          />

          {/* Third Box: Submission Criteria */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              mr: 1,
              flex: 1,
              pt: 4,
              p: 2,
              borderRadius: 2,
              backgroundColor: "background.paper",
            }}
          >
            {/* <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
              Submission Requirements:
            </Typography> */}
            <Typography
              variant="body2"
              color={employee.hasAddressInfo ? "success.main" : "error.main"}
            >
              <Icon
                component={
                  employee.hasAddressInfo ? CheckCircleOutlineIcon : BlockIcon
                }
                sx={{ verticalAlign: "middle", mr: 0.5 }}
              />
              Employee Address Info:{" "}
              {employee.hasAddressInfo ? "Complete" : "Missing"}
            </Typography>
            <Typography
              variant="body2"
              color={employee.hasContactInfo ? "success.main" : "error.main"}
            >
              <Icon
                component={
                  employee.hasContactInfo ? CheckCircleOutlineIcon : BlockIcon
                }
                sx={{ verticalAlign: "middle", mr: 0.5 }}
              />
              Employee Contact Info:{" "}
              {employee.hasContactInfo ? "Complete" : "Missing"}
            </Typography>
            <Typography
              variant="body2"
              color={
                employee.hasEmployeeFamilyInfo ? "success.main" : "error.main"
              }
            >
              <Icon
                component={
                  employee.hasEmployeeFamilyInfo
                    ? CheckCircleOutlineIcon
                    : BlockIcon
                }
                sx={{ verticalAlign: "middle", mr: 0.5 }}
              />
              Employee Family:{" "}
              {employee.hasEmployeeFamilyInfo ? "Complete" : "Missing"}
            </Typography>
            <Typography
              variant="body2"
              color={
                employee.hasEmergencyContactInfo ? "success.main" : "error.main"
              }
            >
              <Icon
                component={
                  employee.hasEmergencyContactInfo
                    ? CheckCircleOutlineIcon
                    : BlockIcon
                }
                sx={{ verticalAlign: "middle", mr: 0.5 }}
              />
              Emergency Contact:{" "}
              {employee.hasEmergencyContactInfo ? "Complete" : "Missing"}
            </Typography>
            <Typography
              variant="body2"
              color={
                employee.hasLanguageSkillInfo ? "success.main" : "error.main"
              }
            >
              <Icon
                component={
                  employee.hasLanguageSkillInfo
                    ? CheckCircleOutlineIcon
                    : BlockIcon
                }
                sx={{ verticalAlign: "middle", mr: 0.5 }}
              />
              Language Skill:{" "}
              {employee.hasLanguageSkillInfo ? "Complete" : "Missing"}
            </Typography>

            {/* {!areRequiredFieldsComplete && employee?.approvalStatus === ApprovalStatus.Draft && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  Please complete all required information before submitting for
                  approval.
                </Typography>
            )} */}
          </Box>

          {/* Workflow Action Buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              mr: 1,
              flex: 1,
            }}
          ></Box>

          {employee?.id && (
            <Box sx={{ display: "flex" }}>
              <Box
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 30,
                  padding: "8px 16px",
                  backgroundColor:
                    employee?.approvalStatus === ApprovalStatus.Approved
                      ? "green"
                      : employee?.approvalStatus === ApprovalStatus.Rejected
                      ? "red"
                      : "orange", // Adjusted to a common palette color
                  color: "white",
                  fontWeight: "bold",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  borderRadius: "4px",
                  transition: "background-color 1.3s ease",
                }}
              >
                <ApprovalStatusChip
                  status={employee?.approvalStatus}
                  size="medium"
                />
                <Divider sx={{ padding: "4px" }}></Divider>
                {employee?.approvalStatus === ApprovalStatus.Submitted && (
                  <>
                    <Box>
                      <ApproveRequestButton id={employee?.id} />
                      <RejectRequestButton id={employee?.id} />
                    </Box>
                  </>
                )}
                {employee?.approvalStatus === ApprovalStatus.Draft && (
                  <Box>
                    <SubmitForApprovalButton
                      id={employee?.id}
                      isSubmissionAllowed={!!areRequiredFieldsComplete} // Pass the new prop, always boolean
                    />
                  </Box>
                )}
                   <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                 {isSuspended?.isActive && (isSuspended.approvalStatus == ApprovalStatus.Approved ? <Chip label="Suspended" color="warning" size="small" /> : <Chip label="Under Suspension" color="warning" size="small" />)}

                  {isResigned?.isActive && (isResigned.approvalStatus == ApprovalStatus.Approved  ? <Chip label="Resigned" color="error" size="small" />: <Chip label="Under Resignation" color="error" size="small" />)}
                </Box>
              </Box>

            </Box>
          )}

          {/* Other versions display area (if any) */}
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "end",
                  }}
                >
                  {!!otherVersions?.length && (
                    <Box
                      sx={{
                        display: "flex",
                        gap: 0.5,
                        alignItems: "center",
                        mt: 1,
                      }}
                    >
                      {/* You can render other versions here if needed */}
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};
