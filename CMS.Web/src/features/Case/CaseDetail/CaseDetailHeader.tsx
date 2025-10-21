import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
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
import { ApprovalStatus } from "../../../app/api/enums";
import { getDetailPageUrl } from "../useNavigateToCaseDetailPage";
import { ChipComponent } from "../../../components/chipComponent";
import {
  ApproveRequestButton,
  RejectRequestButton,
  SubmitForApprovalButton,
} from "../workflow";
import { ApprovalStatusChip } from "../../../components/approvalStatusChip";
import dayjs from "dayjs";
import { useCaseId } from "./useCaseId";

export const CaseDetailHeader = () => {
  const { id, version } = useCaseId();
  const [searchParams, setSearchParams] = useSearchParams();
  const { loadCurrentVersion } = useCurrentVersion();

  const { data: caseinfo, refetch } = useGetCaseInfoQuery(
    {
      id,
      version,
    },
    { skip: !id }
  );

  const { data: versions } = useGetCaseRecordVersionsQuery(
    { id },
    { skip: !id }
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
  }, [id, searchParams, setSearchParams, caseinfo, version, versions]);

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
        <Box sx={{ pb: 2, display: "flex", position: "relative", height: "100%" }}>
          {/* First Info Box */}
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
              <Icon component={Person} sx={{ marginRight: 1, color: "primary.dark" }} />
              <Typography variant="body1" color="primary.dark">
                {caseinfo?.accusedName ? caseinfo.plaintiffName : " -"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Icon component={Cake} sx={{ marginRight: 1, color: "primary.dark" }} />
              <Typography variant="body1" color="primary.dark">
                Birth Date:{" "}
                {caseinfo?.filedAt
                  ? dayjs(caseinfo?.filedAt).format("DD MMM YYYY")
                  : " -"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Icon component={HowToReg} sx={{ marginRight: 1, color: "primary.dark" }} />
              <Typography variant="subtitle2" color="text.secondary">
                Registration Date:{" "}
                <Typography component="span" variant="caption" color="text.primary">
                  {!caseinfo?.closedAt
                    ? " - "
                    : Dayjs(caseinfo?.filedAt).format("MMMM D, YYYY")}
                </Typography>
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Icon component={Badge} sx={{ marginRight: 1, color: "primary.dark" }} />
              <Typography variant="subtitle2" color="text.secondary">
                Employee #: {!caseinfo?.caseNumber ? " - " : caseinfo?.caseNumber}
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

          {/* Second Info Box */}
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
              <Icon component={Bolt} sx={{ marginRight: 1, color: "primary.dark" }} />
              <Typography variant="subtitle2" color="text.secondary">
                Marital Status :{" "}
                {!caseinfo?.accusedName ? " - " : caseinfo?.accusedName}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Icon component={Wc} sx={{ marginRight: 1, color: "primary.dark" }} />
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

          {/* ✅ Third Box: Submission Criteria */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              pt: 4,
              p: 2,
              borderRadius: 2,
              backgroundColor: "background.paper",
              transition: "all 0.3s ease",
              boxShadow: 1,
              "&:hover": {
                boxShadow: 4,
                transform: "translateY(-2px)",
              },
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                mb: 1,
                fontWeight: "bold",
                color: "primary.dark",
                borderBottom: "2px solid",
                borderColor: "primary.light",
                display: "inline-block",
                pb: 0.5,
              }}
            >
              መሰረታዊ መረጃ ማያያዣያዎች:
            </Typography>

            {(
              [
                { key: "hasAddressInfo", label: "የፍ/ቤት እና የጉዳይመረጃ" },
                { key: "hasContactInfo", label: "ቀናት" },
                { key: "hasEmployeeFamilyInfo", label: "ክፍያ እና ገጾች" },
                { key: "hasEmergencyContactInfo", label: "ፋይል ማያያዣያዎች" },
                // { key: "hasLanguageSkillInfo", label: "ዳኛ" },
              ] as const
            ).map(({ key, label }) => {
              type RequiredKeys =
                | "hasAddressInfo"
                | "hasContactInfo"
                | "hasEmployeeFamilyInfo"
                | "hasEmergencyContactInfo";
                // | "hasLanguageSkillInfo";
              const complete = caseinfo?.[key as RequiredKeys];
              return (
                <Box
                  key={key}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 0.6,
                    p: 0.8,
                    borderRadius: 1,
                    transition: "background-color 0.3s ease",
                    backgroundColor: complete
                      ? "rgba(76, 175, 80, 0.06)"
                      : "rgba(244, 67, 54, 0.06)",
                    "&:hover": {
                      backgroundColor: complete
                        ? "rgba(76, 175, 80, 0.15)"
                        : "rgba(244, 67, 54, 0.15)",
                    },
                  }}
                >
                  <Icon
                    component={complete ? CheckCircleOutlineIcon : BlockIcon}
                    sx={{
                      mr: 1,
                      color: complete ? "success.main" : "error.main",
                      fontSize: 20,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: complete ? "success.main" : "error.main",
                      fontWeight: 500,
                    }}
                  >
                    {label}: {complete ? "Complete" : "Missing"}
                  </Typography>
                </Box>
              );
            })}
          </Box>
                    {/* ✅ Third Box: Submission Criteria */}
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
                      {/* Workflow Buttons */}
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
                      : "orange",
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
                <Divider sx={{ padding: "4px" }} />
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
                      isSubmissionAllowed={!!areRequiredFieldsComplete}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          )}

          </Box>
        </Box>
      )}
    </>
  );
};
