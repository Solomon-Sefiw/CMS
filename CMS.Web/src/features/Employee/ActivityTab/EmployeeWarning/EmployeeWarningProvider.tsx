import { createContext, useContext } from "react";
import { useParams } from "react-router-dom";

type EmployeeWarningContextType = {
  employeeId: number;
};

const EmployeeWarningContext = createContext<EmployeeWarningContextType | null>(
  null
);

export const EmployeeWarningProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { id } = useParams();
  const employeeId = Number(id);

  return (
    <EmployeeWarningContext.Provider value={{ employeeId }}>
      {children}
    </EmployeeWarningContext.Provider>
  );
};

export const useEmployeeWarningContext = () => {
  const context = useContext(EmployeeWarningContext);
  if (!context) {
    throw new Error(
      "useEmployeeWarningContext must be used within an EmployeeWarningProvider"
    );
  }
  return context;
};
