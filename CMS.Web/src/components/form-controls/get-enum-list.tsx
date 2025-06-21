export const getEnumOptions = (
  enumObj: any
): { label: string; value: any }[] => {
  return Object.keys(enumObj)
    .filter((key) => isNaN(Number(key))) // Exclude numeric keys
    .map((key) => ({
      label: key.replace(/_/g, " "), // Replace underscores with spaces for better display
      value: enumObj[key],
    }));
};
