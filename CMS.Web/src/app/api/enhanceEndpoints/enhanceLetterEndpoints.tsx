import { HCMSApi } from "../HCMSApi";
import { Tag } from "./tags";

const enhancedApi = HCMSApi.enhanceEndpoints({
  addTagTypes: [Tag.Letter, Tag.LetterDto, Tag.CurrentUser],
  endpoints: {
    currentUserInfo: {
      query: () => "/api/Users/current", // The API endpoint
      providesTags: () => [Tag.CurrentUser, Tag.Letter], // Provides tags when data is fetched
    },
    uploadLetterDocument: {
      // Type assertion required since the original expects JSON shape
      query: ((formData: FormData) => ({
        url: "/api/Letter/UploadLetterDocument",
        method: "POST",
        body: formData,
        headers: { "Content-type": "multipart/form-data" },
      })) as any,
      invalidatesTags: [Tag.Letter],
    },
    updateLetterDocument: {
      query: ((formData: FormData) => ({
        url: "/api/Letter/UpdateLetterDocument",
        method: "PUT",
        body: formData,
        headers: { "Content-type": "multipart/form-data" },
      })) as any,
      invalidatesTags: [Tag.Letter],
    },
        downloadLetterDocument: {
      query: ({ id }: { id: string }) => ({
        url: `/api/Letter/DownloadLetterDocument/${id}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
        headers: {
          Accept: "*/*",
        },
      }),
    },
    
    // addLetterDocument: {
    //   query: (queryArg) => {
    //     const formData = new FormData();
    //     formData.append("file", queryArg?.body.file as any);
    //     return {
    //       url: `/api/Letter/${queryArg.id}/add-Document`,
    //       method: "POST",
    //       body: formData,
    //       headers: { "Content-type": "multipart/form-data" },
    //     };
    //   },

    //   invalidatesTags: (_result, _error, args) => [
    //     { type: Tag.Letter, id: args.id },
    //     Tag.Letter,
    //     Tag.LetterDto,
    //   ],
    // },

  },
});

export default enhancedApi;
