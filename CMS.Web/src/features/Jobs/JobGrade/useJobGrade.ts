import { useMemo } from "react";
import { SelectOption } from "../../../types";
import { useGetAllLookupsQuery } from "../../../app/api/HCMSApi";
import { JobGradeRomanId } from "../../../app/api/enums";
import { getEnumOptions } from "../../../components/form-controls/get-enum-list";

export const useJobGrade = () => {
  const { data } = useGetAllLookupsQuery();

  const { JobGradesLookups, jobGrades } = useMemo(() => {
    const JobGradesLookups = (data?.jobGrades || []).map<SelectOption>(
      ({ jobGradeId, name, jobGradeRomanId }) => {
        const enumKey =
          jobGradeRomanId !== undefined
            ? JobGradeRomanId[jobGradeRomanId]
            : undefined;
        const label = enumKey || name || "";
        return {
          label,
          value: jobGradeId,
        };
      }
    );
    return { JobGradesLookups, jobGrades: data?.jobGrades || [] };
  }, [data]);
  return {
    jobGrades,
    JobGradesLookups,
  };
};
