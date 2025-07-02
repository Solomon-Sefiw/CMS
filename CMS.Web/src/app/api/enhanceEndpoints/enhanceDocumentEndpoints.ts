import { handleFileDownload } from "../../../utils/handleFileDownload";
 import { HCMSApi } from "../HCMSApi";

const enhancedApi = HCMSApi.enhanceEndpoints({
  endpoints: {
    downloadDocument: {
      query: (queryArg) => {
        return {
          url: `/api/Documents/${queryArg.id}/download`,
          responseHandler: handleFileDownload(""),
          cache: "no-cache",
        };
      },
    },
  },
});

export default enhancedApi;
