export enum HttpRequestStatus {
  Loading,
  Succeeded,
  Failed,
}

export type SelectOption = {
  label: string;
  value?: string | number | boolean | undefined;
  isInactive?: boolean;
};
export type SelectOptionRole = {
  claimCategory: number | undefined;
  label: string;
  value?: string | number | boolean | undefined;
  isInactive?: boolean;
  
};

export type MultipleSelectOption = {
  label: string;
  value: string | number; 
  isInactive?: boolean;
};

export type SelectOptionForNumber = {
  label: string;
  value: string | number | undefined; 
  isInactive?: boolean;
};

