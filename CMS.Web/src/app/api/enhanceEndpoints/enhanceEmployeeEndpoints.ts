import { HCMSApi } from "../HCMSApi";
import { Tag } from "./tags";

const enhancedApi = HCMSApi.enhanceEndpoints({
  addTagTypes: [
    Tag.EmployeeProfile,
    Tag.EmployeeDto,
    Tag.CurrentUser,
    Tag.EmployeeFileDocuments,
  ],
  endpoints: {
    getAllEmployees: {
      providesTags: [Tag.EmployeeProfile, Tag.EmployeeDto],
    },
    getEmployeeInfo: {
      providesTags: () => [Tag.EmployeeDto, Tag.EmployeeProfile],
    },
    getEmployeeById: {
      providesTags: [Tag.EmployeeDto, Tag.EmployeeProfile],
    },
    getEmployeeRecordVersions: {
      providesTags: [Tag.EmployeeDto, Tag.EmployeeProfile],
    },
    // getShareholderDocuments: {
    //   providesTags: () => [Tag.ShareholderInfo],
    // },
    addEmployeePhoto: {
      query: (queryArg) => {
        const formData = new FormData();
        formData.append("file", queryArg?.body.file as any);
        return {
          url: `/api/EmployeeProfile/${queryArg.id}/add-photo`,
          method: "POST",
          body: formData,
          headers: { "Content-type": "multipart/form-data" },
        };
      },

      invalidatesTags: (_result, _error, args) => [
        { type: Tag.EmployeeProfile, id: args.id },
        Tag.EmployeeProfile,
        Tag.EmployeeDto,
      ],
    },
    uploadEmployeeFileDocument: {
      // Type assertion required since the original expects JSON shape
      query: ((formData: FormData) => ({
        url: "/api/EmployeeFileDocuments/UploadEmployeeFileDocument",
        method: "POST",
        body: formData,
        headers: { "Content-type": "multipart/form-data" },
      })) as any,
      invalidatesTags: [Tag.EmployeeFileDocuments],
    },
    updateEmployeeFileDocument: {
      query: ((formData: FormData) => ({
        url: "/api/EmployeeFileDocuments/updateEmployeeFileDocument",
        method: "PUT",
        body: formData,
        headers: { "Content-type": "multipart/form-data" },
      })) as any,
      invalidatesTags: [Tag.EmployeeFileDocuments],
    },
    downloadEmployeeFileDocument: {
      query: ({ id }: { id: string }) => ({
        url: `/api/EmployeeFileDocuments/DownloadEmployeeFileDocument/${id}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
        headers: {
          Accept: "*/*",
        },
      }),
    },

    approveEmployee: {
      invalidatesTags: () => [Tag.EmployeeDto],
    },
    submitForApproval: {
      invalidatesTags: () => [Tag.EmployeeDto],
    },
    rejectEmployeeApprovalRequest: {
      invalidatesTags: () => [Tag.EmployeeDto],
    },
  },
});

export default enhancedApi;
