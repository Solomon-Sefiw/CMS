// BusinessUnitContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface BusinessUnitContextProps {
  businessUnitId: number | null;
  setBusinessUnitId: Dispatch<SetStateAction<number | null>>;
}

export const BusinessUnitContext = createContext<BusinessUnitContextProps>({
  businessUnitId: null,
  setBusinessUnitId: () => {}, // Provide a no-op default function
});

export const BusinessUnitProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [businessUnitId, setBusinessUnitId] = useState<number | null>(null);

  return (
    <BusinessUnitContext.Provider value={{ businessUnitId, setBusinessUnitId }}>
      {children}
    </BusinessUnitContext.Provider>
  );
};

export const useBusinessUnitId = () => {
  return useContext(BusinessUnitContext).businessUnitId;
};

export const useSetBusinessUnitId = () => {
  return useContext(BusinessUnitContext).setBusinessUnitId;
};
