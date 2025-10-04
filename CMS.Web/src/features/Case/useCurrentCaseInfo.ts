import { useGetCaseByIdQuery } from "../../app/api";
import { useCaseId } from "./CaseDetail/useCaseId";

export const useCurrentCaseInfo = () => {
  const { id } = useCaseId();
  const { data } = useGetCaseByIdQuery(
    {
      id,
    },
    { skip: !id }
  );

  return data;
};
