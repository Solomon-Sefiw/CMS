import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { EmployeeFileDocumentDto } from "../../../app/store";
export interface AuditEmployeeFileDocumentDto {
  entityName: string;
  actionType: string;
  performedBy: string;
  performedByUserId?: string;
  affectedFileName: string;
  affectedEmployeeId?: number;
  details: string;
  performedAt: string;
}

export const employeeFileApi = createApi({
  reducerPath: "employeeFileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/EmployeeFileDocuments",
  }),
  tagTypes: ["EmployeeFileDocuments"],
  endpoints: (build) => ({
    uploadEmployeeFileDocument: build.mutation<
      { documentId: string },
      FormData
    >({
      query: (formData) => ({
        url: "/UploadEmployeeFileDocument",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["EmployeeFileDocuments"],
    }),

    downloadEmployeeFileDocument: build.query<Blob, { id: string }>({
      query: ({ id }) => ({
        url: `/EmployeeFileDocuments/DownloadEmployeeFileDocument/${id}`,
        responseHandler: (response) => response.blob(),
        // required to return binary data
        cache: "no-cache",
      }),
    }),

    updateEmployeeFileDocument: build.mutation<unknown, FormData>({
      query: (formData) => ({
        url: "/updateEmployeeFileDocument",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["EmployeeFileDocuments"],
    }),

    getAuditEmployeeDocumentFileByEmployeeId: build.query<
      AuditEmployeeFileDocumentDto[],
      { employeeId: number }
    >({
      query: ({ employeeId }) => ({
        // full path because this is outside baseUrl
        url: `/api/AuditEmployeeFileDocument/getAuditEmployeeDocumentFileByEmployeeId/${employeeId}`,
        method: "GET",
      }),
      providesTags: ["EmployeeFileDocuments"],
    }),
    getEmployeeFileDocumentByEmployeeId: build.query<
      EmployeeFileDocumentDto[],
      { employeeId: number }
    >({
      query: ({ employeeId }) => ({
        url: `/api/EmployeeFileDocuments/getDocumentByEmployeeId/${employeeId}`,
        method: "GET",
      }),
      providesTags: ["EmployeeFileDocuments"],
    }),
  }),
});

export const {
  useUploadEmployeeFileDocumentMutation,
  useUpdateEmployeeFileDocumentMutation,
  useGetAuditEmployeeDocumentFileByEmployeeIdQuery,
  useGetEmployeeFileDocumentByEmployeeIdQuery,
  useDownloadEmployeeFileDocumentQuery,
} = employeeFileApi;
