import { createContext, useContext } from "react";
import { useParams } from "react-router-dom";

type SuspensionContextType = {
  employeeId: number;
};

const SuspensionContext = createContext<SuspensionContextType | null>(null);

export const SuspensionProvider = ({ children }: { children: React.ReactNode }) => {
  const { id } = useParams();
  const employeeId = Number(id);

  return <SuspensionContext.Provider value={{ employeeId }}>{children}</SuspensionContext.Provider>;
};

export const useSuspensionContext = () => {
  const context = useContext(SuspensionContext);
  if (!context) throw new Error("useSuspensionContext must be used within a SuspensionProvider");
  return context;
};
