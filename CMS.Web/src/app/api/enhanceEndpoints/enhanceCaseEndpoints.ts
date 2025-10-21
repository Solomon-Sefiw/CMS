import { HCMSApi } from "../HCMSApi";
import { Tag } from "./tags";

const enhancedApi = HCMSApi.enhanceEndpoints({
  addTagTypes: [
    Tag.CaseFileDocuments,
  ],
  endpoints: {
    // getShareholderDocuments: {
    //   providesTags: () => [Tag.ShareholderInfo],
    // },
    uploadCaseFileDocument: {
      // Type assertion required since the original expects JSON shape
      query: ((formData: FormData) => ({
        url: "/api/CaseFileDocuments/UploadCaseFileDocument",
        method: "POST",
        body: formData,
        headers: { "Content-type": "multipart/form-data" },
      })) as any,
      invalidatesTags: [Tag.CaseFileDocuments],
    },
    updateCaseFileDocument: {
      query: ((formData: FormData) => ({
        url: "/api/CaseFileDocuments/updateCaseFileDocument",
        method: "PUT",
        body: formData,
        headers: { "Content-type": "multipart/form-data" },
      })) as any,
      invalidatesTags: [Tag.CaseFileDocuments],
    },
    downloadCaseFileDocument: {
      query: ({ id }: { id: string }) => ({
        url: `/api/CaseFileDocuments/DownloadCaseFileDocument/${id}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
        headers: {
          Accept: "*/*",
        },
      }),
    },
  },
});

export default enhancedApi;
