import { HCMSApi } from "../HCMSApi";
import { Tag } from "./tags";

const enhancedApi = HCMSApi.enhanceEndpoints({
  addTagTypes: [Tag.EmployeeProfile, Tag.EmployeeDto, Tag.CurrentUser],
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
