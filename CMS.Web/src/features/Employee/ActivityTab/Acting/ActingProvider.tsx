import { createContext, useContext } from "react";
import { useParams } from "react-router-dom";

type ActingContextType = {
  employeeId: number;
};

const ActingContext = createContext<ActingContextType | null>(null);

export const ActingProvider = ({ children }: { children: React.ReactNode }) => {
  const { id } = useParams();
  const employeeId = Number(id);

  return (
    <ActingContext.Provider value={{ employeeId }}>
      {children}
    </ActingContext.Provider>
  );
};

export const useActingContext = () => {
  const context = useContext(ActingContext);
  if (!context) {
    throw new Error("ActingContext must be used within a ActingProvider");
  }
  return context;
};
