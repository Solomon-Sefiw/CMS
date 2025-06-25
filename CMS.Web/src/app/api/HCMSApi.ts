import { emptySplitApi as api } from "./emptySplitApi";
export const addTagTypes = [
  "Account",
  "Address",
  "EmployeeProfile",
  "BusinessUnit",
  "Admin",
  "Contact",
  "Dashboard",
  "Documents",
  "Letter",
  "Lookup",
  "Region",
  "SubCity",
  "Users",
] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      activateUser: build.mutation<ActivateUserApiResponse, ActivateUserApiArg>(
        {
          query: (queryArg) => ({
            url: `/api/Account/activate-user`,
            method: "POST",
            body: queryArg.userEmail,
          }),
          invalidatesTags: ["Account"],
        }
      ),
      changePassword: build.mutation<
        ChangePasswordApiResponse,
        ChangePasswordApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Account/change-password`,
          method: "POST",
          body: queryArg.changePasswordPayload,
        }),
        invalidatesTags: ["Account"],
      }),
      deactivateUser: build.mutation<
        DeactivateUserApiResponse,
        DeactivateUserApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Account/deactivate-user`,
          method: "POST",
          body: queryArg.userEmail,
        }),
        invalidatesTags: ["Account"],
      }),
      forgotPassword: build.mutation<
        ForgotPasswordApiResponse,
        ForgotPasswordApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Account/forgot-password`,
          method: "POST",
          body: queryArg.forgotPasswordPayload,
        }),
        invalidatesTags: ["Account"],
      }),
      login: build.mutation<LoginApiResponse, LoginApiArg>({
        query: (queryArg) => ({
          url: `/api/Account/login`,
          method: "POST",
          body: queryArg.loginDto,
          params: { returnUrl: queryArg.returnUrl },
        }),
        invalidatesTags: ["Account"],
      }),
      logout: build.mutation<LogoutApiResponse, LogoutApiArg>({
        query: () => ({ url: `/api/Account/logout`, method: "POST" }),
        invalidatesTags: ["Account"],
      }),
      resetPassword: build.mutation<
        ResetPasswordApiResponse,
        ResetPasswordApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Account/reset-password`,
          method: "POST",
          body: queryArg.resetPasswordPayload,
        }),
        invalidatesTags: ["Account"],
      }),
      verificationCode: build.mutation<
        VerificationCodeApiResponse,
        VerificationCodeApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Account/verification-code`,
          method: "POST",
          body: queryArg.verificationCode,
        }),
        invalidatesTags: ["Account"],
      }),
      createAddress: build.mutation<
        CreateAddressApiResponse,
        CreateAddressApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Address/create`,
          method: "POST",
          body: queryArg.createAddressCommand,
        }),
        invalidatesTags: ["Address", "EmployeeProfile", "BusinessUnit"],
      }),
      getAddressByRequestId: build.query<
        GetAddressByRequestIdApiResponse,
        GetAddressByRequestIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Address/GetAddressbyId`,
          params: {
            requestId: queryArg.requestId,
            addressType: queryArg.addressType,
          },
        }),
        providesTags: ["Address"],
      }),
      getEmployeeFamilyAddressById: build.query<
        GetEmployeeFamilyAddressByIdApiResponse,
        GetEmployeeFamilyAddressByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Address/GetEmployeeFamilyAddressById`,
          params: { addressId: queryArg.addressId },
        }),
        providesTags: ["Address"],
      }),
      getGuaranterAddress: build.query<
        GetGuaranterAddressApiResponse,
        GetGuaranterAddressApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Address/GetGuaranterAddressQuery`,
          params: { employeeId: queryArg.employeeId },
        }),
        providesTags: ["Address"],
      }),
      updateAddressByRequestId: build.mutation<
        UpdateAddressByRequestIdApiResponse,
        UpdateAddressByRequestIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Address/update`,
          method: "PUT",
          body: queryArg.updateAddressCommand,
        }),
        invalidatesTags: ["Address"],
      }),
      createRole: build.mutation<CreateRoleApiResponse, CreateRoleApiArg>({
        query: (queryArg) => ({
          url: `/api/Admin/create-role`,
          method: "POST",
          body: queryArg.createRoleDto,
        }),
        invalidatesTags: ["Admin"],
      }),
      getPermissions: build.query<
        GetPermissionsApiResponse,
        GetPermissionsApiArg
      >({
        query: () => ({ url: `/api/Admin/permissions` }),
        providesTags: ["Admin"],
      }),
      registerUser: build.mutation<RegisterUserApiResponse, RegisterUserApiArg>(
        {
          query: (queryArg) => ({
            url: `/api/Admin/register-user`,
            method: "POST",
            body: queryArg.registerDto,
          }),
          invalidatesTags: ["Admin"],
        }
      ),
      getRoleClaim: build.query<GetRoleClaimApiResponse, GetRoleClaimApiArg>({
        query: () => ({ url: `/api/Admin/role-claims` }),
        providesTags: ["Admin"],
      }),
      getRoles: build.query<GetRolesApiResponse, GetRolesApiArg>({
        query: () => ({ url: `/api/Admin/roles` }),
        providesTags: ["Admin"],
      }),
      getRoleDetail: build.query<GetRoleDetailApiResponse, GetRoleDetailApiArg>(
        {
          query: (queryArg) => ({
            url: `/api/Admin/roles/:id`,
            params: { id: queryArg.id },
          }),
          providesTags: ["Admin"],
        }
      ),
      addRoleClaim: build.mutation<AddRoleClaimApiResponse, AddRoleClaimApiArg>(
        {
          query: (queryArg) => ({
            url: `/api/Admin/roles/:id/:claim`,
            method: "POST",
            params: { id: queryArg.id, claim: queryArg.claim },
          }),
          invalidatesTags: ["Admin"],
        }
      ),
      removeRoleClaim: build.mutation<
        RemoveRoleClaimApiResponse,
        RemoveRoleClaimApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Admin/roles/:id/:claim`,
          method: "DELETE",
          params: { id: queryArg.id, claim: queryArg.claim },
        }),
        invalidatesTags: ["Admin"],
      }),
      addClaims: build.mutation<AddClaimsApiResponse, AddClaimsApiArg>({
        query: (queryArg) => ({
          url: `/api/Admin/user/add-claims`,
          method: "POST",
          body: queryArg.body,
          params: { userId: queryArg.userId },
        }),
        invalidatesTags: ["Admin"],
      }),
      users: build.query<UsersApiResponse, UsersApiArg>({
        query: () => ({ url: `/api/Admin/users` }),
        providesTags: ["Admin"],
      }),
      getUserDetail: build.query<GetUserDetailApiResponse, GetUserDetailApiArg>(
        {
          query: (queryArg) => ({
            url: `/api/Admin/users/:id`,
            params: { id: queryArg.id },
          }),
          providesTags: ["Admin"],
        }
      ),
      addUserRole: build.mutation<AddUserRoleApiResponse, AddUserRoleApiArg>({
        query: (queryArg) => ({
          url: `/api/Admin/users/:id/:role`,
          method: "POST",
          params: { id: queryArg.id, role: queryArg.role },
        }),
        invalidatesTags: ["Admin"],
      }),
      removeUserRole: build.mutation<
        RemoveUserRoleApiResponse,
        RemoveUserRoleApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Admin/users/:id/:role`,
          method: "DELETE",
          params: { id: queryArg.id, role: queryArg.role },
        }),
        invalidatesTags: ["Admin"],
      }),
      activateBusinessUnit: build.mutation<
        ActivateBusinessUnitApiResponse,
        ActivateBusinessUnitApiArg
      >({
        query: (queryArg) => ({
          url: `/api/BusinessUnit/activate`,
          method: "PATCH",
          body: queryArg.activateBusinessUnitCommand,
        }),
        invalidatesTags: ["BusinessUnit"],
      }),
      getAllBusinessUnits: build.query<
        GetAllBusinessUnitsApiResponse,
        GetAllBusinessUnitsApiArg
      >({
        query: () => ({ url: `/api/BusinessUnit/all` }),
        providesTags: ["BusinessUnit"],
      }),
      getAllBuisnessUnitLists: build.query<
        GetAllBuisnessUnitListsApiResponse,
        GetAllBuisnessUnitListsApiArg
      >({
        query: (queryArg) => ({
          url: `/api/BusinessUnit/allBusinessUnit`,
          params: {
            status: queryArg.status,
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["BusinessUnit"],
      }),
      approveBusinessUnit: build.mutation<
        ApproveBusinessUnitApiResponse,
        ApproveBusinessUnitApiArg
      >({
        query: (queryArg) => ({
          url: `/api/BusinessUnit/approve`,
          method: "PATCH",
          body: queryArg.approveBusinessUnitCommand,
        }),
        invalidatesTags: ["BusinessUnit"],
      }),
      getBusinessUnitCountPerApprovalStatus: build.query<
        GetBusinessUnitCountPerApprovalStatusApiResponse,
        GetBusinessUnitCountPerApprovalStatusApiArg
      >({
        query: () => ({ url: `/api/BusinessUnit/counts` }),
        providesTags: ["BusinessUnit"],
      }),
      createBusinessUnit: build.mutation<
        CreateBusinessUnitApiResponse,
        CreateBusinessUnitApiArg
      >({
        query: (queryArg) => ({
          url: `/api/BusinessUnit/CreateBusinessUnit`,
          method: "POST",
          body: queryArg.createBusinessUnitCommand,
        }),
        invalidatesTags: ["BusinessUnit"],
      }),
      deactivateBusinessUnit: build.mutation<
        DeactivateBusinessUnitApiResponse,
        DeactivateBusinessUnitApiArg
      >({
        query: (queryArg) => ({
          url: `/api/BusinessUnit/deactivate`,
          method: "PATCH",
          body: queryArg.deActiveBusinessUnitCommand,
        }),
        invalidatesTags: ["BusinessUnit"],
      }),
      rejectBusinessUnit: build.mutation<
        RejectBusinessUnitApiResponse,
        RejectBusinessUnitApiArg
      >({
        query: (queryArg) => ({
          url: `/api/BusinessUnit/Reject`,
          method: "PATCH",
          body: queryArg.rejectBusinessUnitCommand,
        }),
        invalidatesTags: ["BusinessUnit"],
      }),
      searchAllBusinessUnits: build.query<
        SearchAllBusinessUnitsApiResponse,
        SearchAllBusinessUnitsApiArg
      >({
        query: () => ({ url: `/api/BusinessUnit/search` }),
        providesTags: ["BusinessUnit"],
      }),
      searchBusinessUnits: build.query<
        SearchBusinessUnitsApiResponse,
        SearchBusinessUnitsApiArg
      >({
        query: (queryArg) => ({
          url: `/api/BusinessUnit/SearchBusinessUnits`,
          params: { query: queryArg.query },
        }),
        providesTags: ["BusinessUnit"],
      }),
      submitBusinessUnit: build.mutation<
        SubmitBusinessUnitApiResponse,
        SubmitBusinessUnitApiArg
      >({
        query: (queryArg) => ({
          url: `/api/BusinessUnit/submit`,
          method: "PATCH",
          body: queryArg.submitBusinessUnitCommand,
        }),
        invalidatesTags: ["BusinessUnit"],
      }),
      updateBusinessUnit: build.mutation<
        UpdateBusinessUnitApiResponse,
        UpdateBusinessUnitApiArg
      >({
        query: (queryArg) => ({
          url: `/api/BusinessUnit/update`,
          method: "PUT",
          body: queryArg.updateBusinessUnitCommand,
        }),
        invalidatesTags: ["BusinessUnit"],
      }),
      getContactsById: build.query<
        GetContactsByIdApiResponse,
        GetContactsByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Contact/contacts`,
          params: {
            requestId: queryArg.requestId,
            contactCategory: queryArg.contactCategory,
          },
        }),
        providesTags: ["Contact"],
      }),
      createContact: build.mutation<
        CreateContactApiResponse,
        CreateContactApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Contact/Create`,
          method: "POST",
          body: queryArg.createContactCommand,
        }),
        invalidatesTags: ["Contact", "EmployeeProfile", "BusinessUnit"],
      }),
      getContactByRequestId: build.query<
        GetContactByRequestIdApiResponse,
        GetContactByRequestIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Contact/GetContactByRequestId`,
          params: {
            requestId: queryArg.requestId,
            contactCategory: queryArg.contactCategory,
            type: queryArg["type"],
          },
        }),
        providesTags: ["Contact"],
      }),
      getContactOfGuarater: build.query<
        GetContactOfGuaraterApiResponse,
        GetContactOfGuaraterApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Contact/GetContactOfGuarater`,
          params: { contactId: queryArg.contactId },
        }),
        providesTags: ["Contact"],
      }),
      getContactOfGuaraterWorkingFirm: build.query<
        GetContactOfGuaraterWorkingFirmApiResponse,
        GetContactOfGuaraterWorkingFirmApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Contact/GetContactOfGuaraterWorkingFirm`,
          params: { contactId: queryArg.contactId },
        }),
        providesTags: ["Contact"],
      }),
      getContactsByEntity: build.query<
        GetContactsByEntityApiResponse,
        GetContactsByEntityApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Contact/GetContactsByEntity`,
          params: { employeeId: queryArg.employeeId },
        }),
        providesTags: ["Contact"],
      }),
      getEmployeeFamilyContactById: build.query<
        GetEmployeeFamilyContactByIdApiResponse,
        GetEmployeeFamilyContactByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Contact/GetEmployeeFamilyContact`,
          params: {
            contactId: queryArg.contactId,
            contactCategory: queryArg.contactCategory,
          },
        }),
        providesTags: ["Contact"],
      }),
      updateContactByRequestId: build.mutation<
        UpdateContactByRequestIdApiResponse,
        UpdateContactByRequestIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Contact/update`,
          method: "PUT",
          body: queryArg.updateContactCommand,
        }),
        invalidatesTags: ["Contact", "EmployeeProfile", "BusinessUnit"],
      }),
      getLetterCountPerStatusForDashboard: build.query<
        GetLetterCountPerStatusForDashboardApiResponse,
        GetLetterCountPerStatusForDashboardApiArg
      >({
        query: () => ({ url: `/api/Dashboard/count` }),
        providesTags: ["Dashboard"],
      }),
      searchAllLettersForDashboard: build.query<
        SearchAllLettersForDashboardApiResponse,
        SearchAllLettersForDashboardApiArg
      >({
        query: () => ({ url: `/api/Dashboard/search-all` }),
        providesTags: ["Dashboard"],
      }),
      getApiDocumentsById: build.query<
        GetApiDocumentsByIdApiResponse,
        GetApiDocumentsByIdApiArg
      >({
        query: (queryArg) => ({ url: `/api/Documents/${queryArg.id}` }),
        providesTags: ["Documents"],
      }),
      downloadDocument: build.query<
        DownloadDocumentApiResponse,
        DownloadDocumentApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Documents/${queryArg.id}/download`,
        }),
        providesTags: ["Documents"],
      }),
      documentRootPath: build.query<
        DocumentRootPathApiResponse,
        DocumentRootPathApiArg
      >({
        query: () => ({ url: `/api/Documents/root-path` }),
        providesTags: ["Documents"],
      }),
      createLetter: build.mutation<CreateLetterApiResponse, CreateLetterApiArg>(
        {
          query: (queryArg) => ({
            url: `/api/Letter`,
            method: "POST",
            body: queryArg.createLetterCommand,
          }),
          invalidatesTags: ["Letter"],
        }
      ),
      updateLetter: build.mutation<UpdateLetterApiResponse, UpdateLetterApiArg>(
        {
          query: (queryArg) => ({
            url: `/api/Letter`,
            method: "PUT",
            body: queryArg.updateLetterCommand,
          }),
          invalidatesTags: ["Letter"],
        }
      ),
      approveLetter: build.mutation<
        ApproveLetterApiResponse,
        ApproveLetterApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Letter/approve`,
          method: "PATCH",
          body: queryArg.approveLetterCommand,
        }),
        invalidatesTags: ["Letter"],
      }),
      getLetterCountPerStatus: build.query<
        GetLetterCountPerStatusApiResponse,
        GetLetterCountPerStatusApiArg
      >({
        query: () => ({ url: `/api/Letter/count` }),
        providesTags: ["Letter"],
      }),
      getLettersForPagination: build.query<
        GetLettersForPaginationApiResponse,
        GetLettersForPaginationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Letter/GetLettersForPagination`,
          params: {
            status: queryArg.status,
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Letter"],
      }),
      rejectLetter: build.mutation<RejectLetterApiResponse, RejectLetterApiArg>(
        {
          query: (queryArg) => ({
            url: `/api/Letter/Reject`,
            method: "PATCH",
            body: queryArg.rejectBusinessUnitCommand,
          }),
          invalidatesTags: ["Letter"],
        }
      ),
      searchAllLetters: build.query<
        SearchAllLettersApiResponse,
        SearchAllLettersApiArg
      >({
        query: () => ({ url: `/api/Letter/search-all` }),
        providesTags: ["Letter"],
      }),
      submitLetter: build.mutation<SubmitLetterApiResponse, SubmitLetterApiArg>(
        {
          query: (queryArg) => ({
            url: `/api/Letter/submit`,
            method: "PATCH",
            body: queryArg.submitLetterCommand,
          }),
          invalidatesTags: ["Letter"],
        }
      ),
      getAllLookups: build.query<GetAllLookupsApiResponse, GetAllLookupsApiArg>(
        {
          query: () => ({ url: `/api/Lookup/all` }),
          providesTags: ["Lookup"],
        }
      ),
      approveRegion: build.mutation<
        ApproveRegionApiResponse,
        ApproveRegionApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Region/approve`,
          method: "PATCH",
          body: queryArg.approveRegionCommand,
        }),
        invalidatesTags: ["Region"],
      }),
      getRegionCountPerStatus: build.query<
        GetRegionCountPerStatusApiResponse,
        GetRegionCountPerStatusApiArg
      >({
        query: () => ({ url: `/api/Region/count` }),
        providesTags: ["Region"],
      }),
      createRegion: build.mutation<CreateRegionApiResponse, CreateRegionApiArg>(
        {
          query: (queryArg) => ({
            url: `/api/Region/Create`,
            method: "POST",
            body: queryArg.createRegionCommand,
          }),
          invalidatesTags: ["Region"],
        }
      ),
      getAllRegion: build.query<GetAllRegionApiResponse, GetAllRegionApiArg>({
        query: () => ({ url: `/api/Region/GetAll` }),
        providesTags: ["Region"],
      }),
      getRegionsForPagination: build.query<
        GetRegionsForPaginationApiResponse,
        GetRegionsForPaginationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Region/GetRegionsForPagination`,
          params: {
            status: queryArg.status,
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Region"],
      }),
      rejectRegion: build.mutation<RejectRegionApiResponse, RejectRegionApiArg>(
        {
          query: (queryArg) => ({
            url: `/api/Region/Reject`,
            method: "PATCH",
            body: queryArg.rejectRegionCommand,
          }),
          invalidatesTags: ["Region"],
        }
      ),
      searchAllRegions: build.query<
        SearchAllRegionsApiResponse,
        SearchAllRegionsApiArg
      >({
        query: () => ({ url: `/api/Region/search` }),
        providesTags: ["Region"],
      }),
      submitRegion: build.mutation<SubmitRegionApiResponse, SubmitRegionApiArg>(
        {
          query: (queryArg) => ({
            url: `/api/Region/submit`,
            method: "PATCH",
            body: queryArg.submitRegionCommand,
          }),
          invalidatesTags: ["Region"],
        }
      ),
      updateRegion: build.mutation<UpdateRegionApiResponse, UpdateRegionApiArg>(
        {
          query: (queryArg) => ({
            url: `/api/Region/Update`,
            method: "PUT",
            body: queryArg.updateRegionCommand,
          }),
          invalidatesTags: ["Region"],
        }
      ),
      approveSubCity: build.mutation<
        ApproveSubCityApiResponse,
        ApproveSubCityApiArg
      >({
        query: (queryArg) => ({
          url: `/api/SubCity/approve`,
          method: "PATCH",
          body: queryArg.approveSubCityCommand,
        }),
        invalidatesTags: ["SubCity"],
      }),
      getSubCityCountPerStatus: build.query<
        GetSubCityCountPerStatusApiResponse,
        GetSubCityCountPerStatusApiArg
      >({
        query: () => ({ url: `/api/SubCity/count` }),
        providesTags: ["SubCity"],
      }),
      createSubCity: build.mutation<
        CreateSubCityApiResponse,
        CreateSubCityApiArg
      >({
        query: (queryArg) => ({
          url: `/api/SubCity/Create`,
          method: "POST",
          body: queryArg.createSubCityCommand,
        }),
        invalidatesTags: ["SubCity"],
      }),
      getAllSubCity: build.query<GetAllSubCityApiResponse, GetAllSubCityApiArg>(
        {
          query: () => ({ url: `/api/SubCity/GetAll` }),
          providesTags: ["SubCity"],
        }
      ),
      getSubCitiesForPagination: build.query<
        GetSubCitiesForPaginationApiResponse,
        GetSubCitiesForPaginationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/SubCity/GetSubCitiesForPagination`,
          params: {
            status: queryArg.status,
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["SubCity"],
      }),
      rejectSubCity: build.mutation<
        RejectSubCityApiResponse,
        RejectSubCityApiArg
      >({
        query: (queryArg) => ({
          url: `/api/SubCity/Reject`,
          method: "PATCH",
          body: queryArg.rejectSubCityCommand,
        }),
        invalidatesTags: ["SubCity"],
      }),
      searchAllSubCities: build.query<
        SearchAllSubCitiesApiResponse,
        SearchAllSubCitiesApiArg
      >({
        query: () => ({ url: `/api/SubCity/search` }),
        providesTags: ["SubCity"],
      }),
      submitSubCity: build.mutation<
        SubmitSubCityApiResponse,
        SubmitSubCityApiArg
      >({
        query: (queryArg) => ({
          url: `/api/SubCity/submit`,
          method: "PATCH",
          body: queryArg.submitSubCityCommand,
        }),
        invalidatesTags: ["SubCity"],
      }),
      updateSubCity: build.mutation<
        UpdateSubCityApiResponse,
        UpdateSubCityApiArg
      >({
        query: (queryArg) => ({
          url: `/api/SubCity/Update`,
          method: "PUT",
          body: queryArg.updateSubCityCommand,
        }),
        invalidatesTags: ["SubCity"],
      }),
      currentUserInfo: build.query<
        CurrentUserInfoApiResponse,
        CurrentUserInfoApiArg
      >({
        query: () => ({ url: `/api/Users/current` }),
        providesTags: ["Users"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as HCMSApi };
export type ActivateUserApiResponse = /** status 200 Success */ void;
export type ActivateUserApiArg = {
  userEmail: UserEmail;
};
export type ChangePasswordApiResponse = /** status 200 Success */ void;
export type ChangePasswordApiArg = {
  changePasswordPayload: ChangePasswordPayload;
};
export type DeactivateUserApiResponse = /** status 200 Success */ void;
export type DeactivateUserApiArg = {
  userEmail: UserEmail;
};
export type ForgotPasswordApiResponse = /** status 200 Success */ void;
export type ForgotPasswordApiArg = {
  forgotPasswordPayload: ForgotPasswordPayload;
};
export type LoginApiResponse = /** status 200 Success */ LoginRes;
export type LoginApiArg = {
  returnUrl?: string;
  loginDto: LoginDto;
};
export type LogoutApiResponse = unknown;
export type LogoutApiArg = void;
export type ResetPasswordApiResponse = /** status 200 Success */ void;
export type ResetPasswordApiArg = {
  resetPasswordPayload: ResetPasswordPayload;
};
export type VerificationCodeApiResponse = /** status 200 Success */ void;
export type VerificationCodeApiArg = {
  verificationCode: VerificationCode;
};
export type CreateAddressApiResponse = /** status 200 Success */ number;
export type CreateAddressApiArg = {
  createAddressCommand: CreateAddressCommand;
};
export type GetAddressByRequestIdApiResponse =
  /** status 200 Success */ AddressDto;
export type GetAddressByRequestIdApiArg = {
  requestId?: number;
  addressType?: AddressTypeEnum;
};
export type GetEmployeeFamilyAddressByIdApiResponse =
  /** status 200 Success */ AddressDto[];
export type GetEmployeeFamilyAddressByIdApiArg = {
  addressId?: number;
};
export type GetGuaranterAddressApiResponse =
  /** status 200 Success */ AddressDto[];
export type GetGuaranterAddressApiArg = {
  employeeId?: number;
};
export type UpdateAddressByRequestIdApiResponse =
  /** status 200 Success */ number;
export type UpdateAddressByRequestIdApiArg = {
  updateAddressCommand: UpdateAddressCommand;
};
export type CreateRoleApiResponse = /** status 200 Success */
  | HrRole
  | /** status 201 Created */ HrRole;
export type CreateRoleApiArg = {
  createRoleDto: CreateRoleDto;
};
export type GetPermissionsApiResponse =
  /** status 200 Success */ PermissionClaim[];
export type GetPermissionsApiArg = void;
export type RegisterUserApiResponse = /** status 200 Success */ HrUserRead;
export type RegisterUserApiArg = {
  registerDto: RegisterDto;
};
export type GetRoleClaimApiResponse =
  /** status 200 Success */ RoleWithClaimsDto[];
export type GetRoleClaimApiArg = void;
export type GetRolesApiResponse = /** status 200 Success */ ApplicationRole[];
export type GetRolesApiArg = void;
export type GetRoleDetailApiResponse = /** status 200 Success */ RoleDetail;
export type GetRoleDetailApiArg = {
  id?: string;
};
export type AddRoleClaimApiResponse = /** status 200 Success */ RoleDetail;
export type AddRoleClaimApiArg = {
  id?: string;
  claim?: string;
};
export type RemoveRoleClaimApiResponse = /** status 200 Success */ RoleDetail;
export type RemoveRoleClaimApiArg = {
  id?: string;
  claim?: string;
};
export type AddClaimsApiResponse = /** status 200 Success */ UserDtoRead;
export type AddClaimsApiArg = {
  userId?: string;
  body: {
    [key: string]: string;
  };
};
export type UsersApiResponse = /** status 200 Success */ UserDetail[];
export type UsersApiArg = void;
export type GetUserDetailApiResponse = /** status 200 Success */ UserDetail;
export type GetUserDetailApiArg = {
  id?: string;
};
export type AddUserRoleApiResponse = /** status 200 Success */ UserDetail;
export type AddUserRoleApiArg = {
  id?: string;
  role?: string;
};
export type RemoveUserRoleApiResponse = /** status 200 Success */ UserDetail;
export type RemoveUserRoleApiArg = {
  id?: string;
  role?: string;
};
export type ActivateBusinessUnitApiResponse = /** status 200 Success */ number;
export type ActivateBusinessUnitApiArg = {
  activateBusinessUnitCommand: ActivateBusinessUnitCommand;
};
export type GetAllBusinessUnitsApiResponse =
  /** status 200 Success */ BusinessUnitLists;
export type GetAllBusinessUnitsApiArg = void;
export type GetAllBuisnessUnitListsApiResponse =
  /** status 200 Success */ BusinessUnitSearchResult;
export type GetAllBuisnessUnitListsApiArg = {
  status?: ApprovalStatus;
  pageNumber?: number;
  pageSize?: number;
};
export type ApproveBusinessUnitApiResponse = /** status 200 Success */ number;
export type ApproveBusinessUnitApiArg = {
  approveBusinessUnitCommand: ApproveBusinessUnitCommand;
};
export type GetBusinessUnitCountPerApprovalStatusApiResponse =
  /** status 200 Success */ BusinessUnitCountsByStatus;
export type GetBusinessUnitCountPerApprovalStatusApiArg = void;
export type CreateBusinessUnitApiResponse = /** status 200 Success */ number;
export type CreateBusinessUnitApiArg = {
  createBusinessUnitCommand: CreateBusinessUnitCommand;
};
export type DeactivateBusinessUnitApiResponse =
  /** status 200 Success */ number;
export type DeactivateBusinessUnitApiArg = {
  deActiveBusinessUnitCommand: DeActiveBusinessUnitCommand;
};
export type RejectBusinessUnitApiResponse = /** status 200 Success */ number;
export type RejectBusinessUnitApiArg = {
  rejectBusinessUnitCommand: RejectBusinessUnitCommand;
};
export type SearchAllBusinessUnitsApiResponse =
  /** status 200 Success */ BusinessUnitDto[];
export type SearchAllBusinessUnitsApiArg = void;
export type SearchBusinessUnitsApiResponse =
  /** status 200 Success */ BusinessUnitDto[];
export type SearchBusinessUnitsApiArg = {
  query?: string;
};
export type SubmitBusinessUnitApiResponse = /** status 200 Success */ number;
export type SubmitBusinessUnitApiArg = {
  submitBusinessUnitCommand: SubmitBusinessUnitCommand;
};
export type UpdateBusinessUnitApiResponse = /** status 200 Success */ number;
export type UpdateBusinessUnitApiArg = {
  updateBusinessUnitCommand: UpdateBusinessUnitCommand;
};
export type GetContactsByIdApiResponse = unknown;
export type GetContactsByIdApiArg = {
  requestId?: number;
  contactCategory?: ContactCategoryEnum;
};
export type CreateContactApiResponse = /** status 200 Success */ number;
export type CreateContactApiArg = {
  createContactCommand: CreateContactCommand;
};
export type GetContactByRequestIdApiResponse =
  /** status 200 Success */ ContactDto;
export type GetContactByRequestIdApiArg = {
  requestId?: number;
  contactCategory?: ContactCategoryEnum;
  type?: ContactTypeEnum;
};
export type GetContactOfGuaraterApiResponse =
  /** status 200 Success */ ContactDto[];
export type GetContactOfGuaraterApiArg = {
  contactId?: number;
};
export type GetContactOfGuaraterWorkingFirmApiResponse =
  /** status 200 Success */ ContactDto[];
export type GetContactOfGuaraterWorkingFirmApiArg = {
  contactId?: number;
};
export type GetContactsByEntityApiResponse =
  /** status 200 Success */ ContactDto[];
export type GetContactsByEntityApiArg = {
  employeeId?: number;
};
export type GetEmployeeFamilyContactByIdApiResponse =
  /** status 200 Success */ ContactDto;
export type GetEmployeeFamilyContactByIdApiArg = {
  contactId?: number;
  contactCategory?: ContactCategoryEnum;
};
export type UpdateContactByRequestIdApiResponse =
  /** status 200 Success */ number;
export type UpdateContactByRequestIdApiArg = {
  updateContactCommand: UpdateContactCommand;
};
export type GetLetterCountPerStatusForDashboardApiResponse =
  /** status 200 Success */ LetterCountsByStatus;
export type GetLetterCountPerStatusForDashboardApiArg = void;
export type SearchAllLettersForDashboardApiResponse =
  /** status 200 Success */ LetterDtoRead[];
export type SearchAllLettersForDashboardApiArg = void;
export type GetApiDocumentsByIdApiResponse = /** status 200 Success */ Blob;
export type GetApiDocumentsByIdApiArg = {
  id: string;
};
export type DownloadDocumentApiResponse = /** status 200 Success */ Blob;
export type DownloadDocumentApiArg = {
  id: string;
};
export type DocumentRootPathApiResponse =
  /** status 200 Success */ DocumentEndpointRootPath;
export type DocumentRootPathApiArg = void;
export type CreateLetterApiResponse = /** status 200 Success */ number;
export type CreateLetterApiArg = {
  createLetterCommand: CreateLetterCommand;
};
export type UpdateLetterApiResponse = unknown;
export type UpdateLetterApiArg = {
  updateLetterCommand: UpdateLetterCommand;
};
export type ApproveLetterApiResponse = /** status 200 Success */ number;
export type ApproveLetterApiArg = {
  approveLetterCommand: ApproveLetterCommand;
};
export type GetLetterCountPerStatusApiResponse =
  /** status 200 Success */ LetterCountsByStatus;
export type GetLetterCountPerStatusApiArg = void;
export type GetLettersForPaginationApiResponse =
  /** status 200 Success */ PaginatedLetterListRead;
export type GetLettersForPaginationApiArg = {
  status?: LetterStatus;
  pageNumber?: number;
  pageSize?: number;
};
export type RejectLetterApiResponse = /** status 200 Success */ number;
export type RejectLetterApiArg = {
  rejectBusinessUnitCommand: RejectBusinessUnitCommand;
};
export type SearchAllLettersApiResponse =
  /** status 200 Success */ LetterDtoRead[];
export type SearchAllLettersApiArg = void;
export type SubmitLetterApiResponse = /** status 200 Success */ number;
export type SubmitLetterApiArg = {
  submitLetterCommand: SubmitLetterCommand;
};
export type GetAllLookupsApiResponse = /** status 200 Success */ LookupDto;
export type GetAllLookupsApiArg = void;
export type ApproveRegionApiResponse = /** status 200 Success */ number;
export type ApproveRegionApiArg = {
  approveRegionCommand: ApproveRegionCommand;
};
export type GetRegionCountPerStatusApiResponse =
  /** status 200 Success */ RegionCountsByStatus;
export type GetRegionCountPerStatusApiArg = void;
export type CreateRegionApiResponse = /** status 200 Success */ number;
export type CreateRegionApiArg = {
  createRegionCommand: CreateRegionCommand;
};
export type GetAllRegionApiResponse = /** status 200 Success */ RegionLists;
export type GetAllRegionApiArg = void;
export type GetRegionsForPaginationApiResponse =
  /** status 200 Success */ PaginatedRegionList;
export type GetRegionsForPaginationApiArg = {
  status?: ApprovalStatus;
  pageNumber?: number;
  pageSize?: number;
};
export type RejectRegionApiResponse = /** status 200 Success */ number;
export type RejectRegionApiArg = {
  rejectRegionCommand: RejectRegionCommand;
};
export type SearchAllRegionsApiResponse = /** status 200 Success */ RegionDto[];
export type SearchAllRegionsApiArg = void;
export type SubmitRegionApiResponse = /** status 200 Success */ number;
export type SubmitRegionApiArg = {
  submitRegionCommand: SubmitRegionCommand;
};
export type UpdateRegionApiResponse = /** status 200 Success */ number;
export type UpdateRegionApiArg = {
  updateRegionCommand: UpdateRegionCommand;
};
export type ApproveSubCityApiResponse = /** status 200 Success */ number;
export type ApproveSubCityApiArg = {
  approveSubCityCommand: ApproveSubCityCommand;
};
export type GetSubCityCountPerStatusApiResponse =
  /** status 200 Success */ SubCityCountsByStatus;
export type GetSubCityCountPerStatusApiArg = void;
export type CreateSubCityApiResponse = /** status 200 Success */ number;
export type CreateSubCityApiArg = {
  createSubCityCommand: CreateSubCityCommand;
};
export type GetAllSubCityApiResponse = /** status 200 Success */ SubCityLists;
export type GetAllSubCityApiArg = void;
export type GetSubCitiesForPaginationApiResponse =
  /** status 200 Success */ PaginatedSubCityList;
export type GetSubCitiesForPaginationApiArg = {
  status?: ApprovalStatus;
  pageNumber?: number;
  pageSize?: number;
};
export type RejectSubCityApiResponse = /** status 200 Success */ number;
export type RejectSubCityApiArg = {
  rejectSubCityCommand: RejectSubCityCommand;
};
export type SearchAllSubCitiesApiResponse =
  /** status 200 Success */ SubCityDto[];
export type SearchAllSubCitiesApiArg = void;
export type SubmitSubCityApiResponse = /** status 200 Success */ number;
export type SubmitSubCityApiArg = {
  submitSubCityCommand: SubmitSubCityCommand;
};
export type UpdateSubCityApiResponse = /** status 200 Success */ number;
export type UpdateSubCityApiArg = {
  updateSubCityCommand: UpdateSubCityCommand;
};
export type CurrentUserInfoApiResponse = /** status 200 Success */ UserDtoRead;
export type CurrentUserInfoApiArg = void;
export type ProblemDetails = {
  type?: string | null;
  title?: string | null;
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
  [key: string]: any;
};
export type UserEmail = {
  email?: string | null;
};
export type ChangePasswordPayload = {
  currentPassword?: string | null;
  newPassword?: string | null;
};
export type ForgotPasswordPayload = {
  email?: string | null;
};
export type LoginRes = {
  isSuccess?: boolean;
  needVerification?: boolean | null;
  isLockedOut?: boolean | null;
};
export type LoginDto = {
  email?: string | null;
  password?: string | null;
};
export type ResetPasswordPayload = {
  password?: string | null;
  email?: string | null;
  token?: string | null;
};
export type VerificationCode = {
  code?: string | null;
};
export type AddressTypeEnum = 1 | 2;
export type CountryEnum = 1;
export type CreateAddressCommand = {
  addressType?: AddressTypeEnum;
  country?: CountryEnum;
  regionId?: number | null;
  subCityId?: number | null;
  woreda?: string | null;
  city?: string | null;
  kebele?: string | null;
  houseNumber?: string | null;
  requestId?: number;
};
export type AddressDto = {
  id?: number;
  addressType?: AddressTypeEnum;
  country?: CountryEnum;
  regionId?: number | null;
  regionName?: string | null;
  subCityId?: number | null;
  subCityName?: string | null;
  woreda?: string | null;
  city?: string | null;
  kebele?: string | null;
  houseNumber?: string | null;
  requestId?: number;
  registeredOn?: string;
};
export type UpdateAddressCommand = {
  id?: number;
  addressType?: AddressTypeEnum;
  country?: CountryEnum;
  regionId?: number | null;
  subCityId?: number | null;
  woreda?: string | null;
  city?: string | null;
  kebele?: string | null;
  houseNumber?: string | null;
  requestId?: number;
};
export type StringIdentityRoleClaim = {
  id?: number;
  roleId?: string | null;
  claimType?: string | null;
  claimValue?: string | null;
};
export type HrRole = {
  id?: string | null;
  name?: string | null;
  normalizedName?: string | null;
  concurrencyStamp?: string | null;
  description?: string | null;
  displayName?: string | null;
  claims?: StringIdentityRoleClaim[] | null;
};
export type CreateRoleDto = {
  role?: HrRole;
  permissionNames?: string[] | null;
};
export type ClaimCategory = 1 | 2 | 3 | 4;
export type PermissionClaim = {
  id?: string;
  claimValue?: string | null;
  claimCategory?: ClaimCategory;
};
export type UserRole = {
  userId?: string | null;
  roleId?: string | null;
  role?: HrRole;
  user?: HrUser;
};
export type UserRoleRead = {
  userId?: string | null;
  roleId?: string | null;
  role?: HrRole;
  user?: HrUser;
};
export type ApprovalStatus = 1 | 2 | 3 | 4;
export type LetterType = 1 | 2 | 3;
export type LetterStatus = 1 | 2 | 3 | 4;
export type BusinessUnitTypeEnum = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type Status = 1 | 2;
export type BusinessUnitType = {
  value?: BusinessUnitTypeEnum;
  name?: string | null;
  description?: string | null;
  numberOfDigits?: number;
  order?: number;
  isActive?: boolean;
};
export type BusinessUnit = {
  id?: number;
  businessUnitID?: string | null;
  name?: string | null;
  parentId?: number;
  type?: BusinessUnitTypeEnum;
  businessUnitCode?: string | null;
  staffStrength?: number | null;
  approvalStatus?: ApprovalStatus;
  status?: Status;
  businessUnitType?: BusinessUnitType;
};
export type DocumentType = 1 | 2 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
export type EmployeeDocument = {
  isDeleted?: boolean | null;
  deletedBy?: string | null;
  deletedAt?: string | null;
  deletionComment?: string | null;
  id?: number;
  employeeId?: number;
  documentType?: DocumentType;
  documentId?: string | null;
  fileName?: string | null;
};
export type Letter = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  approvalStatus?: ApprovalStatus;
  approvedBy?: string | null;
  approvedAt?: string | null;
  submittedBy?: string | null;
  submittedAt?: string | null;
  rejectedBy?: string | null;
  rejectedAt?: string | null;
  workflowComment?: string | null;
  versionNumber?: string;
  skipStateTransitionCheck?: boolean;
  id?: number;
  referenceNumber?: string | null;
  subject?: string | null;
  content?: string | null;
  letterType?: LetterType;
  status?: LetterStatus;
  receivedDate?: string | null;
  sentDate?: string | null;
  senderId?: string | null;
  sender?: HrUser;
  recipientId?: string | null;
  recipient?: HrUser;
  businessUnitId?: number;
  businessUnits?: BusinessUnit;
  employeeDocuments?: EmployeeDocument[] | null;
};
export type IDomainEvent = object;
export type LetterRead = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  approvalStatus?: ApprovalStatus;
  approvedBy?: string | null;
  approvedAt?: string | null;
  submittedBy?: string | null;
  submittedAt?: string | null;
  rejectedBy?: string | null;
  rejectedAt?: string | null;
  workflowComment?: string | null;
  versionNumber?: string;
  skipStateTransitionCheck?: boolean;
  domainEvents?: IDomainEvent[] | null;
  id?: number;
  referenceNumber?: string | null;
  subject?: string | null;
  content?: string | null;
  letterType?: LetterType;
  status?: LetterStatus;
  receivedDate?: string | null;
  sentDate?: string | null;
  senderId?: string | null;
  sender?: HrUser;
  recipientId?: string | null;
  recipient?: HrUser;
  businessUnitId?: number;
  businessUnits?: BusinessUnit;
  employeeDocuments?: EmployeeDocument[] | null;
};
export type HrUser = {
  id?: string | null;
  userName?: string | null;
  normalizedUserName?: string | null;
  email?: string | null;
  normalizedEmail?: string | null;
  emailConfirmed?: boolean;
  passwordHash?: string | null;
  securityStamp?: string | null;
  concurrencyStamp?: string | null;
  phoneNumber?: string | null;
  phoneNumberConfirmed?: boolean;
  twoFactorEnabled?: boolean;
  lockoutEnd?: string | null;
  lockoutEnabled?: boolean;
  accessFailedCount?: number;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  branchId?: number;
  isDeactivated?: boolean;
  roles?: UserRole[] | null;
  sentLetters?: Letter[] | null;
  receivedLetters?: Letter[] | null;
};
export type HrUserRead = {
  id?: string | null;
  userName?: string | null;
  normalizedUserName?: string | null;
  email?: string | null;
  normalizedEmail?: string | null;
  emailConfirmed?: boolean;
  passwordHash?: string | null;
  securityStamp?: string | null;
  concurrencyStamp?: string | null;
  phoneNumber?: string | null;
  phoneNumberConfirmed?: boolean;
  twoFactorEnabled?: boolean;
  lockoutEnd?: string | null;
  lockoutEnabled?: boolean;
  accessFailedCount?: number;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  branchId?: number;
  isDeactivated?: boolean;
  roles?: UserRoleRead[] | null;
  sentLetters?: LetterRead[] | null;
  receivedLetters?: LetterRead[] | null;
};
export type RegisterDto = {
  email?: string | null;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  branchId?: number;
  roles?: string[] | null;
};
export type Claim = {
  claimType?: string | null;
  claimValue?: string | null;
  claimCategory?: ClaimCategory;
};
export type RoleWithClaimsDto = {
  roleId?: string | null;
  roleName?: string | null;
  claims?: Claim[] | null;
};
export type ApplicationRole = {
  id?: string | null;
  name?: string | null;
  displayName?: string | null;
  description?: string | null;
  claims?: StringIdentityRoleClaim[] | null;
};
export type RoleDetail = {
  id?: string | null;
  description?: string | null;
  displayName?: string | null;
  name?: string | null;
  permissionClaims?: PermissionClaim[] | null;
  isDeactivated?: boolean;
};
export type Permission = {
  name?: string | null;
  hasPermission?: boolean;
};
export type UserDto = {
  id?: string | null;
  email?: string | null;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  branchId?: number;
  roles?: string[] | null;
  permissions?: Permission[] | null;
};
export type UserDtoRead = {
  id?: string | null;
  email?: string | null;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  branchId?: number;
  roles?: string[] | null;
  permissions?: Permission[] | null;
  fullName?: string | null;
};
export type Role = {
  id?: string | null;
  name?: string | null;
  displayName?: string | null;
  description?: string | null;
};
export type UserDetail = {
  id?: string | null;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  email?: string | null;
  branchId?: number;
  accessFailedCount?: number;
  roles?: Role[] | null;
  claims?: Claim[] | null;
  isDeactivated?: boolean;
};
export type ActivateBusinessUnitCommand = {
  id?: number;
};
export type SubCity = {
  id?: number;
  name?: string | null;
  description?: string | null;
  regionId?: number;
  region?: Region;
  approvalStatus?: ApprovalStatus;
};
export type Region = {
  id?: number;
  name?: string | null;
  description?: string | null;
  subCities?: SubCity[] | null;
  approvalStatus?: ApprovalStatus;
};
export type Address = {
  id?: number;
  addressType?: AddressTypeEnum;
  country?: CountryEnum;
  regionId?: number | null;
  region?: Region;
  subCityId?: number | null;
  subCity?: SubCity;
  city?: string | null;
  woreda?: string | null;
  kebele?: string | null;
  houseNumber?: string | null;
  requestId?: number;
  registeredOn?: string;
};
export type BusinessUnitDto = {
  id?: number;
  businessUnitID?: string | null;
  name?: string | null;
  parentBusinessUnitName?: string | null;
  parentId?: number;
  businessUnitTypeName?: string | null;
  type?: BusinessUnitTypeEnum;
  businessUnitCode?: string | null;
  staffStrength?: number | null;
  approvalStatus?: ApprovalStatus;
  status?: Status;
  address?: Address;
};
export type BusinessUnitLists = {
  approved?: BusinessUnitDto[] | null;
  submitted?: BusinessUnitDto[] | null;
  rejected?: BusinessUnitDto[] | null;
  draft?: BusinessUnitDto[] | null;
};
export type BusinessUnitSearchResult = {
  items?: BusinessUnitDto[] | null;
  totalCount?: number;
};
export type ApproveBusinessUnitCommand = {
  id?: number;
};
export type BusinessUnitCountsByStatus = {
  approved?: number;
  approvalRequests?: number;
  rejected?: number;
  drafts?: number;
};
export type CreateBusinessUnitCommand = {
  name?: string | null;
  parentId?: number;
  type?: BusinessUnitTypeEnum;
  staffStrength?: number | null;
};
export type DeActiveBusinessUnitCommand = {
  id?: number;
};
export type RejectBusinessUnitCommand = {
  id?: number;
};
export type SubmitBusinessUnitCommand = {
  id?: number;
};
export type UpdateBusinessUnitCommand = {
  id?: number;
  name?: string | null;
  parentId?: number;
  type?: BusinessUnitTypeEnum;
  staffStrength?: number | null;
  branchGradeId?: number | null;
};
export type ContactCategoryEnum = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type ContactTypeEnum = 1 | 2 | 3 | 4 | 5 | 6;
export type CreateContactCommand = {
  type?: ContactTypeEnum;
  value?: string | null;
  contactCategory?: ContactCategoryEnum;
  requestId?: number;
};
export type ContactDto = {
  id?: number;
  type?: ContactTypeEnum;
  value?: string | null;
  contactCategory?: ContactCategoryEnum;
  requestId?: number;
};
export type UpdateContactCommand = {
  id?: number;
  type?: ContactTypeEnum;
  value?: string | null;
  contactCategory?: ContactCategoryEnum;
  requestId?: number;
};
export type LetterCountsByStatus = {
  pending?: number;
  received?: number;
  responded?: number;
  archived?: number;
};
export type LetterDto = {
  id?: number;
  referenceNumber?: string | null;
  subject?: string | null;
  content?: string | null;
  letterType?: LetterType;
  status?: LetterStatus;
  receivedDate?: string | null;
  sentDate?: string | null;
  senderId?: string | null;
  sender?: HrUser;
  recipientId?: string | null;
  recipient?: HrUser;
  businessUnitId?: number;
  businessUnits?: BusinessUnit;
};
export type LetterDtoRead = {
  id?: number;
  referenceNumber?: string | null;
  subject?: string | null;
  content?: string | null;
  letterType?: LetterType;
  status?: LetterStatus;
  receivedDate?: string | null;
  sentDate?: string | null;
  senderId?: string | null;
  sender?: HrUserRead;
  recipientId?: string | null;
  recipient?: HrUserRead;
  businessUnitId?: number;
  businessUnits?: BusinessUnit;
};
export type DocumentEndpointRootPath = {
  path?: string | null;
};
export type CreateLetterCommand = {
  referenceNumber?: string | null;
  subject?: string | null;
  content?: string | null;
  letterType?: LetterType;
  senderId?: string | null;
  recipientId?: string | null;
  businessUnitId?: number;
};
export type UpdateLetterCommand = {
  id?: number;
  referenceNumber?: string | null;
  subject?: string | null;
  content?: string | null;
  letterType?: LetterType;
  status?: LetterStatus;
  receivedDate?: string | null;
  sentDate?: string | null;
  senderId?: string | null;
  recipientId?: string | null;
  businessUnitId?: number;
};
export type ApproveLetterCommand = {
  id?: number;
};
export type PaginatedLetterList = {
  items?: LetterDto[] | null;
  totalCount?: number;
};
export type PaginatedLetterListRead = {
  items?: LetterDtoRead[] | null;
  totalCount?: number;
};
export type SubmitLetterCommand = {
  id?: number;
};
export type LookupDto = {
  businessUnits?: BusinessUnitLists;
  businessUnitTypes?: BusinessUnitType[] | null;
};
export type ApproveRegionCommand = {
  id?: number;
};
export type RegionCountsByStatus = {
  approved?: number;
  submitted?: number;
  rejected?: number;
  draft?: number;
};
export type CreateRegionCommand = {
  name?: string | null;
  description?: string | null;
};
export type RegionDto = {
  id?: number;
  name?: string | null;
  description?: string | null;
  approvalStatus?: ApprovalStatus;
};
export type RegionLists = {
  approved?: RegionDto[] | null;
  submitted?: RegionDto[] | null;
  rejected?: RegionDto[] | null;
  draft?: RegionDto[] | null;
};
export type PaginatedRegionList = {
  items?: RegionDto[] | null;
  totalCount?: number;
};
export type RejectRegionCommand = {
  id?: number;
};
export type SubmitRegionCommand = {
  id?: number;
};
export type UpdateRegionCommand = {
  id?: number;
  name?: string | null;
  description?: string | null;
};
export type ApproveSubCityCommand = {
  id?: number;
};
export type SubCityCountsByStatus = {
  approved?: number;
  submitted?: number;
  rejected?: number;
  draft?: number;
};
export type CreateSubCityCommand = {
  name?: string | null;
  description?: string | null;
  regionId?: number;
};
export type SubCityDto = {
  id?: number;
  name?: string | null;
  description?: string | null;
  regionId?: number;
  regionName?: string | null;
  approvalStatus?: ApprovalStatus;
};
export type SubCityLists = {
  approved?: SubCityDto[] | null;
  submitted?: SubCityDto[] | null;
  rejected?: SubCityDto[] | null;
  draft?: SubCityDto[] | null;
};
export type PaginatedSubCityList = {
  items?: SubCityDto[] | null;
  totalCount?: number;
};
export type RejectSubCityCommand = {
  id?: number;
};
export type SubmitSubCityCommand = {
  id?: number;
};
export type UpdateSubCityCommand = {
  id?: number;
  name?: string | null;
  description?: string | null;
  regionId?: number;
  approvalStatus?: ApprovalStatus;
};
export const {
  useActivateUserMutation,
  useChangePasswordMutation,
  useDeactivateUserMutation,
  useForgotPasswordMutation,
  useLoginMutation,
  useLogoutMutation,
  useResetPasswordMutation,
  useVerificationCodeMutation,
  useCreateAddressMutation,
  useGetAddressByRequestIdQuery,
  useLazyGetAddressByRequestIdQuery,
  useGetEmployeeFamilyAddressByIdQuery,
  useLazyGetEmployeeFamilyAddressByIdQuery,
  useGetGuaranterAddressQuery,
  useLazyGetGuaranterAddressQuery,
  useUpdateAddressByRequestIdMutation,
  useCreateRoleMutation,
  useGetPermissionsQuery,
  useLazyGetPermissionsQuery,
  useRegisterUserMutation,
  useGetRoleClaimQuery,
  useLazyGetRoleClaimQuery,
  useGetRolesQuery,
  useLazyGetRolesQuery,
  useGetRoleDetailQuery,
  useLazyGetRoleDetailQuery,
  useAddRoleClaimMutation,
  useRemoveRoleClaimMutation,
  useAddClaimsMutation,
  useUsersQuery,
  useLazyUsersQuery,
  useGetUserDetailQuery,
  useLazyGetUserDetailQuery,
  useAddUserRoleMutation,
  useRemoveUserRoleMutation,
  useActivateBusinessUnitMutation,
  useGetAllBusinessUnitsQuery,
  useLazyGetAllBusinessUnitsQuery,
  useGetAllBuisnessUnitListsQuery,
  useLazyGetAllBuisnessUnitListsQuery,
  useApproveBusinessUnitMutation,
  useGetBusinessUnitCountPerApprovalStatusQuery,
  useLazyGetBusinessUnitCountPerApprovalStatusQuery,
  useCreateBusinessUnitMutation,
  useDeactivateBusinessUnitMutation,
  useRejectBusinessUnitMutation,
  useSearchAllBusinessUnitsQuery,
  useLazySearchAllBusinessUnitsQuery,
  useSearchBusinessUnitsQuery,
  useLazySearchBusinessUnitsQuery,
  useSubmitBusinessUnitMutation,
  useUpdateBusinessUnitMutation,
  useGetContactsByIdQuery,
  useLazyGetContactsByIdQuery,
  useCreateContactMutation,
  useGetContactByRequestIdQuery,
  useLazyGetContactByRequestIdQuery,
  useGetContactOfGuaraterQuery,
  useLazyGetContactOfGuaraterQuery,
  useGetContactOfGuaraterWorkingFirmQuery,
  useLazyGetContactOfGuaraterWorkingFirmQuery,
  useGetContactsByEntityQuery,
  useLazyGetContactsByEntityQuery,
  useGetEmployeeFamilyContactByIdQuery,
  useLazyGetEmployeeFamilyContactByIdQuery,
  useUpdateContactByRequestIdMutation,
  useGetLetterCountPerStatusForDashboardQuery,
  useLazyGetLetterCountPerStatusForDashboardQuery,
  useSearchAllLettersForDashboardQuery,
  useLazySearchAllLettersForDashboardQuery,
  useGetApiDocumentsByIdQuery,
  useLazyGetApiDocumentsByIdQuery,
  useDownloadDocumentQuery,
  useLazyDownloadDocumentQuery,
  useDocumentRootPathQuery,
  useLazyDocumentRootPathQuery,
  useCreateLetterMutation,
  useUpdateLetterMutation,
  useApproveLetterMutation,
  useGetLetterCountPerStatusQuery,
  useLazyGetLetterCountPerStatusQuery,
  useGetLettersForPaginationQuery,
  useLazyGetLettersForPaginationQuery,
  useRejectLetterMutation,
  useSearchAllLettersQuery,
  useLazySearchAllLettersQuery,
  useSubmitLetterMutation,
  useGetAllLookupsQuery,
  useLazyGetAllLookupsQuery,
  useApproveRegionMutation,
  useGetRegionCountPerStatusQuery,
  useLazyGetRegionCountPerStatusQuery,
  useCreateRegionMutation,
  useGetAllRegionQuery,
  useLazyGetAllRegionQuery,
  useGetRegionsForPaginationQuery,
  useLazyGetRegionsForPaginationQuery,
  useRejectRegionMutation,
  useSearchAllRegionsQuery,
  useLazySearchAllRegionsQuery,
  useSubmitRegionMutation,
  useUpdateRegionMutation,
  useApproveSubCityMutation,
  useGetSubCityCountPerStatusQuery,
  useLazyGetSubCityCountPerStatusQuery,
  useCreateSubCityMutation,
  useGetAllSubCityQuery,
  useLazyGetAllSubCityQuery,
  useGetSubCitiesForPaginationQuery,
  useLazyGetSubCitiesForPaginationQuery,
  useRejectSubCityMutation,
  useSearchAllSubCitiesQuery,
  useLazySearchAllSubCitiesQuery,
  useSubmitSubCityMutation,
  useUpdateSubCityMutation,
  useCurrentUserInfoQuery,
  useLazyCurrentUserInfoQuery,
} = injectedRtkApi;
