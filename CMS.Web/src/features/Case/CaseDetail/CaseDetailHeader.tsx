import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"; // Import the checkmark icon
import {
  Box,
  Divider,
  Icon,
  Typography,
} from "@mui/material";
import Dayjs from "dayjs";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  EmployeeRecordVersions,
  useGetCaseInfoQuery,
  useGetCaseRecordVersionsQuery,
} from "../../../app/api";
import {
  AssignmentInd,
  AssuredWorkload,
  Badge,
  Bolt,
  Cake,
  HowToReg,
  Person,
  Wc,
} from "@mui/icons-material";
import { usePrevious } from "../../../hooks";
import { useCurrentVersion } from "../useCurrentVersion";
import { ApprovalStatus } from "../../../app/api/enums"; // Assuming these are still valid
import { getDetailPageUrl } from "../useNavigateToCaseDetailPage";
import { ChipComponent } from "../../../components/chipComponent";
import {
  ApproveRequestButton,
  RejectRequestButton,
  SubmitForApprovalButton,
} from "../workflow"; // Your workflow buttons
import { ApprovalStatusChip } from "../../../components/approvalStatusChip";
import dayjs from "dayjs";
import { useCaseId } from "./useCaseId";

export const CaseDetailHeader = () => {
  const { id, version } = useCaseId();
  const [searchParams, setSearchParams] = useSearchParams();
  const { loadCurrentVersion } = useCurrentVersion();

  const { data: caseinfo , refetch} = useGetCaseInfoQuery(
    {
      id,
      version,
    },
    {
      skip: !id,
    }
  );
  const { data: versions } = useGetCaseRecordVersionsQuery(
    {
      id,
    },
    {
      skip: !id,
    }
  );

  const prevVersions = usePrevious(versions);
  useEffect(() => {
    const shouldSwitchToDraft =
      prevVersions?.current && prevVersions.current !== versions?.current;

    shouldSwitchToDraft && loadCurrentVersion();
  }, [loadCurrentVersion, prevVersions, versions]);

  useEffect(() => {
    if (caseinfo?.caseNumber && version) {
      searchParams.delete("version");
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams, caseinfo?.caseNumber, version]);

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

    if (version && caseinfo?.approvalStatus) {
      const latestVersion = versionsKeys
        .filter((key) => key !== "current")
        .find((key) => versions[key] && versions[key] === versions["current"]);

      const isStaleVersion = !versionsKeys.some(
        (key) => versions[key] === version
      );

      if (
        latestVersion ===
        ApprovalStatus[caseinfo.approvalStatus]?.toLowerCase() ||
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
          !(_version === caseinfo?.versionNumber || key === "current")
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
  }, [
    id,
    searchParams,
    setSearchParams,
    caseinfo,
    version,
    versions,
  ]);

  // Determine if all required fields are complete for submission
  const areRequiredFieldsComplete = useMemo(() => {
    if (!caseinfo) return false;
    return (
      caseinfo.hasAddressInfo &&
      caseinfo.hasEmployeeFamilyInfo &&
      caseinfo.hasEmergencyContactInfo &&
      caseinfo.hasLanguageSkillInfo
    );
  }, [caseinfo]);

  return (
    <>
      {caseinfo && (
        <Box
          sx={{ pb: 2, display: "flex", position: "relative", height: "100%" }}
        >
          {/* Employee Photo Box */}
          {/* <Box
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
          </Box> */}

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
                {caseinfo?.id}
              </Typography>
              <Typography sx={{ paddingTop: 0.5 }}>
                {!!caseinfo?.id && (
                  <ChipComponent color="success" label="New" variant="filled" />
                )}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", paddingBottom: 1 }}>
              <Icon
                component={Person}
                sx={{ marginRight: 1, color: "primary.dark" }}
              />
              <Typography variant="body1" color="primary.dark">
                {caseinfo?.accusedName ? caseinfo.plaintiffName : " -"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Icon
                component={Cake}
                sx={{ marginRight: 1, color: "primary.dark" }}
              />
              <Typography variant="body1" color="primary.dark">
                Birth Date:{" "}
                {caseinfo?.filedAt
                  ? dayjs(caseinfo?.filedAt).format("DD MMM YYYY")
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
                  {!caseinfo?.closedAt
                    ? " - "
                    : Dayjs(caseinfo?.filedAt).format("MMMM D, YYYY")}
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
                {!caseinfo?.caseNumber ? " - " : caseinfo?.caseNumber}
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
                {!caseinfo?.businessUnit?.name ? " - " : caseinfo?.businessUnit.name}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Icon
                component={AssignmentInd}
                sx={{ marginRight: 1, color: "primary.dark" }}
              />
              <Typography variant="subtitle2" color="text.secondary">
                Job Title : {!caseinfo?.accusedName ? " - " : caseinfo?.accusedName}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Icon
                component={Bolt}
                sx={{ marginRight: 1, color: "primary.dark" }}
              />
              <Typography variant="subtitle2" color="text.secondary">
                Marital Status :{" "}
                {!caseinfo?.accusedName
                  ? " - "
                  : caseinfo?.accusedName}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Icon
                component={Wc}
                sx={{ marginRight: 1, color: "primary.dark" }}
              />
              <Typography variant="subtitle2" color="text.secondary">
                Gender : {!caseinfo?.accusedName ? " - " : caseinfo?.caseType}
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
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
              Submission Requirements:
            </Typography>
            <Typography variant="body2" color={caseinfo.hasAddressInfo ? "success.main" : "error.main"}>
              <Icon component={caseinfo.hasAddressInfo ? CheckCircleOutlineIcon : BlockIcon} sx={{ verticalAlign: 'middle', mr: 0.5 }} />
              Employee Address Info: {caseinfo.hasAddressInfo ? "Complete" : "Missing"}
            </Typography>
            <Typography variant="body2" color={caseinfo.hasContactInfo ? "success.main" : "error.main"}>
              <Icon component={caseinfo.hasContactInfo ? CheckCircleOutlineIcon : BlockIcon} sx={{ verticalAlign: 'middle', mr: 0.5 }} />
              Employee Contact Info: {caseinfo.hasContactInfo ? "Complete" : "Missing"}
            </Typography>
            <Typography variant="body2" color={caseinfo.hasEmployeeFamilyInfo ? "success.main" : "error.main"}>
              <Icon component={caseinfo.hasEmployeeFamilyInfo ? CheckCircleOutlineIcon : BlockIcon} sx={{ verticalAlign: 'middle', mr: 0.5 }} />
              Employee Family: {caseinfo.hasEmployeeFamilyInfo ? "Complete" : "Missing"}
            </Typography>
            <Typography variant="body2" color={caseinfo.hasEmergencyContactInfo ? "success.main" : "error.main"}>
              <Icon component={caseinfo.hasEmergencyContactInfo ? CheckCircleOutlineIcon : BlockIcon} sx={{ verticalAlign: 'middle', mr: 0.5 }} />
              Emergency Contact: {caseinfo.hasEmergencyContactInfo ? "Complete" : "Missing"}
            </Typography>
             <Typography variant="body2" color={caseinfo.hasLanguageSkillInfo ? "success.main" : "error.main"}>
              <Icon component={caseinfo.hasLanguageSkillInfo ? CheckCircleOutlineIcon : BlockIcon} sx={{ verticalAlign: 'middle', mr: 0.5 }} />
              Language Skill: {caseinfo.hasLanguageSkillInfo ? "Complete" : "Missing"}
            </Typography>

            {!areRequiredFieldsComplete && caseinfo?.approvalStatus === ApprovalStatus.Draft && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    Please complete all required information before submitting for approval.
                </Typography>
            )}
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

          {caseinfo?.id && (
            <Box sx={{ display: "flex" }}>
              <Box
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 30,
                  padding: "8px 16px",
                  backgroundColor:
                    caseinfo?.approvalStatus === ApprovalStatus.Approved
                      ? "green"
                      : caseinfo?.approvalStatus === ApprovalStatus.Rejected
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
                  status={caseinfo?.approvalStatus}
                  size="medium"
                />
                <Divider sx={{ padding: "4px" }}></Divider>
                {caseinfo?.approvalStatus === ApprovalStatus.Submitted && (
                  <>
                    <Box>
                      <ApproveRequestButton id={caseinfo?.id} />
                      <RejectRequestButton id={caseinfo?.id} />
                    </Box>
                  </>
                )}
                {caseinfo?.approvalStatus === ApprovalStatus.Draft && (
                  <Box>
                    <SubmitForApprovalButton
                      id={caseinfo?.id}
                      isSubmissionAllowed={!!areRequiredFieldsComplete} // Pass the new prop, always boolean
                    />
                  </Box>
                )}
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