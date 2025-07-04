import { useGetEmployeeByIdQuery } from "../../app/api";
import { useEmployeeId } from "./EmployeeDetail/useEmployeeId";

export const useCurrentEmployeeInfo = () => {
  const { id } = useEmployeeId();
  const { data } = useGetEmployeeByIdQuery(
    {
      id,
    },
    { skip: !id }
  );

  return data;
};
