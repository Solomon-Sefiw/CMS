import { createContext, useContext } from "react";
import { useParams } from "react-router-dom";

type DelegationContextType = {
  employeeId: number;
};

const DelegationContext = createContext<DelegationContextType | null>(null);

export const DelegationProvider = ({ children }: { children: React.ReactNode }) => {
  const { id } = useParams();
  const employeeId = Number(id);
  
  return (
    <DelegationContext.Provider value={{ employeeId }}>
      {children}
    </DelegationContext.Provider>
  );
};

export const useDelegationContext = () => {
  const context = useContext(DelegationContext);
  if (!context) {
    throw new Error("useDelegationContext must be used within a DelegationProvider");
  }
  return context;
};