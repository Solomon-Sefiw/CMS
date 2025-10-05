import { createContext, useContext } from "react";
import { useParams } from "react-router-dom";

type ResignationContextType = {
  employeeId: number;
};

const ResignationContext = createContext<ResignationContextType | null>(null);

export const ResignationProvider = ({ children }: { children: React.ReactNode }) => {
  const { id } = useParams();
  const employeeId = Number(id);

  return <ResignationContext.Provider value={{ employeeId }}>{children}</ResignationContext.Provider>;
};

export const useResignationContext = () => {
  const context = useContext(ResignationContext);
  if (!context) throw new Error("useResignationContext must be used within a ResignationProvider");
  return context;
};
