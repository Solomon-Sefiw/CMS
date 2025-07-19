
import { isRejected, MiddlewareAPI } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { addNotification } from "../../features/notification";
export const emptySplitApi = createApi({
  reducerPath: "HCMSApi",
  baseQuery: fetchBaseQuery({
   // baseUrl: "https://cms-api-cnxw.onrender.com",
    baseUrl: "https://cms-api.somee.com",
    //baseUrl: "http://localhost:5023", // ✅ Use your local API URL
         credentials: 'include', // ✅ include cookies if applicable
    prepareHeaders: (headers) => {
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      } else if (headers.get("Content-Type") === "multipart/form-data") {
        headers.delete("Content-Type");
      }

      return headers;
    },
  }),
  endpoints: () => ({}),
});

export const rtkQueryErrorHandler =
  (api: MiddlewareAPI) => (next: any) => (action: any) => {
    if (isRejected(action)) {
      if (action.payload?.status === 403) {
        api.dispatch(
          addNotification({
            message: "Permission Denied",
            type: "error",
          })
        );
      } else if (action.payload?.status === 500) {
        api.dispatch(
          addNotification({
            message: "Error occurred",
            type: "error",
          })
        );
      }
    }

    return next(action);
  };