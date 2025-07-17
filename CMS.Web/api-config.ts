const config: any = {
  schemaFile: process.env.REACT_APP_SWAGGER_SCHEMA_URL,
  apiFile: "./src/app/api/emptySplitApi.ts",
  apiImport: "emptySplitApi",
  outputFile: "./src/app/api/HCMSApi.ts",
  exportName: "HCMSApi",
  hooks: { queries: true, lazyQueries: true, mutations: true },
  tag: {
    tagTypes: ["x-rtk-query-invalidates", "tags"],
    rtk: {
      mutations: {
        invalidates: "x-rtk-query-invalidates",
      },
      queries: {
        provides: "tags",
      },
    },
  },
};

export default config;







