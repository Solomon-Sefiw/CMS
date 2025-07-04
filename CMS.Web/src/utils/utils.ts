import { SxProps } from "@mui/material";
import { each, isObject, toLower, uniq, unset, upperFirst } from "lodash-es";
import * as yup from "yup";
import { EmployeeChangeLogDto } from "../app/store";
import { ChangeType, EmployeeChangeLogEntityType } from "../app/api/enums";

export type YupSchema<T> = T extends string
  ? yup.StringSchema
  : T extends number
  ? yup.NumberSchema
  : T extends boolean
  ? yup.BooleanSchema
  : T extends Record<any, any>
  ? yup.AnyObjectSchema
  : T extends any[]
  ? yup.ArraySchema<any, any>
  : yup.AnySchema;

export type YupShape<T extends object> = {
  [Key in keyof T]: YupSchema<T[Key]>;
};

export const AllowedAmharicCharacters = /^[\u1200-\u137C\s]*$/;

export const employeeChangeLogLabel = ({
  entityType,
  changeType,
}: EmployeeChangeLogDto) => {
  if (EmployeeChangeLogEntityType.BasicInfo === entityType)
    return `${
      (changeType === ChangeType.Added && "New ") || ""
    }Basic Information ${
      (changeType === ChangeType.Added && "Added") || "Modified"
    }`;

  if (EmployeeChangeLogEntityType.Family === entityType)
    return `${(changeType === ChangeType.Added && "New ") || ""}Family ${
      (changeType === ChangeType.Added && "Added") || "Modified"
    }`;

  if (EmployeeChangeLogEntityType.Contact === entityType)
    return `${(changeType === ChangeType.Added && "New ") || ""}Contact ${
      (changeType === ChangeType.Added && "Added") || "Modified"
    }`;

  if (EmployeeChangeLogEntityType.Address === entityType)
    return `${(changeType === ChangeType.Added && "New ") || ""}Address ${
      (changeType === ChangeType.Added && "Added") ||
      (changeType === ChangeType.Deleted && "Deleted") ||
      "Modified"
    }`;

  if (EmployeeChangeLogEntityType.Block === entityType)
    return `Employee Blocked`;

  if (EmployeeChangeLogEntityType.Unblock === entityType)
    return `Employee Unblocked`;

  if (EmployeeChangeLogEntityType.EmergencyContact === entityType)
    return `${
      (changeType === ChangeType.Added && "New ") || ""
    }Emergency Contact ${
      (changeType === ChangeType.Added && "Added") || "Modified"
    }`;

  if (EmployeeChangeLogEntityType.Education === entityType)
    return `${(changeType === ChangeType.Added && "New ") || ""}Education ${
      (changeType === ChangeType.Added && "Added") || "Modified"
    }`;

  if (EmployeeChangeLogEntityType.Experiance === entityType)
    return `${(changeType === ChangeType.Added && "New ") || ""}Experiance ${
      (changeType === ChangeType.Added && "Added") || "Modified"
    }`;
  if (EmployeeChangeLogEntityType.Guarantee === entityType)
    return `${(changeType === ChangeType.Added && "New ") || ""}Guarantee ${
      (changeType === ChangeType.Added && "Added") || "Modified"
    }`;
  if (EmployeeChangeLogEntityType.Language === entityType)
    return `${(changeType === ChangeType.Added && "New ") || ""}Language ${
      (changeType === ChangeType.Added && "Added") || "Modified"
    }`;
};

export const employeeChangeLogsLabels = (logs?: EmployeeChangeLogDto[]) =>
  uniq(
    (logs || []).map((log) => upperFirst(toLower(employeeChangeLogLabel(log))))
  );

export const removeEmptyFields = <T extends object>(
  value: T
): {
  [K in keyof T]: NonNullable<T[K]> | undefined;
} => {
  each(value, (v, k) => {
    if (["", undefined, null].some((x) => x === v)) {
      try {
        unset(value, k);
        // eslint-disable-next-line no-empty
      } catch (_) {}
    } else if (typeof v !== "string" && isObject(v)) {
      removeEmptyFields(v);
    }
  });

  return value as {
    [K in keyof T]: NonNullable<T[K] | undefined>;
  };
};

export const modifiedStyle = {
  borderStyle: "solid",
  borderColor: "warning.main",
  borderWidth: 0,
  borderLeftWidth: 5,
  borderRadius: 2,
  boxSizing: "border-box",
  p: 1,
};
export const addedStyle = {
  borderStyle: "solid",
  borderColor: "success.main",
  borderWidth: 0,
  borderLeftWidth: 5,
  borderRadius: 2,
  boxSizing: "border-box",
  p: 1,
};
