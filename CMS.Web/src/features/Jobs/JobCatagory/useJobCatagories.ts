import { useMemo } from "react";
import { SelectOption } from "../../../types";
import { useGetAllJobCategoryQuery } from "../../../app/store";

export const useJobCategory = () => {
  const { data: jobCategories } = useGetAllJobCategoryQuery();

  const jobCategoriesLookups = useMemo(
    () =>
      (jobCategories?.approved || []).map<SelectOption>(
        ({ id, jobCategoryName }) => ({
          label: jobCategoryName || "",
          value: id,
        })
      ),
    [jobCategories?.approved]
  );

  return { jobCategories, jobCategoriesLookups };
};
