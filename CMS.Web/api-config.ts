// api-config.ts
const config: any = {
   //schemaFile: "https://cms-api-cnxw.onrender.com/swagger/v1/swagger.json",
  schemaFile: "http://localhost:5023/swagger/v1/swagger.json",
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








