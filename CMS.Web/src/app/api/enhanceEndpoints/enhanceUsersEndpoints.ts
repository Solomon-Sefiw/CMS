import { HCMSApi } from "../HCMSApi";
import { Tag } from "./tags";

const enhancedApi = HCMSApi.enhanceEndpoints({
  addTagTypes: [Tag.Users, Tag.UserDto, Tag.CurrentUser],
  endpoints: {
    currentUserInfo: {
      query: () => "/api/Users/current", // The API endpoint
      providesTags: () => [Tag.CurrentUser, Tag.Users], // Provides tags when data is fetched
    },
    addUserPhoto: {
      query: (queryArg) => {
        const formData = new FormData();
        formData.append("file", queryArg?.body.file as any);
        return {
          url: `/api/Users/${queryArg.id}/add-photo`,
          method: "POST",
          body: formData,
          headers: { "Content-type": "multipart/form-data" },
        };
      },

      invalidatesTags: (_result, _error, args) => [
        { type: Tag.Users, id: args.id },
        Tag.Users,
        Tag.UserDto,
      ],
    },

  },
});

export default enhancedApi;
