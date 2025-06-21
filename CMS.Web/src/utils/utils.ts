import { SxProps } from "@mui/material";
import { each, isObject, toLower, uniq, unset, upperFirst } from "lodash-es";
import * as yup from "yup";

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
