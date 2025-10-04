import { emptySplitApi as api } from "./emptySplitApi";
export const addTagTypes = [
  "BranchGrade",
  "Dashboard",
  "Account",
  "Acting",
  "EmployeeProfile",
  "Address",
  "BusinessUnit",
  "Admin",
  "AuditEmployeeFileDocument",
  "Awards",
  "Benefit",
  "BenefitUnitPrice",
  "BenefitUnitOfMeasurement",
  "BenefitValues",
  "Case",
  "CaseTemplate",
  "CaseTimeline",
  "Chilot",
  "Contact",
  "Delegation",
  "DocketEntry",
  "Documents",
  "Education",
  "EducationLevel",
  "EmployeeFamily",
  "EmployeeFileDocuments",
  "EmployeeTransaction",
  "EmployeeTransfers",
  "EmployeeWarning",
  "FieldOfStudy",
<<<<<<< HEAD
  "Health",
  "Hearing",
=======
>>>>>>> origin/Solomon/v2
  "InstitutionName",
  "Job",
  "JobCategory",
  "JobGrade",
  "JobRoleCategory",
  "JudgeAssignment",
  "Judgment",
  "LanguageSkill",
  "Letter",
  "Lookup",
  "Reemployment",
  "Region",
  "Resignation",
  "SubCity",
  "Suspension",
  "Users",
] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      addBranchGrade: build.mutation<
        AddBranchGradeApiResponse,
        AddBranchGradeApiArg
      >({
        query: (queryArg) => ({
          url: `/AddBranchGrade`,
          method: "POST",
          body: queryArg.addBranchGradeCommand,
        }),
        invalidatesTags: ["BranchGrade", "Dashboard"],
      }),
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
      approveActing: build.mutation<
        ApproveActingApiResponse,
        ApproveActingApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Acting/approve`,
          method: "PATCH",
          body: queryArg.approveActingCommand,
        }),
        invalidatesTags: ["Acting", "EmployeeProfile"],
      }),
      getActingCountPerStatus: build.query<
        GetActingCountPerStatusApiResponse,
        GetActingCountPerStatusApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Acting/count`,
          params: { id: queryArg.id },
        }),
        providesTags: ["Acting", "EmployeeProfile"],
      }),
      createActing: build.mutation<CreateActingApiResponse, CreateActingApiArg>(
        {
          query: (queryArg) => ({
            url: `/api/Acting/Create`,
            method: "POST",
            body: queryArg.createActingCommand,
          }),
          invalidatesTags: ["Acting", "EmployeeProfile"],
        }
      ),
      getAllActiveActing: build.query<
        GetAllActiveActingApiResponse,
        GetAllActiveActingApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Acting/GetAllActive`,
          params: { id: queryArg.id },
        }),
        providesTags: ["Acting"],
      }),
      getPaginatedActings: build.query<
        GetPaginatedActingsApiResponse,
        GetPaginatedActingsApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Acting/GetPaginatedActings`,
          params: {
            id: queryArg.id,
            status: queryArg.status,
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Acting", "EmployeeProfile"],
      }),
      createReassignment: build.mutation<
        CreateReassignmentApiResponse,
        CreateReassignmentApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Acting/Reassign`,
          method: "POST",
          body: queryArg.reAssignmentActingCommand,
        }),
        invalidatesTags: ["Acting", "EmployeeProfile"],
      }),
      rejectActing: build.mutation<RejectActingApiResponse, RejectActingApiArg>(
        {
          query: (queryArg) => ({
            url: `/api/Acting/Reject`,
            method: "PATCH",
            body: queryArg.rejectActingCommand,
          }),
          invalidatesTags: ["Acting", "EmployeeProfile"],
        }
      ),
      submitActing: build.mutation<SubmitActingApiResponse, SubmitActingApiArg>(
        {
          query: (queryArg) => ({
            url: `/api/Acting/submit`,
            method: "PATCH",
            body: queryArg.submitActingCommand,
          }),
          invalidatesTags: ["Acting", "EmployeeProfile"],
        }
      ),
      updateActing: build.mutation<UpdateActingApiResponse, UpdateActingApiArg>(
        {
          query: (queryArg) => ({
            url: `/api/Acting/Update`,
            method: "PUT",
            body: queryArg.updateActingCommand,
          }),
          invalidatesTags: ["Acting", "EmployeeProfile"],
        }
      ),
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
      getAddressQueryByEntityType: build.query<
        GetAddressQueryByEntityTypeApiResponse,
        GetAddressQueryByEntityTypeApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Address/GetAddressQueryByEntityType`,
          params: { entityId: queryArg.entityId },
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
      getGuaranterWorkingFirmAddress: build.query<
        GetGuaranterWorkingFirmAddressApiResponse,
        GetGuaranterWorkingFirmAddressApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Address/GetGuaranterWorkingFirmAddressQuery`,
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
<<<<<<< HEAD
      createAppointment: build.mutation<
        CreateAppointmentApiResponse,
        CreateAppointmentApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Appointment/Create`,
          method: "POST",
          body: queryArg.createAppointmentCommand,
        }),
        invalidatesTags: ["Appointment"],
      }),
      getAllAppointments: build.query<
        GetAllAppointmentsApiResponse,
        GetAllAppointmentsApiArg
      >({
        query: () => ({ url: `/api/Appointment/GetAll` }),
        providesTags: ["Appointment"],
      }),
      getAppointmentsByBusinessUnitId: build.query<
        GetAppointmentsByBusinessUnitIdApiResponse,
        GetAppointmentsByBusinessUnitIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Appointment/GetByBusinessUnitId`,
          params: { businessUnitId: queryArg.businessUnitId },
        }),
        providesTags: ["Appointment"],
      }),
      getAppointmentsByCaseId: build.query<
        GetAppointmentsByCaseIdApiResponse,
        GetAppointmentsByCaseIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Appointment/GetByCaseId`,
          params: { caseId: queryArg.caseId },
        }),
        providesTags: ["Appointment"],
      }),
      getAppointmentById: build.query<
        GetAppointmentByIdApiResponse,
        GetAppointmentByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Appointment/GetById`,
          params: { id: queryArg.id },
        }),
        providesTags: ["Appointment"],
      }),
      updateAppointment: build.mutation<
        UpdateAppointmentApiResponse,
        UpdateAppointmentApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Appointment/Update`,
          method: "PUT",
          body: queryArg.updateAppointmentCommand,
          params: { id: queryArg.id },
        }),
        invalidatesTags: ["Appointment"],
=======
      getAuditEmployeeDocumentFileByEmployeeId: build.query<
        GetAuditEmployeeDocumentFileByEmployeeIdApiResponse,
        GetAuditEmployeeDocumentFileByEmployeeIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/AuditEmployeeFileDocument/getAuditEmployeeDocumentFileByEmployeeId/${queryArg.employeeId}`,
        }),
        providesTags: ["AuditEmployeeFileDocument"],
      }),
      getAuditEmployeeFileDocumentLogs: build.query<
        GetAuditEmployeeFileDocumentLogsApiResponse,
        GetAuditEmployeeFileDocumentLogsApiArg
      >({
        query: () => ({
          url: `/api/AuditEmployeeFileDocument/getAuditEmployeeFileDocumentLogs`,
        }),
        providesTags: ["AuditEmployeeFileDocument"],
>>>>>>> origin/Solomon/v2
      }),
      approveAward: build.mutation<ApproveAwardApiResponse, ApproveAwardApiArg>(
        {
          query: (queryArg) => ({
            url: `/api/Awards/approve`,
            method: "PATCH",
            body: queryArg.approveAwardCommand,
          }),
          invalidatesTags: ["Awards", "Dashboard"],
        }
      ),
      getAwardCountPerStatus: build.query<
        GetAwardCountPerStatusApiResponse,
        GetAwardCountPerStatusApiArg
      >({
        query: () => ({ url: `/api/Awards/count` }),
        providesTags: ["Awards"],
      }),
      createAward: build.mutation<CreateAwardApiResponse, CreateAwardApiArg>({
        query: (queryArg) => ({
          url: `/api/Awards/create`,
          method: "POST",
          body: queryArg.createAwardCommand,
        }),
        invalidatesTags: ["Awards", "Dashboard"],
      }),
      getAllAward: build.query<GetAllAwardApiResponse, GetAllAwardApiArg>({
        query: () => ({ url: `/api/Awards/GetAll` }),
        providesTags: ["Awards"],
      }),
      getAwardsForPagination: build.query<
        GetAwardsForPaginationApiResponse,
        GetAwardsForPaginationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Awards/GetAwardsForPagination`,
          params: {
            status: queryArg.status,
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Awards"],
      }),
      rejectAward: build.mutation<RejectAwardApiResponse, RejectAwardApiArg>({
        query: (queryArg) => ({
          url: `/api/Awards/Reject`,
          method: "PATCH",
          body: queryArg.rejectAwardCommand,
        }),
        invalidatesTags: ["Awards", "Dashboard"],
      }),
      searchAllAwards: build.query<
        SearchAllAwardsApiResponse,
        SearchAllAwardsApiArg
      >({
        query: () => ({ url: `/api/Awards/search` }),
        providesTags: ["Awards"],
      }),
      submitAward: build.mutation<SubmitAwardApiResponse, SubmitAwardApiArg>({
        query: (queryArg) => ({
          url: `/api/Awards/submit`,
          method: "PATCH",
          body: queryArg.submitAwardCommand,
        }),
        invalidatesTags: ["Awards", "Dashboard"],
      }),
      updateAward: build.mutation<UpdateAwardApiResponse, UpdateAwardApiArg>({
        query: (queryArg) => ({
          url: `/api/Awards/update`,
          method: "PUT",
          body: queryArg.updateAwardCommand,
        }),
        invalidatesTags: ["Awards"],
      }),
      addBenefit: build.mutation<AddBenefitApiResponse, AddBenefitApiArg>({
        query: (queryArg) => ({
          url: `/api/Benefit/AddBenefit`,
          method: "POST",
          body: queryArg.addBenefitCommand,
        }),
        invalidatesTags: ["Benefit", "Dashboard", "BenefitUnitPrice"],
      }),
      approveBenefit: build.mutation<
        ApproveBenefitApiResponse,
        ApproveBenefitApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Benefit/ApproveBenefit`,
          method: "POST",
          body: queryArg.approveBenefitCommand,
        }),
        invalidatesTags: ["Benefit", "Dashboard", "BenefitUnitPrice"],
      }),
      getAllBenefitList: build.query<
        GetAllBenefitListApiResponse,
        GetAllBenefitListApiArg
      >({
        query: () => ({ url: `/api/Benefit/GetAllBenefitList` }),
        providesTags: ["Benefit"],
      }),
      getAllUnitPricedBenefitlist: build.query<
        GetAllUnitPricedBenefitlistApiResponse,
        GetAllUnitPricedBenefitlistApiArg
      >({
        query: () => ({ url: `/api/Benefit/GetAllUnitPricedBenefitlist` }),
        providesTags: ["Benefit"],
      }),
      getBenefitCountPerStatus: build.query<
        GetBenefitCountPerStatusApiResponse,
        GetBenefitCountPerStatusApiArg
      >({
        query: () => ({ url: `/api/Benefit/GetBenefitCountPerStatus` }),
        providesTags: ["Benefit"],
      }),
      getBenefitListForPagination: build.query<
        GetBenefitListForPaginationApiResponse,
        GetBenefitListForPaginationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Benefit/GetBenefitListForPagination`,
          params: {
            status: queryArg.status,
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Benefit"],
      }),
      rejectBenefit: build.mutation<
        RejectBenefitApiResponse,
        RejectBenefitApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Benefit/RejectBenefit`,
          method: "POST",
          body: queryArg.rejectBenefitCommand,
        }),
        invalidatesTags: ["Benefit", "Dashboard"],
      }),
      submitBenefit: build.mutation<
        SubmitBenefitApiResponse,
        SubmitBenefitApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Benefit/SubmitBenefit`,
          method: "POST",
          body: queryArg.submitBenefitCommand,
        }),
        invalidatesTags: ["Benefit", "Dashboard"],
      }),
      updateBenefit: build.mutation<
        UpdateBenefitApiResponse,
        UpdateBenefitApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Benefit/UpdateBenefit`,
          method: "PUT",
          body: queryArg.updateBenefitCommand,
        }),
        invalidatesTags: ["Benefit"],
      }),
      addBenefitUnitOfMeasurement: build.mutation<
        AddBenefitUnitOfMeasurementApiResponse,
        AddBenefitUnitOfMeasurementApiArg
      >({
        query: (queryArg) => ({
          url: `/api/BenefitUnitOfMeasurement/AddBenefitUnitOfMeasurement`,
          method: "POST",
          body: queryArg.addBenefitUnitOfMeasurementCommand,
        }),
        invalidatesTags: ["BenefitUnitOfMeasurement", "Dashboard"],
      }),
      approveBenefitUnitOfMeasurement: build.mutation<
        ApproveBenefitUnitOfMeasurementApiResponse,
        ApproveBenefitUnitOfMeasurementApiArg
      >({
        query: (queryArg) => ({
          url: `/api/BenefitUnitOfMeasurement/ApproveBenefitUnitOfMeasurement`,
          method: "POST",
          body: queryArg.approveBenefitUnitOfMeasurementCommand,
        }),
        invalidatesTags: ["BenefitUnitOfMeasurement", "Dashboard"],
      }),
      getAllBenefitUnitOfMeasurementList: build.query<
        GetAllBenefitUnitOfMeasurementListApiResponse,
        GetAllBenefitUnitOfMeasurementListApiArg
      >({
        query: () => ({
          url: `/api/BenefitUnitOfMeasurement/GetAllBenefitUnitOfMeasurementList`,
        }),
        providesTags: ["BenefitUnitOfMeasurement"],
      }),
      getBenefitUnitOfMeasurementCountPerStatus: build.query<
        GetBenefitUnitOfMeasurementCountPerStatusApiResponse,
        GetBenefitUnitOfMeasurementCountPerStatusApiArg
      >({
        query: () => ({
          url: `/api/BenefitUnitOfMeasurement/GetBenefitUnitOfMeasurementCountPerStatus`,
        }),
        providesTags: ["BenefitUnitOfMeasurement"],
      }),
      getBenefitUnitOfMeasurementListForPagination: build.query<
        GetBenefitUnitOfMeasurementListForPaginationApiResponse,
        GetBenefitUnitOfMeasurementListForPaginationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/BenefitUnitOfMeasurement/GetBenefitUnitOfMeasurementListForPagination`,
          params: {
            status: queryArg.status,
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["BenefitUnitOfMeasurement"],
      }),
      rejectBenefitUnitOfMeasurement: build.mutation<
        RejectBenefitUnitOfMeasurementApiResponse,
        RejectBenefitUnitOfMeasurementApiArg
      >({
        query: (queryArg) => ({
          url: `/api/BenefitUnitOfMeasurement/RejectBenefitUnitOfMeasurement`,
          method: "POST",
          body: queryArg.rejectBenefitUnitOfMeasurementCommand,
        }),
        invalidatesTags: ["BenefitUnitOfMeasurement", "Dashboard"],
      }),
      submitBenefitUnitOfMeasurement: build.mutation<
        SubmitBenefitUnitOfMeasurementApiResponse,
        SubmitBenefitUnitOfMeasurementApiArg
      >({
        query: (queryArg) => ({
          url: `/api/BenefitUnitOfMeasurement/SubmitBenefitUnitOfMeasurement`,
          method: "POST",
          body: queryArg.submitBenefitUnitOfMeasurementCommand,
        }),
        invalidatesTags: ["BenefitUnitOfMeasurement", "Dashboard"],
      }),
      updateBenefitUnitOfMeasurement: build.mutation<
        UpdateBenefitUnitOfMeasurementApiResponse,
        UpdateBenefitUnitOfMeasurementApiArg
      >({
        query: (queryArg) => ({
          url: `/api/BenefitUnitOfMeasurement/UpdateBenefitUnitOfMeasurement`,
          method: "PUT",
          body: queryArg.updateBenefitUnitOfMeasurementCommand,
        }),
        invalidatesTags: ["BenefitUnitOfMeasurement"],
      }),
      addBenefitUnitPrice: build.mutation<
        AddBenefitUnitPriceApiResponse,
        AddBenefitUnitPriceApiArg
      >({
        query: (queryArg) => ({
          url: `/api/BenefitUnitPrice/AddBenefitUnitPrice`,
          method: "POST",
          body: queryArg.addBenefitUnitPriceCommand,
        }),
        invalidatesTags: ["BenefitUnitPrice", "Dashboard"],
      }),
      approveBenefitUnitPrice: build.mutation<
        ApproveBenefitUnitPriceApiResponse,
        ApproveBenefitUnitPriceApiArg
      >({
        query: (queryArg) => ({
          url: `/api/BenefitUnitPrice/ApproveBenefitUnitPrice`,
          method: "POST",
          body: queryArg.approveBenefitUnitPriceCommand,
        }),
        invalidatesTags: ["BenefitUnitPrice", "Dashboard"],
      }),
      getAllBenefitUnitPric: build.query<
        GetAllBenefitUnitPricApiResponse,
        GetAllBenefitUnitPricApiArg
      >({
        query: () => ({
          url: `/api/BenefitUnitPrice/GetAllBenefitUnitPriceList`,
        }),
        providesTags: ["BenefitUnitPrice"],
      }),
      getBenefitUnitPriceCountPerStatus: build.query<
        GetBenefitUnitPriceCountPerStatusApiResponse,
        GetBenefitUnitPriceCountPerStatusApiArg
      >({
        query: () => ({
          url: `/api/BenefitUnitPrice/GetBenefitUnitPriceCountPerStatus`,
        }),
        providesTags: ["BenefitUnitPrice"],
      }),
      getBenefitUnitPriceListForPagination: build.query<
        GetBenefitUnitPriceListForPaginationApiResponse,
        GetBenefitUnitPriceListForPaginationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/BenefitUnitPrice/GetBenefitUnitPriceListForPagination`,
          params: {
            status: queryArg.status,
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["BenefitUnitPrice"],
      }),
      rejectBenefitUnitPrice: build.mutation<
        RejectBenefitUnitPriceApiResponse,
        RejectBenefitUnitPriceApiArg
      >({
        query: (queryArg) => ({
          url: `/api/BenefitUnitPrice/RejectBenefitUnitPrice`,
          method: "POST",
          body: queryArg.rejectBenefitUnitPriceCommand,
        }),
        invalidatesTags: ["BenefitUnitPrice", "Dashboard"],
      }),
      submitBenefitUnitPrice: build.mutation<
        SubmitBenefitUnitPriceApiResponse,
        SubmitBenefitUnitPriceApiArg
      >({
        query: (queryArg) => ({
          url: `/api/BenefitUnitPrice/SubmitBenefitUnitPrice`,
          method: "POST",
          body: queryArg.submitBenefitUnitPriceCommand,
        }),
        invalidatesTags: ["BenefitUnitPrice", "Dashboard"],
      }),
      updateBenefitUnitPrice: build.mutation<
        UpdateBenefitUnitPriceApiResponse,
        UpdateBenefitUnitPriceApiArg
      >({
        query: (queryArg) => ({
          url: `/api/BenefitUnitPrice/UpdateBenefitUnitPrice`,
          method: "PUT",
          body: queryArg.updateBenefitUnitPriceCommand,
        }),
        invalidatesTags: ["BenefitUnitPrice", "Dashboard"],
      }),
      addBenefitValue: build.mutation<
        AddBenefitValueApiResponse,
        AddBenefitValueApiArg
      >({
        query: (queryArg) => ({
          url: `/api/BenefitValues/AddBenefitValue`,
          method: "POST",
          body: queryArg.addBenefitValueCommand,
        }),
        invalidatesTags: ["BenefitValues", "Dashboard"],
      }),
      approveBenefitValue: build.mutation<
        ApproveBenefitValueApiResponse,
        ApproveBenefitValueApiArg
      >({
        query: (queryArg) => ({
          url: `/api/BenefitValues/ApproveBenefitValue`,
          method: "POST",
          body: queryArg.approveBenefitValueCommand,
        }),
        invalidatesTags: ["BenefitValues", "Dashboard"],
      }),
      getAllBenefitValue: build.query<
        GetAllBenefitValueApiResponse,
        GetAllBenefitValueApiArg
      >({
        query: () => ({ url: `/api/BenefitValues/GetAllBenefitValueList` }),
        providesTags: ["BenefitValues"],
      }),
      getBenefitSetupList: build.query<
        GetBenefitSetupListApiResponse,
        GetBenefitSetupListApiArg
      >({
        query: () => ({ url: `/api/BenefitValues/GetBenefitSetupList` }),
        providesTags: ["BenefitValues"],
      }),
      getBenefitValueById: build.query<
        GetBenefitValueByIdApiResponse,
        GetBenefitValueByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/BenefitValues/GetBenefitValueById`,
          params: { id: queryArg.id },
        }),
        providesTags: ["BenefitValues"],
      }),
      getBenefitValueCountPerStatus: build.query<
        GetBenefitValueCountPerStatusApiResponse,
        GetBenefitValueCountPerStatusApiArg
      >({
        query: () => ({
          url: `/api/BenefitValues/GetBenefitValueCountPerStatus`,
        }),
        providesTags: ["BenefitValues"],
      }),
      getBenefitValueListForPagination: build.query<
        GetBenefitValueListForPaginationApiResponse,
        GetBenefitValueListForPaginationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/BenefitValues/GetBenefitValueListForPagination`,
          params: {
            status: queryArg.status,
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["BenefitValues"],
      }),
      getBenefitValuesListByBenefitId: build.query<
        GetBenefitValuesListByBenefitIdApiResponse,
        GetBenefitValuesListByBenefitIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/BenefitValues/GetBenefitValuesByBenefitId`,
          params: { benefitId: queryArg.benefitId },
        }),
        providesTags: ["BenefitValues"],
      }),
      rejectBenefitValue: build.mutation<
        RejectBenefitValueApiResponse,
        RejectBenefitValueApiArg
      >({
        query: (queryArg) => ({
          url: `/api/BenefitValues/RejectBenefitValue`,
          method: "POST",
          body: queryArg.rejectBenefitValueCommand,
        }),
        invalidatesTags: ["BenefitValues", "Dashboard"],
      }),
      submitBenefitValue: build.mutation<
        SubmitBenefitValueApiResponse,
        SubmitBenefitValueApiArg
      >({
        query: (queryArg) => ({
          url: `/api/BenefitValues/SubmitBenefitValue`,
          method: "POST",
          body: queryArg.submitBenefitValueCommand,
        }),
        invalidatesTags: ["BenefitValues", "Dashboard"],
      }),
      updateBenefitValue: build.mutation<
        UpdateBenefitValueApiResponse,
        UpdateBenefitValueApiArg
      >({
        query: (queryArg) => ({
          url: `/api/BenefitValues/UpdateBenefitValue`,
          method: "PUT",
          body: queryArg.updateBenefitValueCommand,
        }),
        invalidatesTags: ["BenefitValues"],
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
      getEmployeeCountPerApprovalStatus: build.query<
        GetEmployeeCountPerApprovalStatusApiResponse,
        GetEmployeeCountPerApprovalStatusApiArg
      >({
        query: (queryArg) => ({
          url: `/api/BusinessUnit/countsByBusinssUnitId`,
          params: { businssUnitId: queryArg.businssUnitId },
        }),
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
      getCaseById: build.query<GetCaseByIdApiResponse, GetCaseByIdApiArg>({
        query: (queryArg) => ({ url: `/api/Case/${queryArg.id}` }),
        providesTags: ["Case"],
      }),
      getCaseByBusinessUnitId: build.query<
        GetCaseByBusinessUnitIdApiResponse,
        GetCaseByBusinessUnitIdApiArg
      >({
        query: (queryArg) => ({ url: `/api/Case/${queryArg.id}/businessUnit` }),
        providesTags: ["Case"],
      }),
      getCaseInfo: build.query<GetCaseInfoApiResponse, GetCaseInfoApiArg>({
        query: (queryArg) => ({
          url: `/api/Case/${queryArg.id}/info`,
          params: { version: queryArg.version },
        }),
        providesTags: ["Case"],
      }),
      getCaseRecordVersions: build.query<
        GetCaseRecordVersionsApiResponse,
        GetCaseRecordVersionsApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Case/${queryArg.id}/record-versions`,
        }),
        providesTags: ["Case"],
      }),
      createCase: build.mutation<CreateCaseApiResponse, CreateCaseApiArg>({
        query: (queryArg) => ({
          url: `/api/Case/add`,
          method: "POST",
          body: queryArg.createCaseCommand,
        }),
        invalidatesTags: ["Case", "Dashboard"],
      }),
      getAllCases: build.query<GetAllCasesApiResponse, GetAllCasesApiArg>({
        query: () => ({ url: `/api/Case/all` }),
        providesTags: ["Case"],
      }),
      getAllCasesByStatus: build.query<
        GetAllCasesByStatusApiResponse,
        GetAllCasesByStatusApiArg
      >({
        query: () => ({ url: `/api/Case/allByStatus` }),
        providesTags: ["Case"],
      }),
      getAllCaseLists: build.query<
        GetAllCaseListsApiResponse,
        GetAllCaseListsApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Case/allCases`,
          params: {
            businessUnitId: queryArg.businessUnitId,
            status: queryArg.status,
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
            searchQuery: queryArg.searchQuery,
          },
        }),
        providesTags: ["Case"],
      }),
      getCaseCountPerApprovalStatus: build.query<
        GetCaseCountPerApprovalStatusApiResponse,
        GetCaseCountPerApprovalStatusApiArg
      >({
        query: () => ({ url: `/api/Case/counts` }),
        providesTags: ["Case"],
      }),
      updateCase: build.mutation<UpdateCaseApiResponse, UpdateCaseApiArg>({
        query: (queryArg) => ({
          url: `/api/Case/update`,
          method: "POST",
          body: queryArg.updateCaseCommand,
        }),
        invalidatesTags: ["Case", "Dashboard"],
      }),
      createCaseTemplate: build.mutation<
        CreateCaseTemplateApiResponse,
        CreateCaseTemplateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/CaseTemplate/Create`,
          method: "POST",
          body: queryArg.createCaseTemplateCommand,
        }),
        invalidatesTags: ["CaseTemplate"],
      }),
      getAllCaseTemplates: build.query<
        GetAllCaseTemplatesApiResponse,
        GetAllCaseTemplatesApiArg
      >({
        query: () => ({ url: `/api/CaseTemplate/GetAll` }),
        providesTags: ["CaseTemplate"],
      }),
      getCaseTemplateById: build.query<
        GetCaseTemplateByIdApiResponse,
        GetCaseTemplateByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/CaseTemplate/GetById`,
          params: { id: queryArg.id },
        }),
        providesTags: ["CaseTemplate"],
      }),
      updateCaseTemplate: build.mutation<
        UpdateCaseTemplateApiResponse,
        UpdateCaseTemplateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/CaseTemplate/Update`,
          method: "PUT",
          body: queryArg.updateCaseTemplateCommand,
          params: { id: queryArg.id },
        }),
        invalidatesTags: ["CaseTemplate"],
      }),
      createCaseTimeline: build.mutation<
        CreateCaseTimelineApiResponse,
        CreateCaseTimelineApiArg
      >({
        query: (queryArg) => ({
          url: `/api/CaseTimeline/Create`,
          method: "POST",
          body: queryArg.createCaseTimelineCommand,
        }),
        invalidatesTags: ["CaseTimeline"],
      }),
      getAllCaseTimelines: build.query<
        GetAllCaseTimelinesApiResponse,
        GetAllCaseTimelinesApiArg
      >({
        query: () => ({ url: `/api/CaseTimeline/GetAll` }),
        providesTags: ["CaseTimeline"],
      }),
      getCaseTimelinesByCaseId: build.query<
        GetCaseTimelinesByCaseIdApiResponse,
        GetCaseTimelinesByCaseIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/CaseTimeline/GetByCaseId`,
          params: { caseId: queryArg.caseId },
        }),
        providesTags: ["CaseTimeline"],
      }),
      getCaseTimelineById: build.query<
        GetCaseTimelineByIdApiResponse,
        GetCaseTimelineByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/CaseTimeline/GetById`,
          params: { id: queryArg.id },
        }),
        providesTags: ["CaseTimeline"],
      }),
      updateCaseTimeline: build.mutation<
        UpdateCaseTimelineApiResponse,
        UpdateCaseTimelineApiArg
      >({
        query: (queryArg) => ({
          url: `/api/CaseTimeline/Update`,
          method: "PUT",
          body: queryArg.updateCaseTimelineCommand,
          params: { id: queryArg.id },
        }),
        invalidatesTags: ["CaseTimeline"],
      }),
      getAllChilot: build.query<GetAllChilotApiResponse, GetAllChilotApiArg>({
        query: () => ({ url: `/api/Chilot/allChilot` }),
        providesTags: ["Chilot"],
      }),
      getChilotByBusinessUnit: build.query<
        GetChilotByBusinessUnitApiResponse,
        GetChilotByBusinessUnitApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Chilot/by-business/${queryArg.businessUnitId}`,
        }),
        providesTags: ["Chilot"],
      }),
      createChilot: build.mutation<CreateChilotApiResponse, CreateChilotApiArg>(
        {
          query: (queryArg) => ({
            url: `/api/Chilot/create`,
            method: "POST",
            body: queryArg.createChilotCommand,
          }),
          invalidatesTags: ["Chilot"],
        }
      ),
      updateChilot: build.mutation<UpdateChilotApiResponse, UpdateChilotApiArg>(
        {
          query: (queryArg) => ({
            url: `/api/Chilot/update`,
            method: "PUT",
            body: queryArg.updateChilotCommand,
          }),
          invalidatesTags: ["Chilot"],
        }
      ),
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
        query: (queryArg) => ({
          url: `/api/Dashboard/count`,
          params: { userId: queryArg.userId },
        }),
        providesTags: ["Dashboard"],
      }),
      getAllApprovalItemsList: build.query<
        GetAllApprovalItemsListApiResponse,
        GetAllApprovalItemsListApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Dashboard/GetAllApprovalItemsList`,
          params: {
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Dashboard"],
      }),
      getApprovalStatusSummary: build.query<
        GetApprovalStatusSummaryApiResponse,
        GetApprovalStatusSummaryApiArg
      >({
        query: () => ({ url: `/api/Dashboard/GetApprovalStatusSummary` }),
        providesTags: ["Dashboard"],
      }),
      getApprovedActiveBusinessCount: build.query<
        GetApprovedActiveBusinessCountApiResponse,
        GetApprovedActiveBusinessCountApiArg
      >({
        query: () => ({ url: `/api/Dashboard/GetApprovedActiveBusinessCount` }),
        providesTags: ["Dashboard"],
      }),
      getApprovedActiveEmployeeCount: build.query<
        GetApprovedActiveEmployeeCountApiResponse,
        GetApprovedActiveEmployeeCountApiArg
      >({
        query: () => ({ url: `/api/Dashboard/GetApprovedActiveEmployeeCount` }),
        providesTags: ["Dashboard"],
      }),
      getApprovedActiveJobRoleCount: build.query<
        GetApprovedActiveJobRoleCountApiResponse,
        GetApprovedActiveJobRoleCountApiArg
      >({
        query: () => ({ url: `/api/Dashboard/GetApprovedActiveJobRoleCount` }),
        providesTags: ["Dashboard"],
      }),
      getEmployeeDistributionByStatus: build.query<
        GetEmployeeDistributionByStatusApiResponse,
        GetEmployeeDistributionByStatusApiArg
      >({
        query: () => ({
          url: `/api/Dashboard/GetEmployeeDistributionByStatus`,
        }),
        providesTags: ["Dashboard"],
      }),
      getEmployeeJobCategoryGroupCount: build.query<
        GetEmployeeJobCategoryGroupCountApiResponse,
        GetEmployeeJobCategoryGroupCountApiArg
      >({
        query: () => ({
          url: `/api/Dashboard/GetEmployeeJobCategoryGroupCount`,
        }),
        providesTags: ["Dashboard"],
      }),
      getEmployeeRetentionRate: build.query<
        GetEmployeeRetentionRateApiResponse,
        GetEmployeeRetentionRateApiArg
      >({
        query: () => ({ url: `/api/Dashboard/GetEmployeeRetentionRate` }),
        providesTags: ["Dashboard"],
      }),
      getEmployeeTurnoverRate: build.query<
        GetEmployeeTurnoverRateApiResponse,
        GetEmployeeTurnoverRateApiArg
      >({
        query: () => ({ url: `/api/Dashboard/GetEmployeeTurnoverRate` }),
        providesTags: ["Dashboard"],
      }),
      getMonthlyEmployeeCount: build.query<
        GetMonthlyEmployeeCountApiResponse,
        GetMonthlyEmployeeCountApiArg
      >({
        query: () => ({ url: `/api/Dashboard/GetMonthlyEmployeeCount` }),
        providesTags: ["Dashboard"],
      }),
      getNewEmployeesThisYear: build.query<
        GetNewEmployeesThisYearApiResponse,
        GetNewEmployeesThisYearApiArg
      >({
        query: () => ({ url: `/api/Dashboard/GetNewEmployeesThisYear` }),
        providesTags: ["Dashboard"],
      }),
      getResignedEmployeesThisYear: build.query<
        GetResignedEmployeesThisYearApiResponse,
        GetResignedEmployeesThisYearApiArg
      >({
        query: () => ({ url: `/api/Dashboard/GetResignedEmployeesThisYear` }),
        providesTags: ["Dashboard"],
      }),
      getVacantJobsCount: build.query<
        GetVacantJobsCountApiResponse,
        GetVacantJobsCountApiArg
      >({
        query: () => ({ url: `/api/Dashboard/GetVacantJobsCount` }),
        providesTags: ["Dashboard"],
      }),
      searchAllLettersForDashboard: build.query<
        SearchAllLettersForDashboardApiResponse,
        SearchAllLettersForDashboardApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Dashboard/search-all`,
          params: { userId: queryArg.userId },
        }),
        providesTags: ["Dashboard"],
      }),
      approveDelegation: build.mutation<
        ApproveDelegationApiResponse,
        ApproveDelegationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Delegation/approve`,
          method: "PATCH",
          body: queryArg.approveDelegationCommand,
        }),
        invalidatesTags: ["Delegation"],
      }),
      getDelegationCountPerStatus: build.query<
        GetDelegationCountPerStatusApiResponse,
        GetDelegationCountPerStatusApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Delegation/count`,
          params: { id: queryArg.id },
        }),
        providesTags: ["Delegation"],
      }),
      createDelegation: build.mutation<
        CreateDelegationApiResponse,
        CreateDelegationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Delegation/Create`,
          method: "POST",
          body: queryArg.createDelegationCommand,
        }),
        invalidatesTags: ["Delegation"],
      }),
      getAllDelegation: build.query<
        GetAllDelegationApiResponse,
        GetAllDelegationApiArg
      >({
        query: () => ({ url: `/api/Delegation/GetAll` }),
        providesTags: ["Delegation"],
      }),
      getAllActiveDelegation: build.query<
        GetAllActiveDelegationApiResponse,
        GetAllActiveDelegationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Delegation/GetAllActive`,
          params: { id: queryArg.id },
        }),
        providesTags: ["Delegation"],
      }),
      getPaginatedDelegations: build.query<
        GetPaginatedDelegationsApiResponse,
        GetPaginatedDelegationsApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Delegation/GetPaginatedDelegations`,
          params: {
            id: queryArg.id,
            status: queryArg.status,
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Delegation"],
      }),
      rejectDelegation: build.mutation<
        RejectDelegationApiResponse,
        RejectDelegationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Delegation/Reject`,
          method: "PATCH",
          body: queryArg.rejectDelegationCommand,
        }),
        invalidatesTags: ["Delegation"],
      }),
      removeDelegation: build.mutation<
        RemoveDelegationApiResponse,
        RemoveDelegationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Delegation/Remove`,
          method: "PATCH",
          body: queryArg.removeDeligationCommand,
        }),
        invalidatesTags: ["Delegation"],
      }),
      submitDelegation: build.mutation<
        SubmitDelegationApiResponse,
        SubmitDelegationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Delegation/submit`,
          method: "PATCH",
          body: queryArg.submitDelegationCommand,
        }),
        invalidatesTags: ["Delegation"],
      }),
      updateDelegation: build.mutation<
        UpdateDelegationApiResponse,
        UpdateDelegationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Delegation/Update`,
          method: "PUT",
          body: queryArg.updateDelegationCommands,
        }),
        invalidatesTags: ["Delegation"],
      }),
      createDocketEntry: build.mutation<
        CreateDocketEntryApiResponse,
        CreateDocketEntryApiArg
      >({
        query: (queryArg) => ({
          url: `/api/DocketEntry/Create`,
          method: "POST",
          body: queryArg.createDocketEntryCommand,
        }),
        invalidatesTags: ["DocketEntry"],
      }),
      getAllDocketEntries: build.query<
        GetAllDocketEntriesApiResponse,
        GetAllDocketEntriesApiArg
      >({
        query: () => ({ url: `/api/DocketEntry/GetAll` }),
        providesTags: ["DocketEntry"],
      }),
      getDocketEntriesByCaseId: build.query<
        GetDocketEntriesByCaseIdApiResponse,
        GetDocketEntriesByCaseIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/DocketEntry/GetByCaseId`,
          params: { caseId: queryArg.caseId },
        }),
        providesTags: ["DocketEntry"],
      }),
      getDocketEntryById: build.query<
        GetDocketEntryByIdApiResponse,
        GetDocketEntryByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/DocketEntry/GetById`,
          params: { id: queryArg.id },
        }),
        providesTags: ["DocketEntry"],
      }),
      updateDocketEntry: build.mutation<
        UpdateDocketEntryApiResponse,
        UpdateDocketEntryApiArg
      >({
        query: (queryArg) => ({
          url: `/api/DocketEntry/Update`,
          method: "PUT",
          body: queryArg.updateDocketEntryCommand,
          params: { id: queryArg.id },
        }),
        invalidatesTags: ["DocketEntry"],
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
      createEducation: build.mutation<
        CreateEducationApiResponse,
        CreateEducationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Education/create`,
          method: "POST",
          body: queryArg.createEducationCommand,
        }),
        invalidatesTags: ["Education", "EmployeeProfile"],
      }),
      getEducationById: build.query<
        GetEducationByIdApiResponse,
        GetEducationByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Education/GetEducationById`,
          params: { employeeId: queryArg.employeeId },
        }),
        providesTags: ["Education"],
      }),
      updateEducation: build.mutation<
        UpdateEducationApiResponse,
        UpdateEducationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Education/update`,
          method: "PUT",
          body: queryArg.updateEducationCommand,
        }),
        invalidatesTags: ["Education", "EmployeeProfile"],
      }),
      approveEducationLevel: build.mutation<
        ApproveEducationLevelApiResponse,
        ApproveEducationLevelApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EducationLevel/approve`,
          method: "PATCH",
          body: queryArg.approveEducationLevelCommand,
        }),
        invalidatesTags: ["EducationLevel", "Dashboard"],
      }),
      getEducationLevelCountPerStatus: build.query<
        GetEducationLevelCountPerStatusApiResponse,
        GetEducationLevelCountPerStatusApiArg
      >({
        query: () => ({ url: `/api/EducationLevel/count` }),
        providesTags: ["EducationLevel"],
      }),
      createEducationLevel: build.mutation<
        CreateEducationLevelApiResponse,
        CreateEducationLevelApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EducationLevel/create`,
          method: "POST",
          body: queryArg.createEducationLevelCommand,
        }),
        invalidatesTags: ["EducationLevel", "Dashboard"],
      }),
      getAllEducationLevel: build.query<
        GetAllEducationLevelApiResponse,
        GetAllEducationLevelApiArg
      >({
        query: () => ({ url: `/api/EducationLevel/GetAll` }),
        providesTags: ["EducationLevel"],
      }),
      getEducationLevelsForPagination: build.query<
        GetEducationLevelsForPaginationApiResponse,
        GetEducationLevelsForPaginationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EducationLevel/GetEducationLevelsForPagination`,
          params: {
            status: queryArg.status,
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["EducationLevel"],
      }),
      rejectEducationLevel: build.mutation<
        RejectEducationLevelApiResponse,
        RejectEducationLevelApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EducationLevel/Reject`,
          method: "PATCH",
          body: queryArg.rejectEducationLevelCommand,
        }),
        invalidatesTags: ["EducationLevel", "Dashboard"],
      }),
      searchAllEducationLevels: build.query<
        SearchAllEducationLevelsApiResponse,
        SearchAllEducationLevelsApiArg
      >({
        query: () => ({ url: `/api/EducationLevel/search` }),
        providesTags: ["EducationLevel"],
      }),
      submitEducationLevel: build.mutation<
        SubmitEducationLevelApiResponse,
        SubmitEducationLevelApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EducationLevel/submit`,
          method: "PATCH",
          body: queryArg.submitEducationLevelCommand,
        }),
        invalidatesTags: ["EducationLevel", "Dashboard"],
      }),
      updateEducationLevel: build.mutation<
        UpdateEducationLevelApiResponse,
        UpdateEducationLevelApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EducationLevel/update`,
          method: "PUT",
          body: queryArg.updateEducationLevelCommand,
        }),
        invalidatesTags: ["EducationLevel"],
      }),
      activateEmployeeFamily: build.mutation<
        ActivateEmployeeFamilyApiResponse,
        ActivateEmployeeFamilyApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeFamily/ActivateEmployeeFamily`,
          method: "PUT",
          body: queryArg.activateEmployeeFamilyCommand,
        }),
        invalidatesTags: ["EmployeeFamily"],
      }),
      activateEmployeeGurantee: build.mutation<
        ActivateEmployeeGuranteeApiResponse,
        ActivateEmployeeGuranteeApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeFamily/ActivateEmployeeGurantee`,
          method: "PUT",
          body: queryArg.activateEmployeeGurantersCommand,
        }),
        invalidatesTags: ["EmployeeFamily"],
      }),
      addEmployeeExperience: build.mutation<
        AddEmployeeExperienceApiResponse,
        AddEmployeeExperienceApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeFamily/AddEmployeeExperience`,
          method: "POST",
          body: queryArg.addEmployeeExperienceCommand,
        }),
        invalidatesTags: ["EmployeeFamily"],
      }),
      addEmployeeChildren: build.mutation<
        AddEmployeeChildrenApiResponse,
        AddEmployeeChildrenApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeFamily/AddEmployeeFamily`,
          method: "POST",
          body: queryArg.addEmployeeFamilyCommand,
        }),
        invalidatesTags: ["EmployeeFamily", "EmployeeProfile"],
      }),
      addEmployeeGuranters: build.mutation<
        AddEmployeeGurantersApiResponse,
        AddEmployeeGurantersApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeFamily/AddEmployeeGuranters`,
          method: "POST",
          body: queryArg.addEmployeeGurantersCommand,
        }),
        invalidatesTags: ["EmployeeFamily"],
      }),
      allFamilyOfAllEmployee: build.query<
        AllFamilyOfAllEmployeeApiResponse,
        AllFamilyOfAllEmployeeApiArg
      >({
        query: () => ({ url: `/api/EmployeeFamily/AllFamilyOfAllEmployee` }),
        providesTags: ["EmployeeFamily"],
      }),
      deActivateEmployeeFamily: build.mutation<
        DeActivateEmployeeFamilyApiResponse,
        DeActivateEmployeeFamilyApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeFamily/DeActivateEmployeeFamily`,
          method: "PUT",
          body: queryArg.deActivateEmployeeFamilyCommand,
        }),
        invalidatesTags: ["EmployeeFamily"],
      }),
      deActivateEmployeeGuarantee: build.mutation<
        DeActivateEmployeeGuaranteeApiResponse,
        DeActivateEmployeeGuaranteeApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeFamily/DeActivateEmployeeGuarantee`,
          method: "PUT",
          body: queryArg.deActivateEmployeeGurantersCommand,
        }),
        invalidatesTags: ["EmployeeFamily"],
      }),
      getFamily: build.query<GetFamilyApiResponse, GetFamilyApiArg>({
        query: (queryArg) => ({
          url: `/api/EmployeeFamily/GetChild`,
          params: { familyId: queryArg.familyId },
        }),
        providesTags: ["EmployeeFamily"],
      }),
      getEmployeeExperienceById: build.query<
        GetEmployeeExperienceByIdApiResponse,
        GetEmployeeExperienceByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeFamily/GetEmployeeExperienceById`,
          params: { id: queryArg.id },
        }),
        providesTags: ["EmployeeFamily"],
      }),
      getEmployeeExperienceListOfEmployee: build.query<
        GetEmployeeExperienceListOfEmployeeApiResponse,
        GetEmployeeExperienceListOfEmployeeApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeFamily/GetEmployeeExperienceListOfEmployee`,
          params: { employeeId: queryArg.employeeId },
        }),
        providesTags: ["EmployeeFamily"],
      }),
      getEmployeeGuaranterEmployee: build.query<
        GetEmployeeGuaranterEmployeeApiResponse,
        GetEmployeeGuaranterEmployeeApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeFamily/GetEmployeeGuaranterOfEmployee`,
          params: { employeeId: queryArg.employeeId },
        }),
        providesTags: ["EmployeeFamily"],
      }),
      getEmployeeGurantersById: build.query<
        GetEmployeeGurantersByIdApiResponse,
        GetEmployeeGurantersByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeFamily/GetEmployeeGurantersById`,
          params: { guaranteeId: queryArg.guaranteeId },
        }),
        providesTags: ["EmployeeFamily"],
      }),
      getFamilyOfAnEmployee: build.query<
        GetFamilyOfAnEmployeeApiResponse,
        GetFamilyOfAnEmployeeApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeFamily/GetFamilyOfAnEmployee`,
          params: { employeeID: queryArg.employeeId },
        }),
        providesTags: ["EmployeeFamily"],
      }),
      updateEmployeeExperience: build.mutation<
        UpdateEmployeeExperienceApiResponse,
        UpdateEmployeeExperienceApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeFamily/UpdateEmployeeExperience`,
          method: "PUT",
          body: queryArg.updateEmployeeExperienceCommand,
        }),
        invalidatesTags: ["EmployeeFamily"],
      }),
      updateEmployeeFamily: build.mutation<
        UpdateEmployeeFamilyApiResponse,
        UpdateEmployeeFamilyApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeFamily/UpdateEmployeeFamily`,
          method: "PUT",
          body: queryArg.updateEmployeeFamilyCommand,
        }),
        invalidatesTags: ["EmployeeFamily"],
      }),
      updateEmployeeGuranters: build.mutation<
        UpdateEmployeeGurantersApiResponse,
        UpdateEmployeeGurantersApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeFamily/UpdateEmployeeGuranters`,
          method: "PUT",
          body: queryArg.updateEmployeeGurantersCommand,
        }),
        invalidatesTags: ["EmployeeFamily"],
      }),
      downloadEmployeeFileDocument: build.query<
        DownloadEmployeeFileDocumentApiResponse,
        DownloadEmployeeFileDocumentApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeFileDocuments/DownloadEmployeeFileDocument/${queryArg.id}`,
        }),
        providesTags: ["EmployeeFileDocuments"],
      }),
      getById: build.query<GetByIdApiResponse, GetByIdApiArg>({
        query: (queryArg) => ({
          url: `/api/EmployeeFileDocuments/get/${queryArg.id}`,
        }),
        providesTags: ["EmployeeFileDocuments"],
      }),
      getEmployeeFileDocumentByEmployeeId: build.query<
        GetEmployeeFileDocumentByEmployeeIdApiResponse,
        GetEmployeeFileDocumentByEmployeeIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeFileDocuments/getDocumentByEmployeeId/${queryArg.employeeId}`,
          params: {
            resignationId: queryArg.resignationId,
            suspensionId: queryArg.suspensionId,
          },
        }),
        providesTags: ["EmployeeFileDocuments"],
      }),
      updateEmployeeFileDocument: build.mutation<
        UpdateEmployeeFileDocumentApiResponse,
        UpdateEmployeeFileDocumentApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeFileDocuments/updateEmployeeFileDocument`,
          method: "PUT",
          body: queryArg.body,
        }),
        invalidatesTags: ["EmployeeFileDocuments"],
      }),
      uploadEmployeeFileDocument: build.mutation<
        UploadEmployeeFileDocumentApiResponse,
        UploadEmployeeFileDocumentApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeFileDocuments/UploadEmployeeFileDocument`,
          method: "POST",
          body: queryArg.body,
        }),
        invalidatesTags: ["EmployeeFileDocuments"],
      }),
      getEmployeeChangeLog: build.query<
        GetEmployeeChangeLogApiResponse,
        GetEmployeeChangeLogApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeProfile/${queryArg.employeeId}/change-logs`,
        }),
        providesTags: ["EmployeeProfile"],
      }),
      getEmployeeById: build.query<
        GetEmployeeByIdApiResponse,
        GetEmployeeByIdApiArg
      >({
        query: (queryArg) => ({ url: `/api/EmployeeProfile/${queryArg.id}` }),
        providesTags: ["EmployeeProfile"],
      }),
      addEmployeePhoto: build.mutation<
        AddEmployeePhotoApiResponse,
        AddEmployeePhotoApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeProfile/${queryArg.id}/add-photo`,
          method: "POST",
          body: queryArg.body,
        }),
        invalidatesTags: ["EmployeeProfile"],
      }),
      getEmployeeByBusinessUnitId: build.query<
        GetEmployeeByBusinessUnitIdApiResponse,
        GetEmployeeByBusinessUnitIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeProfile/${queryArg.id}/businessUnit`,
        }),
        providesTags: ["EmployeeProfile"],
      }),
      getEmployeeInfo: build.query<
        GetEmployeeInfoApiResponse,
        GetEmployeeInfoApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeProfile/${queryArg.id}/info`,
          params: { version: queryArg.version },
        }),
        providesTags: ["EmployeeProfile"],
      }),
      addEmployeeNote: build.mutation<
        AddEmployeeNoteApiResponse,
        AddEmployeeNoteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeProfile/${queryArg.id}/note`,
          method: "POST",
          body: queryArg.note,
        }),
        invalidatesTags: ["EmployeeProfile"],
      }),
      getEmployeeRecordVersions: build.query<
        GetEmployeeRecordVersionsApiResponse,
        GetEmployeeRecordVersionsApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeProfile/${queryArg.id}/record-versions`,
        }),
        providesTags: ["EmployeeProfile"],
      }),
      createEmployeeProfile: build.mutation<
        CreateEmployeeProfileApiResponse,
        CreateEmployeeProfileApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeProfile/add`,
          method: "POST",
          body: queryArg.createEmployeeProfileCommand,
        }),
        invalidatesTags: ["EmployeeProfile", "Dashboard"],
      }),
      getAllEmployees: build.query<
        GetAllEmployeesApiResponse,
        GetAllEmployeesApiArg
      >({
        query: () => ({ url: `/api/EmployeeProfile/all` }),
        providesTags: ["EmployeeProfile"],
      }),
      getAllEmployeesByStatus: build.query<
        GetAllEmployeesByStatusApiResponse,
        GetAllEmployeesByStatusApiArg
      >({
        query: () => ({ url: `/api/EmployeeProfile/allByStatus` }),
        providesTags: ["EmployeeProfile"],
      }),
      allEmployeeApproveProbation: build.mutation<
        AllEmployeeApproveProbationApiResponse,
        AllEmployeeApproveProbationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeProfile/AllEmployeeApproveProbation`,
          method: "POST",
          body: queryArg.allEmployeeApproveCommand,
        }),
        invalidatesTags: ["EmployeeProfile"],
      }),
      getAllEmployeetLists: build.query<
        GetAllEmployeetListsApiResponse,
        GetAllEmployeetListsApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeProfile/allEmployees`,
          params: {
            businessUnitId: queryArg.businessUnitId,
            status: queryArg.status,
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
            searchQuery: queryArg.searchQuery,
          },
        }),
        providesTags: ["EmployeeProfile"],
      }),
      approveEmployee: build.mutation<
        ApproveEmployeeApiResponse,
        ApproveEmployeeApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeProfile/approve-approval-request`,
          method: "POST",
          body: queryArg.changeWorkflowStatusEntityDto,
        }),
        invalidatesTags: ["EmployeeProfile", "Dashboard"],
      }),
      createEmployeeEmergencyContact: build.mutation<
        CreateEmployeeEmergencyContactApiResponse,
        CreateEmployeeEmergencyContactApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeProfile/CreateEmployeeEmergencyContact`,
          method: "POST",
          body: queryArg.createEmployeeEmergencyContactCommand,
        }),
        invalidatesTags: ["EmployeeProfile", "Dashboard"],
      }),
      employeeIdCardApprovalApproval: build.mutation<
        EmployeeIdCardApprovalApprovalApiResponse,
        EmployeeIdCardApprovalApprovalApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeProfile/EmployeeIDCardApprovalApproval`,
          method: "POST",
          body: queryArg.employeeIdCardApprovalApprovalCommand,
        }),
        invalidatesTags: ["EmployeeProfile", "Dashboard"],
      }),
      employeeIdCardApprovalRejected: build.mutation<
        EmployeeIdCardApprovalRejectedApiResponse,
        EmployeeIdCardApprovalRejectedApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeProfile/EmployeeIDCardApprovalRejected`,
          method: "POST",
          body: queryArg.employeeIdCardApprovalRejectedCommand,
        }),
        invalidatesTags: ["EmployeeProfile", "Dashboard"],
      }),
      employeeIdCardGiven: build.mutation<
        EmployeeIdCardGivenApiResponse,
        EmployeeIdCardGivenApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeProfile/EmployeeIDCardGiven`,
          method: "POST",
          body: queryArg.employeeIdCardGivenCommand,
        }),
        invalidatesTags: ["EmployeeProfile", "Dashboard"],
      }),
      employeeIdCardReplace: build.mutation<
        EmployeeIdCardReplaceApiResponse,
        EmployeeIdCardReplaceApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeProfile/EmployeeIDCardReplace`,
          method: "POST",
          body: queryArg.employeeIdCardReplaceCommand,
        }),
        invalidatesTags: ["EmployeeProfile", "Dashboard"],
      }),
      employeeIdCardSubmit: build.mutation<
        EmployeeIdCardSubmitApiResponse,
        EmployeeIdCardSubmitApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeProfile/EmployeeIDCardSubmit`,
          method: "POST",
          body: queryArg.employeeIdCardSubmitCommand,
        }),
        invalidatesTags: ["EmployeeProfile", "Dashboard"],
      }),
      employeeIdCardUpdate: build.mutation<
        EmployeeIdCardUpdateApiResponse,
        EmployeeIdCardUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeProfile/EmployeeIDCardUpdate`,
          method: "POST",
          body: queryArg.employeeIdCardUpdateCommand,
        }),
        invalidatesTags: ["EmployeeProfile", "Dashboard"],
      }),
      employeeProbationApprove: build.mutation<
        EmployeeProbationApproveApiResponse,
        EmployeeProbationApproveApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeProfile/EmployeeProbationApprove`,
          method: "POST",
          body: queryArg.employeeProbationApproveCommand,
        }),
        invalidatesTags: ["EmployeeProfile", "Dashboard"],
      }),
      employeeProbationTermination: build.mutation<
        EmployeeProbationTerminationApiResponse,
        EmployeeProbationTerminationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeProfile/EmployeeProbationTermination`,
          method: "POST",
          body: queryArg.employeeProbationTerminationCommand,
        }),
        invalidatesTags: ["EmployeeProfile", "Dashboard"],
      }),
      getActiveEmployeeForIdManagement: build.query<
        GetActiveEmployeeForIdManagementApiResponse,
        GetActiveEmployeeForIdManagementApiArg
      >({
        query: () => ({
          url: `/api/EmployeeProfile/GetActiveEmployeeForIdManagement`,
        }),
        providesTags: ["EmployeeProfile"],
      }),
      getAllEmployeeIdList: build.query<
        GetAllEmployeeIdListApiResponse,
        GetAllEmployeeIdListApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeProfile/GetAllEmployeeIDList`,
          params: {
            status: queryArg.status,
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["EmployeeProfile"],
      }),
      getAllEmployeeOnProbation: build.query<
        GetAllEmployeeOnProbationApiResponse,
        GetAllEmployeeOnProbationApiArg
      >({
        query: () => ({
          url: `/api/EmployeeProfile/GetAllEmployeeOnProbation`,
        }),
        providesTags: ["EmployeeProfile"],
      }),
      getAllEmployeesIdCardInfo: build.query<
        GetAllEmployeesIdCardInfoApiResponse,
        GetAllEmployeesIdCardInfoApiArg
      >({
        query: () => ({
          url: `/api/EmployeeProfile/GetAllEmployeesIDCardInfo`,
        }),
        providesTags: ["EmployeeProfile"],
      }),
      getAllProbationForNotification: build.query<
        GetAllProbationForNotificationApiResponse,
        GetAllProbationForNotificationApiArg
      >({
        query: () => ({
          url: `/api/EmployeeProfile/GetAllProbationForNotification`,
        }),
        providesTags: ["EmployeeProfile"],
      }),
      getEmployeeEmergencyContacts: build.query<
        GetEmployeeEmergencyContactsApiResponse,
        GetEmployeeEmergencyContactsApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeProfile/GetEmployeeEmeregencyContact/${queryArg.employeeId}`,
        }),
        providesTags: ["EmployeeProfile"],
      }),
      getEmployeeIdCountPerApprovalStatus: build.query<
        GetEmployeeIdCountPerApprovalStatusApiResponse,
        GetEmployeeIdCountPerApprovalStatusApiArg
      >({
        query: () => ({
          url: `/api/EmployeeProfile/GetEmployeeIDCountPerApprovalStatus`,
        }),
        providesTags: ["EmployeeProfile"],
      }),
      getProbationList: build.query<
        GetProbationListApiResponse,
        GetProbationListApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeProfile/GetProbationList`,
          params: {
            status: queryArg.status,
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["EmployeeProfile"],
      }),
      getSingleEmployee: build.query<
        GetSingleEmployeeApiResponse,
        GetSingleEmployeeApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeProfile/GetSingleEmployee`,
          params: { id: queryArg.id },
        }),
        providesTags: ["EmployeeProfile"],
      }),
      probationApproval: build.mutation<
        ProbationApprovalApiResponse,
        ProbationApprovalApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeProfile/ProbationApproval`,
          method: "POST",
          body: queryArg.probationApprovalCommand,
        }),
        invalidatesTags: ["EmployeeProfile", "Dashboard"],
      }),
      getProbationCountPerApprovalStatus: build.query<
        GetProbationCountPerApprovalStatusApiResponse,
        GetProbationCountPerApprovalStatusApiArg
      >({
        query: () => ({
          url: `/api/EmployeeProfile/ProbationCountPerApprovalStatus`,
        }),
        providesTags: ["EmployeeProfile"],
      }),
      probationSubmit: build.mutation<
        ProbationSubmitApiResponse,
        ProbationSubmitApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeProfile/ProbationSubmit`,
          method: "POST",
          body: queryArg.probationSubmitToApproverCommand,
        }),
        invalidatesTags: ["EmployeeProfile", "Dashboard"],
      }),
      probationTerminate: build.mutation<
        ProbationTerminateApiResponse,
        ProbationTerminateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeProfile/ProbationTerminate`,
          method: "POST",
          body: queryArg.probationTerminateCommand,
        }),
        invalidatesTags: ["EmployeeProfile", "Dashboard"],
      }),
      rejectEmployeeApprovalRequest: build.mutation<
        RejectEmployeeApprovalRequestApiResponse,
        RejectEmployeeApprovalRequestApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeProfile/reject-approval-request`,
          method: "POST",
          body: queryArg.changeWorkflowStatusEntityDto,
        }),
        invalidatesTags: ["EmployeeProfile", "Dashboard"],
      }),
      rejectedProbationActivate: build.mutation<
        RejectedProbationActivateApiResponse,
        RejectedProbationActivateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeProfile/RejectedProbationActivate`,
          method: "POST",
          body: queryArg.rejectedProbationActivateCommand,
        }),
        invalidatesTags: ["EmployeeProfile", "Dashboard"],
      }),
      rejectProbationApproval: build.mutation<
        RejectProbationApprovalApiResponse,
        RejectProbationApprovalApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeProfile/RejectProbation`,
          method: "POST",
          body: queryArg.probationRejectApprovalCommand,
        }),
        invalidatesTags: ["EmployeeProfile", "Dashboard"],
      }),
      submitForApproval: build.mutation<
        SubmitForApprovalApiResponse,
        SubmitForApprovalApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeProfile/submit-for-approval`,
          method: "POST",
          body: queryArg.changeWorkflowStatusEntityDto,
        }),
        invalidatesTags: ["EmployeeProfile", "Dashboard"],
      }),
      updateEmployee: build.mutation<
        UpdateEmployeeApiResponse,
        UpdateEmployeeApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeProfile/update`,
          method: "POST",
          body: queryArg.updateEmployeeCommand,
        }),
        invalidatesTags: ["EmployeeProfile", "Dashboard"],
      }),
      updateEmployeeEmergencyContactCommand: build.mutation<
        UpdateEmployeeEmergencyContactCommandApiResponse,
        UpdateEmployeeEmergencyContactCommandApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeProfile/UpdateEmployeeEmergencyContactCommand`,
          method: "PUT",
          body: queryArg.updateEmployeeEmergencyContactCommand,
        }),
        invalidatesTags: ["EmployeeProfile", "Dashboard"],
      }),
      addEmployeeDemotion: build.mutation<
        AddEmployeeDemotionApiResponse,
        AddEmployeeDemotionApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransaction/AddEmployeeDemotion`,
          method: "POST",
          body: queryArg.addEmployeeDemotionCommand,
        }),
        invalidatesTags: ["EmployeeTransaction"],
      }),
      addEmployeePromotion: build.mutation<
        AddEmployeePromotionApiResponse,
        AddEmployeePromotionApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransaction/AddEmployeePromotionCommand`,
          method: "POST",
          body: queryArg.addEmployeePromotionCommand,
        }),
        invalidatesTags: ["EmployeeTransaction"],
      }),
      addEmployeeReClassification: build.mutation<
        AddEmployeeReClassificationApiResponse,
        AddEmployeeReClassificationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransaction/AddEmployeeReClassification`,
          method: "POST",
          body: queryArg.addEmployeeReClassificationCommand,
        }),
        invalidatesTags: ["EmployeeTransaction"],
      }),
      addEmployeeSalaryIncrement: build.mutation<
        AddEmployeeSalaryIncrementApiResponse,
        AddEmployeeSalaryIncrementApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransaction/AddEmployeeSalaryIncrement`,
          method: "POST",
          body: queryArg.addSalaryIncrementCommand,
        }),
        invalidatesTags: ["EmployeeTransaction"],
      }),
      getAllDemotions: build.query<
        GetAllDemotionsApiResponse,
        GetAllDemotionsApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransaction/allDemotions`,
          params: {
            status: queryArg.status,
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
            employeeId: queryArg.employeeId,
          },
        }),
        providesTags: ["EmployeeTransaction"],
      }),
      getAllPromotions: build.query<
        GetAllPromotionsApiResponse,
        GetAllPromotionsApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransaction/allPromotions`,
          params: {
            status: queryArg.status,
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
            employeeId: queryArg.employeeId,
          },
        }),
        providesTags: ["EmployeeTransaction"],
      }),
      getAllReClassifications: build.query<
        GetAllReClassificationsApiResponse,
        GetAllReClassificationsApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransaction/allReClassifications`,
          params: {
            status: queryArg.status,
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
            employeeId: queryArg.employeeId,
          },
        }),
        providesTags: ["EmployeeTransaction"],
      }),
      approveEmployeeDemotion: build.mutation<
        ApproveEmployeeDemotionApiResponse,
        ApproveEmployeeDemotionApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransaction/ApproveEmployeeDemotion`,
          method: "PUT",
          body: queryArg.approveEmployeeDemotion,
        }),
        invalidatesTags: ["EmployeeTransaction"],
      }),
      approveEmployeePromotion: build.mutation<
        ApproveEmployeePromotionApiResponse,
        ApproveEmployeePromotionApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransaction/ApproveEmployeePromotion`,
          method: "PUT",
          body: queryArg.approveEmployeePromotion,
        }),
        invalidatesTags: ["EmployeeTransaction"],
      }),
      approveEmployeeReClassification: build.mutation<
        ApproveEmployeeReClassificationApiResponse,
        ApproveEmployeeReClassificationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransaction/ApproveEmployeeReClassification`,
          method: "PUT",
          body: queryArg.approveEmployeeReClassification,
        }),
        invalidatesTags: ["EmployeeTransaction"],
      }),
      approveSalaryIncrement: build.mutation<
        ApproveSalaryIncrementApiResponse,
        ApproveSalaryIncrementApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransaction/ApproveSalaryIncrement`,
          method: "PUT",
          body: queryArg.approveSalaryIncrementCommand,
        }),
        invalidatesTags: ["EmployeeTransaction"],
      }),
      getPromotionCountPerApprovalStatus: build.query<
        GetPromotionCountPerApprovalStatusApiResponse,
        GetPromotionCountPerApprovalStatusApiArg
      >({
        query: () => ({ url: `/api/EmployeeTransaction/counts` }),
        providesTags: ["EmployeeTransaction"],
      }),
      getAllSalaryIncrementList: build.query<
        GetAllSalaryIncrementListApiResponse,
        GetAllSalaryIncrementListApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransaction/GetAllSalaryIncrementList`,
          params: {
            status: queryArg.status,
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
            employeeId: queryArg.employeeId,
          },
        }),
        providesTags: ["EmployeeTransaction"],
      }),
      getEmployeeDemotionById: build.query<
        GetEmployeeDemotionByIdApiResponse,
        GetEmployeeDemotionByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransaction/GetEmployeeDemotionById`,
          params: { id: queryArg.id },
        }),
        providesTags: ["EmployeeTransaction"],
      }),
      getEmployeeDemotionList: build.query<
        GetEmployeeDemotionListApiResponse,
        GetEmployeeDemotionListApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransaction/GetEmployeeDemotionList`,
          params: { employeeId: queryArg.employeeId },
        }),
        providesTags: ["EmployeeTransaction"],
      }),
      getEmployeePromotionById: build.query<
        GetEmployeePromotionByIdApiResponse,
        GetEmployeePromotionByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransaction/GetEmployeePromotionById`,
          params: { id: queryArg.id },
        }),
        providesTags: ["EmployeeTransaction"],
      }),
      getEmployeePromotionList: build.query<
        GetEmployeePromotionListApiResponse,
        GetEmployeePromotionListApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransaction/GetEmployeePromotionList`,
          params: { employeeId: queryArg.employeeId },
        }),
        providesTags: ["EmployeeTransaction"],
      }),
      getEmployeeReClassificationById: build.query<
        GetEmployeeReClassificationByIdApiResponse,
        GetEmployeeReClassificationByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransaction/GetEmployeeReClassificationById`,
          params: { id: queryArg.id },
        }),
        providesTags: ["EmployeeTransaction"],
      }),
      getEmployeeReClassificationList: build.query<
        GetEmployeeReClassificationListApiResponse,
        GetEmployeeReClassificationListApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransaction/GetEmployeeReClassificationList`,
          params: { employeeId: queryArg.employeeId },
        }),
        providesTags: ["EmployeeTransaction"],
      }),
      getSalaryIncrementById: build.query<
        GetSalaryIncrementByIdApiResponse,
        GetSalaryIncrementByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransaction/GetSalaryIncrementById`,
          params: { id: queryArg.id },
        }),
        providesTags: ["EmployeeTransaction"],
      }),
      getSalaryIncrementList: build.query<
        GetSalaryIncrementListApiResponse,
        GetSalaryIncrementListApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransaction/GetSalaryIncrementList`,
          params: { employeeId: queryArg.employeeId },
        }),
        providesTags: ["EmployeeTransaction"],
      }),
      rejectEmployeeDemotion: build.mutation<
        RejectEmployeeDemotionApiResponse,
        RejectEmployeeDemotionApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransaction/RejectEmployeeDemotion`,
          method: "PUT",
          body: queryArg.rejectEmployeeDemotion,
        }),
        invalidatesTags: ["EmployeeTransaction"],
      }),
      rejectEmployeePromotion: build.mutation<
        RejectEmployeePromotionApiResponse,
        RejectEmployeePromotionApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransaction/RejectEmployeePromotion`,
          method: "PUT",
          body: queryArg.rejectEmployeePromotion,
        }),
        invalidatesTags: ["EmployeeTransaction"],
      }),
      rejectEmployeeReClassification: build.mutation<
        RejectEmployeeReClassificationApiResponse,
        RejectEmployeeReClassificationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransaction/RejectEmployeeReClassification`,
          method: "PUT",
          body: queryArg.rejectEmployeeReClassification,
        }),
        invalidatesTags: ["EmployeeTransaction"],
      }),
      rejectSalaryIncrement: build.mutation<
        RejectSalaryIncrementApiResponse,
        RejectSalaryIncrementApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransaction/RejectSalaryIncrement`,
          method: "PUT",
          body: queryArg.rejectSalaryIncrementCommand,
        }),
        invalidatesTags: ["EmployeeTransaction"],
      }),
      submitEmployeeDemotion: build.mutation<
        SubmitEmployeeDemotionApiResponse,
        SubmitEmployeeDemotionApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransaction/SubmitEmployeeDemotion`,
          method: "PUT",
          body: queryArg.submitEmployeeDemotion,
        }),
        invalidatesTags: ["EmployeeTransaction"],
      }),
      submittEmployeePromotion: build.mutation<
        SubmittEmployeePromotionApiResponse,
        SubmittEmployeePromotionApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransaction/submitEmployeePromotion`,
          method: "PUT",
          body: queryArg.submitEmployeePromotion,
        }),
        invalidatesTags: ["EmployeeTransaction"],
      }),
      submitSalaryIncrement: build.mutation<
        SubmitSalaryIncrementApiResponse,
        SubmitSalaryIncrementApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransaction/SubmitSalaryIncrement`,
          method: "PUT",
          body: queryArg.submitSalaryIncrementCommand,
        }),
        invalidatesTags: ["EmployeeTransaction"],
      }),
      submittEmployeeReClassification: build.mutation<
        SubmittEmployeeReClassificationApiResponse,
        SubmittEmployeeReClassificationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransaction/SubmittEmployeeReClassification`,
          method: "PUT",
          body: queryArg.submitEmployeeReClassification,
        }),
        invalidatesTags: ["EmployeeTransaction"],
      }),
      getDemotionCountPerApprovalStatus: build.query<
        GetDemotionCountPerApprovalStatusApiResponse,
        GetDemotionCountPerApprovalStatusApiArg
      >({
        query: () => ({ url: `/api/EmployeeTransaction/TotalDemotion` }),
        providesTags: ["EmployeeTransaction"],
      }),
      updateEmployeeDemotion: build.mutation<
        UpdateEmployeeDemotionApiResponse,
        UpdateEmployeeDemotionApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransaction/UpdateEmployeeDemotion`,
          method: "POST",
          body: queryArg.updateEmployeeDemotionCommand,
        }),
        invalidatesTags: ["EmployeeTransaction"],
      }),
      updateEmployeePromotion: build.mutation<
        UpdateEmployeePromotionApiResponse,
        UpdateEmployeePromotionApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransaction/UpdateEmployeePromotionCommand`,
          method: "POST",
          body: queryArg.updateEmployeePromotionCommand,
        }),
        invalidatesTags: ["EmployeeTransaction"],
      }),
      updateEmployeeReClassification: build.mutation<
        UpdateEmployeeReClassificationApiResponse,
        UpdateEmployeeReClassificationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransaction/UpdateEmployeeReClassification`,
          method: "POST",
          body: queryArg.updateEmployeeReClassificationCommand,
        }),
        invalidatesTags: ["EmployeeTransaction"],
      }),
      updateSalaryIncrement: build.mutation<
        UpdateSalaryIncrementApiResponse,
        UpdateSalaryIncrementApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransaction/UpdateSalaryIncrement`,
          method: "POST",
          body: queryArg.updateSalaryIncrementCommand,
        }),
        invalidatesTags: ["EmployeeTransaction"],
      }),
      createTransfer: build.mutation<
        CreateTransferApiResponse,
        CreateTransferApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransfers/AddEmployeeTransfer`,
          method: "POST",
          body: queryArg.createTransferCommand,
        }),
        invalidatesTags: ["EmployeeTransfers"],
      }),
      approveTransfer: build.mutation<
        ApproveTransferApiResponse,
        ApproveTransferApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransfers/ApproveEmployeeTransfer`,
          method: "POST",
          body: queryArg.approveTransferCommand,
        }),
        invalidatesTags: ["EmployeeTransfers"],
      }),
      getAllTransfersList: build.query<
        GetAllTransfersListApiResponse,
        GetAllTransfersListApiArg
      >({
        query: () => ({ url: `/api/EmployeeTransfers/GetAllTransfersList` }),
        providesTags: ["EmployeeTransfers"],
      }),
      getEmployeeWithDetails: build.query<
        GetEmployeeWithDetailsApiResponse,
        GetEmployeeWithDetailsApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransfers/GetEmployeeWithDetails`,
          params: { id: queryArg.id },
        }),
        providesTags: ["EmployeeTransfers"],
      }),
      getTransferCountPerStatus: build.query<
        GetTransferCountPerStatusApiResponse,
        GetTransferCountPerStatusApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransfers/GetTransferCountPerStatus`,
          params: { employeeId: queryArg.employeeId },
        }),
        providesTags: ["EmployeeTransfers"],
      }),
      getTransferListForPagination: build.query<
        GetTransferListForPaginationApiResponse,
        GetTransferListForPaginationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransfers/GetTransferListForPagination`,
          params: {
            status: queryArg.status,
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
            employeeId: queryArg.employeeId,
          },
        }),
        providesTags: ["EmployeeTransfers"],
      }),
      rejectTransfer: build.mutation<
        RejectTransferApiResponse,
        RejectTransferApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransfers/RejectEmployeeTransfer`,
          method: "POST",
          body: queryArg.rejectTransferCommand,
        }),
        invalidatesTags: ["EmployeeTransfers"],
      }),
      submitTransfer: build.mutation<
        SubmitTransferApiResponse,
        SubmitTransferApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransfers/SubmitEmployeeTransfer`,
          method: "POST",
          body: queryArg.submitTransferCommand,
        }),
        invalidatesTags: ["EmployeeTransfers"],
      }),
      updateTransfer: build.mutation<
        UpdateTransferApiResponse,
        UpdateTransferApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeTransfers/UpdateEmployeeTransfer`,
          method: "PUT",
          body: queryArg.updateTransferCommand,
        }),
        invalidatesTags: ["EmployeeTransfers"],
      }),
      approveEmployeeWarning: build.mutation<
        ApproveEmployeeWarningApiResponse,
        ApproveEmployeeWarningApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeWarning/approve`,
          method: "PATCH",
          body: queryArg.approveEmployeeWarningCommand,
        }),
        invalidatesTags: ["EmployeeWarning"],
      }),
      getEmployeeWarningCountPerStatus: build.query<
        GetEmployeeWarningCountPerStatusApiResponse,
        GetEmployeeWarningCountPerStatusApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeWarning/count`,
          params: { id: queryArg.id },
        }),
        providesTags: ["EmployeeWarning"],
      }),
      createEmployeeWarning: build.mutation<
        CreateEmployeeWarningApiResponse,
        CreateEmployeeWarningApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeWarning/Create`,
          method: "POST",
          body: queryArg.createEmployeeWarningCommand,
        }),
        invalidatesTags: ["EmployeeWarning"],
      }),
      getPaginatedEmployeeWarnings: build.query<
        GetPaginatedEmployeeWarningsApiResponse,
        GetPaginatedEmployeeWarningsApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeWarning/GetPaginatedEmployeeWarnings`,
          params: {
            id: queryArg.id,
            status: queryArg.status,
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["EmployeeWarning"],
      }),
      rejectEmployeeWarning: build.mutation<
        RejectEmployeeWarningApiResponse,
        RejectEmployeeWarningApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeWarning/Reject`,
          method: "PATCH",
          body: queryArg.rejectEmployeeWarningCommand,
        }),
        invalidatesTags: ["EmployeeWarning"],
      }),
      submitEmployeeWarning: build.mutation<
        SubmitEmployeeWarningApiResponse,
        SubmitEmployeeWarningApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeWarning/submit`,
          method: "PATCH",
          body: queryArg.submitEmployeeWarningCommand,
        }),
        invalidatesTags: ["EmployeeWarning"],
      }),
      updateEmployeeWarning: build.mutation<
        UpdateEmployeeWarningApiResponse,
        UpdateEmployeeWarningApiArg
      >({
        query: (queryArg) => ({
          url: `/api/EmployeeWarning/Update`,
          method: "PUT",
          body: queryArg.updateEmployeeWarningCommand,
        }),
        invalidatesTags: ["EmployeeWarning"],
      }),
      approveFieldOfStudy: build.mutation<
        ApproveFieldOfStudyApiResponse,
        ApproveFieldOfStudyApiArg
      >({
        query: (queryArg) => ({
          url: `/api/FieldOfStudy/approve`,
          method: "PATCH",
          body: queryArg.approveFieldOfStudyCommand,
        }),
        invalidatesTags: ["FieldOfStudy", "Dashboard"],
      }),
      getFieldOfStudyCountPerStatus: build.query<
        GetFieldOfStudyCountPerStatusApiResponse,
        GetFieldOfStudyCountPerStatusApiArg
      >({
        query: () => ({ url: `/api/FieldOfStudy/count` }),
        providesTags: ["FieldOfStudy"],
      }),
      createFieldOfStudy: build.mutation<
        CreateFieldOfStudyApiResponse,
        CreateFieldOfStudyApiArg
      >({
        query: (queryArg) => ({
          url: `/api/FieldOfStudy/create`,
          method: "POST",
          body: queryArg.createFieldOfStudyCommand,
        }),
        invalidatesTags: ["FieldOfStudy", "Dashboard"],
      }),
      getAllFieldOfStudy: build.query<
        GetAllFieldOfStudyApiResponse,
        GetAllFieldOfStudyApiArg
      >({
        query: () => ({ url: `/api/FieldOfStudy/GetAll` }),
        providesTags: ["FieldOfStudy"],
      }),
      getFieldOfStudiesForPagination: build.query<
        GetFieldOfStudiesForPaginationApiResponse,
        GetFieldOfStudiesForPaginationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/FieldOfStudy/GetFieldOfStudiesForPagination`,
          params: {
            status: queryArg.status,
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["FieldOfStudy"],
      }),
      rejectFieldOfStudy: build.mutation<
        RejectFieldOfStudyApiResponse,
        RejectFieldOfStudyApiArg
      >({
        query: (queryArg) => ({
          url: `/api/FieldOfStudy/Reject`,
          method: "PATCH",
          body: queryArg.rejectFieldOfStudyCommand,
        }),
        invalidatesTags: ["FieldOfStudy", "Dashboard"],
      }),
      searchAllFieldOfStudies: build.query<
        SearchAllFieldOfStudiesApiResponse,
        SearchAllFieldOfStudiesApiArg
      >({
        query: () => ({ url: `/api/FieldOfStudy/search` }),
        providesTags: ["FieldOfStudy"],
      }),
      submitFieldOfStudy: build.mutation<
        SubmitFieldOfStudyApiResponse,
        SubmitFieldOfStudyApiArg
      >({
        query: (queryArg) => ({
          url: `/api/FieldOfStudy/submit`,
          method: "PATCH",
          body: queryArg.submitFieldOfStudyCommand,
        }),
        invalidatesTags: ["FieldOfStudy", "Dashboard"],
      }),
      updateFieldOfStudy: build.mutation<
        UpdateFieldOfStudyApiResponse,
        UpdateFieldOfStudyApiArg
      >({
        query: (queryArg) => ({
          url: `/api/FieldOfStudy/update`,
          method: "PUT",
          body: queryArg.updateFieldOfStudyCommand,
        }),
        invalidatesTags: ["FieldOfStudy"],
      }),
<<<<<<< HEAD
      getApiHealth: build.query<GetApiHealthApiResponse, GetApiHealthApiArg>({
        query: () => ({ url: `/api/Health` }),
        providesTags: ["Health"],
      }),
      createHearing: build.mutation<
        CreateHearingApiResponse,
        CreateHearingApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Hearing/Create`,
          method: "POST",
          body: queryArg.createHearingCommand,
        }),
        invalidatesTags: ["Hearing"],
      }),
      getHearingByCaseId: build.query<
        GetHearingByCaseIdApiResponse,
        GetHearingByCaseIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Hearing/GetHearingByCaseId`,
          params: { caseId: queryArg.caseId },
        }),
        providesTags: ["Hearing"],
      }),
      updateHearing: build.mutation<
        UpdateHearingApiResponse,
        UpdateHearingApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Hearing/update`,
          method: "PUT",
          body: queryArg.updateHearingCommand,
          params: { id: queryArg.id },
        }),
        invalidatesTags: ["Hearing"],
      }),
=======
>>>>>>> origin/Solomon/v2
      approveInstitutionName: build.mutation<
        ApproveInstitutionNameApiResponse,
        ApproveInstitutionNameApiArg
      >({
        query: (queryArg) => ({
          url: `/api/InstitutionName/approve`,
          method: "PATCH",
          body: queryArg.approveInstitutionNameCommand,
        }),
        invalidatesTags: ["InstitutionName", "Dashboard"],
      }),
      getInstitutionNameCountPerStatus: build.query<
        GetInstitutionNameCountPerStatusApiResponse,
        GetInstitutionNameCountPerStatusApiArg
      >({
        query: () => ({ url: `/api/InstitutionName/count` }),
        providesTags: ["InstitutionName"],
      }),
      createInstitutionName: build.mutation<
        CreateInstitutionNameApiResponse,
        CreateInstitutionNameApiArg
      >({
        query: (queryArg) => ({
          url: `/api/InstitutionName/create`,
          method: "POST",
          body: queryArg.createInstitutionNameCommand,
        }),
        invalidatesTags: ["InstitutionName", "Dashboard"],
      }),
      getAllInstitutionName: build.query<
        GetAllInstitutionNameApiResponse,
        GetAllInstitutionNameApiArg
      >({
        query: () => ({ url: `/api/InstitutionName/GetAll` }),
        providesTags: ["InstitutionName"],
      }),
      getInstitutionNamesForPagination: build.query<
        GetInstitutionNamesForPaginationApiResponse,
        GetInstitutionNamesForPaginationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/InstitutionName/GetInstitutionNamesForPagination`,
          params: {
            status: queryArg.status,
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["InstitutionName"],
      }),
      rejectInstitutionName: build.mutation<
        RejectInstitutionNameApiResponse,
        RejectInstitutionNameApiArg
      >({
        query: (queryArg) => ({
          url: `/api/InstitutionName/Reject`,
          method: "PATCH",
          body: queryArg.rejectInstitutionNameCommand,
        }),
        invalidatesTags: ["InstitutionName", "Dashboard"],
      }),
      searchAllInstitutionNames: build.query<
        SearchAllInstitutionNamesApiResponse,
        SearchAllInstitutionNamesApiArg
      >({
        query: () => ({ url: `/api/InstitutionName/search` }),
        providesTags: ["InstitutionName"],
      }),
      submitInstitutionName: build.mutation<
        SubmitInstitutionNameApiResponse,
        SubmitInstitutionNameApiArg
      >({
        query: (queryArg) => ({
          url: `/api/InstitutionName/submit`,
          method: "PATCH",
          body: queryArg.submitInstitutionNameCommand,
        }),
        invalidatesTags: ["InstitutionName", "Dashboard"],
      }),
      updateInstitutionName: build.mutation<
        UpdateInstitutionNameApiResponse,
        UpdateInstitutionNameApiArg
      >({
        query: (queryArg) => ({
          url: `/api/InstitutionName/update`,
          method: "PUT",
          body: queryArg.updateInstitutionNameCommand,
        }),
        invalidatesTags: ["InstitutionName"],
      }),
      activateJobRole: build.mutation<
        ActivateJobRoleApiResponse,
        ActivateJobRoleApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Job/Activate`,
          method: "PUT",
          body: queryArg.activateJobRoleCommand,
        }),
        invalidatesTags: ["Job", "Dashboard"],
      }),
      activateJob: build.mutation<ActivateJobApiResponse, ActivateJobApiArg>({
        query: (queryArg) => ({
          url: `/api/Job/ActivateJob`,
          method: "POST",
          body: queryArg.activateJobCommand,
        }),
        invalidatesTags: ["Job", "Dashboard"],
      }),
      addJob: build.mutation<AddJobApiResponse, AddJobApiArg>({
        query: (queryArg) => ({
          url: `/api/Job/AddJob`,
          method: "POST",
          body: queryArg.addJobCommand,
        }),
        invalidatesTags: ["Job", "Dashboard"],
      }),
      addJobRole: build.mutation<AddJobRoleApiResponse, AddJobRoleApiArg>({
        query: (queryArg) => ({
          url: `/api/Job/AddJobRoles`,
          method: "POST",
          body: queryArg.addJobRoleCommand,
        }),
        invalidatesTags: ["Job", "Dashboard"],
      }),
      getAllJobList: build.query<GetAllJobListApiResponse, GetAllJobListApiArg>(
        {
          query: () => ({ url: `/api/Job/AllJobList` }),
          providesTags: ["Job"],
        }
      ),
      getAllJobRole: build.query<GetAllJobRoleApiResponse, GetAllJobRoleApiArg>(
        {
          query: () => ({ url: `/api/Job/allJobRole` }),
          providesTags: ["Job"],
        }
      ),
      getJobRolesLists: build.query<
        GetJobRolesListsApiResponse,
        GetJobRolesListsApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Job/allJobRoles`,
          params: {
            status: queryArg.status,
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Job"],
      }),
      approveJob: build.mutation<ApproveJobApiResponse, ApproveJobApiArg>({
        query: (queryArg) => ({
          url: `/api/Job/ApproveJob`,
          method: "POST",
          body: queryArg.approveJobCommand,
        }),
        invalidatesTags: ["Job", "Dashboard"],
      }),
      approveJobRole: build.mutation<
        ApproveJobRoleApiResponse,
        ApproveJobRoleApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Job/ApproveJobRole`,
          method: "PUT",
          body: queryArg.approveJobRolesCommand,
        }),
        invalidatesTags: ["Job", "Dashboard"],
      }),
      getJobRolesCountPerApprovalStatus: build.query<
        GetJobRolesCountPerApprovalStatusApiResponse,
        GetJobRolesCountPerApprovalStatusApiArg
      >({
        query: () => ({ url: `/api/Job/counts` }),
        providesTags: ["Job"],
      }),
      deactivateJobRole: build.mutation<
        DeactivateJobRoleApiResponse,
        DeactivateJobRoleApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Job/Deactivate`,
          method: "PUT",
          body: queryArg.deactivateJobRoleCommand,
        }),
        invalidatesTags: ["Job", "Dashboard"],
      }),
      deactivateJob: build.mutation<
        DeactivateJobApiResponse,
        DeactivateJobApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Job/DeactivateJob`,
          method: "POST",
          body: queryArg.deactivateJobCommand,
        }),
        invalidatesTags: ["Job", "Dashboard"],
      }),
      getJobByBuId: build.query<GetJobByBuIdApiResponse, GetJobByBuIdApiArg>({
        query: (queryArg) => ({
          url: `/api/Job/GetJobByBUId`,
          params: { id: queryArg.id, employeeId: queryArg.employeeId },
        }),
        providesTags: ["Job"],
      }),
      getJobForPagination: build.query<
        GetJobForPaginationApiResponse,
        GetJobForPaginationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Job/GetJobForPagination`,
          params: {
            status: queryArg.status,
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Job"],
      }),
      getJobListByBusinessUnitAndJobRole: build.query<
        GetJobListByBusinessUnitAndJobRoleApiResponse,
        GetJobListByBusinessUnitAndJobRoleApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Job/GetJobListByBusinessUnitAndJobRole`,
          params: {
            businessUnit: queryArg.businessUnit,
            jobRole: queryArg.jobRole,
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Job"],
      }),
      getJobRoleById: build.query<
        GetJobRoleByIdApiResponse,
        GetJobRoleByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Job/GetJobRoleById`,
          params: { id: queryArg.id },
        }),
        providesTags: ["Job"],
      }),
      getJobRoleforPromotion: build.query<
        GetJobRoleforPromotionApiResponse,
        GetJobRoleforPromotionApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Job/GetJobRoleforPromotion`,
          params: { rolename: queryArg.rolename },
        }),
        providesTags: ["Job"],
      }),
      getJobCountPerStatus: build.query<
        GetJobCountPerStatusApiResponse,
        GetJobCountPerStatusApiArg
      >({
        query: () => ({ url: `/api/Job/JobCountsBystatus` }),
        providesTags: ["Job"],
      }),
      rejectJob: build.mutation<RejectJobApiResponse, RejectJobApiArg>({
        query: (queryArg) => ({
          url: `/api/Job/RejectJob`,
          method: "POST",
          body: queryArg.rejectJobCommand,
        }),
        invalidatesTags: ["Job", "Dashboard"],
      }),
      rejectJobRole: build.mutation<
        RejectJobRoleApiResponse,
        RejectJobRoleApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Job/RejectJobRole`,
          method: "PUT",
          body: queryArg.rejectJobRolesCommand,
        }),
        invalidatesTags: ["Job", "Dashboard"],
      }),
      submitJob: build.mutation<SubmitJobApiResponse, SubmitJobApiArg>({
        query: (queryArg) => ({
          url: `/api/Job/SubmitJob`,
          method: "POST",
          body: queryArg.submitJobCommand,
        }),
        invalidatesTags: ["Job", "Dashboard"],
      }),
      submitJobRoles: build.mutation<
        SubmitJobRolesApiResponse,
        SubmitJobRolesApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Job/SubmitJobRoles`,
          method: "PUT",
          body: queryArg.submitJobRolesCommand,
        }),
        invalidatesTags: ["Job", "Dashboard"],
      }),
      updateJob: build.mutation<UpdateJobApiResponse, UpdateJobApiArg>({
        query: (queryArg) => ({
          url: `/api/Job/UpdateJob`,
          method: "PUT",
          body: queryArg.updateJobCommand,
        }),
        invalidatesTags: ["Job"],
      }),
      updateJobRole: build.mutation<
        UpdateJobRoleApiResponse,
        UpdateJobRoleApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Job/UpdateJobRole`,
          method: "PUT",
          body: queryArg.updateJobRoleCommand,
        }),
        invalidatesTags: ["Job"],
      }),
      activateJobCategory: build.mutation<
        ActivateJobCategoryApiResponse,
        ActivateJobCategoryApiArg
      >({
        query: (queryArg) => ({
          url: `/api/JobCategory/ActivateJobCategory/${queryArg.id}`,
          method: "PUT",
        }),
        invalidatesTags: ["JobCategory", "Dashboard"],
      }),
      approveJobCatagory: build.mutation<
        ApproveJobCatagoryApiResponse,
        ApproveJobCatagoryApiArg
      >({
        query: (queryArg) => ({
          url: `/api/JobCategory/ApproveJobCategory/${queryArg.id}`,
          method: "PUT",
        }),
        invalidatesTags: ["JobCategory", "Dashboard"],
      }),
      createJobCategoy: build.mutation<
        CreateJobCategoyApiResponse,
        CreateJobCategoyApiArg
      >({
        query: (queryArg) => ({
          url: `/api/JobCategory/CreateJobCategory`,
          method: "POST",
          body: queryArg.createJobCategoryCommand,
        }),
        invalidatesTags: ["JobCategory", "Dashboard"],
      }),
      deactivateJobCategoy: build.mutation<
        DeactivateJobCategoyApiResponse,
        DeactivateJobCategoyApiArg
      >({
        query: (queryArg) => ({
          url: `/api/JobCategory/DeactivateJobCategoy/${queryArg.id}`,
          method: "PUT",
        }),
        invalidatesTags: ["JobCategory", "Dashboard"],
      }),
      deleteJobCategory: build.mutation<
        DeleteJobCategoryApiResponse,
        DeleteJobCategoryApiArg
      >({
        query: (queryArg) => ({
          url: `/api/JobCategory/DeleteJobCategory/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["JobCategory", "Dashboard"],
      }),
      getAllJobCategory: build.query<
        GetAllJobCategoryApiResponse,
        GetAllJobCategoryApiArg
      >({
        query: () => ({ url: `/api/JobCategory/GetAll` }),
        providesTags: ["JobCategory"],
      }),
      getJobCategoriesListForPaginationQuery: build.query<
        GetJobCategoriesListForPaginationQueryApiResponse,
        GetJobCategoriesListForPaginationQueryApiArg
      >({
        query: (queryArg) => ({
          url: `/api/JobCategory/GetJobCategoriesListForPaginationQuery`,
          params: {
            status: queryArg.status,
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["JobCategory"],
      }),
      getJobCategoryById: build.query<
        GetJobCategoryByIdApiResponse,
        GetJobCategoryByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/JobCategory/GetJobCategoryById/${queryArg.id}`,
        }),
        providesTags: ["JobCategory"],
      }),
      getJobCategoryCountByApprovalStatus: build.query<
        GetJobCategoryCountByApprovalStatusApiResponse,
        GetJobCategoryCountByApprovalStatusApiArg
      >({
        query: () => ({
          url: `/api/JobCategory/GetJobCategoryCountByApprovalStatus`,
        }),
        providesTags: ["JobCategory"],
      }),
      getJobCatagoryListQuery: build.query<
        GetJobCatagoryListQueryApiResponse,
        GetJobCatagoryListQueryApiArg
      >({
        query: () => ({ url: `/api/JobCategory/GetJobCategoryListQuery` }),
        providesTags: ["JobCategory"],
      }),
      rejectJobCategory: build.mutation<
        RejectJobCategoryApiResponse,
        RejectJobCategoryApiArg
      >({
        query: (queryArg) => ({
          url: `/api/JobCategory/RejectJobCategory`,
          method: "PUT",
          body: queryArg.rejectJobCategoryCommand,
        }),
        invalidatesTags: ["JobCategory", "Dashboard"],
      }),
      submitJobCategory: build.mutation<
        SubmitJobCategoryApiResponse,
        SubmitJobCategoryApiArg
      >({
        query: (queryArg) => ({
          url: `/api/JobCategory/SubmitJobCategory/${queryArg.id}`,
          method: "PUT",
        }),
        invalidatesTags: ["JobCategory", "Dashboard"],
      }),
      updateJobCategory: build.mutation<
        UpdateJobCategoryApiResponse,
        UpdateJobCategoryApiArg
      >({
        query: (queryArg) => ({
          url: `/api/JobCategory/UpdateJobCategory`,
          method: "PUT",
          body: queryArg.updateJobCategoryCommand,
        }),
        invalidatesTags: ["JobCategory"],
      }),
      addJobGrade: build.mutation<AddJobGradeApiResponse, AddJobGradeApiArg>({
        query: (queryArg) => ({
          url: `/api/JobGrade/AddJobGrade`,
          method: "POST",
          body: queryArg.addJobGradeCommand,
        }),
        invalidatesTags: ["JobGrade", "Dashboard"],
      }),
      getAllJobGrade: build.query<
        GetAllJobGradeApiResponse,
        GetAllJobGradeApiArg
      >({
        query: () => ({ url: `/api/JobGrade/allJobGrades` }),
        providesTags: ["JobGrade"],
      }),
      approveJobGrade: build.mutation<
        ApproveJobGradeApiResponse,
        ApproveJobGradeApiArg
      >({
        query: (queryArg) => ({
          url: `/api/JobGrade/ApproveJobGrade`,
          method: "PUT",
          body: queryArg.approveJobGradeCommand,
        }),
        invalidatesTags: ["JobGrade", "Dashboard"],
      }),
      getJobGradesCountPerApprovalStatus: build.query<
        GetJobGradesCountPerApprovalStatusApiResponse,
        GetJobGradesCountPerApprovalStatusApiArg
      >({
        query: () => ({ url: `/api/JobGrade/counts` }),
        providesTags: ["JobGrade"],
      }),
      getJobGradeOfJobRole: build.query<
        GetJobGradeOfJobRoleApiResponse,
        GetJobGradeOfJobRoleApiArg
      >({
        query: (queryArg) => ({
          url: `/api/JobGrade/GetJobGradeOfJobRole`,
          params: { roleid: queryArg.roleid },
        }),
        providesTags: ["JobGrade"],
      }),
      getJobGradesList: build.query<
        GetJobGradesListApiResponse,
        GetJobGradesListApiArg
      >({
        query: (queryArg) => ({
          url: `/api/JobGrade/GetJobGradesList`,
          params: {
            status: queryArg.status,
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["JobGrade"],
      }),
      getSalaryOfEmployeeByRole: build.query<
        GetSalaryOfEmployeeByRoleApiResponse,
        GetSalaryOfEmployeeByRoleApiArg
      >({
        query: (queryArg) => ({
          url: `/api/JobGrade/GetSalaryOfEmployeeByRole`,
          params: {
            gradeId: queryArg.gradeId,
            salarytype: queryArg.salarytype,
            step: queryArg.step,
            stepId: queryArg.stepId,
          },
        }),
        providesTags: ["JobGrade"],
      }),
      rejectJobGrade: build.mutation<
        RejectJobGradeApiResponse,
        RejectJobGradeApiArg
      >({
        query: (queryArg) => ({
          url: `/api/JobGrade/RejectJobGrade`,
          method: "PUT",
          body: queryArg.rejectJobGradeCommand,
        }),
        invalidatesTags: ["JobGrade", "Dashboard"],
      }),
      submitJobGrade: build.mutation<
        SubmitJobGradeApiResponse,
        SubmitJobGradeApiArg
      >({
        query: (queryArg) => ({
          url: `/api/JobGrade/SubmitJobGrade`,
          method: "PUT",
          body: queryArg.submitJobGradeCommand,
        }),
        invalidatesTags: ["JobGrade", "Dashboard"],
      }),
      updateJobGrade: build.mutation<
        UpdateJobGradeApiResponse,
        UpdateJobGradeApiArg
      >({
        query: (queryArg) => ({
          url: `/api/JobGrade/UpdateJobGrade`,
          method: "PUT",
          body: queryArg.updateJobGradeCommand,
        }),
        invalidatesTags: ["JobGrade"],
      }),
      approveJobRoleCategory: build.mutation<
        ApproveJobRoleCategoryApiResponse,
        ApproveJobRoleCategoryApiArg
      >({
        query: (queryArg) => ({
          url: `/api/JobRoleCategory/approve`,
          method: "PATCH",
          body: queryArg.approveJobRoleCatagoryCommand,
        }),
        invalidatesTags: ["JobRoleCategory", "Dashboard"],
      }),
      getJobRoleCategoryCountPerStatus: build.query<
        GetJobRoleCategoryCountPerStatusApiResponse,
        GetJobRoleCategoryCountPerStatusApiArg
      >({
        query: () => ({ url: `/api/JobRoleCategory/count` }),
        providesTags: ["JobRoleCategory"],
      }),
      createJobRoleCategory: build.mutation<
        CreateJobRoleCategoryApiResponse,
        CreateJobRoleCategoryApiArg
      >({
        query: (queryArg) => ({
          url: `/api/JobRoleCategory/Create`,
          method: "POST",
          body: queryArg.createJobRoleCatagoryCommand,
        }),
        invalidatesTags: ["JobRoleCategory", "Dashboard"],
      }),
      getAllJobRoleCategory: build.query<
        GetAllJobRoleCategoryApiResponse,
        GetAllJobRoleCategoryApiArg
      >({
        query: () => ({ url: `/api/JobRoleCategory/GetAll` }),
        providesTags: ["JobRoleCategory"],
      }),
      getJobRoleCategoriesForPagination: build.query<
        GetJobRoleCategoriesForPaginationApiResponse,
        GetJobRoleCategoriesForPaginationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/JobRoleCategory/GetJobRoleCategoriesForPagination`,
          params: {
            status: queryArg.status,
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["JobRoleCategory"],
      }),
      rejectJobRoleCategory: build.mutation<
        RejectJobRoleCategoryApiResponse,
        RejectJobRoleCategoryApiArg
      >({
        query: (queryArg) => ({
          url: `/api/JobRoleCategory/Reject`,
          method: "PATCH",
          body: queryArg.rejectJobRoleCatagoryCommand,
        }),
        invalidatesTags: ["JobRoleCategory", "Dashboard"],
      }),
      searchAllJobRoleCatagories: build.query<
        SearchAllJobRoleCatagoriesApiResponse,
        SearchAllJobRoleCatagoriesApiArg
      >({
        query: () => ({ url: `/api/JobRoleCategory/search` }),
        providesTags: ["JobRoleCategory"],
      }),
      submitJobRoleCategory: build.mutation<
        SubmitJobRoleCategoryApiResponse,
        SubmitJobRoleCategoryApiArg
      >({
        query: (queryArg) => ({
          url: `/api/JobRoleCategory/submit`,
          method: "PATCH",
          body: queryArg.submitJobRoleCatagoryCommand,
        }),
        invalidatesTags: ["JobRoleCategory", "Dashboard"],
      }),
      updateJobRoleCategory: build.mutation<
        UpdateJobRoleCategoryApiResponse,
        UpdateJobRoleCategoryApiArg
      >({
        query: (queryArg) => ({
          url: `/api/JobRoleCategory/Update`,
          method: "PUT",
          body: queryArg.updateJobRoleCatagoryCommand,
        }),
        invalidatesTags: ["JobRoleCategory"],
      }),
      createJudgeAssignment: build.mutation<
        CreateJudgeAssignmentApiResponse,
        CreateJudgeAssignmentApiArg
      >({
        query: (queryArg) => ({
          url: `/api/JudgeAssignment/Create`,
          method: "POST",
          body: queryArg.createJudgeAssignmentCommand,
        }),
        invalidatesTags: ["JudgeAssignment"],
      }),
      getJudgeAssignmentsByCaseId: build.query<
        GetJudgeAssignmentsByCaseIdApiResponse,
        GetJudgeAssignmentsByCaseIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/JudgeAssignment/GetByCaseId`,
          params: { caseId: queryArg.caseId },
        }),
        providesTags: ["JudgeAssignment"],
      }),
      updateJudgeAssignment: build.mutation<
        UpdateJudgeAssignmentApiResponse,
        UpdateJudgeAssignmentApiArg
      >({
        query: (queryArg) => ({
          url: `/api/JudgeAssignment/Update`,
          method: "PUT",
          body: queryArg.updateJudgeAssignmentCommand,
          params: { id: queryArg.id },
        }),
        invalidatesTags: ["JudgeAssignment"],
      }),
      createJudgment: build.mutation<
        CreateJudgmentApiResponse,
        CreateJudgmentApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Judgment/Create`,
          method: "POST",
          body: queryArg.createJudgmentCommand,
        }),
        invalidatesTags: ["Judgment"],
      }),
      getJudgmentsByCaseId: build.query<
        GetJudgmentsByCaseIdApiResponse,
        GetJudgmentsByCaseIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Judgment/GetByCaseId`,
          params: { caseId: queryArg.caseId },
        }),
        providesTags: ["Judgment"],
      }),
      updateJudgment: build.mutation<
        UpdateJudgmentApiResponse,
        UpdateJudgmentApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Judgment/Update`,
          method: "PUT",
          body: queryArg.updateJudgmentCommand,
          params: { id: queryArg.id },
        }),
        invalidatesTags: ["Judgment"],
      }),
      createLanguage: build.mutation<
        CreateLanguageApiResponse,
        CreateLanguageApiArg
      >({
        query: (queryArg) => ({
          url: `/api/LanguageSkill/create`,
          method: "POST",
          body: queryArg.createLanguageSkillCommand,
        }),
        invalidatesTags: ["LanguageSkill", "EmployeeProfile"],
      }),
      deleteLanguageSkill: build.mutation<
        DeleteLanguageSkillApiResponse,
        DeleteLanguageSkillApiArg
      >({
        query: (queryArg) => ({
          url: `/api/LanguageSkill/delete`,
          method: "DELETE",
          body: queryArg.deleteLanguageSkillCommand,
        }),
        invalidatesTags: ["LanguageSkill"],
      }),
      getLanguageSkillById: build.query<
        GetLanguageSkillByIdApiResponse,
        GetLanguageSkillByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/LanguageSkill/GetLanguageSkillById`,
          params: { employeeId: queryArg.employeeId },
        }),
        providesTags: ["LanguageSkill"],
      }),
      updateLanguageSkill: build.mutation<
        UpdateLanguageSkillApiResponse,
        UpdateLanguageSkillApiArg
      >({
        query: (queryArg) => ({
          url: `/api/LanguageSkill/update`,
          method: "PUT",
          body: queryArg.updateLanguageSkillCommand,
        }),
        invalidatesTags: ["LanguageSkill"],
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
      addLetterDocument: build.mutation<
        AddLetterDocumentApiResponse,
        AddLetterDocumentApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Letter/${queryArg.id}/add-Document`,
          method: "POST",
          body: queryArg.body,
          params: { documentType: queryArg.documentType },
        }),
        invalidatesTags: ["Letter"],
      }),
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
        query: (queryArg) => ({
          url: `/api/Letter/count`,
          params: { userId: queryArg.userId },
        }),
        providesTags: ["Letter"],
      }),
      createEditableLetter: build.mutation<
        CreateEditableLetterApiResponse,
        CreateEditableLetterApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Letter/editable`,
          method: "POST",
          body: queryArg.createEditableLetterCommand,
        }),
        invalidatesTags: ["Letter"],
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
            userId: queryArg.userId,
          },
        }),
        providesTags: ["Letter"],
      }),
      rejectLetter: build.mutation<RejectLetterApiResponse, RejectLetterApiArg>(
        {
          query: (queryArg) => ({
            url: `/api/Letter/Reject`,
            method: "PATCH",
            body: queryArg.rejectLetterCommand,
          }),
          invalidatesTags: ["Letter"],
        }
      ),
      searchAllLetters: build.query<
        SearchAllLettersApiResponse,
        SearchAllLettersApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Letter/search-all`,
          params: { userId: queryArg.userId },
        }),
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
<<<<<<< HEAD
      getUserConversations: build.query<
        GetUserConversationsApiResponse,
        GetUserConversationsApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Message/conversations`,
          params: { userId: queryArg.userId },
        }),
        providesTags: ["Message"],
      }),
      markMessagesAsRead: build.mutation<
        MarkMessagesAsReadApiResponse,
        MarkMessagesAsReadApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Message/mark-read/${queryArg.chatPartnerId}`,
          method: "POST",
          params: { userId: queryArg.userId },
        }),
        invalidatesTags: ["Message"],
      }),
      getMessages: build.query<GetMessagesApiResponse, GetMessagesApiArg>({
        query: (queryArg) => ({
          url: `/api/Message/messages/${queryArg.chatPartnerId}`,
          params: { userId: queryArg.userId },
        }),
        providesTags: ["Message"],
      }),
      sendMessage: build.mutation<SendMessageApiResponse, SendMessageApiArg>({
        query: (queryArg) => ({
          url: `/api/Message/send`,
          method: "POST",
          body: queryArg.sendMessageCommand,
        }),
        invalidatesTags: ["Message"],
      }),
      createNotification: build.mutation<
        CreateNotificationApiResponse,
        CreateNotificationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Notification/Create`,
          method: "POST",
          body: queryArg.createNotificationCommand,
        }),
        invalidatesTags: ["Notification"],
      }),
      getNotificationsByUserId: build.query<
        GetNotificationsByUserIdApiResponse,
        GetNotificationsByUserIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Notification/GetByUserId/${queryArg.userId}`,
        }),
        providesTags: ["Notification"],
      }),
      updateNotification: build.mutation<
        UpdateNotificationApiResponse,
        UpdateNotificationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Notification/Update/${queryArg.id}`,
          method: "PUT",
          body: queryArg.updateNotificationCommand,
        }),
        invalidatesTags: ["Notification"],
      }),
      createPayment: build.mutation<
        CreatePaymentApiResponse,
        CreatePaymentApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Payment/Create`,
          method: "POST",
          body: queryArg.createPaymentCommand,
        }),
        invalidatesTags: ["Payment"],
      }),
      getAllPayments: build.query<
        GetAllPaymentsApiResponse,
        GetAllPaymentsApiArg
      >({
        query: () => ({ url: `/api/Payment/GetAll` }),
        providesTags: ["Payment"],
      }),
      getPaymentsByBusinessUnit: build.query<
        GetPaymentsByBusinessUnitApiResponse,
        GetPaymentsByBusinessUnitApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Payment/GetByBusinessUnit`,
          params: { businessUnitId: queryArg.businessUnitId },
        }),
        providesTags: ["Payment"],
      }),
      getPaymentsByCaseId: build.query<
        GetPaymentsByCaseIdApiResponse,
        GetPaymentsByCaseIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Payment/GetByCaseId`,
          params: { caseId: queryArg.caseId },
        }),
        providesTags: ["Payment"],
      }),
      getById: build.query<GetByIdApiResponse, GetByIdApiArg>({
        query: (queryArg) => ({
          url: `/api/Payment/GetById`,
          params: { id: queryArg.id },
        }),
        providesTags: ["Payment"],
      }),
      updatePayment: build.mutation<
        UpdatePaymentApiResponse,
        UpdatePaymentApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Payment/Update`,
          method: "PUT",
          body: queryArg.updatePaymentCommand,
          params: { id: queryArg.id },
        }),
        invalidatesTags: ["Payment"],
=======
      approveReemployment: build.mutation<
        ApproveReemploymentApiResponse,
        ApproveReemploymentApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Reemployment/ApproveReemployment`,
          method: "POST",
          body: queryArg.approveReemploymentCommand,
        }),
        invalidatesTags: ["Reemployment"],
      }),
      createReemployment: build.mutation<
        CreateReemploymentApiResponse,
        CreateReemploymentApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Reemployment/CreateReemployment`,
          method: "POST",
          body: queryArg.createReemploymentCommand,
        }),
        invalidatesTags: ["Reemployment"],
      }),
      getAllReemploymentsList: build.query<
        GetAllReemploymentsListApiResponse,
        GetAllReemploymentsListApiArg
      >({
        query: () => ({ url: `/api/Reemployment/GetAllReemploymentsList` }),
        providesTags: ["Reemployment"],
      }),
      getReemploymentById: build.query<
        GetReemploymentByIdApiResponse,
        GetReemploymentByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Reemployment/GetReemploymentById`,
          params: { reemploymentId: queryArg.reemploymentId },
        }),
        providesTags: ["Reemployment"],
      }),
      getReemploymentCountPerStatus: build.query<
        GetReemploymentCountPerStatusApiResponse,
        GetReemploymentCountPerStatusApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Reemployment/GetReemploymentCountPerStatus`,
          params: { employeeId: queryArg.employeeId },
        }),
        providesTags: ["Reemployment"],
      }),
      getReemploymentListForPagination: build.query<
        GetReemploymentListForPaginationApiResponse,
        GetReemploymentListForPaginationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Reemployment/GetReemploymentListForPagination`,
          params: {
            status: queryArg.status,
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
            employeeId: queryArg.employeeId,
          },
        }),
        providesTags: ["Reemployment"],
      }),
      rejectReemployment: build.mutation<
        RejectReemploymentApiResponse,
        RejectReemploymentApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Reemployment/RejectReemployment`,
          method: "POST",
          body: queryArg.rejectReemploymentCommand,
        }),
        invalidatesTags: ["Reemployment"],
      }),
      submitReemployment: build.mutation<
        SubmitReemploymentApiResponse,
        SubmitReemploymentApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Reemployment/SubmitReemployment`,
          method: "POST",
          body: queryArg.submitReemploymentCommand,
        }),
        invalidatesTags: ["Reemployment"],
      }),
      updateReemployment: build.mutation<
        UpdateReemploymentApiResponse,
        UpdateReemploymentApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Reemployment/UpdateReemployment`,
          method: "POST",
          body: queryArg.updateReemploymentCommand,
        }),
        invalidatesTags: ["Reemployment"],
>>>>>>> origin/Solomon/v2
      }),
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
      approveResignation: build.mutation<
        ApproveResignationApiResponse,
        ApproveResignationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Resignation/Approve`,
          method: "PATCH",
          body: queryArg.approveResignationCommand,
        }),
        invalidatesTags: ["Resignation"],
      }),
      getResignationCountPerStatus: build.query<
        GetResignationCountPerStatusApiResponse,
        GetResignationCountPerStatusApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Resignation/Count`,
          params: { employeeId: queryArg.employeeId },
        }),
        providesTags: ["Resignation"],
      }),
      createResignation: build.mutation<
        CreateResignationApiResponse,
        CreateResignationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Resignation/Create`,
          method: "POST",
          body: queryArg.createResignationCommand,
        }),
        invalidatesTags: ["Resignation"],
      }),
      getActiveResignation: build.query<
        GetActiveResignationApiResponse,
        GetActiveResignationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Resignation/GetAllActive`,
          params: { id: queryArg.id },
        }),
        providesTags: ["Resignation"],
      }),
      getPaginatedResignations: build.query<
        GetPaginatedResignationsApiResponse,
        GetPaginatedResignationsApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Resignation/GetPaginatedResignations`,
          params: {
            employeeId: queryArg.employeeId,
            status: queryArg.status,
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Resignation"],
      }),
      rejectResignation: build.mutation<
        RejectResignationApiResponse,
        RejectResignationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Resignation/Reject`,
          method: "PATCH",
          body: queryArg.rejectResignationCommand,
        }),
        invalidatesTags: ["Resignation"],
      }),
      submitResignation: build.mutation<
        SubmitResignationApiResponse,
        SubmitResignationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Resignation/Submit`,
          method: "PATCH",
          body: queryArg.submitResignationCommand,
        }),
        invalidatesTags: ["Resignation"],
      }),
      updateResignation: build.mutation<
        UpdateResignationApiResponse,
        UpdateResignationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Resignation/Update`,
          method: "PUT",
          body: queryArg.updateResignationCommand,
        }),
        invalidatesTags: ["Resignation"],
      }),
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
      approveSuspension: build.mutation<
        ApproveSuspensionApiResponse,
        ApproveSuspensionApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Suspension/Approve`,
          method: "PATCH",
          body: queryArg.approveSuspensionCommand,
        }),
        invalidatesTags: ["Suspension"],
      }),
      getSuspensionCountPerStatus: build.query<
        GetSuspensionCountPerStatusApiResponse,
        GetSuspensionCountPerStatusApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Suspension/Count`,
          params: { employeeId: queryArg.employeeId },
        }),
        providesTags: ["Suspension"],
      }),
      createSuspension: build.mutation<
        CreateSuspensionApiResponse,
        CreateSuspensionApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Suspension/Create`,
          method: "POST",
          body: queryArg.createSuspensionCommand,
        }),
        invalidatesTags: ["Suspension"],
      }),
      getActiveSuspention: build.query<
        GetActiveSuspentionApiResponse,
        GetActiveSuspentionApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Suspension/GetActive`,
          params: { id: queryArg.id },
        }),
        providesTags: ["Suspension"],
      }),
      getPaginatedSuspensions: build.query<
        GetPaginatedSuspensionsApiResponse,
        GetPaginatedSuspensionsApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Suspension/GetPaginatedSuspensions`,
          params: {
            employeeId: queryArg.employeeId,
            status: queryArg.status,
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Suspension"],
      }),
      rejectSuspension: build.mutation<
        RejectSuspensionApiResponse,
        RejectSuspensionApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Suspension/Reject`,
          method: "PATCH",
          body: queryArg.rejectSuspensionCommand,
        }),
        invalidatesTags: ["Suspension"],
      }),
      submitSuspension: build.mutation<
        SubmitSuspensionApiResponse,
        SubmitSuspensionApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Suspension/Submit`,
          method: "PATCH",
          body: queryArg.submitSuspensionCommand,
        }),
        invalidatesTags: ["Suspension"],
      }),
      updateSuspension: build.mutation<
        UpdateSuspensionApiResponse,
        UpdateSuspensionApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Suspension/Update`,
          method: "PUT",
          body: queryArg.updateSuspensionCommand,
        }),
        invalidatesTags: ["Suspension"],
      }),
      addUserPhoto: build.mutation<AddUserPhotoApiResponse, AddUserPhotoApiArg>(
        {
          query: (queryArg) => ({
            url: `/api/Users/${queryArg.id}/add-photo`,
            method: "POST",
            body: queryArg.body,
          }),
          invalidatesTags: ["Users"],
        }
      ),
      addUserSignature: build.mutation<
        AddUserSignatureApiResponse,
        AddUserSignatureApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Users/${queryArg.id}/add-signature`,
          method: "POST",
          body: queryArg.body,
        }),
        invalidatesTags: ["Users"],
      }),
      currentUserInfo: build.query<
        CurrentUserInfoApiResponse,
        CurrentUserInfoApiArg
      >({
        query: () => ({ url: `/api/Users/current` }),
        providesTags: ["Users"],
      }),
      approveBranchGrade: build.mutation<
        ApproveBranchGradeApiResponse,
        ApproveBranchGradeApiArg
      >({
        query: (queryArg) => ({
          url: `/ApproveBranchGrade`,
          method: "POST",
          body: queryArg.approveBranchGradeCommand,
        }),
        invalidatesTags: ["BranchGrade", "Dashboard"],
      }),
      getBranchGradeCountPerStatus: build.query<
        GetBranchGradeCountPerStatusApiResponse,
        GetBranchGradeCountPerStatusApiArg
      >({
        query: () => ({ url: `/BranchGradeCountsBystatus` }),
        providesTags: ["BranchGrade"],
      }),
      getAllBranchGradeList: build.query<
        GetAllBranchGradeListApiResponse,
        GetAllBranchGradeListApiArg
      >({
        query: () => ({ url: `/GetAllBranchGradeList` }),
        providesTags: ["BranchGrade"],
      }),
      getBranchGradeByDescription: build.query<
        GetBranchGradeByDescriptionApiResponse,
        GetBranchGradeByDescriptionApiArg
      >({
        query: (queryArg) => ({
          url: `/GetBranchGradeByDescription`,
          params: { description: queryArg.description },
        }),
        providesTags: ["BranchGrade"],
      }),
      getBranchGradeForPagination: build.query<
        GetBranchGradeForPaginationApiResponse,
        GetBranchGradeForPaginationApiArg
      >({
        query: (queryArg) => ({
          url: `/GetBranchGradeForPagination`,
          params: {
            status: queryArg.status,
            pageNumber: queryArg.pageNumber,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["BranchGrade"],
      }),
      rejectBranchGrade: build.mutation<
        RejectBranchGradeApiResponse,
        RejectBranchGradeApiArg
      >({
        query: (queryArg) => ({
          url: `/RejectBranchGrade`,
          method: "POST",
          body: queryArg.rejectBranchGradeCommand,
        }),
        invalidatesTags: ["BranchGrade", "Dashboard"],
      }),
      submitBranchGrade: build.mutation<
        SubmitBranchGradeApiResponse,
        SubmitBranchGradeApiArg
      >({
        query: (queryArg) => ({
          url: `/SubmitBranchGrade`,
          method: "POST",
          body: queryArg.submitBranchGradeCommand,
        }),
        invalidatesTags: ["BranchGrade", "Dashboard"],
      }),
      updateBranchGrade: build.mutation<
        UpdateBranchGradeApiResponse,
        UpdateBranchGradeApiArg
      >({
        query: (queryArg) => ({
          url: `/UpdateBranchGrade`,
          method: "PUT",
          body: queryArg.updateBranchGradeCommand,
        }),
        invalidatesTags: ["BranchGrade"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as HCMSApi };
export type AddBranchGradeApiResponse = /** status 200 Success */ number;
export type AddBranchGradeApiArg = {
  addBranchGradeCommand: AddBranchGradeCommand;
};
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
  loginDto: LoginDto;
};
export type LogoutApiResponse = unknown;
export type LogoutApiArg = void;
export type ResetPasswordApiResponse = /** status 200 Success */ void;
export type ResetPasswordApiArg = {
  resetPasswordPayload: ResetPasswordPayload;
};
export type VerificationCodeApiResponse = /** status 200 Success */ LoginRes;
export type VerificationCodeApiArg = {
  verificationCode: VerificationCode;
};
export type ApproveActingApiResponse = /** status 200 Success */ number;
export type ApproveActingApiArg = {
  approveActingCommand: ApproveActingCommand;
};
export type GetActingCountPerStatusApiResponse =
  /** status 200 Success */ ActingCountsByStatus;
export type GetActingCountPerStatusApiArg = {
  id?: number;
};
export type CreateActingApiResponse = /** status 200 Success */ number;
export type CreateActingApiArg = {
  createActingCommand: CreateActingCommand;
};
export type GetAllActiveActingApiResponse =
  /** status 200 Success */ ActingDtoRead;
export type GetAllActiveActingApiArg = {
  id?: number;
};
export type GetPaginatedActingsApiResponse =
  /** status 200 Success */ PaginatedActinglistRead;
export type GetPaginatedActingsApiArg = {
  id?: number;
  status?: ApprovalStatus;
  pageNumber?: number;
  pageSize?: number;
};
export type CreateReassignmentApiResponse = /** status 200 Success */ number;
export type CreateReassignmentApiArg = {
  reAssignmentActingCommand: ReAssignmentActingCommand;
};
export type RejectActingApiResponse = /** status 200 Success */ number;
export type RejectActingApiArg = {
  rejectActingCommand: RejectActingCommand;
};
export type SubmitActingApiResponse = /** status 200 Success */ number;
export type SubmitActingApiArg = {
  submitActingCommand: SubmitActingCommand;
};
export type UpdateActingApiResponse = /** status 200 Success */ number;
export type UpdateActingApiArg = {
  updateActingCommand: UpdateActingCommand;
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
export type GetAddressQueryByEntityTypeApiResponse =
  /** status 200 Success */ AddressDto[];
export type GetAddressQueryByEntityTypeApiArg = {
  entityId?: number;
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
export type GetGuaranterWorkingFirmAddressApiResponse =
  /** status 200 Success */ AddressDto[];
export type GetGuaranterWorkingFirmAddressApiArg = {
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
<<<<<<< HEAD
export type CreateAppointmentApiResponse = /** status 200 Success */ number;
export type CreateAppointmentApiArg = {
  createAppointmentCommand: CreateAppointmentCommand;
};
export type GetAllAppointmentsApiResponse =
  /** status 200 Success */ AppointmentDto[];
export type GetAllAppointmentsApiArg = void;
export type GetAppointmentsByBusinessUnitIdApiResponse =
  /** status 200 Success */ AppointmentDto[];
export type GetAppointmentsByBusinessUnitIdApiArg = {
  businessUnitId?: number;
};
export type GetAppointmentsByCaseIdApiResponse =
  /** status 200 Success */ AppointmentDto[];
export type GetAppointmentsByCaseIdApiArg = {
  caseId?: number;
};
export type GetAppointmentByIdApiResponse =
  /** status 200 Success */ AppointmentDto;
export type GetAppointmentByIdApiArg = {
  id?: number;
};
export type UpdateAppointmentApiResponse = /** status 200 Success */ boolean;
export type UpdateAppointmentApiArg = {
  id?: number;
  updateAppointmentCommand: UpdateAppointmentCommand;
};
=======
export type GetAuditEmployeeDocumentFileByEmployeeIdApiResponse =
  /** status 200 Success */ AuditEmployeeFileDocumentDto[];
export type GetAuditEmployeeDocumentFileByEmployeeIdApiArg = {
  employeeId: number;
};
export type GetAuditEmployeeFileDocumentLogsApiResponse = unknown;
export type GetAuditEmployeeFileDocumentLogsApiArg = void;
>>>>>>> origin/Solomon/v2
export type ApproveAwardApiResponse = /** status 200 Success */ number;
export type ApproveAwardApiArg = {
  approveAwardCommand: ApproveAwardCommand;
};
export type GetAwardCountPerStatusApiResponse =
  /** status 200 Success */ AwardCountsByStatus;
export type GetAwardCountPerStatusApiArg = void;
export type CreateAwardApiResponse = /** status 201 Created */ number;
export type CreateAwardApiArg = {
  createAwardCommand: CreateAwardCommand;
};
export type GetAllAwardApiResponse = /** status 200 Success */ AwardLists;
export type GetAllAwardApiArg = void;
export type GetAwardsForPaginationApiResponse =
  /** status 200 Success */ PaginatedAwardList;
export type GetAwardsForPaginationApiArg = {
  status?: ApprovalStatus;
  pageNumber?: number;
  pageSize?: number;
};
export type RejectAwardApiResponse = /** status 200 Success */ number;
export type RejectAwardApiArg = {
  rejectAwardCommand: RejectAwardCommand;
};
export type SearchAllAwardsApiResponse = /** status 200 Success */ AwardDto[];
export type SearchAllAwardsApiArg = void;
export type SubmitAwardApiResponse = /** status 200 Success */ number;
export type SubmitAwardApiArg = {
  submitAwardCommand: SubmitAwardCommand;
};
export type UpdateAwardApiResponse = /** status 204 No Content */ void;
export type UpdateAwardApiArg = {
  updateAwardCommand: UpdateAwardCommand;
};
export type AddBenefitApiResponse = /** status 200 Success */ number;
export type AddBenefitApiArg = {
  addBenefitCommand: AddBenefitCommand;
};
export type ApproveBenefitApiResponse = /** status 200 Success */ number;
export type ApproveBenefitApiArg = {
  approveBenefitCommand: ApproveBenefitCommand;
};
export type GetAllBenefitListApiResponse =
  /** status 200 Success */ BenefitDto[];
export type GetAllBenefitListApiArg = void;
export type GetAllUnitPricedBenefitlistApiResponse =
  /** status 200 Success */ BenefitDto[];
export type GetAllUnitPricedBenefitlistApiArg = void;
export type GetBenefitCountPerStatusApiResponse =
  /** status 200 Success */ BenefitCountsByStatus;
export type GetBenefitCountPerStatusApiArg = void;
export type GetBenefitListForPaginationApiResponse =
  /** status 200 Success */ BenefitSearchResult;
export type GetBenefitListForPaginationApiArg = {
  status?: ApprovalStatus;
  pageNumber?: number;
  pageSize?: number;
};
export type RejectBenefitApiResponse = /** status 200 Success */ number;
export type RejectBenefitApiArg = {
  rejectBenefitCommand: RejectBenefitCommand;
};
export type SubmitBenefitApiResponse = /** status 200 Success */ number;
export type SubmitBenefitApiArg = {
  submitBenefitCommand: SubmitBenefitCommand;
};
export type UpdateBenefitApiResponse = /** status 200 Success */ number;
export type UpdateBenefitApiArg = {
  updateBenefitCommand: UpdateBenefitCommand;
};
export type AddBenefitUnitOfMeasurementApiResponse =
  /** status 200 Success */ number;
export type AddBenefitUnitOfMeasurementApiArg = {
  addBenefitUnitOfMeasurementCommand: AddBenefitUnitOfMeasurementCommand;
};
export type ApproveBenefitUnitOfMeasurementApiResponse =
  /** status 200 Success */ number;
export type ApproveBenefitUnitOfMeasurementApiArg = {
  approveBenefitUnitOfMeasurementCommand: ApproveBenefitUnitOfMeasurementCommand;
};
export type GetAllBenefitUnitOfMeasurementListApiResponse =
  /** status 200 Success */ BenefitUnitOfMeasurementDto[];
export type GetAllBenefitUnitOfMeasurementListApiArg = void;
export type GetBenefitUnitOfMeasurementCountPerStatusApiResponse =
  /** status 200 Success */ BenefitUnitOfMeasurementCountsByStatus;
export type GetBenefitUnitOfMeasurementCountPerStatusApiArg = void;
export type GetBenefitUnitOfMeasurementListForPaginationApiResponse =
  /** status 200 Success */ BenefitUnitOfMeasurementSearchResult;
export type GetBenefitUnitOfMeasurementListForPaginationApiArg = {
  status?: ApprovalStatus;
  pageNumber?: number;
  pageSize?: number;
};
export type RejectBenefitUnitOfMeasurementApiResponse =
  /** status 200 Success */ number;
export type RejectBenefitUnitOfMeasurementApiArg = {
  rejectBenefitUnitOfMeasurementCommand: RejectBenefitUnitOfMeasurementCommand;
};
export type SubmitBenefitUnitOfMeasurementApiResponse =
  /** status 200 Success */ number;
export type SubmitBenefitUnitOfMeasurementApiArg = {
  submitBenefitUnitOfMeasurementCommand: SubmitBenefitUnitOfMeasurementCommand;
};
export type UpdateBenefitUnitOfMeasurementApiResponse =
  /** status 200 Success */ number;
export type UpdateBenefitUnitOfMeasurementApiArg = {
  updateBenefitUnitOfMeasurementCommand: UpdateBenefitUnitOfMeasurementCommand;
};
export type AddBenefitUnitPriceApiResponse = /** status 200 Success */ number;
export type AddBenefitUnitPriceApiArg = {
  addBenefitUnitPriceCommand: AddBenefitUnitPriceCommand;
};
export type ApproveBenefitUnitPriceApiResponse =
  /** status 200 Success */ number;
export type ApproveBenefitUnitPriceApiArg = {
  approveBenefitUnitPriceCommand: ApproveBenefitUnitPriceCommand;
};
export type GetAllBenefitUnitPricApiResponse =
  /** status 200 Success */ BenefitValueDto[];
export type GetAllBenefitUnitPricApiArg = void;
export type GetBenefitUnitPriceCountPerStatusApiResponse =
  /** status 200 Success */ BenefitUnitPriceCountsByStatus;
export type GetBenefitUnitPriceCountPerStatusApiArg = void;
export type GetBenefitUnitPriceListForPaginationApiResponse =
  /** status 200 Success */ BenefitUnitPriceSearchResult;
export type GetBenefitUnitPriceListForPaginationApiArg = {
  status?: ApprovalStatus;
  pageNumber?: number;
  pageSize?: number;
};
export type RejectBenefitUnitPriceApiResponse =
  /** status 200 Success */ number;
export type RejectBenefitUnitPriceApiArg = {
  rejectBenefitUnitPriceCommand: RejectBenefitUnitPriceCommand;
};
export type SubmitBenefitUnitPriceApiResponse =
  /** status 200 Success */ number;
export type SubmitBenefitUnitPriceApiArg = {
  submitBenefitUnitPriceCommand: SubmitBenefitUnitPriceCommand;
};
export type UpdateBenefitUnitPriceApiResponse =
  /** status 200 Success */ number;
export type UpdateBenefitUnitPriceApiArg = {
  updateBenefitUnitPriceCommand: UpdateBenefitUnitPriceCommand;
};
export type AddBenefitValueApiResponse = /** status 200 Success */ number;
export type AddBenefitValueApiArg = {
  addBenefitValueCommand: AddBenefitValueCommand;
};
export type ApproveBenefitValueApiResponse = /** status 200 Success */ number;
export type ApproveBenefitValueApiArg = {
  approveBenefitValueCommand: ApproveBenefitValueCommand;
};
export type GetAllBenefitValueApiResponse =
  /** status 200 Success */ BenefitValueDto[];
export type GetAllBenefitValueApiArg = void;
export type GetBenefitSetupListApiResponse =
  /** status 200 Success */ BenefitSetupDto[];
export type GetBenefitSetupListApiArg = void;
export type GetBenefitValueByIdApiResponse =
  /** status 200 Success */ BenefitValueDto[];
export type GetBenefitValueByIdApiArg = {
  id?: number;
};
export type GetBenefitValueCountPerStatusApiResponse =
  /** status 200 Success */ BenefitValueCountsByStatus;
export type GetBenefitValueCountPerStatusApiArg = void;
export type GetBenefitValueListForPaginationApiResponse =
  /** status 200 Success */ BenefitValueSearchResult;
export type GetBenefitValueListForPaginationApiArg = {
  status?: ApprovalStatus;
  pageNumber?: number;
  pageSize?: number;
};
export type GetBenefitValuesListByBenefitIdApiResponse =
  /** status 200 Success */ BenefitValueDto[];
export type GetBenefitValuesListByBenefitIdApiArg = {
  benefitId?: number;
};
export type RejectBenefitValueApiResponse = /** status 200 Success */ number;
export type RejectBenefitValueApiArg = {
  rejectBenefitValueCommand: RejectBenefitValueCommand;
};
export type SubmitBenefitValueApiResponse = /** status 200 Success */ number;
export type SubmitBenefitValueApiArg = {
  submitBenefitValueCommand: SubmitBenefitValueCommand;
};
export type UpdateBenefitValueApiResponse = /** status 200 Success */ number;
export type UpdateBenefitValueApiArg = {
  updateBenefitValueCommand: UpdateBenefitValueCommand;
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
export type GetEmployeeCountPerApprovalStatusApiResponse =
  /** status 200 Success */ EmployeeCountsByStatus;
export type GetEmployeeCountPerApprovalStatusApiArg = {
  businssUnitId?: number;
};
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
export type GetCaseByIdApiResponse =
  /** status 200 Success */ CaseDetailsDtoRead;
export type GetCaseByIdApiArg = {
  id: number;
};
export type GetCaseByBusinessUnitIdApiResponse =
  /** status 200 Success */ CaseDtoRead[];
export type GetCaseByBusinessUnitIdApiArg = {
  id: number;
};
export type GetCaseInfoApiResponse = /** status 200 Success */ CaseDtoRead;
export type GetCaseInfoApiArg = {
  id: number;
  version?: string;
};
export type GetCaseRecordVersionsApiResponse =
  /** status 200 Success */ CaseRecordVersions;
export type GetCaseRecordVersionsApiArg = {
  id: number;
};
export type CreateCaseApiResponse =
  /** status 200 Success */ CreateCaseReturnType;
export type CreateCaseApiArg = {
  createCaseCommand: CreateCaseCommand;
};
export type GetAllCasesApiResponse = /** status 200 Success */ CaseDtoRead[];
export type GetAllCasesApiArg = void;
export type GetAllCasesByStatusApiResponse =
  /** status 200 Success */ CaseListRead;
export type GetAllCasesByStatusApiArg = void;
export type GetAllCaseListsApiResponse =
  /** status 200 Success */ CaseSearchResultRead;
export type GetAllCaseListsApiArg = {
  businessUnitId?: number;
  status?: ApprovalStatus;
  pageNumber?: number;
  pageSize?: number;
  searchQuery?: string;
};
export type GetCaseCountPerApprovalStatusApiResponse =
  /** status 200 Success */ CaseCountsByStatus;
export type GetCaseCountPerApprovalStatusApiArg = void;
export type UpdateCaseApiResponse = /** status 200 Success */ number;
export type UpdateCaseApiArg = {
  updateCaseCommand: UpdateCaseCommand;
};
export type CreateCaseTemplateApiResponse = /** status 200 Success */ number;
export type CreateCaseTemplateApiArg = {
  createCaseTemplateCommand: CreateCaseTemplateCommand;
};
export type GetAllCaseTemplatesApiResponse =
  /** status 200 Success */ CaseTemplateDto[];
export type GetAllCaseTemplatesApiArg = void;
export type GetCaseTemplateByIdApiResponse =
  /** status 200 Success */ CaseTemplateDto;
export type GetCaseTemplateByIdApiArg = {
  id?: number;
};
export type UpdateCaseTemplateApiResponse = /** status 200 Success */ boolean;
export type UpdateCaseTemplateApiArg = {
  id?: number;
  updateCaseTemplateCommand: UpdateCaseTemplateCommand;
};
export type CreateCaseTimelineApiResponse = /** status 200 Success */ number;
export type CreateCaseTimelineApiArg = {
  createCaseTimelineCommand: CreateCaseTimelineCommand;
};
export type GetAllCaseTimelinesApiResponse =
  /** status 200 Success */ CaseTimelineDto[];
export type GetAllCaseTimelinesApiArg = void;
export type GetCaseTimelinesByCaseIdApiResponse =
  /** status 200 Success */ CaseTimelineDto[];
export type GetCaseTimelinesByCaseIdApiArg = {
  caseId?: number;
};
export type GetCaseTimelineByIdApiResponse =
  /** status 200 Success */ CaseTimelineDto;
export type GetCaseTimelineByIdApiArg = {
  id?: number;
};
export type UpdateCaseTimelineApiResponse = /** status 200 Success */ boolean;
export type UpdateCaseTimelineApiArg = {
  id?: number;
  updateCaseTimelineCommand: UpdateCaseTimelineCommand;
};
export type GetAllChilotApiResponse = /** status 200 Success */ ChilotDto[];
export type GetAllChilotApiArg = void;
export type GetChilotByBusinessUnitApiResponse =
  /** status 200 Success */ ChilotDto[];
export type GetChilotByBusinessUnitApiArg = {
  businessUnitId: number;
};
export type CreateChilotApiResponse = /** status 200 Success */ number;
export type CreateChilotApiArg = {
  createChilotCommand: CreateChilotCommand;
};
export type UpdateChilotApiResponse = /** status 200 Success */ number;
export type UpdateChilotApiArg = {
  updateChilotCommand: UpdateChilotCommand;
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
export type GetLetterCountPerStatusForDashboardApiArg = {
  userId?: string;
};
export type GetAllApprovalItemsListApiResponse = unknown;
export type GetAllApprovalItemsListApiArg = {
  pageNumber?: number;
  pageSize?: number;
};
export type GetApprovalStatusSummaryApiResponse = unknown;
export type GetApprovalStatusSummaryApiArg = void;
export type GetApprovedActiveBusinessCountApiResponse = unknown;
export type GetApprovedActiveBusinessCountApiArg = void;
export type GetApprovedActiveEmployeeCountApiResponse = unknown;
export type GetApprovedActiveEmployeeCountApiArg = void;
export type GetApprovedActiveJobRoleCountApiResponse = unknown;
export type GetApprovedActiveJobRoleCountApiArg = void;
export type GetEmployeeDistributionByStatusApiResponse = unknown;
export type GetEmployeeDistributionByStatusApiArg = void;
export type GetEmployeeJobCategoryGroupCountApiResponse = unknown;
export type GetEmployeeJobCategoryGroupCountApiArg = void;
export type GetEmployeeRetentionRateApiResponse = unknown;
export type GetEmployeeRetentionRateApiArg = void;
export type GetEmployeeTurnoverRateApiResponse = unknown;
export type GetEmployeeTurnoverRateApiArg = void;
export type GetMonthlyEmployeeCountApiResponse = unknown;
export type GetMonthlyEmployeeCountApiArg = void;
export type GetNewEmployeesThisYearApiResponse = unknown;
export type GetNewEmployeesThisYearApiArg = void;
export type GetResignedEmployeesThisYearApiResponse = unknown;
export type GetResignedEmployeesThisYearApiArg = void;
export type GetVacantJobsCountApiResponse = unknown;
export type GetVacantJobsCountApiArg = void;
export type SearchAllLettersForDashboardApiResponse =
  /** status 200 Success */ LetterDtoRead[];
export type SearchAllLettersForDashboardApiArg = {
  userId?: string;
};
export type ApproveDelegationApiResponse = /** status 200 Success */ number;
export type ApproveDelegationApiArg = {
  approveDelegationCommand: ApproveDelegationCommand;
};
export type GetDelegationCountPerStatusApiResponse =
  /** status 200 Success */ DelegationCountsByStatus;
export type GetDelegationCountPerStatusApiArg = {
  id?: number;
};
export type CreateDelegationApiResponse = /** status 200 Success */ number;
export type CreateDelegationApiArg = {
  createDelegationCommand: CreateDelegationCommand;
};
export type GetAllDelegationApiResponse =
  /** status 200 Success */ DelegationListsRead;
export type GetAllDelegationApiArg = void;
export type GetAllActiveDelegationApiResponse =
  /** status 200 Success */ DelegationDtoRead;
export type GetAllActiveDelegationApiArg = {
  id?: number;
};
export type GetPaginatedDelegationsApiResponse =
  /** status 200 Success */ PaginatedDelegationlistRead;
export type GetPaginatedDelegationsApiArg = {
  id?: number;
  status?: ApprovalStatus;
  pageNumber?: number;
  pageSize?: number;
};
export type RejectDelegationApiResponse = /** status 200 Success */ number;
export type RejectDelegationApiArg = {
  rejectDelegationCommand: RejectDelegationCommand;
};
export type RemoveDelegationApiResponse = /** status 200 Success */ number;
export type RemoveDelegationApiArg = {
  removeDeligationCommand: RemoveDeligationCommand;
};
export type SubmitDelegationApiResponse = /** status 200 Success */ number;
export type SubmitDelegationApiArg = {
  submitDelegationCommand: SubmitDelegationCommand;
};
export type UpdateDelegationApiResponse = /** status 200 Success */ number;
export type UpdateDelegationApiArg = {
  updateDelegationCommands: UpdateDelegationCommands;
};
export type CreateDocketEntryApiResponse = /** status 200 Success */ number;
export type CreateDocketEntryApiArg = {
  createDocketEntryCommand: CreateDocketEntryCommand;
};
export type GetAllDocketEntriesApiResponse =
  /** status 200 Success */ DocketEntryDto[];
export type GetAllDocketEntriesApiArg = void;
export type GetDocketEntriesByCaseIdApiResponse =
  /** status 200 Success */ DocketEntryDto[];
export type GetDocketEntriesByCaseIdApiArg = {
  caseId?: number;
};
export type GetDocketEntryByIdApiResponse =
  /** status 200 Success */ DocketEntryDto;
export type GetDocketEntryByIdApiArg = {
  id?: number;
};
export type UpdateDocketEntryApiResponse = /** status 200 Success */ boolean;
export type UpdateDocketEntryApiArg = {
  id?: number;
  updateDocketEntryCommand: UpdateDocketEntryCommand;
};
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
export type CreateEducationApiResponse = /** status 200 Success */ number;
export type CreateEducationApiArg = {
  createEducationCommand: CreateEducationCommand;
};
export type GetEducationByIdApiResponse =
  /** status 200 Success */ EducationDto[];
export type GetEducationByIdApiArg = {
  employeeId?: number;
};
export type UpdateEducationApiResponse = /** status 200 Success */ number;
export type UpdateEducationApiArg = {
  updateEducationCommand: UpdateEducationCommand;
};
export type ApproveEducationLevelApiResponse = /** status 200 Success */ number;
export type ApproveEducationLevelApiArg = {
  approveEducationLevelCommand: ApproveEducationLevelCommand;
};
export type GetEducationLevelCountPerStatusApiResponse =
  /** status 200 Success */ EducationLevelCountsByStatus;
export type GetEducationLevelCountPerStatusApiArg = void;
export type CreateEducationLevelApiResponse = /** status 201 Created */ number;
export type CreateEducationLevelApiArg = {
  createEducationLevelCommand: CreateEducationLevelCommand;
};
export type GetAllEducationLevelApiResponse =
  /** status 200 Success */ EducationLevelLists;
export type GetAllEducationLevelApiArg = void;
export type GetEducationLevelsForPaginationApiResponse =
  /** status 200 Success */ PaginatedEducationLevelList;
export type GetEducationLevelsForPaginationApiArg = {
  status?: ApprovalStatus;
  pageNumber?: number;
  pageSize?: number;
};
export type RejectEducationLevelApiResponse = /** status 200 Success */ number;
export type RejectEducationLevelApiArg = {
  rejectEducationLevelCommand: RejectEducationLevelCommand;
};
export type SearchAllEducationLevelsApiResponse =
  /** status 200 Success */ EducationLevelDto[];
export type SearchAllEducationLevelsApiArg = void;
export type SubmitEducationLevelApiResponse = /** status 200 Success */ number;
export type SubmitEducationLevelApiArg = {
  submitEducationLevelCommand: SubmitEducationLevelCommand;
};
export type UpdateEducationLevelApiResponse = /** status 204 No Content */ void;
export type UpdateEducationLevelApiArg = {
  updateEducationLevelCommand: UpdateEducationLevelCommand;
};
export type ActivateEmployeeFamilyApiResponse =
  /** status 200 Success */ number;
export type ActivateEmployeeFamilyApiArg = {
  activateEmployeeFamilyCommand: ActivateEmployeeFamilyCommand;
};
export type ActivateEmployeeGuranteeApiResponse =
  /** status 200 Success */ number;
export type ActivateEmployeeGuranteeApiArg = {
  activateEmployeeGurantersCommand: ActivateEmployeeGurantersCommand;
};
export type AddEmployeeExperienceApiResponse = /** status 200 Success */ number;
export type AddEmployeeExperienceApiArg = {
  addEmployeeExperienceCommand: AddEmployeeExperienceCommand;
};
export type AddEmployeeChildrenApiResponse = /** status 200 Success */ number;
export type AddEmployeeChildrenApiArg = {
  addEmployeeFamilyCommand: AddEmployeeFamilyCommand;
};
export type AddEmployeeGurantersApiResponse = /** status 200 Success */ number;
export type AddEmployeeGurantersApiArg = {
  addEmployeeGurantersCommand: AddEmployeeGurantersCommand;
};
export type AllFamilyOfAllEmployeeApiResponse =
  /** status 200 Success */ EmployeeFamilyDto[];
export type AllFamilyOfAllEmployeeApiArg = void;
export type DeActivateEmployeeFamilyApiResponse =
  /** status 200 Success */ number;
export type DeActivateEmployeeFamilyApiArg = {
  deActivateEmployeeFamilyCommand: DeActivateEmployeeFamilyCommand;
};
export type DeActivateEmployeeGuaranteeApiResponse =
  /** status 200 Success */ number;
export type DeActivateEmployeeGuaranteeApiArg = {
  deActivateEmployeeGurantersCommand: DeActivateEmployeeGurantersCommand;
};
export type GetFamilyApiResponse =
  /** status 200 Success */ EmployeeFamilyRead[];
export type GetFamilyApiArg = {
  familyId?: number;
};
export type GetEmployeeExperienceByIdApiResponse =
  /** status 200 Success */ EmployeeExperienceDto[];
export type GetEmployeeExperienceByIdApiArg = {
  id?: number;
};
export type GetEmployeeExperienceListOfEmployeeApiResponse =
  /** status 200 Success */ EmployeeExperienceDto[];
export type GetEmployeeExperienceListOfEmployeeApiArg = {
  employeeId?: number;
};
export type GetEmployeeGuaranterEmployeeApiResponse =
  /** status 200 Success */ EmployeeGurantersDto[];
export type GetEmployeeGuaranterEmployeeApiArg = {
  employeeId?: number;
};
export type GetEmployeeGurantersByIdApiResponse =
  /** status 200 Success */ EmployeeGurantersDto[];
export type GetEmployeeGurantersByIdApiArg = {
  guaranteeId?: number;
};
export type GetFamilyOfAnEmployeeApiResponse =
  /** status 200 Success */ EmployeeFamilyDto[];
export type GetFamilyOfAnEmployeeApiArg = {
  employeeId?: number;
};
export type UpdateEmployeeExperienceApiResponse =
  /** status 200 Success */ number;
export type UpdateEmployeeExperienceApiArg = {
  updateEmployeeExperienceCommand: UpdateEmployeeExperienceCommand;
};
export type UpdateEmployeeFamilyApiResponse = /** status 200 Success */ number;
export type UpdateEmployeeFamilyApiArg = {
  updateEmployeeFamilyCommand: UpdateEmployeeFamilyCommand;
};
export type UpdateEmployeeGurantersApiResponse =
  /** status 200 Success */ number;
export type UpdateEmployeeGurantersApiArg = {
  updateEmployeeGurantersCommand: UpdateEmployeeGurantersCommand;
};
export type DownloadEmployeeFileDocumentApiResponse =
  /** status 200 Success */ void;
export type DownloadEmployeeFileDocumentApiArg = {
  id: string;
};
export type GetByIdApiResponse =
  /** status 200 Success */ EmployeeFileDocumentDto;
export type GetByIdApiArg = {
  id: string;
};
export type GetEmployeeFileDocumentByEmployeeIdApiResponse =
  /** status 200 Success */ EmployeeFileDocumentDto[];
export type GetEmployeeFileDocumentByEmployeeIdApiArg = {
  employeeId: number;
  resignationId?: number;
  suspensionId?: number;
};
export type UpdateEmployeeFileDocumentApiResponse =
  /** status 200 Success */ string;
export type UpdateEmployeeFileDocumentApiArg = {
  body: {
    id?: string;
    file?: Blob;
    documentType?: string;
    remark?: string;
  };
};
export type UploadEmployeeFileDocumentApiResponse = unknown;
export type UploadEmployeeFileDocumentApiArg = {
  body: {
    employeeId?: number;
    suspensionId?: number;
    resignationId?: number;
    documentType?: DocumentType;
    file?: Blob;
    remark?: string;
  };
};
export type GetEmployeeChangeLogApiResponse =
  /** status 200 Success */ EmployeeChangeLogDto[];
export type GetEmployeeChangeLogApiArg = {
  employeeId: number;
};
export type GetEmployeeByIdApiResponse =
  /** status 200 Success */ EmployeeDetailsDtoRead;
export type GetEmployeeByIdApiArg = {
  id: number;
};
export type AddEmployeePhotoApiResponse =
  /** status 200 Success */ DocumentMetadataDto;
export type AddEmployeePhotoApiArg = {
  id: number;
  body: {
    file?: Blob;
  };
};
export type GetEmployeeByBusinessUnitIdApiResponse =
  /** status 200 Success */ EmployeeDtoRead[];
export type GetEmployeeByBusinessUnitIdApiArg = {
  id: number;
};
export type GetEmployeeInfoApiResponse =
  /** status 200 Success */ EmployeeDtoRead;
export type GetEmployeeInfoApiArg = {
  id: number;
  version?: string;
};
export type AddEmployeeNoteApiResponse = unknown;
export type AddEmployeeNoteApiArg = {
  id: number;
  note: Note;
};
export type GetEmployeeRecordVersionsApiResponse =
  /** status 200 Success */ EmployeeRecordVersions;
export type GetEmployeeRecordVersionsApiArg = {
  id: number;
};
export type CreateEmployeeProfileApiResponse =
  /** status 200 Success */ CreateEmployeeProfileReturnType;
export type CreateEmployeeProfileApiArg = {
  createEmployeeProfileCommand: CreateEmployeeProfileCommand;
};
export type GetAllEmployeesApiResponse =
  /** status 200 Success */ EmployeeDtoRead[];
export type GetAllEmployeesApiArg = void;
export type GetAllEmployeesByStatusApiResponse =
  /** status 200 Success */ EmployeeListRead;
export type GetAllEmployeesByStatusApiArg = void;
export type AllEmployeeApproveProbationApiResponse =
  /** status 200 Success */ number;
export type AllEmployeeApproveProbationApiArg = {
  allEmployeeApproveCommand: AllEmployeeApproveCommand;
};
export type GetAllEmployeetListsApiResponse =
  /** status 200 Success */ EmployeeSearchResultRead;
export type GetAllEmployeetListsApiArg = {
  businessUnitId?: number;
  status?: ApprovalStatus;
  pageNumber?: number;
  pageSize?: number;
  searchQuery?: string;
};
export type ApproveEmployeeApiResponse = unknown;
export type ApproveEmployeeApiArg = {
  changeWorkflowStatusEntityDto: ChangeWorkflowStatusEntityDto;
};
export type CreateEmployeeEmergencyContactApiResponse =
  /** status 200 Success */ number;
export type CreateEmployeeEmergencyContactApiArg = {
  createEmployeeEmergencyContactCommand: CreateEmployeeEmergencyContactCommand;
};
export type EmployeeIdCardApprovalApprovalApiResponse =
  /** status 200 Success */ number;
export type EmployeeIdCardApprovalApprovalApiArg = {
  employeeIdCardApprovalApprovalCommand: EmployeeIdCardApprovalApprovalCommand;
};
export type EmployeeIdCardApprovalRejectedApiResponse =
  /** status 200 Success */ number;
export type EmployeeIdCardApprovalRejectedApiArg = {
  employeeIdCardApprovalRejectedCommand: EmployeeIdCardApprovalRejectedCommand;
};
export type EmployeeIdCardGivenApiResponse = /** status 200 Success */ number;
export type EmployeeIdCardGivenApiArg = {
  employeeIdCardGivenCommand: EmployeeIdCardGivenCommand;
};
export type EmployeeIdCardReplaceApiResponse = /** status 200 Success */ number;
export type EmployeeIdCardReplaceApiArg = {
  employeeIdCardReplaceCommand: EmployeeIdCardReplaceCommand;
};
export type EmployeeIdCardSubmitApiResponse = /** status 200 Success */ number;
export type EmployeeIdCardSubmitApiArg = {
  employeeIdCardSubmitCommand: EmployeeIdCardSubmitCommand;
};
export type EmployeeIdCardUpdateApiResponse = /** status 200 Success */ number;
export type EmployeeIdCardUpdateApiArg = {
  employeeIdCardUpdateCommand: EmployeeIdCardUpdateCommand;
};
export type EmployeeProbationApproveApiResponse =
  /** status 200 Success */ number;
export type EmployeeProbationApproveApiArg = {
  employeeProbationApproveCommand: EmployeeProbationApproveCommand;
};
export type EmployeeProbationTerminationApiResponse =
  /** status 200 Success */ number;
export type EmployeeProbationTerminationApiArg = {
  employeeProbationTerminationCommand: EmployeeProbationTerminationCommand;
};
export type GetActiveEmployeeForIdManagementApiResponse =
  /** status 200 Success */ EmployeeDtoRead[];
export type GetActiveEmployeeForIdManagementApiArg = void;
export type GetAllEmployeeIdListApiResponse =
  /** status 200 Success */ EmployeeIdSearchResultRead;
export type GetAllEmployeeIdListApiArg = {
  status?: EmployeeIdCardStatus;
  pageNumber?: number;
  pageSize?: number;
};
export type GetAllEmployeeOnProbationApiResponse =
  /** status 200 Success */ EmployeeDtoRead[];
export type GetAllEmployeeOnProbationApiArg = void;
export type GetAllEmployeesIdCardInfoApiResponse =
  /** status 200 Success */ EmployeeDtoRead[];
export type GetAllEmployeesIdCardInfoApiArg = void;
export type GetAllProbationForNotificationApiResponse =
  /** status 200 Success */ EmployeeDtoRead[];
export type GetAllProbationForNotificationApiArg = void;
export type GetEmployeeEmergencyContactsApiResponse =
  /** status 200 Success */ EmployeeEmergencyContactDtoRead[];
export type GetEmployeeEmergencyContactsApiArg = {
  employeeId: number;
};
export type GetEmployeeIdCountPerApprovalStatusApiResponse =
  /** status 200 Success */ GetEmployeeIdCountsByStatus;
export type GetEmployeeIdCountPerApprovalStatusApiArg = void;
export type GetProbationListApiResponse =
  /** status 200 Success */ ProbationSearchResultRead;
export type GetProbationListApiArg = {
  status?: EmployeeStatusEnum;
  pageNumber?: number;
  pageSize?: number;
};
export type GetSingleEmployeeApiResponse = /** status 200 Success */ boolean;
export type GetSingleEmployeeApiArg = {
  id?: MartialStatus;
};
export type ProbationApprovalApiResponse = /** status 200 Success */ number;
export type ProbationApprovalApiArg = {
  probationApprovalCommand: ProbationApprovalCommand;
};
export type GetProbationCountPerApprovalStatusApiResponse =
  /** status 200 Success */ GetProbationCountsByStatus;
export type GetProbationCountPerApprovalStatusApiArg = void;
export type ProbationSubmitApiResponse = /** status 200 Success */ number;
export type ProbationSubmitApiArg = {
  probationSubmitToApproverCommand: ProbationSubmitToApproverCommand;
};
export type ProbationTerminateApiResponse = /** status 200 Success */ number;
export type ProbationTerminateApiArg = {
  probationTerminateCommand: ProbationTerminateCommand;
};
export type RejectEmployeeApprovalRequestApiResponse = unknown;
export type RejectEmployeeApprovalRequestApiArg = {
  changeWorkflowStatusEntityDto: ChangeWorkflowStatusEntityDto;
};
export type RejectedProbationActivateApiResponse =
  /** status 200 Success */ number;
export type RejectedProbationActivateApiArg = {
  rejectedProbationActivateCommand: RejectedProbationActivateCommand;
};
export type RejectProbationApprovalApiResponse =
  /** status 200 Success */ number;
export type RejectProbationApprovalApiArg = {
  probationRejectApprovalCommand: ProbationRejectApprovalCommand;
};
export type SubmitForApprovalApiResponse = unknown;
export type SubmitForApprovalApiArg = {
  changeWorkflowStatusEntityDto: ChangeWorkflowStatusEntityDto;
};
export type UpdateEmployeeApiResponse = /** status 200 Success */ number;
export type UpdateEmployeeApiArg = {
  updateEmployeeCommand: UpdateEmployeeCommand;
};
export type UpdateEmployeeEmergencyContactCommandApiResponse =
  /** status 200 Success */ number;
export type UpdateEmployeeEmergencyContactCommandApiArg = {
  updateEmployeeEmergencyContactCommand: UpdateEmployeeEmergencyContactCommand;
};
export type AddEmployeeDemotionApiResponse = /** status 200 Success */ number;
export type AddEmployeeDemotionApiArg = {
  addEmployeeDemotionCommand: AddEmployeeDemotionCommand;
};
export type AddEmployeePromotionApiResponse = /** status 200 Success */ number;
export type AddEmployeePromotionApiArg = {
  addEmployeePromotionCommand: AddEmployeePromotionCommand;
};
export type AddEmployeeReClassificationApiResponse =
  /** status 200 Success */ number;
export type AddEmployeeReClassificationApiArg = {
  addEmployeeReClassificationCommand: AddEmployeeReClassificationCommand;
};
export type AddEmployeeSalaryIncrementApiResponse =
  /** status 200 Success */ number;
export type AddEmployeeSalaryIncrementApiArg = {
  addSalaryIncrementCommand: AddSalaryIncrementCommand;
};
export type GetAllDemotionsApiResponse =
  /** status 200 Success */ EmployeeDemotionSearchResult;
export type GetAllDemotionsApiArg = {
  status?: EmployeeTransactionStatus;
  pageNumber?: number;
  pageSize?: number;
  employeeId?: number;
};
export type GetAllPromotionsApiResponse =
  /** status 200 Success */ EmployeePromotionSearchResult;
export type GetAllPromotionsApiArg = {
  status?: EmployeeTransactionStatus;
  pageNumber?: number;
  pageSize?: number;
  employeeId?: number;
};
export type GetAllReClassificationsApiResponse =
  /** status 200 Success */ EmployeeReClassificationSearchResult;
export type GetAllReClassificationsApiArg = {
  status?: EmployeeTransactionStatus;
  pageNumber?: number;
  pageSize?: number;
  employeeId?: number;
};
export type ApproveEmployeeDemotionApiResponse =
  /** status 200 Success */ number;
export type ApproveEmployeeDemotionApiArg = {
  approveEmployeeDemotion: ApproveEmployeeDemotion;
};
export type ApproveEmployeePromotionApiResponse =
  /** status 200 Success */ number;
export type ApproveEmployeePromotionApiArg = {
  approveEmployeePromotion: ApproveEmployeePromotion;
};
export type ApproveEmployeeReClassificationApiResponse =
  /** status 200 Success */ number;
export type ApproveEmployeeReClassificationApiArg = {
  approveEmployeeReClassification: ApproveEmployeeReClassification;
};
export type ApproveSalaryIncrementApiResponse =
  /** status 200 Success */ number;
export type ApproveSalaryIncrementApiArg = {
  approveSalaryIncrementCommand: ApproveSalaryIncrementCommand;
};
export type GetPromotionCountPerApprovalStatusApiResponse =
  /** status 200 Success */ PromotionCountsByStatus;
export type GetPromotionCountPerApprovalStatusApiArg = void;
export type GetAllSalaryIncrementListApiResponse =
  /** status 200 Success */ EmployeeSalaryIncrementSearchResult;
export type GetAllSalaryIncrementListApiArg = {
  status?: EmployeeTransactionStatus;
  pageNumber?: number;
  pageSize?: number;
  employeeId?: number;
};
export type GetEmployeeDemotionByIdApiResponse =
  /** status 200 Success */ EmployeeDemotionRead;
export type GetEmployeeDemotionByIdApiArg = {
  id?: number;
};
export type GetEmployeeDemotionListApiResponse =
  /** status 200 Success */ EmployeeDemotionDto[];
export type GetEmployeeDemotionListApiArg = {
  employeeId?: number;
};
export type GetEmployeePromotionByIdApiResponse =
  /** status 200 Success */ EmployeePromotionRead;
export type GetEmployeePromotionByIdApiArg = {
  id?: number;
};
export type GetEmployeePromotionListApiResponse =
  /** status 200 Success */ EmployeePromotionDto[];
export type GetEmployeePromotionListApiArg = {
  employeeId?: number;
};
export type GetEmployeeReClassificationByIdApiResponse =
  /** status 200 Success */ EmployeeReClassificationRead;
export type GetEmployeeReClassificationByIdApiArg = {
  id?: number;
};
export type GetEmployeeReClassificationListApiResponse =
  /** status 200 Success */ EmployeeReClassificationDto[];
export type GetEmployeeReClassificationListApiArg = {
  employeeId?: number;
};
export type GetSalaryIncrementByIdApiResponse =
  /** status 200 Success */ EmployeeSalaryIncrement;
export type GetSalaryIncrementByIdApiArg = {
  id?: number;
};
export type GetSalaryIncrementListApiResponse =
  /** status 200 Success */ EmployeeSalaryIncrementDto[];
export type GetSalaryIncrementListApiArg = {
  employeeId?: number;
};
export type RejectEmployeeDemotionApiResponse =
  /** status 200 Success */ number;
export type RejectEmployeeDemotionApiArg = {
  rejectEmployeeDemotion: RejectEmployeeDemotion;
};
export type RejectEmployeePromotionApiResponse =
  /** status 200 Success */ number;
export type RejectEmployeePromotionApiArg = {
  rejectEmployeePromotion: RejectEmployeePromotion;
};
export type RejectEmployeeReClassificationApiResponse =
  /** status 200 Success */ number;
export type RejectEmployeeReClassificationApiArg = {
  rejectEmployeeReClassification: RejectEmployeeReClassification;
};
export type RejectSalaryIncrementApiResponse = /** status 200 Success */ number;
export type RejectSalaryIncrementApiArg = {
  rejectSalaryIncrementCommand: RejectSalaryIncrementCommand;
};
export type SubmitEmployeeDemotionApiResponse =
  /** status 200 Success */ number;
export type SubmitEmployeeDemotionApiArg = {
  submitEmployeeDemotion: SubmitEmployeeDemotion;
};
export type SubmittEmployeePromotionApiResponse =
  /** status 200 Success */ number;
export type SubmittEmployeePromotionApiArg = {
  submitEmployeePromotion: SubmitEmployeePromotion;
};
export type SubmitSalaryIncrementApiResponse = /** status 200 Success */ number;
export type SubmitSalaryIncrementApiArg = {
  submitSalaryIncrementCommand: SubmitSalaryIncrementCommand;
};
export type SubmittEmployeeReClassificationApiResponse =
  /** status 200 Success */ number;
export type SubmittEmployeeReClassificationApiArg = {
  submitEmployeeReClassification: SubmitEmployeeReClassification;
};
export type GetDemotionCountPerApprovalStatusApiResponse =
  /** status 200 Success */ DemotionCountsByStatus;
export type GetDemotionCountPerApprovalStatusApiArg = void;
export type UpdateEmployeeDemotionApiResponse =
  /** status 200 Success */ number;
export type UpdateEmployeeDemotionApiArg = {
  updateEmployeeDemotionCommand: UpdateEmployeeDemotionCommand;
};
export type UpdateEmployeePromotionApiResponse =
  /** status 200 Success */ number;
export type UpdateEmployeePromotionApiArg = {
  updateEmployeePromotionCommand: UpdateEmployeePromotionCommand;
};
export type UpdateEmployeeReClassificationApiResponse =
  /** status 200 Success */ number;
export type UpdateEmployeeReClassificationApiArg = {
  updateEmployeeReClassificationCommand: UpdateEmployeeReClassificationCommand;
};
export type UpdateSalaryIncrementApiResponse = /** status 200 Success */ number;
export type UpdateSalaryIncrementApiArg = {
  updateSalaryIncrementCommand: UpdateSalaryIncrementCommand;
};
export type CreateTransferApiResponse = unknown;
export type CreateTransferApiArg = {
  createTransferCommand: CreateTransferCommand;
};
export type ApproveTransferApiResponse = unknown;
export type ApproveTransferApiArg = {
  approveTransferCommand: ApproveTransferCommand;
};
export type GetAllTransfersListApiResponse =
  /** status 200 Success */ EmployeeTransferDto[];
export type GetAllTransfersListApiArg = void;
export type GetEmployeeWithDetailsApiResponse =
  /** status 200 Success */ EmployeeBasicInfoDto;
export type GetEmployeeWithDetailsApiArg = {
  id?: number;
};
export type GetTransferCountPerStatusApiResponse =
  /** status 200 Success */ TransferCountsByStatus;
export type GetTransferCountPerStatusApiArg = {
  employeeId?: number;
};
export type GetTransferListForPaginationApiResponse =
  /** status 200 Success */ TransferSearchResult;
export type GetTransferListForPaginationApiArg = {
  status?: ApprovalStatus;
  pageNumber?: number;
  pageSize?: number;
  employeeId?: number;
};
export type RejectTransferApiResponse = unknown;
export type RejectTransferApiArg = {
  rejectTransferCommand: RejectTransferCommand;
};
export type SubmitTransferApiResponse = unknown;
export type SubmitTransferApiArg = {
  submitTransferCommand: SubmitTransferCommand;
};
export type UpdateTransferApiResponse = /** status 200 Success */ void;
export type UpdateTransferApiArg = {
  updateTransferCommand: UpdateTransferCommand;
};
export type ApproveEmployeeWarningApiResponse =
  /** status 200 Success */ number;
export type ApproveEmployeeWarningApiArg = {
  approveEmployeeWarningCommand: ApproveEmployeeWarningCommand;
};
export type GetEmployeeWarningCountPerStatusApiResponse =
  /** status 200 Success */ EmployeeWarningCountsByStatus;
export type GetEmployeeWarningCountPerStatusApiArg = {
  id?: number;
};
export type CreateEmployeeWarningApiResponse = /** status 200 Success */ number;
export type CreateEmployeeWarningApiArg = {
  createEmployeeWarningCommand: CreateEmployeeWarningCommand;
};
export type GetPaginatedEmployeeWarningsApiResponse =
  /** status 200 Success */ PaginatedEmployeeWarninglistRead;
export type GetPaginatedEmployeeWarningsApiArg = {
  id?: number;
  status?: ApprovalStatus;
  pageNumber?: number;
  pageSize?: number;
};
export type RejectEmployeeWarningApiResponse = /** status 200 Success */ number;
export type RejectEmployeeWarningApiArg = {
  rejectEmployeeWarningCommand: RejectEmployeeWarningCommand;
};
export type SubmitEmployeeWarningApiResponse = /** status 200 Success */ number;
export type SubmitEmployeeWarningApiArg = {
  submitEmployeeWarningCommand: SubmitEmployeeWarningCommand;
};
export type UpdateEmployeeWarningApiResponse = /** status 200 Success */ number;
export type UpdateEmployeeWarningApiArg = {
  updateEmployeeWarningCommand: UpdateEmployeeWarningCommand;
};
export type ApproveFieldOfStudyApiResponse = /** status 200 Success */ number;
export type ApproveFieldOfStudyApiArg = {
  approveFieldOfStudyCommand: ApproveFieldOfStudyCommand;
};
export type GetFieldOfStudyCountPerStatusApiResponse =
  /** status 200 Success */ FieldOfStudyCountsByStatus;
export type GetFieldOfStudyCountPerStatusApiArg = void;
export type CreateFieldOfStudyApiResponse = /** status 201 Created */ number;
export type CreateFieldOfStudyApiArg = {
  createFieldOfStudyCommand: CreateFieldOfStudyCommand;
};
export type GetAllFieldOfStudyApiResponse =
  /** status 200 Success */ FieldOfStudyLists;
export type GetAllFieldOfStudyApiArg = void;
export type GetFieldOfStudiesForPaginationApiResponse =
  /** status 200 Success */ PaginatedFieldOfStudyList;
export type GetFieldOfStudiesForPaginationApiArg = {
  status?: ApprovalStatus;
  pageNumber?: number;
  pageSize?: number;
};
export type RejectFieldOfStudyApiResponse = /** status 200 Success */ number;
export type RejectFieldOfStudyApiArg = {
  rejectFieldOfStudyCommand: RejectFieldOfStudyCommand;
};
export type SearchAllFieldOfStudiesApiResponse =
  /** status 200 Success */ FieldOfStudyDto[];
export type SearchAllFieldOfStudiesApiArg = void;
export type SubmitFieldOfStudyApiResponse = /** status 200 Success */ number;
export type SubmitFieldOfStudyApiArg = {
  submitFieldOfStudyCommand: SubmitFieldOfStudyCommand;
};
export type UpdateFieldOfStudyApiResponse = /** status 204 No Content */ void;
export type UpdateFieldOfStudyApiArg = {
  updateFieldOfStudyCommand: UpdateFieldOfStudyCommand;
};
export type ApproveInstitutionNameApiResponse =
  /** status 200 Success */ number;
export type ApproveInstitutionNameApiArg = {
  approveInstitutionNameCommand: ApproveInstitutionNameCommand;
};
export type GetInstitutionNameCountPerStatusApiResponse =
  /** status 200 Success */ InstitutionNameCountsByStatus;
export type GetInstitutionNameCountPerStatusApiArg = void;
export type CreateInstitutionNameApiResponse = /** status 201 Created */ number;
export type CreateInstitutionNameApiArg = {
  createInstitutionNameCommand: CreateInstitutionNameCommand;
};
export type GetAllInstitutionNameApiResponse =
  /** status 200 Success */ InstitutionNameLists;
export type GetAllInstitutionNameApiArg = void;
export type GetInstitutionNamesForPaginationApiResponse =
  /** status 200 Success */ PaginatedInstitutionNameList;
export type GetInstitutionNamesForPaginationApiArg = {
  status?: ApprovalStatus;
  pageNumber?: number;
  pageSize?: number;
};
export type RejectInstitutionNameApiResponse = /** status 200 Success */ number;
export type RejectInstitutionNameApiArg = {
  rejectInstitutionNameCommand: RejectInstitutionNameCommand;
};
export type SearchAllInstitutionNamesApiResponse =
  /** status 200 Success */ InstitutionNameDto[];
export type SearchAllInstitutionNamesApiArg = void;
export type SubmitInstitutionNameApiResponse = /** status 200 Success */ number;
export type SubmitInstitutionNameApiArg = {
  submitInstitutionNameCommand: SubmitInstitutionNameCommand;
};
export type UpdateInstitutionNameApiResponse =
  /** status 204 No Content */ void;
export type UpdateInstitutionNameApiArg = {
  updateInstitutionNameCommand: UpdateInstitutionNameCommand;
};
export type ActivateJobRoleApiResponse = /** status 200 Success */ number;
export type ActivateJobRoleApiArg = {
  activateJobRoleCommand: ActivateJobRoleCommand;
};
export type ActivateJobApiResponse = /** status 200 Success */ number;
export type ActivateJobApiArg = {
  activateJobCommand: ActivateJobCommand;
};
export type AddJobApiResponse = /** status 200 Success */ JobCreationResponse;
export type AddJobApiArg = {
  addJobCommand: AddJobCommand;
};
export type AddJobRoleApiResponse = /** status 200 Success */ number;
export type AddJobRoleApiArg = {
  addJobRoleCommand: AddJobRoleCommand;
};
export type GetAllJobListApiResponse = /** status 200 Success */ JobDto[];
export type GetAllJobListApiArg = void;
export type GetAllJobRoleApiResponse =
  /** status 200 Success */ JobRoleDtoRead[];
export type GetAllJobRoleApiArg = void;
export type GetJobRolesListsApiResponse =
  /** status 200 Success */ JobRolesSearchResultRead;
export type GetJobRolesListsApiArg = {
  status?: ApprovalStatus;
  pageNumber?: number;
  pageSize?: number;
};
export type ApproveJobApiResponse = /** status 200 Success */ number;
export type ApproveJobApiArg = {
  approveJobCommand: ApproveJobCommand;
};
export type ApproveJobRoleApiResponse = /** status 200 Success */ number;
export type ApproveJobRoleApiArg = {
  approveJobRolesCommand: ApproveJobRolesCommand;
};
export type GetJobRolesCountPerApprovalStatusApiResponse =
  /** status 200 Success */ JobRolesCountsByStatus;
export type GetJobRolesCountPerApprovalStatusApiArg = void;
export type DeactivateJobRoleApiResponse = /** status 200 Success */ number;
export type DeactivateJobRoleApiArg = {
  deactivateJobRoleCommand: DeactivateJobRoleCommand;
};
export type DeactivateJobApiResponse = /** status 200 Success */ number;
export type DeactivateJobApiArg = {
  deactivateJobCommand: DeactivateJobCommand;
};
export type GetJobByBuIdApiResponse = /** status 200 Success */ JobDto[];
export type GetJobByBuIdApiArg = {
  id?: number;
  employeeId?: number;
};
export type GetJobForPaginationApiResponse =
  /** status 200 Success */ JobSearchResult;
export type GetJobForPaginationApiArg = {
  status?: ApprovalStatus;
  pageNumber?: number;
  pageSize?: number;
};
export type GetJobListByBusinessUnitAndJobRoleApiResponse =
  /** status 200 Success */ JobSearchResultByBusinessUnitAndJobRole;
export type GetJobListByBusinessUnitAndJobRoleApiArg = {
  businessUnit?: number;
  jobRole?: number;
  pageNumber?: number;
  pageSize?: number;
};
export type GetJobRoleByIdApiResponse = /** status 200 Success */ number;
export type GetJobRoleByIdApiArg = {
  id?: number;
};
export type GetJobRoleforPromotionApiResponse =
  /** status 200 Success */ JobRoleDtoRead[];
export type GetJobRoleforPromotionApiArg = {
  rolename?: string;
};
export type GetJobCountPerStatusApiResponse =
  /** status 200 Success */ JobCountsByStatus;
export type GetJobCountPerStatusApiArg = void;
export type RejectJobApiResponse = /** status 200 Success */ number;
export type RejectJobApiArg = {
  rejectJobCommand: RejectJobCommand;
};
export type RejectJobRoleApiResponse = /** status 200 Success */ number;
export type RejectJobRoleApiArg = {
  rejectJobRolesCommand: RejectJobRolesCommand;
};
export type SubmitJobApiResponse = /** status 200 Success */ number;
export type SubmitJobApiArg = {
  submitJobCommand: SubmitJobCommand;
};
export type SubmitJobRolesApiResponse = /** status 200 Success */ number;
export type SubmitJobRolesApiArg = {
  submitJobRolesCommand: SubmitJobRolesCommand;
};
export type UpdateJobApiResponse =
  /** status 200 Success */ JobUpdationResponse;
export type UpdateJobApiArg = {
  updateJobCommand: UpdateJobCommand;
};
export type UpdateJobRoleApiResponse = /** status 200 Success */ number;
export type UpdateJobRoleApiArg = {
  updateJobRoleCommand: UpdateJobRoleCommand;
};
export type ActivateJobCategoryApiResponse = unknown;
export type ActivateJobCategoryApiArg = {
  id: number;
};
export type ApproveJobCatagoryApiResponse = unknown;
export type ApproveJobCatagoryApiArg = {
  id: number;
};
export type CreateJobCategoyApiResponse = /** status 200 Success */ number;
export type CreateJobCategoyApiArg = {
  createJobCategoryCommand: CreateJobCategoryCommand;
};
export type DeactivateJobCategoyApiResponse = unknown;
export type DeactivateJobCategoyApiArg = {
  id: number;
};
export type DeleteJobCategoryApiResponse = unknown;
export type DeleteJobCategoryApiArg = {
  id: number;
};
export type GetAllJobCategoryApiResponse =
  /** status 200 Success */ JobCategoryLists;
export type GetAllJobCategoryApiArg = void;
export type GetJobCategoriesListForPaginationQueryApiResponse =
  /** status 200 Success */ JobCategorySearchResult;
export type GetJobCategoriesListForPaginationQueryApiArg = {
  status?: ApprovalStatus;
  pageNumber?: number;
  pageSize?: number;
};
export type GetJobCategoryByIdApiResponse = unknown;
export type GetJobCategoryByIdApiArg = {
  id: number;
};
export type GetJobCategoryCountByApprovalStatusApiResponse =
  /** status 200 Success */ JobCategoryCountsByStatus;
export type GetJobCategoryCountByApprovalStatusApiArg = void;
export type GetJobCatagoryListQueryApiResponse = unknown;
export type GetJobCatagoryListQueryApiArg = void;
export type RejectJobCategoryApiResponse = unknown;
export type RejectJobCategoryApiArg = {
  rejectJobCategoryCommand: RejectJobCategoryCommand;
};
export type SubmitJobCategoryApiResponse = unknown;
export type SubmitJobCategoryApiArg = {
  id: number;
};
export type UpdateJobCategoryApiResponse = unknown;
export type UpdateJobCategoryApiArg = {
  updateJobCategoryCommand: UpdateJobCategoryCommand;
};
export type AddJobGradeApiResponse = /** status 200 Success */ number;
export type AddJobGradeApiArg = {
  addJobGradeCommand: AddJobGradeCommand;
};
export type GetAllJobGradeApiResponse = /** status 200 Success */ JobGrade[];
export type GetAllJobGradeApiArg = void;
export type ApproveJobGradeApiResponse = /** status 200 Success */ number;
export type ApproveJobGradeApiArg = {
  approveJobGradeCommand: ApproveJobGradeCommand;
};
export type GetJobGradesCountPerApprovalStatusApiResponse =
  /** status 200 Success */ JobGradesCountsByStatus;
export type GetJobGradesCountPerApprovalStatusApiArg = void;
export type GetJobGradeOfJobRoleApiResponse = /** status 200 Success */ JobRole;
export type GetJobGradeOfJobRoleApiArg = {
  roleid?: number;
};
export type GetJobGradesListApiResponse =
  /** status 200 Success */ JobGradesSearchResult;
export type GetJobGradesListApiArg = {
  status?: ApprovalStatus;
  pageNumber?: number;
  pageSize?: number;
};
export type GetSalaryOfEmployeeByRoleApiResponse =
  /** status 200 Success */ number;
export type GetSalaryOfEmployeeByRoleApiArg = {
  gradeId?: number;
  salarytype?: number;
  step?: number;
  stepId?: number;
};
export type RejectJobGradeApiResponse = /** status 200 Success */ number;
export type RejectJobGradeApiArg = {
  rejectJobGradeCommand: RejectJobGradeCommand;
};
export type SubmitJobGradeApiResponse = /** status 200 Success */ number;
export type SubmitJobGradeApiArg = {
  submitJobGradeCommand: SubmitJobGradeCommand;
};
export type UpdateJobGradeApiResponse = unknown;
export type UpdateJobGradeApiArg = {
  updateJobGradeCommand: UpdateJobGradeCommand;
};
export type ApproveJobRoleCategoryApiResponse =
  /** status 200 Success */ number;
export type ApproveJobRoleCategoryApiArg = {
  approveJobRoleCatagoryCommand: ApproveJobRoleCatagoryCommand;
};
export type GetJobRoleCategoryCountPerStatusApiResponse =
  /** status 200 Success */ JobRoleCatagoryCountsByStatus;
export type GetJobRoleCategoryCountPerStatusApiArg = void;
export type CreateJobRoleCategoryApiResponse = /** status 200 Success */ number;
export type CreateJobRoleCategoryApiArg = {
  createJobRoleCatagoryCommand: CreateJobRoleCatagoryCommand;
};
export type GetAllJobRoleCategoryApiResponse =
  /** status 200 Success */ JobRoleCatagoryLists;
export type GetAllJobRoleCategoryApiArg = void;
export type GetJobRoleCategoriesForPaginationApiResponse =
  /** status 200 Success */ PaginatedJobRoleCatagoryList;
export type GetJobRoleCategoriesForPaginationApiArg = {
  status?: ApprovalStatus;
  pageNumber?: number;
  pageSize?: number;
};
export type RejectJobRoleCategoryApiResponse = /** status 200 Success */ number;
export type RejectJobRoleCategoryApiArg = {
  rejectJobRoleCatagoryCommand: RejectJobRoleCatagoryCommand;
};
export type SearchAllJobRoleCatagoriesApiResponse =
  /** status 200 Success */ JobRoleCatagoryDto[];
export type SearchAllJobRoleCatagoriesApiArg = void;
export type SubmitJobRoleCategoryApiResponse = /** status 200 Success */ number;
export type SubmitJobRoleCategoryApiArg = {
  submitJobRoleCatagoryCommand: SubmitJobRoleCatagoryCommand;
};
export type UpdateJobRoleCategoryApiResponse = /** status 200 Success */ number;
export type UpdateJobRoleCategoryApiArg = {
  updateJobRoleCatagoryCommand: UpdateJobRoleCatagoryCommand;
};
export type CreateJudgeAssignmentApiResponse = /** status 200 Success */ number;
export type CreateJudgeAssignmentApiArg = {
  createJudgeAssignmentCommand: CreateJudgeAssignmentCommand;
};
export type GetJudgeAssignmentsByCaseIdApiResponse =
  /** status 200 Success */ JudgeAssignmentDto[];
export type GetJudgeAssignmentsByCaseIdApiArg = {
  caseId?: number;
};
export type UpdateJudgeAssignmentApiResponse = /** status 200 Success */ number;
export type UpdateJudgeAssignmentApiArg = {
  id?: number;
  updateJudgeAssignmentCommand: UpdateJudgeAssignmentCommand;
};
export type CreateJudgmentApiResponse = /** status 200 Success */ number;
export type CreateJudgmentApiArg = {
  createJudgmentCommand: CreateJudgmentCommand;
};
export type GetJudgmentsByCaseIdApiResponse =
  /** status 200 Success */ JudgmentDto[];
export type GetJudgmentsByCaseIdApiArg = {
  caseId?: number;
};
export type UpdateJudgmentApiResponse = /** status 200 Success */ number;
export type UpdateJudgmentApiArg = {
  id?: number;
  updateJudgmentCommand: UpdateJudgmentCommand;
};
export type CreateLanguageApiResponse = /** status 200 Success */ number;
export type CreateLanguageApiArg = {
  createLanguageSkillCommand: CreateLanguageSkillCommand;
};
export type DeleteLanguageSkillApiResponse = unknown;
export type DeleteLanguageSkillApiArg = {
  deleteLanguageSkillCommand: DeleteLanguageSkillCommand;
};
export type GetLanguageSkillByIdApiResponse =
  /** status 200 Success */ LanguageSkillDto[];
export type GetLanguageSkillByIdApiArg = {
  employeeId?: number;
};
export type UpdateLanguageSkillApiResponse = /** status 200 Success */ number;
export type UpdateLanguageSkillApiArg = {
  updateLanguageSkillCommand: UpdateLanguageSkillCommand;
};
export type CreateLetterApiResponse = /** status 200 Success */ number;
export type CreateLetterApiArg = {
  createLetterCommand: CreateLetterCommand;
};
export type UpdateLetterApiResponse = unknown;
export type UpdateLetterApiArg = {
  updateLetterCommand: UpdateLetterCommand;
};
export type AddLetterDocumentApiResponse =
  /** status 200 Success */ DocumentMetadataDto;
export type AddLetterDocumentApiArg = {
  id: number;
  documentType?: DocumentType;
  body: {
    file?: Blob;
  };
};
export type ApproveLetterApiResponse = /** status 200 Success */ number;
export type ApproveLetterApiArg = {
  approveLetterCommand: ApproveLetterCommand;
};
export type GetLetterCountPerStatusApiResponse =
  /** status 200 Success */ LetterCountsByStatus;
export type GetLetterCountPerStatusApiArg = {
  userId?: string;
};
export type CreateEditableLetterApiResponse = /** status 200 Success */ number;
export type CreateEditableLetterApiArg = {
  createEditableLetterCommand: CreateEditableLetterCommand;
};
export type GetLettersForPaginationApiResponse =
  /** status 200 Success */ PaginatedLetterListRead;
export type GetLettersForPaginationApiArg = {
  status?: LetterStatus;
  pageNumber?: number;
  pageSize?: number;
  userId?: string;
};
export type RejectLetterApiResponse = /** status 200 Success */ number;
export type RejectLetterApiArg = {
  rejectLetterCommand: RejectLetterCommand;
};
export type SearchAllLettersApiResponse =
  /** status 200 Success */ LetterDtoRead[];
export type SearchAllLettersApiArg = {
  userId?: string;
};
export type SubmitLetterApiResponse = /** status 200 Success */ number;
export type SubmitLetterApiArg = {
  submitLetterCommand: SubmitLetterCommand;
};
export type GetAllLookupsApiResponse = /** status 200 Success */ LookupDtoRead;
export type GetAllLookupsApiArg = void;
<<<<<<< HEAD
export type GetUserConversationsApiResponse =
  /** status 200 Success */ ConversationDto[];
export type GetUserConversationsApiArg = {
  userId?: string;
};
export type MarkMessagesAsReadApiResponse = unknown;
export type MarkMessagesAsReadApiArg = {
  userId?: string;
  chatPartnerId: string;
};
export type GetMessagesApiResponse = /** status 200 Success */ ChatMessageDto[];
export type GetMessagesApiArg = {
  userId?: string;
  chatPartnerId: string;
};
export type SendMessageApiResponse = unknown;
export type SendMessageApiArg = {
  sendMessageCommand: SendMessageCommand;
};
export type CreateNotificationApiResponse = /** status 200 Success */ number;
export type CreateNotificationApiArg = {
  createNotificationCommand: CreateNotificationCommand;
};
export type GetNotificationsByUserIdApiResponse =
  /** status 200 Success */ NotificationDto[];
export type GetNotificationsByUserIdApiArg = {
  userId: string;
};
export type UpdateNotificationApiResponse = /** status 200 Success */ number;
export type UpdateNotificationApiArg = {
  id: number;
  updateNotificationCommand: UpdateNotificationCommand;
};
export type CreatePaymentApiResponse = /** status 200 Success */ number;
export type CreatePaymentApiArg = {
  createPaymentCommand: CreatePaymentCommand;
};
export type GetAllPaymentsApiResponse = /** status 200 Success */ PaymentDto[];
export type GetAllPaymentsApiArg = void;
export type GetPaymentsByBusinessUnitApiResponse =
  /** status 200 Success */ PaymentDto[];
export type GetPaymentsByBusinessUnitApiArg = {
  businessUnitId?: number;
};
export type GetPaymentsByCaseIdApiResponse =
  /** status 200 Success */ PaymentDto[];
export type GetPaymentsByCaseIdApiArg = {
  caseId?: number;
};
export type GetByIdApiResponse = /** status 200 Success */ PaymentDto;
export type GetByIdApiArg = {
  id?: number;
};
export type UpdatePaymentApiResponse = /** status 200 Success */ boolean;
export type UpdatePaymentApiArg = {
  id?: number;
  updatePaymentCommand: UpdatePaymentCommand;
=======
export type ApproveReemploymentApiResponse = /** status 200 Success */ number;
export type ApproveReemploymentApiArg = {
  approveReemploymentCommand: ApproveReemploymentCommand;
};
export type CreateReemploymentApiResponse = /** status 200 Success */ number;
export type CreateReemploymentApiArg = {
  createReemploymentCommand: CreateReemploymentCommand;
};
export type GetAllReemploymentsListApiResponse =
  /** status 200 Success */ ReemploymentDto[];
export type GetAllReemploymentsListApiArg = void;
export type GetReemploymentByIdApiResponse =
  /** status 200 Success */ ReemploymentDto;
export type GetReemploymentByIdApiArg = {
  reemploymentId?: number;
};
export type GetReemploymentCountPerStatusApiResponse =
  /** status 200 Success */ ReemploymentCountsByStatus;
export type GetReemploymentCountPerStatusApiArg = {
  employeeId?: number;
};
export type GetReemploymentListForPaginationApiResponse =
  /** status 200 Success */ ReemploymentSearchResult;
export type GetReemploymentListForPaginationApiArg = {
  status?: ApprovalStatus;
  pageNumber?: number;
  pageSize?: number;
  employeeId?: number;
};
export type RejectReemploymentApiResponse = /** status 200 Success */ number;
export type RejectReemploymentApiArg = {
  rejectReemploymentCommand: RejectReemploymentCommand;
};
export type SubmitReemploymentApiResponse = /** status 200 Success */ number;
export type SubmitReemploymentApiArg = {
  submitReemploymentCommand: SubmitReemploymentCommand;
};
export type UpdateReemploymentApiResponse = /** status 200 Success */ number;
export type UpdateReemploymentApiArg = {
  updateReemploymentCommand: UpdateReemploymentCommand;
>>>>>>> origin/Solomon/v2
};
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
export type ApproveResignationApiResponse = /** status 200 Success */ number;
export type ApproveResignationApiArg = {
  approveResignationCommand: ApproveResignationCommand;
};
export type GetResignationCountPerStatusApiResponse =
  /** status 200 Success */ ResignationCountsByStatus;
export type GetResignationCountPerStatusApiArg = {
  employeeId?: number;
};
export type CreateResignationApiResponse = /** status 200 Success */ number;
export type CreateResignationApiArg = {
  createResignationCommand: CreateResignationCommand;
};
export type GetActiveResignationApiResponse =
  /** status 200 Success */ ActingDtoRead;
export type GetActiveResignationApiArg = {
  id?: number;
};
export type GetPaginatedResignationsApiResponse =
  /** status 200 Success */ PaginatedResignationListRead;
export type GetPaginatedResignationsApiArg = {
  employeeId?: number;
  status?: ApprovalStatus;
  pageNumber?: number;
  pageSize?: number;
};
export type RejectResignationApiResponse = /** status 200 Success */ number;
export type RejectResignationApiArg = {
  rejectResignationCommand: RejectResignationCommand;
};
export type SubmitResignationApiResponse = /** status 200 Success */ number;
export type SubmitResignationApiArg = {
  submitResignationCommand: SubmitResignationCommand;
};
export type UpdateResignationApiResponse = /** status 200 Success */ number;
export type UpdateResignationApiArg = {
  updateResignationCommand: UpdateResignationCommand;
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
export type ApproveSuspensionApiResponse = /** status 200 Success */ number;
export type ApproveSuspensionApiArg = {
  approveSuspensionCommand: ApproveSuspensionCommand;
};
export type GetSuspensionCountPerStatusApiResponse =
  /** status 200 Success */ SuspensionCountsByStatus;
export type GetSuspensionCountPerStatusApiArg = {
  employeeId?: number;
};
export type CreateSuspensionApiResponse = /** status 200 Success */ number;
export type CreateSuspensionApiArg = {
  createSuspensionCommand: CreateSuspensionCommand;
};
export type GetActiveSuspentionApiResponse =
  /** status 200 Success */ ActingDtoRead;
export type GetActiveSuspentionApiArg = {
  id?: number;
};
export type GetPaginatedSuspensionsApiResponse =
  /** status 200 Success */ PaginatedSuspensionListRead;
export type GetPaginatedSuspensionsApiArg = {
  employeeId?: number;
  status?: ApprovalStatus;
  pageNumber?: number;
  pageSize?: number;
};
export type RejectSuspensionApiResponse = /** status 200 Success */ number;
export type RejectSuspensionApiArg = {
  rejectSuspensionCommand: RejectSuspensionCommand;
};
export type SubmitSuspensionApiResponse = /** status 200 Success */ number;
export type SubmitSuspensionApiArg = {
  submitSuspensionCommand: SubmitSuspensionCommand;
};
export type UpdateSuspensionApiResponse = /** status 200 Success */ number;
export type UpdateSuspensionApiArg = {
  updateSuspensionCommand: UpdateSuspensionCommand;
};
export type AddUserPhotoApiResponse =
  /** status 200 Success */ DocumentMetadataDto;
export type AddUserPhotoApiArg = {
  id: string;
  body: {
    file?: Blob;
  };
};
export type AddUserSignatureApiResponse =
  /** status 200 Success */ DocumentMetadataDto;
export type AddUserSignatureApiArg = {
  id: string;
  body: {
    file?: Blob;
  };
};
export type CurrentUserInfoApiResponse = /** status 200 Success */ UserDtoRead;
export type CurrentUserInfoApiArg = void;
export type ApproveBranchGradeApiResponse = /** status 200 Success */ number;
export type ApproveBranchGradeApiArg = {
  approveBranchGradeCommand: ApproveBranchGradeCommand;
};
export type GetBranchGradeCountPerStatusApiResponse =
  /** status 200 Success */ BranchGradeCountsByStatus;
export type GetBranchGradeCountPerStatusApiArg = void;
export type GetAllBranchGradeListApiResponse =
  /** status 200 Success */ BranchGradeDto[];
export type GetAllBranchGradeListApiArg = void;
export type GetBranchGradeByDescriptionApiResponse =
  /** status 200 Success */ BranchGradeDto[];
export type GetBranchGradeByDescriptionApiArg = {
  description?: string;
};
export type GetBranchGradeForPaginationApiResponse =
  /** status 200 Success */ BranchGradeSearchResult;
export type GetBranchGradeForPaginationApiArg = {
  status?: ApprovalStatus;
  pageNumber?: number;
  pageSize?: number;
};
export type RejectBranchGradeApiResponse = /** status 200 Success */ number;
export type RejectBranchGradeApiArg = {
  rejectBranchGradeCommand: RejectBranchGradeCommand;
};
export type SubmitBranchGradeApiResponse = /** status 200 Success */ number;
export type SubmitBranchGradeApiArg = {
  submitBranchGradeCommand: SubmitBranchGradeCommand;
};
export type UpdateBranchGradeApiResponse = /** status 200 Success */ number;
export type UpdateBranchGradeApiArg = {
  updateBranchGradeCommand: UpdateBranchGradeCommand;
};
export type AddBranchGradeCommand = {
  grade?: string | null;
  staffLimit?: number;
  description?: string | null;
};
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
export type ApproveActingCommand = {
  id?: number;
};
export type ActingCountsByStatus = {
  approved?: number;
  submitted?: number;
  rejected?: number;
  draft?: number;
};
export type ActingType = 1 | 2 | 3;
export type CreateActingCommand = {
  employeeId?: number;
  jobRoleId?: number;
  previousJobRoleId?: number;
  businessUnitId?: number | null;
  previousBusinessUnitId?: number | null;
  startDate?: string;
  endDate?: string | null;
  actingType?: ActingType;
};
export type ApprovalStatus = 1 | 2 | 3 | 4;
export type EmploymentType = 1 | 2 | 3;
export type Gender = 0 | 1 | 2;
export type MartialStatus = 1 | 2 | 3 | 4;
export type BusinessUnitTypeEnum = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Status = 1 | 2;
export type BusinessUnitType = {
  value?: BusinessUnitTypeEnum;
  name?: string | null;
  description?: string | null;
  numberOfDigits?: number;
  order?: number;
  isActive?: boolean;
};
export type CourtLevel = 1 | 2 | 3;
export type ChilotType = 1 | 2 | 3 | 99;
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
export type LetterType = 1 | 2 | 3;
export type LetterStatus = 1 | 2 | 3 | 4;
export type DocumentType = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type LetterDocument = {
  isDeleted?: boolean | null;
  deletedBy?: string | null;
  deletedAt?: string | null;
  deletionComment?: string | null;
  id?: number;
  documentType?: DocumentType;
  documentId?: string | null;
  fileName?: string | null;
  isImage?: boolean;
  letterId?: number;
  letter?: Letter;
};
export type LetterDocumentRead = {
  isDeleted?: boolean | null;
  deletedBy?: string | null;
  deletedAt?: string | null;
  deletionComment?: string | null;
  id?: number;
  documentType?: DocumentType;
  documentId?: string | null;
  fileName?: string | null;
  isImage?: boolean;
  letterId?: number;
  letter?: Letter;
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
  letterDocuments?: LetterDocument[] | null;
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
  letterDocuments?: LetterDocumentRead[] | null;
};
export type UserDocument = {
  isDeleted?: boolean | null;
  deletedBy?: string | null;
  deletedAt?: string | null;
  deletionComment?: string | null;
  id?: number;
  documentType?: DocumentType;
  documentId?: string | null;
  fileName?: string | null;
  userId?: string | null;
  user?: HrUser;
};
export type UserDocumentRead = {
  isDeleted?: boolean | null;
  deletedBy?: string | null;
  deletedAt?: string | null;
  deletionComment?: string | null;
  id?: number;
  documentType?: DocumentType;
  documentId?: string | null;
  fileName?: string | null;
  userId?: string | null;
  user?: HrUser;
};
export type CaseType = 1 | 2 | 3 | 4;
export type CaseStatus = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
export type CaseDocument = {
  isDeleted?: boolean | null;
  deletedBy?: string | null;
  deletedAt?: string | null;
  deletionComment?: string | null;
  id?: number;
  fileName: string;
  filePath: string;
  documentType?: DocumentType;
  pageCount?: number;
  isVerified?: boolean;
  uploadedById?: string | null;
  uploadedAt?: string;
  caseId?: number;
  case?: Case;
};
export type CaseDocumentRead = {
  isDeleted?: boolean | null;
  deletedBy?: string | null;
  deletedAt?: string | null;
  deletionComment?: string | null;
  id?: number;
  fileName: string;
  filePath: string;
  documentType?: DocumentType;
  pageCount?: number;
  isVerified?: boolean;
  uploadedById?: string | null;
  uploadedAt?: string;
  caseId?: number;
  case?: Case;
};
export type PaymentStatus = 1 | 2 | 3 | 4;
export type Payment = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  id?: number;
  caseId?: number;
  case?: Case;
  amount?: number;
  gateway?: string | null;
  transactionId?: string | null;
  status?: PaymentStatus;
  receiptFilePath?: string | null;
  processedById?: string | null;
  processedBy?: HrUser;
  paidAt?: string | null;
};
export type PaymentRead = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  id?: number;
  caseId?: number;
  case?: Case;
  amount?: number;
  gateway?: string | null;
  transactionId?: string | null;
  status?: PaymentStatus;
  receiptFilePath?: string | null;
  processedById?: string | null;
  processedBy?: HrUser;
  paidAt?: string | null;
};
export type HearingType = 1 | 2 | 3 | 4 | 5;
export type HearingParticipant = {
  id?: number;
  userId?: string | null;
  displayName?: string | null;
  role?: string | null;
};
export type Hearing = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  id?: number;
  caseId?: number;
  case?: Case;
  scheduledAt?: string;
  hearingType?: HearingType;
  locationOrUrl?: string | null;
  responsibleJudgeId?: string | null;
  participants?: HearingParticipant[] | null;
  chilotId?: number | null;
  chilot?: Chilot;
  businessUnitId?: number | null;
  businessUnit?: BusinessUnit;
  notes?: string | null;
};
export type HearingRead = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  id?: number;
  caseId?: number;
  case?: Case;
  scheduledAt?: string;
  hearingType?: HearingType;
  locationOrUrl?: string | null;
  responsibleJudgeId?: string | null;
  participants?: HearingParticipant[] | null;
  chilotId?: number | null;
  chilot?: Chilot;
  businessUnitId?: number | null;
  businessUnit?: BusinessUnit;
  notes?: string | null;
};
export type Judgment = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  id?: number;
  caseId?: number;
  case?: Case;
  htmlContent?: string | null;
  pdfFilePath?: string | null;
  signedByUserId?: string | null;
  signedBy?: HrUser;
  signedAt?: string | null;
  fileHash?: string | null;
  isPublished?: boolean;
  publishedAt?: string | null;
};
export type JudgmentRead = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  id?: number;
  caseId?: number;
  case?: Case;
  htmlContent?: string | null;
  pdfFilePath?: string | null;
  signedByUserId?: string | null;
  signedBy?: HrUser;
  signedAt?: string | null;
  fileHash?: string | null;
  isPublished?: boolean;
  publishedAt?: string | null;
};
export type CaseTimeline = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  id?: number;
  caseId?: number;
  case?: Case;
  eventType: string;
  details?: string | null;
  actorUserId?: string | null;
  eventAt?: string;
};
export type CaseTimelineRead = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  id?: number;
  caseId?: number;
  case?: Case;
  eventType: string;
  details?: string | null;
  actorUserId?: string | null;
  eventAt?: string;
};
export type CaseTemplate = {
  createdAt?: string;
  modifiedAt?: string | null;
  createdBy?: HrUser;
  modifiedBy?: string | null;
  id?: number;
  name: string;
  content?: string | null;
  createdById?: string | null;
};
export type CaseTemplateRead = {
  createdAt?: string;
  modifiedAt?: string | null;
  createdBy?: HrUser;
  modifiedBy?: string | null;
  id?: number;
  name: string;
  content?: string | null;
  createdById?: string | null;
};
export type AppointmentStatus = 1 | 2 | 3 | 4;
export type Appointment = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  id?: number;
  caseId?: number;
  case?: Case;
  businessUnitId?: number;
  businessUnit?: BusinessUnit;
  appointmentDate?: string;
  subject: string;
  location?: string | null;
  status?: AppointmentStatus;
  scheduledById?: string | null;
  scheduledBy?: HrUser;
  notes?: string | null;
};
export type AppointmentRead = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  id?: number;
  caseId?: number;
  case?: Case;
  businessUnitId?: number;
  businessUnit?: BusinessUnit;
  appointmentDate?: string;
  subject: string;
  location?: string | null;
  status?: AppointmentStatus;
  scheduledById?: string | null;
  scheduledBy?: HrUser;
  notes?: string | null;
};
export type ChatbotMessage = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  id?: number;
  caseId?: number;
  case?: Case;
  senderId?: string | null;
  sender?: HrUser;
  receiverId?: string | null;
  receiver?: HrUser;
  message?: string | null;
  response?: string | null;
  seen?: boolean;
  isSystem?: boolean;
  sentAt?: string;
};
export type ChatbotMessageRead = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  id?: number;
  caseId?: number;
  case?: Case;
  senderId?: string | null;
  sender?: HrUser;
  receiverId?: string | null;
  receiver?: HrUser;
  message?: string | null;
  response?: string | null;
  seen?: boolean;
  isSystem?: boolean;
  sentAt?: string;
};
export type Case = {
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
  caseNumber: string;
  caseType?: CaseType;
  status?: CaseStatus;
  plaintiffName: string;
  accusedName: string;
  subject?: string | null;
  filedAt?: string;
  closedAt?: string | null;
  filedById: string;
  filedBy?: HrUser;
  assignedJudgeId?: string | null;
  assignedJudge?: HrUser;
  businessUnitId?: number;
  businessUnit?: BusinessUnit;
  chilotId?: number | null;
  chilot?: Chilot;
  documents?: CaseDocument[] | null;
  payments?: Payment[] | null;
  hearings?: Hearing[] | null;
  judgments?: Judgment[] | null;
  timeline?: CaseTimeline[] | null;
  judgeAssignments?: JudgeAssignment[] | null;
  templatesUsed?: CaseTemplate[] | null;
  appointments?: Appointment[] | null;
  chatbotMessages?: ChatbotMessage[] | null;
};
export type CaseRead = {
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
  caseNumber: string;
  caseType?: CaseType;
  status?: CaseStatus;
  plaintiffName: string;
  accusedName: string;
  subject?: string | null;
  filedAt?: string;
  closedAt?: string | null;
  filedById: string;
  filedBy?: HrUser;
  assignedJudgeId?: string | null;
  assignedJudge?: HrUser;
  businessUnitId?: number;
  businessUnit?: BusinessUnit;
  chilotId?: number | null;
  chilot?: Chilot;
  documents?: CaseDocumentRead[] | null;
  payments?: PaymentRead[] | null;
  hearings?: HearingRead[] | null;
  judgments?: JudgmentRead[] | null;
  timeline?: CaseTimelineRead[] | null;
  judgeAssignments?: JudgeAssignment[] | null;
  templatesUsed?: CaseTemplateRead[] | null;
  appointments?: AppointmentRead[] | null;
  chatbotMessages?: ChatbotMessageRead[] | null;
};
export type NotificationChannel = 1 | 2 | 3;
export type Notification = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  id?: number;
  userId?: string | null;
  user?: HrUser;
  title: string;
  body?: string | null;
  isRead?: boolean;
  sentAt?: string;
  caseId?: number | null;
  paymentId?: number | null;
  hearingId?: number | null;
  channel?: NotificationChannel;
};
export type NotificationRead = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  id?: number;
  userId?: string | null;
  user?: HrUser;
  title: string;
  body?: string | null;
  isRead?: boolean;
  sentAt?: string;
  caseId?: number | null;
  paymentId?: number | null;
  hearingId?: number | null;
  channel?: NotificationChannel;
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
  userDocuments?: UserDocument[] | null;
  filedCases?: Case[] | null;
  assignedCases?: Case[] | null;
  notifications?: Notification[] | null;
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
  userDocuments?: UserDocumentRead[] | null;
  filedCases?: CaseRead[] | null;
  assignedCases?: CaseRead[] | null;
  notifications?: NotificationRead[] | null;
};
export type JudgeAssignment = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  id?: number;
  judgeId?: string | null;
  judge?: HrUser;
  caseId?: number | null;
  case?: Case;
  chilotId?: number | null;
  chilot?: Chilot;
  businessUnitId?: number | null;
  businessUnit?: BusinessUnit;
  assignedAt?: string;
  unassignedAt?: string | null;
  role?: string | null;
};
export type JudgeAssignmentRead = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  id?: number;
  judgeId?: string | null;
  judge?: HrUserRead;
  caseId?: number | null;
  case?: CaseRead;
  chilotId?: number | null;
  chilot?: Chilot;
  businessUnitId?: number | null;
  businessUnit?: BusinessUnit;
  assignedAt?: string;
  unassignedAt?: string | null;
  role?: string | null;
};
export type Chilot = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  id?: number;
  name?: string | null;
  chilotType?: ChilotType;
  roomNumber?: string | null;
  businessUnitId?: number;
  businessUnit?: BusinessUnit;
  judgeAssignments?: JudgeAssignment[] | null;
  cases?: Case[] | null;
};
export type ChilotRead = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  id?: number;
  name?: string | null;
  chilotType?: ChilotType;
  roomNumber?: string | null;
  businessUnitId?: number;
  businessUnit?: BusinessUnit;
  judgeAssignments?: JudgeAssignmentRead[] | null;
  cases?: CaseRead[] | null;
};
export type BusinessUnit = {
  id?: number;
  businessUnitID: string;
  name: string;
  parentId?: number;
  type?: BusinessUnitTypeEnum;
  businessUnitCode?: string | null;
  staffStrength?: number | null;
  approvalStatus?: ApprovalStatus;
  status?: Status;
  businessUnitType?: BusinessUnitType;
  courtLevel?: CourtLevel;
  courtCode?: string | null;
  location?: string | null;
  address?: string | null;
  chillots?: Chilot[] | null;
  cases?: Case[] | null;
  appointments?: Appointment[] | null;
  judgeAssignments?: JudgeAssignment[] | null;
};
export type BusinessUnitRead = {
  id?: number;
  businessUnitID: string;
  name: string;
  parentId?: number;
  type?: BusinessUnitTypeEnum;
  businessUnitCode?: string | null;
  staffStrength?: number | null;
  approvalStatus?: ApprovalStatus;
  status?: Status;
  businessUnitType?: BusinessUnitType;
  courtLevel?: CourtLevel;
  courtCode?: string | null;
  location?: string | null;
  address?: string | null;
  chillots?: ChilotRead[] | null;
  cases?: CaseRead[] | null;
  appointments?: AppointmentRead[] | null;
  judgeAssignments?: JudgeAssignmentRead[] | null;
};
export type JobStatus = 1 | 2;
export type JobRoleCategory = {
  id?: number;
  name?: string | null;
  description?: string | null;
  jobRoles?: JobRole[] | null;
  approvalStatus?: ApprovalStatus;
};
export type JobGradeRomanId =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 32
  | 33
  | 34
  | 35
  | 36
  | 37
  | 38
  | 39
  | 40;
export type JobGradeStep = {
  id?: number;
  jobGradeId?: number;
  jobGrade?: JobGrade;
  stepNumber?: number;
  salaryAmount?: number;
};
export type JobGrade = {
  jobGradeId?: number;
  jobGradeRomanId?: JobGradeRomanId;
  name?: string | null;
  baseSalary?: number;
  stepCoefficient?: number;
  ceilingSalary?: number | null;
  description?: string | null;
  approvalStatus?: ApprovalStatus;
  statusRemark?: string | null;
  steps?: JobGradeStep[] | null;
};
export type JobCatagory = {
  id?: number;
  jobCategoryName?: string | null;
  approvalStatus?: ApprovalStatus;
  probationPeriodInDays?: number;
  isActive?: boolean;
  createdAt?: string;
  lastModifiedAt?: string;
};
export type ActivationEnum = 0 | 1;
export type BenefitUnitOfMeasurement = {
  id?: number;
  name?: string | null;
  isUnitPriced?: boolean;
  description?: string | null;
  remark?: string | null;
  approvalStatus?: ApprovalStatus;
  benefits?: Benefit[] | null;
};
export type BenefitValue = {
  id?: number;
  benefitId?: number;
  benefit?: Benefit;
  value?: number;
  approvalStatus?: ApprovalStatus;
  description?: string | null;
  remark?: string | null;
};
export type BenefitUnitPrice = {
  id?: number;
  benefitId?: number;
  price?: number;
  effectiveDate?: string;
  approvalStatus?: ApprovalStatus;
  benefit?: Benefit;
  remark?: string | null;
  isActive?: ActivationEnum;
};
export type Benefit = {
  id?: number;
  name?: string | null;
  unitOfMeasurementId?: number;
  unitOfMeasurement?: BenefitUnitOfMeasurement;
  approvalStatus?: ApprovalStatus;
  isActive?: ActivationEnum;
  remark?: string | null;
  benefitValues?: BenefitValue[] | null;
  jobRoleBenefits?: JobRoleBenefit[] | null;
  benefitUnitPrices?: BenefitUnitPrice[] | null;
};
export type JobRoleBenefit = {
  id?: number;
  jobRoleId?: number;
  jobRole?: JobRole;
  benefitId?: number;
  benefit?: Benefit;
  benefitValueId?: number;
  benefitValue?: BenefitValue;
  isDeleted?: boolean;
  deletedDate?: string | null;
  createdDate?: string | null;
  modifiedDate?: string | null;
};
export type JobRole = {
  id?: number;
  roleName?: string | null;
  jobCatagoryId?: number;
  jobRoleCategoryId?: number;
  jobRoleCategory?: JobRoleCategory;
  jobGradeId?: number;
  jobGrade?: JobGrade;
  jobCatagory?: JobCatagory;
  description?: string | null;
  approvalStatus?: ApprovalStatus;
  statusRemark?: string | null;
  isActive?: ActivationEnum;
  jobRoleBenefits?: JobRoleBenefit[] | null;
};
export type Job = {
  id?: number;
  jobRoleId?: number;
  businessUnitId?: number;
  isVacant?: boolean;
  jobStatus?: JobStatus;
  approvalStatus?: ApprovalStatus;
  isLocked?: boolean;
  businessUnit?: BusinessUnit;
  jobRole?: JobRole;
  remark?: string | null;
};
<<<<<<< HEAD
export type JobRead = {
  id?: number;
  jobRoleId?: number;
  businessUnitId?: number;
  isVacant?: boolean;
  jobStatus?: JobStatus;
  approvalStatus?: ApprovalStatus;
  isLocked?: boolean;
  businessUnit?: BusinessUnitRead;
  jobRole?: JobRole;
  remark?: string | null;
};
export type EmployeeStatusEnum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
export type ProbationResult = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type EmployeeIdCardStatus = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type EmployeeIdCardReplaceReason = 1 | 2 | 3 | 4 | 5;
=======
export type EmployeeStatusEnum =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12;
export type ProbationResult = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type EmployeeIdCardStatus = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type EmployeeIdCardReplaceReason = 1 | 2 | 3 | 4 | 5;
export type DocumentType =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18;
>>>>>>> origin/Solomon/v2
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
export type EmployeeComment = {
  id?: number;
  employeeId?: number;
  commentType?: string | null;
  commentedByUserId?: string | null;
  commentedBy?: string | null;
  text?: string | null;
  date?: string;
  employee?: Employee;
};
export type EmployeeCommentRead = {
  id?: number;
  employeeId?: number;
  commentType?: string | null;
  commentedByUserId?: string | null;
  commentedBy?: string | null;
  text?: string | null;
  date?: string;
  employee?: Employee;
};
export type InstitutionName = {
  id?: number;
  name?: string | null;
  description?: string | null;
  educations?: Education[] | null;
  approvalStatus?: ApprovalStatus;
};
export type EducationLevel = {
  id?: number;
  name?: string | null;
  description?: string | null;
  educations?: Education[] | null;
  approvalStatus?: ApprovalStatus;
};
export type Award = {
  id?: number;
  name?: string | null;
  description?: string | null;
  educations?: Education[] | null;
  approvalStatus?: ApprovalStatus;
};
export type FieldOfStudy = {
  id?: number;
  name?: string | null;
  description?: string | null;
  educations?: Education[] | null;
  approvalStatus?: ApprovalStatus;
};
export type Education = {
  id?: number;
  startDate?: string;
  endDate?: string;
  schoolCity?: string | null;
  institutionNameId?: number;
  institutionName?: InstitutionName;
  educationLevelId?: number;
  educationLevel?: EducationLevel;
  awardId?: number;
  award?: Award;
  fieldOfStudyId?: number;
  fieldOfStudy?: FieldOfStudy;
  employeeId?: number | null;
  employee?: Employee;
  cgpa?: number | null;
};
export type EducationRead = {
  id?: number;
  startDate?: string;
  endDate?: string;
  schoolCity?: string | null;
  institutionNameId?: number;
  institutionName?: InstitutionName;
  educationLevelId?: number;
  educationLevel?: EducationLevel;
  awardId?: number;
  award?: Award;
  fieldOfStudyId?: number;
  fieldOfStudy?: FieldOfStudy;
  employeeId?: number | null;
  employee?: Employee;
  cgpa?: number | null;
};
export type LanguageEnum =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 32
  | 33
  | 34
  | 35
  | 36
  | 37
  | 38
  | 39
  | 40
  | 41
  | 42
  | 43
  | 44
  | 45
  | 46
  | 47
  | 48
  | 49
  | 50
  | 51
  | 52
  | 53
  | 54
  | 55
  | 56
  | 57
  | 58
  | 59
  | 60
  | 61
  | 62
  | 63
  | 64
  | 65
  | 66
  | 67
  | 68
  | 69
  | 70
  | 71
  | 72
  | 73;
export type SkillLevelEnum = 1 | 2 | 3 | 4;
export type LanguageSkill = {
  id?: number;
  language?: LanguageEnum;
  speaking?: SkillLevelEnum;
  listening?: SkillLevelEnum;
  writing?: SkillLevelEnum;
  reading?: SkillLevelEnum;
  employeeId?: number;
  employee?: Employee;
};
export type LanguageSkillRead = {
  id?: number;
  language?: LanguageEnum;
  speaking?: SkillLevelEnum;
  listening?: SkillLevelEnum;
  writing?: SkillLevelEnum;
  reading?: SkillLevelEnum;
  employeeId?: number;
  employee?: Employee;
};
export type EmployeeEmergencyContact = {
  id?: number;
  name?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  isWorking?: boolean;
  workingFirmName?: string | null;
  employeeId?: number;
};
export type EmployeeEmergencyContactRead = {
  id?: number;
  name?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  isWorking?: boolean;
  workingFirmName?: string | null;
  employeeId?: number;
};
export type EmployeeFamilyType = 1 | 2 | 3;
export type SpouseIsWorking = 0 | 1 | 2;
export type IsParentLiving = 0 | 1 | 2;
export type ParentType = 0 | 1 | 2;
export type EmployeeFamily = {
  id?: number;
  employeeId?: number;
  employees?: Employee;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  fatherFullName?: string | null;
  motherFullName?: string | null;
  dateOfBirth?: string | null;
  gender?: Gender;
  approvalStatus?: ApprovalStatus;
  workingFirm?: string | null;
  familyType?: EmployeeFamilyType;
  spouseIsWorking?: SpouseIsWorking;
  isParentLiving?: IsParentLiving;
  familyParentType?: ParentType;
  parentLivelyHood?: string | null;
  isActive?: ActivationEnum;
  comment?: string | null;
};
export type EmployeeFamilyRead = {
  id?: number;
  employeeId?: number;
  employees?: Employee;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  fatherFullName?: string | null;
  motherFullName?: string | null;
  dateOfBirth?: string | null;
  gender?: Gender;
  approvalStatus?: ApprovalStatus;
  workingFirm?: string | null;
  familyType?: EmployeeFamilyType;
  spouseIsWorking?: SpouseIsWorking;
  isParentLiving?: IsParentLiving;
  familyParentType?: ParentType;
  parentLivelyHood?: string | null;
  isActive?: ActivationEnum;
  comment?: string | null;
};
export type SuspensionReason = 1 | 2 | 3 | 4 | 99;
export type Suspension = {
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
  employeeId?: number;
  employee?: Employee;
  startDate?: string;
  endDate?: string | null;
  salary?: number;
  reason?: SuspensionReason;
  description?: string | null;
  conditionsForReinstatement?: string | null;
  isActive?: boolean;
  employeeFileDocuments?: EmployeeFileDocument[] | null;
};
<<<<<<< HEAD
export type EmployeeRead = {
=======
export type IDomainEvent = object;
export type SuspensionRead = {
>>>>>>> origin/Solomon/v2
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
  employeeId?: number;
  employee?: Employee;
  startDate?: string;
  endDate?: string | null;
  salary?: number;
  reason?: SuspensionReason;
  description?: string | null;
  conditionsForReinstatement?: string | null;
  isActive?: boolean;
  employeeFileDocuments?: EmployeeFileDocument[] | null;
};
export type ResignationType = 1 | 2 | 3 | 4;
export type Resignation = {
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
  employeeId?: number;
  employee?: Employee;
  salary?: number;
  workUnit?: string | null;
  resignationDate?: string;
  resignationType?: ResignationType;
  reasonForResignation?: string | null;
  finalSettlementDetails?: string | null;
  isActive?: boolean;
  employeeFileDocuments?: EmployeeFileDocument[] | null;
};
export type ResignationRead = {
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
  employeeId?: number;
  employee?: Employee;
  salary?: number;
  workUnit?: string | null;
  resignationDate?: string;
  resignationType?: ResignationType;
  reasonForResignation?: string | null;
  finalSettlementDetails?: string | null;
  isActive?: boolean;
  employeeFileDocuments?: EmployeeFileDocument[] | null;
};
export type EmployeeFileDocument = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  id?: string;
  employeeId?: number;
  employee?: Employee;
  suspensionId?: number | null;
  suspension?: Suspension;
  resignationId?: number | null;
  resignation?: Resignation;
  documentType?: DocumentType;
  fileName?: string | null;
  filePath?: string | null;
  contentType?: string | null;
  remark?: string | null;
  approvalStatus?: ApprovalStatus;
};
export type EmployeeFileDocumentRead = {
  createdAt?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  id?: string;
  employeeId?: number;
  employee?: Employee;
  suspensionId?: number | null;
  suspension?: SuspensionRead;
  resignationId?: number | null;
  resignation?: ResignationRead;
  documentType?: DocumentType;
  fileName?: string | null;
  filePath?: string | null;
  contentType?: string | null;
  remark?: string | null;
  approvalStatus?: ApprovalStatus;
};
export type Acting = {
  id?: number;
  employeeId?: number;
  employee?: Employee;
  jobRoleId?: number;
  jobRole?: JobRole;
  businessUnitId?: number | null;
  businessUnit?: BusinessUnit;
  startDate?: string;
  endDate?: string | null;
  actingType?: ActingType;
  previousJobRoleId?: number | null;
  previousJobRole?: JobRole;
  previousBusinessUnitId?: number | null;
  isActive?: boolean;
  previousBusinessUnit?: BusinessUnit;
  approvalStatus?: ApprovalStatus;
};
export type ActingRead = {
  id?: number;
  employeeId?: number;
  employee?: Employee;
  jobRoleId?: number;
  jobRole?: JobRole;
  businessUnitId?: number | null;
  businessUnit?: BusinessUnit;
  startDate?: string;
  endDate?: string | null;
  actingType?: ActingType;
  previousJobRoleId?: number | null;
  previousJobRole?: JobRole;
  previousBusinessUnitId?: number | null;
  isActive?: boolean;
  previousBusinessUnit?: BusinessUnit;
  approvalStatus?: ApprovalStatus;
};
export type Delegation = {
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
  employeeId?: number;
  employee?: Employee;
  jobRoleId?: number;
  jobRole?: JobRole;
  businessUnitId?: number | null;
  businessUnit?: BusinessUnit;
  startDate?: string;
  endDate?: string | null;
  isActive?: boolean;
};
export type DelegationRead = {
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
  employeeId?: number;
  employee?: Employee;
  jobRoleId?: number;
  jobRole?: JobRole;
  businessUnitId?: number | null;
  businessUnit?: BusinessUnit;
  startDate?: string;
  endDate?: string | null;
  isActive?: boolean;
};
export type Employee = {
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
  previousEmployeeId?: number | null;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  amharicFirstName?: string | null;
  amharicMiddleName?: string | null;
  amharicLastName?: string | null;
  amharicDisplayName?: string | null;
  tinNumber?: string | null;
  pensionID?: string | null;
  employmentType?: EmploymentType;
  businessUnitID?: number;
  jobId?: number;
  birthDate?: string;
  employementDate?: string;
  gender?: Gender;
  martialStatus?: MartialStatus;
<<<<<<< HEAD
  businessUnits?: BusinessUnitRead;
  job?: JobRead;
=======
  businessUnits?: BusinessUnit;
  salaryOnGradeStepId?: number | null;
  job?: Job;
  isNew?: boolean;
  employeeStatus?: EmployeeStatusEnum;
  probationResult?: ProbationResult;
  probationRemark?: string | null;
  employeeIDCardStatus?: EmployeeIdCardStatus;
  idReplaceReason?: EmployeeIdCardReplaceReason;
  employeeDocuments?: EmployeeDocument[] | null;
  employeeComments?: EmployeeComment[] | null;
  educations?: Education[] | null;
  languageSkills?: LanguageSkill[] | null;
  employeeEmergencyContacts?: EmployeeEmergencyContact[] | null;
  employeeFamilies?: EmployeeFamily[] | null;
  employeeFileDocuments?: EmployeeFileDocument[] | null;
  employeeIdCardStatusRemark?: string | null;
  actings?: Acting[] | null;
  delegations?: Delegation[] | null;
};
export type EmployeeRead = {
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
  previousEmployeeId?: number | null;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  amharicFirstName?: string | null;
  amharicMiddleName?: string | null;
  amharicLastName?: string | null;
  amharicDisplayName?: string | null;
  tinNumber?: string | null;
  pensionID?: string | null;
  employmentType?: EmploymentType;
  businessUnitID?: number;
  jobId?: number;
  birthDate?: string;
  employementDate?: string;
  gender?: Gender;
  martialStatus?: MartialStatus;
  businessUnits?: BusinessUnit;
  salaryOnGradeStepId?: number | null;
  job?: Job;
>>>>>>> origin/Solomon/v2
  isNew?: boolean;
  employeeStatus?: EmployeeStatusEnum;
  probationResult?: ProbationResult;
  probationRemark?: string | null;
  employeeIDCardStatus?: EmployeeIdCardStatus;
  idReplaceReason?: EmployeeIdCardReplaceReason;
  employeeDocuments?: EmployeeDocument[] | null;
  employeeComments?: EmployeeCommentRead[] | null;
  educations?: EducationRead[] | null;
  languageSkills?: LanguageSkillRead[] | null;
  employeeEmergencyContacts?: EmployeeEmergencyContactRead[] | null;
  employeeFamilies?: EmployeeFamilyRead[] | null;
  employeeFileDocuments?: EmployeeFileDocumentRead[] | null;
  employeeIdCardStatusRemark?: string | null;
  actings?: ActingRead[] | null;
  delegations?: DelegationRead[] | null;
};
export type ActingDto = {
  id?: number;
  employeeId?: number;
  employee?: Employee;
  jobRoleId?: number;
  jobRole?: JobRole;
  businessUnitId?: number | null;
  businessUnit?: BusinessUnit;
  startDate?: string;
  endDate?: string | null;
  approvalStatus?: ApprovalStatus;
  actingType?: ActingType;
  previousJobRoleId?: number | null;
  previousJobRole?: JobRole;
  previousBusinessUnitId?: number | null;
  previousBusinessUnit?: BusinessUnit;
  isActive?: boolean;
};
export type ActingDtoRead = {
  id?: number;
  employeeId?: number;
  employee?: EmployeeRead;
  jobRoleId?: number;
  jobRole?: JobRole;
  businessUnitId?: number | null;
  businessUnit?: BusinessUnitRead;
  startDate?: string;
  endDate?: string | null;
  approvalStatus?: ApprovalStatus;
  actingType?: ActingType;
  previousJobRoleId?: number | null;
  previousJobRole?: JobRole;
  previousBusinessUnitId?: number | null;
  previousBusinessUnit?: BusinessUnit;
  isActive?: boolean;
};
export type PaginatedActinglist = {
  items?: ActingDto[] | null;
  totalCount?: number;
};
export type PaginatedActinglistRead = {
  items?: ActingDtoRead[] | null;
  totalCount?: number;
};
export type ReAssignmentActingCommand = {
  employeeId?: number;
  jobRoleId?: number;
  previousJobRoleId?: number;
  businessUnitId?: number | null;
  previousBusinessUnitId?: number | null;
  startDate?: string;
  endDate?: string | null;
  actingType?: ActingType;
};
export type RejectActingCommand = {
  id?: number;
};
export type SubmitActingCommand = {
  id?: number;
};
export type UpdateActingCommand = {
  id?: number;
  employeeId?: number;
  jobRoleId?: number;
  previousJobRoleId?: number;
  businessUnitId?: number | null;
  previousBusinessUnitId?: number | null;
  startDate?: string;
  endDate?: string | null;
  actingType?: ActingType;
};
export type AddressTypeEnum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
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
export type CreateRoleDto = {
  role?: HrRole;
  permissionNames?: string[] | null;
};
export type ClaimCategory = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type PermissionClaim = {
  id?: string;
  claimValue?: string | null;
  claimCategory?: ClaimCategory;
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
  photoId?: string | null;
  photoUrl?: string | null;
  signatureId?: string | null;
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
  photoId?: string | null;
  photoUrl?: string | null;
  signatureId?: string | null;
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
<<<<<<< HEAD
export type CreateAppointmentCommand = {
  caseId?: number;
  businessUnitId?: number;
  appointmentDate?: string;
  subject?: string | null;
  location?: string | null;
  scheduledById?: string | null;
  notes?: string | null;
};
export type AppointmentDto = {
  id?: number;
  caseId?: number;
  businessUnitId?: number;
  appointmentDate?: string;
  subject?: string | null;
  location?: string | null;
  status?: string | null;
  scheduledById?: string | null;
  notes?: string | null;
  createdAt?: string;
  modifiedAt?: string | null;
};
export type UpdateAppointmentCommand = {
  id?: number;
  appointmentDate?: string;
  subject?: string | null;
  location?: string | null;
  status?: string | null;
  notes?: string | null;
=======
export type AuditEmployeeFileDocumentDto = {
  entityName?: string | null;
  actionType?: string | null;
  performedBy?: string | null;
  performedByUserId?: string | null;
  affectedEmployeeName?: string | null;
  oldFileName?: string | null;
  newFileName?: string | null;
  affectedEmployeeId?: number | null;
  details?: string | null;
  remark?: string | null;
  performedAt?: string;
>>>>>>> origin/Solomon/v2
};
export type ApproveAwardCommand = {
  id?: number;
};
export type AwardCountsByStatus = {
  approved?: number;
  submitted?: number;
  rejected?: number;
  draft?: number;
};
export type CreateAwardCommand = {
  name?: string | null;
  description?: string | null;
};
export type AwardDto = {
  id?: number;
  name?: string | null;
  description?: string | null;
  approvalStatus?: ApprovalStatus;
};
export type AwardLists = {
  approved?: AwardDto[] | null;
  submitted?: AwardDto[] | null;
  rejected?: AwardDto[] | null;
  draft?: AwardDto[] | null;
};
export type PaginatedAwardList = {
  items?: AwardDto[] | null;
  totalCount?: number;
};
export type RejectAwardCommand = {
  id?: number;
};
export type SubmitAwardCommand = {
  id?: number;
};
export type UpdateAwardCommand = {
  id?: number;
  name?: string | null;
  description?: string | null;
};
export type AddBenefitCommand = {
  name?: string | null;
  unitOfMeasurementId?: number;
};
export type ApproveBenefitCommand = {
  id?: number;
  remark?: string | null;
};
export type BenefitDto = {
  id?: number;
  name?: string | null;
  unitOfMeasurementId?: number;
  unitName?: string | null;
  approvalStatus?: ApprovalStatus;
  isActive?: ActivationEnum;
  remark?: string | null;
};
export type BenefitCountsByStatus = {
  approved?: number;
  approvalRequests?: number;
  rejected?: number;
  drafts?: number;
};
export type BenefitSearchResult = {
  items?: BenefitDto[] | null;
  totalCount?: number;
};
export type RejectBenefitCommand = {
  id?: number;
  remark?: string | null;
};
export type SubmitBenefitCommand = {
  id?: number;
  remark?: string | null;
};
export type UpdateBenefitCommand = {
  id?: number;
  name?: string | null;
  unitOfMeasurementId?: number;
};
export type AddBenefitUnitOfMeasurementCommand = {
  name?: string | null;
  isUnitPriced?: boolean;
  description?: string | null;
};
export type ApproveBenefitUnitOfMeasurementCommand = {
  id?: number;
  remark?: string | null;
};
export type BenefitUnitOfMeasurementDto = {
  id?: number;
  name?: string | null;
  description?: string | null;
  isUnitPriced?: boolean;
  remark?: string | null;
  approvalStatus?: ApprovalStatus;
};
export type BenefitUnitOfMeasurementCountsByStatus = {
  approved?: number;
  approvalRequests?: number;
  rejected?: number;
  drafts?: number;
};
export type BenefitUnitOfMeasurementSearchResult = {
  items?: BenefitUnitOfMeasurementDto[] | null;
  totalCount?: number;
};
export type RejectBenefitUnitOfMeasurementCommand = {
  id?: number;
  remark?: string | null;
};
export type SubmitBenefitUnitOfMeasurementCommand = {
  id?: number;
  remark?: string | null;
};
export type UpdateBenefitUnitOfMeasurementCommand = {
  id?: number;
  name?: string | null;
  isUnitPriced?: boolean;
  description?: string | null;
};
export type AddBenefitUnitPriceCommand = {
  benefitId?: number;
  price?: number;
  effectiveDate?: string;
};
export type ApproveBenefitUnitPriceCommand = {
  id?: number;
  remark?: string | null;
};
export type BenefitValueDto = {
  id?: number;
  benefitId?: number;
  benefitName?: string | null;
  value?: number;
  unitPrice?: number | null;
  calculatedBenefitAmount?: number | null;
  approvalStatus?: ApprovalStatus;
  isUnitPriced?: boolean;
  unitOfMeasurementName?: string | null;
  description?: string | null;
  remark?: string | null;
};
export type BenefitUnitPriceCountsByStatus = {
  approved?: number;
  approvalRequests?: number;
  rejected?: number;
  drafts?: number;
};
export type BenefitUnitPriceDto = {
  id?: number;
  benefitId?: number;
  benefitName?: string | null;
  price?: number;
  unitOfMeasurementName?: string | null;
  approvalStatus?: ApprovalStatus;
  effectiveDate?: string;
  remark?: string | null;
  activationEnum?: ActivationEnum;
};
export type BenefitUnitPriceSearchResult = {
  items?: BenefitUnitPriceDto[] | null;
  totalCount?: number;
};
export type RejectBenefitUnitPriceCommand = {
  id?: number;
  remark?: string | null;
};
export type SubmitBenefitUnitPriceCommand = {
  id?: number;
  remark?: string | null;
};
export type UpdateBenefitUnitPriceCommand = {
  id?: number;
  benefitId?: number;
  price?: number;
  effectiveDate?: string;
};
export type AddBenefitValueCommand = {
  benefitId?: number;
  value?: number;
  description?: string | null;
};
export type ApproveBenefitValueCommand = {
  id?: number;
  remark?: string | null;
};
export type BenefitSetupDto = {
  benefitId?: number;
  benefitName?: string | null;
  unit?: string | null;
  values?: BenefitValueDto[] | null;
};
export type BenefitValueCountsByStatus = {
  approved?: number;
  approvalRequests?: number;
  rejected?: number;
  drafts?: number;
};
export type BenefitValueSearchResult = {
  items?: BenefitValueDto[] | null;
  totalCount?: number;
};
export type RejectBenefitValueCommand = {
  id?: number;
  remark?: string | null;
};
export type SubmitBenefitValueCommand = {
  id?: number;
  remark?: string | null;
};
export type UpdateBenefitValueCommand = {
  id?: number;
  benefitId?: number;
  value?: number;
  description?: string | null;
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
export type EmployeeCountsByStatus = {
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
export type CaseDetailsDto = {
  workflowComment?: string | null;
  approvalStatus?: ApprovalStatus;
  approvedBy?: string | null;
  approvedAt?: string | null;
  submittedBy?: string | null;
  submittedAt?: string | null;
  rejectedBy?: string | null;
  rejectedAt?: string | null;
  versionNumber?: string;
  periodStart?: string;
  periodEnd?: string;
  id?: number;
  caseNumber: string;
  caseType?: CaseType;
  status?: CaseStatus;
  plaintiffName: string;
  accusedName: string;
  subject?: string | null;
  filedAt?: string;
  closedAt?: string | null;
  filedById: string;
  filedBy?: HrUser;
  assignedJudgeId?: string | null;
  assignedJudge?: HrUser;
  businessUnitId?: number;
  businessUnit?: BusinessUnit;
  chilotId?: number | null;
  chilot?: Chilot;
  hasAddressInfo?: boolean;
  hasContactInfo?: boolean;
  hasEmployeeFamilyInfo?: boolean;
  hasEmergencyContactInfo?: boolean;
  hasLanguageSkillInfo?: boolean;
};
export type CaseDetailsDtoRead = {
  workflowComment?: string | null;
  approvalStatus?: ApprovalStatus;
  approvedBy?: string | null;
  approvedAt?: string | null;
  submittedBy?: string | null;
  submittedAt?: string | null;
  rejectedBy?: string | null;
  rejectedAt?: string | null;
  versionNumber?: string;
  periodStart?: string;
  periodEnd?: string;
  id?: number;
  caseNumber: string;
  caseType?: CaseType;
  status?: CaseStatus;
  plaintiffName: string;
  accusedName: string;
  subject?: string | null;
  filedAt?: string;
  closedAt?: string | null;
  filedById: string;
  filedBy?: HrUserRead;
  assignedJudgeId?: string | null;
  assignedJudge?: HrUserRead;
  businessUnitId?: number;
  businessUnit?: BusinessUnitRead;
  chilotId?: number | null;
  chilot?: ChilotRead;
  hasAddressInfo?: boolean;
  hasContactInfo?: boolean;
  hasEmployeeFamilyInfo?: boolean;
  hasEmergencyContactInfo?: boolean;
  hasLanguageSkillInfo?: boolean;
};
export type CaseDto = {
  workflowComment?: string | null;
  approvalStatus?: ApprovalStatus;
  approvedBy?: string | null;
  approvedAt?: string | null;
  submittedBy?: string | null;
  submittedAt?: string | null;
  rejectedBy?: string | null;
  rejectedAt?: string | null;
  versionNumber?: string;
  periodStart?: string;
  periodEnd?: string;
  id?: number;
  caseNumber: string;
  caseType?: CaseType;
  status?: CaseStatus;
  plaintiffName: string;
  accusedName: string;
  subject?: string | null;
  filedAt?: string;
  closedAt?: string | null;
  filedById: string;
  filedBy?: HrUser;
  assignedJudgeId?: string | null;
  assignedJudge?: HrUser;
  businessUnitId?: number;
  businessUnit?: BusinessUnit;
  chilotId?: number | null;
  chilot?: Chilot;
  hasAddressInfo?: boolean;
  hasContactInfo?: boolean;
  hasEmployeeFamilyInfo?: boolean;
  hasEmergencyContactInfo?: boolean;
  hasLanguageSkillInfo?: boolean;
};
export type CaseDtoRead = {
  workflowComment?: string | null;
  approvalStatus?: ApprovalStatus;
  approvedBy?: string | null;
  approvedAt?: string | null;
  submittedBy?: string | null;
  submittedAt?: string | null;
  rejectedBy?: string | null;
  rejectedAt?: string | null;
  versionNumber?: string;
  periodStart?: string;
  periodEnd?: string;
  id?: number;
  caseNumber: string;
  caseType?: CaseType;
  status?: CaseStatus;
  plaintiffName: string;
  accusedName: string;
  subject?: string | null;
  filedAt?: string;
  closedAt?: string | null;
  filedById: string;
  filedBy?: HrUserRead;
  assignedJudgeId?: string | null;
  assignedJudge?: HrUserRead;
  businessUnitId?: number;
  businessUnit?: BusinessUnitRead;
  chilotId?: number | null;
  chilot?: ChilotRead;
  hasAddressInfo?: boolean;
  hasContactInfo?: boolean;
  hasEmployeeFamilyInfo?: boolean;
  hasEmergencyContactInfo?: boolean;
  hasLanguageSkillInfo?: boolean;
};
export type CaseRecordVersions = {
  current?: string | null;
  approved?: string | null;
  submitted?: string | null;
  draft?: string | null;
  rejected?: string | null;
};
export type CreateCaseReturnType = {
  id?: number;
  versionNumber?: string;
};
export type CreateCaseCommand = {
  caseNumber?: string | null;
  caseType?: CaseType;
  status?: CaseStatus;
  plaintiffName?: string | null;
  accusedName?: string | null;
  subject?: string | null;
  filedAt?: string;
  closedAt?: string | null;
  filedById?: string | null;
  assignedJudgeId?: string | null;
  businessUnitId?: number;
  chilotId?: number | null;
};
export type CaseList = {
  approved?: CaseDto[] | null;
  submitted?: CaseDto[] | null;
  rejected?: CaseDto[] | null;
  draft?: CaseDto[] | null;
};
export type CaseListRead = {
  approved?: CaseDtoRead[] | null;
  submitted?: CaseDtoRead[] | null;
  rejected?: CaseDtoRead[] | null;
  draft?: CaseDtoRead[] | null;
};
export type CaseSearchResult = {
  items?: CaseDto[] | null;
  totalCount?: number;
};
export type CaseSearchResultRead = {
  items?: CaseDtoRead[] | null;
  totalCount?: number;
};
export type CaseCountsByStatus = {
  approved?: number;
  approvalRequests?: number;
  rejected?: number;
  drafts?: number;
};
export type UpdateCaseCommand = {
  id?: number;
  caseNumber?: string | null;
  caseType?: CaseType;
  status?: CaseStatus;
  plaintiffName?: string | null;
  accusedName?: string | null;
  subject?: string | null;
  closedAt?: string | null;
  filedById?: string | null;
  assignedJudgeId?: string | null;
  businessUnitId?: number;
  chilotId?: number | null;
};
export type CreateCaseTemplateCommand = {
  name?: string | null;
  content?: string | null;
  createdById?: string | null;
};
export type CaseTemplateDto = {
  id?: number;
  name?: string | null;
  content?: string | null;
  createdById?: string | null;
  createdByName?: string | null;
  createdAt?: string;
};
export type UpdateCaseTemplateCommand = {
  id?: number;
  name?: string | null;
  content?: string | null;
};
export type CreateCaseTimelineCommand = {
  caseId?: number;
  eventType?: string | null;
  details?: string | null;
  actorUserId?: string | null;
  eventAt?: string | null;
};
export type CaseTimelineDto = {
  id?: number;
  caseId?: number;
  caseNumber?: string | null;
  eventType?: string | null;
  details?: string | null;
  actorUserId?: string | null;
  actorUserName?: string | null;
  eventAt?: string;
  createdAt?: string;
  modifiedAt?: string | null;
};
export type UpdateCaseTimelineCommand = {
  id?: number;
  caseId?: number;
  eventType?: string | null;
  details?: string | null;
  actorUserId?: string | null;
  eventAt?: string;
};
export type ChilotDto = {
  id?: number;
  name?: string | null;
  chilotType?: ChilotType;
  roomNumber?: string | null;
  businessUnitId?: number;
  businessUnit?: string | null;
};
export type CreateChilotCommand = {
  name?: string | null;
  chilotType?: ChilotType;
  roomNumber?: string | null;
  businessUnitId?: number;
};
export type UpdateChilotCommand = {
  id?: number;
  name?: string | null;
  chilotType?: ChilotType;
  roomNumber?: string | null;
  businessUnitId?: number;
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
  letterDocuments?: LetterDocument[] | null;
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
  businessUnits?: BusinessUnitRead;
  letterDocuments?: LetterDocumentRead[] | null;
};
export type ApproveDelegationCommand = {
  id?: number;
};
export type DelegationCountsByStatus = {
  approved?: number;
  submitted?: number;
  rejected?: number;
  draft?: number;
};
export type CreateDelegationCommand = {
  employeeId?: number;
  jobRoleId?: number;
  businessUnitId?: number | null;
  startDate?: string;
  endDate?: string | null;
};
export type DelegationDto = {
  id?: number;
  employeeId?: number;
  employee?: Employee;
  jobRoleId?: number;
  jobRole?: JobRole;
  businessUnitId?: number | null;
  businessUnit?: BusinessUnit;
  startDate?: string;
  endDate?: string | null;
  approvalStatus?: ApprovalStatus;
  isActive?: boolean;
};
export type DelegationDtoRead = {
  id?: number;
  employeeId?: number;
  employee?: EmployeeRead;
  jobRoleId?: number;
  jobRole?: JobRole;
  businessUnitId?: number | null;
  businessUnit?: BusinessUnitRead;
  startDate?: string;
  endDate?: string | null;
  approvalStatus?: ApprovalStatus;
  isActive?: boolean;
};
export type DelegationLists = {
  approved?: DelegationDto[] | null;
  submitted?: DelegationDto[] | null;
  rejected?: DelegationDto[] | null;
  draft?: DelegationDto[] | null;
};
export type DelegationListsRead = {
  approved?: DelegationDtoRead[] | null;
  submitted?: DelegationDtoRead[] | null;
  rejected?: DelegationDtoRead[] | null;
  draft?: DelegationDtoRead[] | null;
};
export type PaginatedDelegationlist = {
  items?: DelegationDto[] | null;
  totalCount?: number;
};
export type PaginatedDelegationlistRead = {
  items?: DelegationDtoRead[] | null;
  totalCount?: number;
};
export type RejectDelegationCommand = {
  id?: number;
};
export type RemoveDeligationCommand = {
  id?: number;
};
export type SubmitDelegationCommand = {
  id?: number;
};
export type UpdateDelegationCommands = {
  id?: number;
  employeeId?: number;
  jobRoleId?: number;
  businessUnitId?: number | null;
  startDate?: string;
  endDate?: string | null;
};
export type CreateDocketEntryCommand = {
  docketNumber?: string | null;
  caseId?: number;
  storagePath?: string | null;
  archivedBy?: string | null;
};
export type DocketEntryDto = {
  id?: number;
  docketNumber?: string | null;
  caseId?: number;
  storagePath?: string | null;
  archivedAt?: string;
  archivedBy?: string | null;
  createdAt?: string;
  modifiedAt?: string | null;
};
export type UpdateDocketEntryCommand = {
  id?: number;
  docketNumber?: string | null;
  caseId?: number;
  storagePath?: string | null;
  archivedBy?: string | null;
};
export type DocumentEndpointRootPath = {
  path?: string | null;
};
export type CreateEducationCommand = {
  startDate?: string;
  endDate?: string;
  schoolCity?: string | null;
  institutionNameId?: number;
  educationLevelId?: number;
  awardId?: number;
  fieldOfStudyId?: number;
  employeeId?: number;
  cgpa?: number | null;
};
export type EducationDto = {
  id?: number;
  startDate?: string;
  endDate?: string;
  schoolCity?: string | null;
  institutionNameId?: number;
  institutionName?: string | null;
  educationLevelId?: number;
  educationLevelName?: string | null;
  awardId?: number;
  awardName?: string | null;
  fieldOfStudyId?: number;
  fieldOfStudyName?: string | null;
  employeeId?: number;
  cgpa?: number | null;
};
export type UpdateEducationCommand = {
  id?: number;
  startDate?: string;
  endDate?: string;
  schoolCity?: string | null;
  institutionNameId?: number;
  educationLevelId?: number;
  awardId?: number;
  fieldOfStudyId?: number;
  employeeId?: number;
  cgpa?: number | null;
};
export type ApproveEducationLevelCommand = {
  id?: number;
};
export type EducationLevelCountsByStatus = {
  approved?: number;
  submitted?: number;
  rejected?: number;
  draft?: number;
};
export type CreateEducationLevelCommand = {
  name?: string | null;
  description?: string | null;
};
export type EducationLevelDto = {
  id?: number;
  name?: string | null;
  description?: string | null;
  approvalStatus?: ApprovalStatus;
};
export type EducationLevelLists = {
  approved?: EducationLevelDto[] | null;
  submitted?: EducationLevelDto[] | null;
  rejected?: EducationLevelDto[] | null;
  draft?: EducationLevelDto[] | null;
};
export type PaginatedEducationLevelList = {
  items?: EducationLevelDto[] | null;
  totalCount?: number;
};
export type RejectEducationLevelCommand = {
  id?: number;
};
export type SubmitEducationLevelCommand = {
  id?: number;
};
export type UpdateEducationLevelCommand = {
  id?: number;
  name?: string | null;
  description?: string | null;
};
export type ActivateEmployeeFamilyCommand = {
  id?: number;
  comment?: string | null;
};
export type ActivateEmployeeGurantersCommand = {
  id?: number;
  employeeId?: number;
  comment?: string | null;
};
export type ExperienceType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type AddEmployeeExperienceCommand = {
  id?: number;
  firmName?: string | null;
  startDate?: string;
  endDate?: string | null;
  jobTitle?: string | null;
  city?: string | null;
  lastSalary?: number;
  reasonForResignation?: string | null;
  experienceType?: ExperienceType;
  employeeId?: number;
};
export type AddEmployeeFamilyCommand = {
  id?: number;
  employeeId?: number;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  dateOfBirth?: string | null;
  age?: number | null;
  fatherFullName?: string | null;
  motherFullName?: string | null;
  gender?: Gender;
  workingFirm?: string | null;
  familyType?: EmployeeFamilyType;
  spouseIsWorking?: SpouseIsWorking;
  isParentLiving?: IsParentLiving;
  familyParentType?: ParentType;
  parentLivelyHood?: string | null;
  isActive?: ActivationEnum;
  comment?: string | null;
};
export type Guarantee = 1 | 2;
export type AddEmployeeGurantersCommand = {
  id?: number;
  identificationCardNo?: string | null;
  name?: string | null;
  fathersName?: string | null;
  grandfathersName?: string | null;
  workingFirm?: string | null;
  employeeId?: number;
  referenceno?: string | null;
  salary?: number | null;
  active?: ActivationEnum;
  fromDate?: string | null;
  toDate?: string | null;
  guaranteeType?: Guarantee;
  comment?: string | null;
};
export type EmployeeFamilyDto = {
  id?: number;
  employeeName?: string | null;
  fullName?: string | null;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  fatherFullName?: string | null;
  motherFullName?: string | null;
  dateOfBirth?: string | null;
  age?: number | null;
  gender?: string | null;
  approvalStatus?: ApprovalStatus;
  workingFirm?: string | null;
  familyType?: EmployeeFamilyType;
  spouseIsWorking?: SpouseIsWorking;
  isParentLiving?: IsParentLiving;
  familyParentType?: ParentType;
  parentLivelyHood?: string | null;
  isActive?: ActivationEnum;
  comment?: string | null;
  employeeId?: number;
};
export type DeActivateEmployeeFamilyCommand = {
  id?: number;
  comment?: string | null;
};
export type DeActivateEmployeeGurantersCommand = {
  id?: number;
  employeeId?: number;
  comment?: string | null;
};
export type EmployeeExperienceDto = {
  id?: number;
  firmName?: string | null;
  startDate?: string;
  endDate?: string | null;
  jobTitle?: string | null;
  city?: string | null;
  lastSalary?: number;
  reasonForResignation?: string | null;
  employeeId?: number;
  employeeName?: string | null;
  experienceType?: ExperienceType;
};
export type EmployeeGurantersDto = {
  id?: number;
  identificationCardNo?: string | null;
  name?: string | null;
  fathersName?: string | null;
  grandfathersName?: string | null;
  workingFirm?: string | null;
  employeeId?: number;
  referenceno?: string | null;
  salary?: number | null;
  guaranteeType?: Guarantee;
  active?: ActivationEnum;
  fromDate?: string | null;
  toDate?: string | null;
  comment?: string | null;
};
export type UpdateEmployeeExperienceCommand = {
  id?: number;
  firmName?: string | null;
  startDate?: string;
  endDate?: string | null;
  jobTitle?: string | null;
  city?: string | null;
  lastSalary?: number;
  reasonForResignation?: string | null;
  experienceType?: ExperienceType;
  employeeId?: number;
};
export type UpdateEmployeeFamilyCommand = {
  id?: number;
  employeeId?: number;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  dateOfBirth?: string | null;
  age?: number | null;
  fatherFullName?: string | null;
  motherFullName?: string | null;
  gender?: Gender;
  workingFirm?: string | null;
  familyType?: EmployeeFamilyType;
  spouseIsWorking?: SpouseIsWorking;
  isParentLiving?: IsParentLiving;
  familyParentType?: ParentType;
  parentLivelyHood?: string | null;
  isActive?: ActivationEnum;
  comment?: string | null;
};
export type UpdateEmployeeGurantersCommand = {
  id?: number;
  identificationCardNo?: string | null;
  name?: string | null;
  fathersName?: string | null;
  grandfathersName?: string | null;
  workingFirm?: string | null;
  employeeId?: number;
  referenceno?: string | null;
  salary?: number | null;
  guaranteeType?: Guarantee;
  active?: ActivationEnum;
  fromDate?: string | null;
  toDate?: string | null;
  comment?: string | null;
};
export type EmployeeFileDocumentDto = {
  id?: string;
  employeeId?: number;
  suspensionId?: number | null;
  resignationId?: number | null;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  documentType?: DocumentType;
  fileName?: string | null;
  contentType?: string | null;
  fileContent?: string | null;
  createdAt?: string | null;
  filePath?: string | null;
  modifiedAt?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  approvalStatus?: ApprovalStatus;
  remark?: string | null;
};
export type EmployeeChangeLogEntityType =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11;
export type ChangeType = 1 | 2 | 3 | 4 | 5 | 6;
export type EmployeeChangeLogDto = {
  id?: number;
  employeeId?: number;
  entityType?: EmployeeChangeLogEntityType;
  entityId?: number;
  changeType?: ChangeType;
};
export type Contact = {
  id?: number;
  type?: ContactTypeEnum;
  value?: string | null;
  contactCategory?: ContactCategoryEnum;
  requestId?: number;
};
export type EmployeeDetailsDto = {
  workflowComment?: string | null;
  approvedBy?: string | null;
  approvedAt?: string | null;
  submittedBy?: string | null;
  submittedAt?: string | null;
  rejectedBy?: string | null;
  rejectedAt?: string | null;
  versionNumber?: string;
  periodStart?: string;
  periodEnd?: string;
  id?: number;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  amharicFirstName?: string | null;
  amharicMiddleName?: string | null;
  amharicLastName?: string | null;
  amharicDisplayName?: string | null;
  businessUnitID?: number;
  businessUnit?: string | null;
  jobTitle?: string | null;
  jobId?: number;
  photoId?: string | null;
  photoUrl?: string | null;
  birthDate?: string;
  employementDate?: string;
  gender?: Gender;
  martialStatus?: MartialStatus;
  isCurrent?: boolean;
  approvalStatus?: ApprovalStatus;
  salaryOnGradeStepId?: number | null;
  employeeDocuments?: EmployeeDocument[] | null;
  businessUnits?: BusinessUnit;
  job?: Job;
  isNew?: boolean;
  address?: Address;
  contact?: Contact;
  employeeStatus?: EmployeeStatusEnum;
  probationResult?: ProbationResult;
  probationRemark?: string | null;
  employeeIDCardStatus?: EmployeeIdCardStatus;
  idReplaceReason?: EmployeeIdCardReplaceReason;
  employeeIdCardStatusRemark?: string | null;
  hasAddressInfo?: boolean;
  hasContactInfo?: boolean;
  hasEmployeeFamilyInfo?: boolean;
  hasEmergencyContactInfo?: boolean;
  hasLanguageSkillInfo?: boolean;
  tinNumber?: string | null;
  pensionID?: string | null;
  employmentType?: EmploymentType;
};
export type EmployeeDetailsDtoRead = {
  workflowComment?: string | null;
  approvedBy?: string | null;
  approvedAt?: string | null;
  submittedBy?: string | null;
  submittedAt?: string | null;
  rejectedBy?: string | null;
  rejectedAt?: string | null;
  versionNumber?: string;
  periodStart?: string;
  periodEnd?: string;
  id?: number;
  employeeId?: number;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  amharicFirstName?: string | null;
  amharicMiddleName?: string | null;
  amharicLastName?: string | null;
  amharicDisplayName?: string | null;
  businessUnitID?: number;
  businessUnit?: string | null;
  jobTitle?: string | null;
  jobId?: number;
  photoId?: string | null;
  photoUrl?: string | null;
  birthDate?: string;
  employementDate?: string;
  gender?: Gender;
  martialStatus?: MartialStatus;
  isCurrent?: boolean;
  approvalStatus?: ApprovalStatus;
  employeeDocuments?: EmployeeDocument[] | null;
  businessUnits?: BusinessUnitRead;
  job?: JobRead;
  isNew?: boolean;
  address?: Address;
  contact?: Contact;
  employeeStatus?: EmployeeStatusEnum;
  probationResult?: ProbationResult;
  probationRemark?: string | null;
  employeeIDCardStatus?: EmployeeIdCardStatus;
  idReplaceReason?: EmployeeIdCardReplaceReason;
  employeeIdCardStatusRemark?: string | null;
  hasAddressInfo?: boolean;
  hasContactInfo?: boolean;
  hasEmployeeFamilyInfo?: boolean;
  hasEmergencyContactInfo?: boolean;
  hasLanguageSkillInfo?: boolean;
};
export type DocumentMetadataDto = {
  id?: string | null;
};
export type EmployeeDto = {
  workflowComment?: string | null;
  approvedBy?: string | null;
  approvedAt?: string | null;
  submittedBy?: string | null;
  submittedAt?: string | null;
  rejectedBy?: string | null;
  rejectedAt?: string | null;
  versionNumber?: string;
  periodStart?: string;
  periodEnd?: string;
  id?: number;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  amharicFirstName?: string | null;
  amharicMiddleName?: string | null;
  amharicLastName?: string | null;
  amharicDisplayName?: string | null;
  businessUnitID?: number;
  businessUnit?: string | null;
  jobTitle?: string | null;
  jobId?: number;
  photoId?: string | null;
  photoUrl?: string | null;
  birthDate?: string;
  employementDate?: string;
  gender?: Gender;
  martialStatus?: MartialStatus;
  isCurrent?: boolean;
  approvalStatus?: ApprovalStatus;
  salaryOnGradeStepId?: number | null;
  employeeDocuments?: EmployeeDocument[] | null;
  businessUnits?: BusinessUnit;
  job?: Job;
  isNew?: boolean;
  address?: Address;
  contact?: Contact;
  employeeStatus?: EmployeeStatusEnum;
  probationResult?: ProbationResult;
  probationRemark?: string | null;
  employeeIDCardStatus?: EmployeeIdCardStatus;
  idReplaceReason?: EmployeeIdCardReplaceReason;
  employeeIdCardStatusRemark?: string | null;
  hasAddressInfo?: boolean;
  hasContactInfo?: boolean;
  hasEmployeeFamilyInfo?: boolean;
  hasEmergencyContactInfo?: boolean;
  hasLanguageSkillInfo?: boolean;
  tinNumber?: string | null;
  pensionID?: string | null;
  employmentType?: EmploymentType;
};
export type EmployeeDtoRead = {
  workflowComment?: string | null;
  approvedBy?: string | null;
  approvedAt?: string | null;
  submittedBy?: string | null;
  submittedAt?: string | null;
  rejectedBy?: string | null;
  rejectedAt?: string | null;
  versionNumber?: string;
  periodStart?: string;
  periodEnd?: string;
  id?: number;
  employeeId?: number;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  amharicFirstName?: string | null;
  amharicMiddleName?: string | null;
  amharicLastName?: string | null;
  amharicDisplayName?: string | null;
  businessUnitID?: number;
  businessUnit?: string | null;
  jobTitle?: string | null;
  jobId?: number;
  photoId?: string | null;
  photoUrl?: string | null;
  birthDate?: string;
  employementDate?: string;
  gender?: Gender;
  martialStatus?: MartialStatus;
  isCurrent?: boolean;
  approvalStatus?: ApprovalStatus;
  employeeDocuments?: EmployeeDocument[] | null;
  businessUnits?: BusinessUnitRead;
  job?: JobRead;
  isNew?: boolean;
  address?: Address;
  contact?: Contact;
  employeeStatus?: EmployeeStatusEnum;
  probationResult?: ProbationResult;
  probationRemark?: string | null;
  employeeIDCardStatus?: EmployeeIdCardStatus;
  idReplaceReason?: EmployeeIdCardReplaceReason;
  employeeIdCardStatusRemark?: string | null;
  hasAddressInfo?: boolean;
  hasContactInfo?: boolean;
  hasEmployeeFamilyInfo?: boolean;
  hasEmergencyContactInfo?: boolean;
  hasLanguageSkillInfo?: boolean;
};
export type Note = {
  text?: string | null;
};
export type EmployeeRecordVersions = {
  current?: string | null;
  approved?: string | null;
  submitted?: string | null;
  draft?: string | null;
  rejected?: string | null;
};
export type CreateEmployeeProfileReturnType = {
  id?: number;
  versionNumber?: string;
};
export type CreateEmployeeProfileCommand = {
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  amharicFirstName?: string | null;
  amharicMiddleName?: string | null;
  amharicLastName?: string | null;
  businessUnitID?: number;
  jobId?: number;
  birthDate?: string;
  employementDate?: string;
  gender?: Gender;
  martialStatus?: MartialStatus;
  salaryOnGradeStepId?: number | null;
  tinNumber?: string | null;
  pensionID?: string | null;
  employmentType?: EmploymentType;
  previousEmployeeId?: number | null;
};
export type EmployeeList = {
  approved?: EmployeeDto[] | null;
  submitted?: EmployeeDto[] | null;
  rejected?: EmployeeDto[] | null;
  draft?: EmployeeDto[] | null;
};
export type EmployeeListRead = {
  approved?: EmployeeDtoRead[] | null;
  submitted?: EmployeeDtoRead[] | null;
  rejected?: EmployeeDtoRead[] | null;
  draft?: EmployeeDtoRead[] | null;
};
export type AllEmployeeApproveCommand = {
  employeeId?: number;
};
export type EmployeeSearchResult = {
  items?: EmployeeDto[] | null;
  totalCount?: number;
};
export type EmployeeSearchResultRead = {
  items?: EmployeeDtoRead[] | null;
  totalCount?: number;
};
export type ChangeWorkflowStatusEntityDto = {
  id?: number;
  note?: string | null;
};
export type CreateEmployeeEmergencyContactCommand = {
  name?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  isWorking?: boolean;
  workingFirmName?: string | null;
  employeeId?: number;
};
export type EmployeeIdCardApprovalApprovalCommand = {
  employeeId?: number;
  status?: EmployeeIdCardStatus;
  employeeIdCardStatusRemark?: string | null;
};
export type EmployeeIdCardApprovalRejectedCommand = {
  employeeId?: number;
  status?: EmployeeIdCardStatus;
  employeeIdCardStatusRemark?: string | null;
};
export type EmployeeIdCardGivenCommand = {
  employeeId?: number;
  status?: EmployeeIdCardStatus;
  employeeIdCardStatusRemark?: string | null;
};
export type EmployeeIdCardReplaceCommand = {
  employeeId?: number;
  status?: EmployeeIdCardStatus;
  reason?: EmployeeIdCardReplaceReason;
  employeeIdCardStatusRemark?: string | null;
};
export type EmployeeIdCardSubmitCommand = {
  employeeId?: number;
  status?: EmployeeIdCardStatus;
  employeeIdCardStatusRemark?: string | null;
};
export type EmployeeIdCardUpdateCommand = {
  employeeId?: number;
  status?: EmployeeIdCardStatus;
  employeeIdCardStatusRemark?: string | null;
};
export type EmployeeProbationApproveCommand = {
  id?: number;
  employeeId?: number;
  probationResult?: ProbationResult;
  probationRemark?: string | null;
};
export type EmployeeProbationTerminationCommand = {
  employeeId?: number;
  probationResult?: ProbationResult;
  probationRemark?: string | null;
};
export type EmployeeIdSearchResult = {
  items?: EmployeeDto[] | null;
  totalCount?: number;
};
export type EmployeeIdSearchResultRead = {
  items?: EmployeeDtoRead[] | null;
  totalCount?: number;
};
export type EmployeeEmergencyContactDto = {
  id?: number;
  name?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  isWorking?: boolean;
  workingFirmName?: string | null;
  employeeId?: number;
};
export type EmployeeEmergencyContactDtoRead = {
  id?: number;
  name?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  isWorking?: boolean;
  workingFirmName?: string | null;
  employeeId?: number;
};
export type GetEmployeeIdCountsByStatus = {
  approvalRequests?: number;
  draft?: number;
  rejected?: number;
  idGiven?: number;
};
export type ProbationSearchResult = {
  items?: EmployeeDto[] | null;
  totalCount?: number;
};
export type ProbationSearchResultRead = {
  items?: EmployeeDtoRead[] | null;
  totalCount?: number;
};
export type ProbationApprovalCommand = {
  id?: number;
  employeeId?: number;
  probationResult?: ProbationResult;
  employeeStatus?: EmployeeStatusEnum;
  probationRemark?: string | null;
};
export type GetProbationCountsByStatus = {
  approvalRequests?: number;
  probationState?: number;
  rejected?: number;
};
export type ProbationSubmitToApproverCommand = {
  employeeId?: number;
  probationResult?: ProbationResult;
  probationRemark?: string | null;
};
export type ProbationTerminateCommand = {
  employeeId?: number;
  probationResult?: ProbationResult;
  probationRemark?: string | null;
};
export type RejectedProbationActivateCommand = {
  employeeId?: number;
  probationResult?: ProbationResult;
  employeeStatus?: EmployeeStatusEnum;
  probationRemark?: string | null;
};
export type ProbationRejectApprovalCommand = {
  employeeId?: number;
  probationResult?: ProbationResult;
  employeeStatus?: EmployeeStatusEnum;
  probationRemark?: string | null;
};
export type UpdateEmployeeCommand = {
  id?: number;
  employeeId?: number;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  amharicFirstName?: string | null;
  amharicMiddleName?: string | null;
  amharicLastName?: string | null;
  amharicDisplayName?: string | null;
  businessUnitID?: number;
  jobId?: number;
  birthDate?: string;
  employementDate?: string;
  gender?: Gender;
  martialStatus?: MartialStatus;
  salaryOnGradeStepId?: number | null;
  tinNumber?: string | null;
  pensionID?: string | null;
  employmentType?: EmploymentType;
};
export type UpdateEmployeeEmergencyContactCommand = {
  id?: number;
  name?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  isWorking?: boolean;
  workingFirmName?: string | null;
  employeeId?: number;
};
export type DemotionType = 1 | 2 | 3 | 4 | 5 | 6;
export type EmployeeTransactionStatus = 1 | 2 | 3 | 4;
export type AddEmployeeDemotionCommand = {
  employeeId?: number;
  demotionDate?: string;
  demotionEndDate?: string | null;
  jobRoleBeforeId?: number;
  jobRoleAfterId?: number;
  demotionType?: DemotionType;
  businessUnitBeforeId?: number;
  businessUnitAfterId?: number;
  beforeGradeSalaryStepId?: number;
  afterGradeSalaryStepId?: number;
  remark?: string | null;
  isBusinessUnitChange?: boolean;
  transactionStatus?: EmployeeTransactionStatus;
};
export type PromotionType = 1 | 2;
export type AddEmployeePromotionCommand = {
  employeeId?: number;
  promotionDate?: string;
  promotionEndDate?: string | null;
  jobRoleBeforeId?: number;
  jobRoleAfterId?: number;
  promotionType?: PromotionType;
  businessUnitBeforeId?: number;
  businessUnitAfterId?: number;
  beforeGradeSalaryStepId?: number;
  afterGradeSalaryStepId?: number;
  remark?: string | null;
  isBusinessUnitChange?: boolean;
  transactionStatus?: EmployeeTransactionStatus;
};
export type ReClassificationType = 1 | 2;
export type AddEmployeeReClassificationCommand = {
  employeeId?: number;
  reClassificationDate?: string;
  reClassificationEndDate?: string | null;
  jobRoleBeforeId?: number;
  jobRoleAfterId?: number;
  reClassificationType?: ReClassificationType;
  remark?: string | null;
  transactionStatus?: EmployeeTransactionStatus;
};
export type AddSalaryIncrementCommand = {
  id?: number;
  employeeId?: number;
  jobRoleId?: number;
  salaryIncrementDate?: string;
  salaryIncrementEndDate?: string | null;
  beforeGradeSalaryStepId?: number;
  afterGradeSalaryStepId?: number;
  remark?: string | null;
  transactionStatus?: EmployeeTransactionStatus;
};
export type EmployeeDemotionDto = {
  id?: number;
  employeeId?: number;
  demotionDate?: string;
  demotionEndDate?: string | null;
  jobRoleBefore?: string | null;
  jobRoleAfter?: string | null;
  salaryAfter?: number | null;
  salaryBefore?: number | null;
  demotionType?: DemotionType;
  businessUnitBefore?: string | null;
  businessUnitAfter?: string | null;
  beforeGradeSalaryStepId?: number;
  afterGradeSalaryStepId?: number;
  remark?: string | null;
  isBusinessUnitChange?: boolean;
  transactionStatus?: EmployeeTransactionStatus;
};
export type EmployeeDemotionSearchResult = {
  items?: EmployeeDemotionDto[] | null;
  totalCount?: number;
};
export type EmployeePromotionDto = {
  id?: number;
  employeeId?: number;
  promotionDate?: string;
  promotionEndDate?: string | null;
  jobRoleBefore?: string | null;
  jobRoleAfter?: string | null;
  promotionType?: PromotionType;
  businessUnitBefore?: string | null;
  businessUnitAfter?: string | null;
  beforeGradeSalaryStepId?: number;
  afterGradeSalaryStepId?: number;
  remark?: string | null;
  isBusinessUnitChange?: boolean;
  transactionStatus?: EmployeeTransactionStatus;
};
export type EmployeePromotionSearchResult = {
  items?: EmployeePromotionDto[] | null;
  totalCount?: number;
};
export type EmployeeReClassificationDto = {
  id?: number;
  employeeId?: number;
  reClassificationDate?: string;
  reClassificationEndDate?: string | null;
  jobRoleBefore?: string | null;
  jobRoleAfter?: string | null;
  reClassificationType?: ReClassificationType;
  remark?: string | null;
  transactionStatus?: EmployeeTransactionStatus;
};
export type EmployeeReClassificationSearchResult = {
  items?: EmployeeReClassificationDto[] | null;
  totalCount?: number;
};
export type ApproveEmployeeDemotion = {
  id?: number;
  employeeId?: number;
  remark?: string | null;
};
export type ApproveEmployeePromotion = {
  id?: number;
  employeeId?: number;
  remark?: string | null;
};
export type ApproveEmployeeReClassification = {
  id?: number;
  employeeId?: number;
  remark?: string | null;
};
export type ApproveSalaryIncrementCommand = {
  id?: number;
  employeeId?: number;
  remark?: string | null;
};
export type PromotionCountsByStatus = {
  approved?: number;
  approvalRequests?: number;
  rejected?: number;
  drafts?: number;
};
export type EmployeeSalaryIncrementDto = {
  id?: number;
  employeeId?: number;
  jobRole?: string | null;
  grade?: JobGradeRomanId;
  salaryIncrementDate?: string;
  salaryIncrementEndDate?: string | null;
  beforeGradeSalaryStepId?: number;
  afterGradeSalaryStepId?: number;
  remark?: string | null;
  transactionStatus?: EmployeeTransactionStatus;
};
export type EmployeeSalaryIncrementSearchResult = {
  items?: EmployeeSalaryIncrementDto[] | null;
  totalCount?: number;
};
export type EmployeeDemotion = {
  id?: number;
  employeeId?: number;
  employee?: Employee;
  demotionDate?: string | null;
  demotionEndDate?: string | null;
  jobRoleBeforeId?: number;
  jobRoleBefore?: JobRole;
  jobRoleAfterId?: number;
  jobRoleAfter?: JobRole;
  demotionType?: DemotionType;
  businessUnitBeforeId?: number;
  businessUnitBefore?: BusinessUnit;
  businessUnitAfterId?: number;
  businessUnitAfter?: BusinessUnit;
  beforeGradeSalaryStepId?: number;
  afterGradeSalaryStepId?: number;
  remark?: string | null;
  isBusinessUnitChange?: boolean;
  transactionStatus?: EmployeeTransactionStatus;
};
export type EmployeeDemotionRead = {
  id?: number;
  employeeId?: number;
  employee?: EmployeeRead;
  demotionDate?: string | null;
  demotionEndDate?: string | null;
  jobRoleBeforeId?: number;
  jobRoleBefore?: JobRole;
  jobRoleAfterId?: number;
  jobRoleAfter?: JobRole;
  demotionType?: DemotionType;
  businessUnitBeforeId?: number;
  businessUnitBefore?: BusinessUnit;
  businessUnitAfterId?: number;
  businessUnitAfter?: BusinessUnit;
  beforeGradeSalaryStepId?: number;
  afterGradeSalaryStepId?: number;
  remark?: string | null;
  isBusinessUnitChange?: boolean;
  transactionStatus?: EmployeeTransactionStatus;
};
export type EmployeePromotion = {
  id?: number;
  employeeId?: number;
  employee?: Employee;
  promotionDate?: string | null;
  promotionEndDate?: string | null;
  jobRoleBeforeId?: number;
  jobRoleBefore?: JobRole;
  jobRoleAfterId?: number;
  jobRoleAfter?: JobRole;
  promotionType?: PromotionType;
  businessUnitBeforeId?: number;
  businessUnitBefore?: BusinessUnit;
  businessUnitAfterId?: number;
  businessUnitAfter?: BusinessUnit;
  salaryAfter?: number | null;
  salaryBefore?: number | null;
  remark?: string | null;
  beforeGradeSalaryStepId?: number;
  afterGradeSalaryStepId?: number;
  isBusinessUnitChange?: boolean;
  transactionStatus?: EmployeeTransactionStatus;
};
export type EmployeePromotionRead = {
  id?: number;
  employeeId?: number;
  employee?: EmployeeRead;
  promotionDate?: string | null;
  promotionEndDate?: string | null;
  jobRoleBeforeId?: number;
  jobRoleBefore?: JobRole;
  jobRoleAfterId?: number;
  jobRoleAfter?: JobRole;
  promotionType?: PromotionType;
  businessUnitBeforeId?: number;
  businessUnitBefore?: BusinessUnit;
  businessUnitAfterId?: number;
  businessUnitAfter?: BusinessUnit;
  salaryAfter?: number | null;
  salaryBefore?: number | null;
  remark?: string | null;
  beforeGradeSalaryStepId?: number;
  afterGradeSalaryStepId?: number;
  isBusinessUnitChange?: boolean;
  transactionStatus?: EmployeeTransactionStatus;
};
export type EmployeeReClassification = {
  id?: number;
  employeeId?: number;
  employee?: Employee;
  reClassificationDate?: string | null;
  reClassificationEndDate?: string | null;
  jobRoleBeforeId?: number;
  jobRoleBefore?: JobRole;
  jobRoleAfterId?: number;
  jobRoleAfter?: JobRole;
  reClassificationType?: ReClassificationType;
  remark?: string | null;
  transactionStatus?: EmployeeTransactionStatus;
};
export type EmployeeReClassificationRead = {
  id?: number;
  employeeId?: number;
  employee?: EmployeeRead;
  reClassificationDate?: string | null;
  reClassificationEndDate?: string | null;
  jobRoleBeforeId?: number;
  jobRoleBefore?: JobRole;
  jobRoleAfterId?: number;
  jobRoleAfter?: JobRole;
  reClassificationType?: ReClassificationType;
  remark?: string | null;
  transactionStatus?: EmployeeTransactionStatus;
};
export type EmployeeSalaryIncrement = {
  id?: number;
  employeeId?: number;
  jobRoleId?: number;
  jobRole?: JobRole;
  salaryIncrementDate?: string;
  salaryIncrementEndDate?: string | null;
  beforeGradeSalaryStepId?: number;
  afterGradeSalaryStepId?: number;
  remark?: string | null;
  transactionStatus?: EmployeeTransactionStatus;
};
export type RejectEmployeeDemotion = {
  id?: number;
  employeeId?: number;
  remark?: string | null;
};
export type RejectEmployeePromotion = {
  id?: number;
  employeeId?: number;
  remark?: string | null;
};
export type RejectEmployeeReClassification = {
  id?: number;
  employeeId?: number;
  remark?: string | null;
};
export type RejectSalaryIncrementCommand = {
  id?: number;
  employeeId?: number;
  remark?: string | null;
};
export type SubmitEmployeeDemotion = {
  id?: number;
  employeeId?: number;
  remark?: string | null;
};
export type SubmitEmployeePromotion = {
  id?: number;
  employeeId?: number;
  remark?: string | null;
};
export type SubmitSalaryIncrementCommand = {
  id?: number;
  employeeId?: number;
  remark?: string | null;
};
export type SubmitEmployeeReClassification = {
  id?: number;
  employeeId?: number;
  remark?: string | null;
};
export type DemotionCountsByStatus = {
  approved?: number;
  approvalRequests?: number;
  rejected?: number;
  drafts?: number;
};
export type UpdateEmployeeDemotionCommand = {
  id?: number;
  employeeId?: number;
  demotionDate?: string | null;
  demotionEndDate?: string | null;
  jobRoleBeforeId?: number | null;
  jobRoleAfterId?: number | null;
  demotionType?: DemotionType;
  businessUnitBeforeId?: number | null;
  businessUnitAfterId?: number | null;
  beforeGradeSalaryStepId?: number;
  afterGradeSalaryStepId?: number;
  remark?: string | null;
  isBusinessUnitChange?: boolean;
  transactionStatus?: EmployeeTransactionStatus;
};
export type UpdateEmployeePromotionCommand = {
  id?: number;
  employeeId?: number;
  promotionDate?: string | null;
  promotionEndDate?: string | null;
  jobRoleBeforeId?: number | null;
  jobRoleAfterId?: number | null;
  promotionType?: PromotionType;
  businessUnitBeforeId?: number | null;
  businessUnitAfterId?: number | null;
  beforeGradeSalaryStepId?: number;
  afterGradeSalaryStepId?: number;
  remark?: string | null;
  isBusinessUnitChange?: boolean;
  transactionStatus?: EmployeeTransactionStatus;
};
export type UpdateEmployeeReClassificationCommand = {
  id?: number;
  employeeId?: number;
  reClassificationDate?: string | null;
  reClassificationEndDate?: string | null;
  jobRoleBeforeId?: number | null;
  jobRoleAfterId?: number | null;
  reClassificationType?: ReClassificationType;
  remark?: string | null;
  transactionStatus?: EmployeeTransactionStatus;
};
export type UpdateSalaryIncrementCommand = {
  id?: number;
  employeeId?: number;
  jobRoleId?: number;
  salaryIncrementDate?: string | null;
  salaryIncrementEndDate?: string | null;
  beforeGradeSalaryStepId?: number;
  afterGradeSalaryStepId?: number;
  remark?: string | null;
  transactionStatus?: EmployeeTransactionStatus;
};
export type LateralTransferType = 1 | 2 | 3;
export type CreateTransferCommand = {
  employeeId?: number;
  toBusinessUnitId?: number;
  toJobRoleId?: number;
  transferType?: LateralTransferType;
  transferDate?: string;
  transferReason?: string | null;
};
export type ApproveTransferCommand = {
  id?: number;
  comment?: string | null;
};
export type EmployeeTransferDto = {
  id?: number;
  employeeId?: number;
  employeeName?: string | null;
  fromBusinessUnitId?: number;
  fromBusinessUnitName?: string | null;
  toBusinessUnitId?: number;
  toBusinessUnitName?: string | null;
  fromJobRoleId?: number;
  fromJobRoleName?: string | null;
  toJobRoleId?: number;
  toJobRoleName?: string | null;
  transferType?: LateralTransferType;
  transferDate?: string;
  transferReason?: string | null;
  approvalStatus?: ApprovalStatus;
  remark?: string | null;
};
export type EmployeeBasicInfoDto = {
  id?: number;
  displayName?: string | null;
  businessUnitId?: number | null;
  businessUnitName?: string | null;
  jobRoleId?: number | null;
  jobRoleName?: string | null;
};
export type TransferCountsByStatus = {
  approved?: number;
  approvalRequests?: number;
  rejected?: number;
  drafts?: number;
};
export type TransferSearchResult = {
  items?: EmployeeTransferDto[] | null;
  totalCount?: number;
};
export type RejectTransferCommand = {
  id?: number;
  comment?: string | null;
};
export type SubmitTransferCommand = {
  id?: number;
  comment?: string | null;
};
export type UpdateTransferCommand = {
  id?: number;
  employeeId?: number;
  toBusinessUnitId?: number;
  toJobRoleId?: number;
  transferType?: LateralTransferType;
  transferDate?: string;
  transferReason?: string | null;
};
export type ApproveEmployeeWarningCommand = {
  id?: number;
};
export type EmployeeWarningCountsByStatus = {
  approved?: number;
  submitted?: number;
  rejected?: number;
  draft?: number;
};
export type ViolationType = 1 | 2 | 3 | 4;
export type WarningStatus = 1 | 2 | 3;
export type CreateEmployeeWarningCommand = {
  employeeId?: number;
  percentage?: number;
  warningDate?: string;
  violationType?: ViolationType;
  warningStatus?: WarningStatus;
  remark?: string | null;
};
export type EmployeeWarningDto = {
  id?: number;
  employeeId?: number;
  employee?: Employee;
  percentage?: number;
  warningDate?: string;
  warningStatus?: WarningStatus;
  violationType?: ViolationType;
  remark?: string | null;
  approvalStatus?: ApprovalStatus;
};
export type EmployeeWarningDtoRead = {
  id?: number;
  employeeId?: number;
  employee?: EmployeeRead;
  percentage?: number;
  warningDate?: string;
  warningStatus?: WarningStatus;
  violationType?: ViolationType;
  remark?: string | null;
  approvalStatus?: ApprovalStatus;
};
export type PaginatedEmployeeWarninglist = {
  items?: EmployeeWarningDto[] | null;
  totalCount?: number;
};
export type PaginatedEmployeeWarninglistRead = {
  items?: EmployeeWarningDtoRead[] | null;
  totalCount?: number;
};
export type RejectEmployeeWarningCommand = {
  id?: number;
};
export type SubmitEmployeeWarningCommand = {
  id?: number;
};
export type UpdateEmployeeWarningCommand = {
  id?: number;
  employeeId?: number;
  percentage?: number;
  warningDate?: string;
  warningStatus?: WarningStatus;
  violationType?: ViolationType;
  remark?: string | null;
};
export type ApproveFieldOfStudyCommand = {
  id?: number;
};
export type FieldOfStudyCountsByStatus = {
  approved?: number;
  submitted?: number;
  rejected?: number;
  draft?: number;
};
export type CreateFieldOfStudyCommand = {
  name?: string | null;
  description?: string | null;
};
export type FieldOfStudyDto = {
  id?: number;
  name?: string | null;
  description?: string | null;
  approvalStatus?: ApprovalStatus;
};
export type FieldOfStudyLists = {
  approved?: FieldOfStudyDto[] | null;
  submitted?: FieldOfStudyDto[] | null;
  rejected?: FieldOfStudyDto[] | null;
  draft?: FieldOfStudyDto[] | null;
};
export type PaginatedFieldOfStudyList = {
  items?: FieldOfStudyDto[] | null;
  totalCount?: number;
};
export type RejectFieldOfStudyCommand = {
  id?: number;
};
export type SubmitFieldOfStudyCommand = {
  id?: number;
};
export type UpdateFieldOfStudyCommand = {
  id?: number;
  name?: string | null;
  description?: string | null;
};
export type HearingParticipantDto = {
  id?: number;
  userId?: string | null;
  displayName?: string | null;
  role?: string | null;
};
export type CreateHearingCommand = {
  caseId?: number;
  scheduledAt?: string;
  hearingType?: HearingType;
  locationOrUrl?: string | null;
  responsibleJudgeId?: string | null;
  chilotId?: number | null;
  businessUnitId?: number | null;
  notes?: string | null;
  participants?: HearingParticipantDto[] | null;
};
export type HearingDto = {
  id?: number;
  caseId?: number;
  caseNumber?: string | null;
  scheduledAt?: string;
  hearingType?: HearingType;
  locationOrUrl?: string | null;
  responsibleJudgeId?: string | null;
  responsibleJudgeName?: string | null;
  chilotId?: number | null;
  chilotName?: string | null;
  businessUnitId?: number | null;
  businessUnitName?: string | null;
  notes?: string | null;
  participants?: HearingParticipantDto[] | null;
};
export type UpdateHearingCommand = {
  id?: number;
  scheduledAt?: string;
  hearingType?: HearingType;
  locationOrUrl?: string | null;
  responsibleJudgeId?: string | null;
  chilotId?: number | null;
  businessUnitId?: number | null;
  notes?: string | null;
  participants?: HearingParticipantDto[] | null;
};
export type ApproveInstitutionNameCommand = {
  id?: number;
};
export type InstitutionNameCountsByStatus = {
  approved?: number;
  submitted?: number;
  rejected?: number;
  draft?: number;
};
export type CreateInstitutionNameCommand = {
  name?: string | null;
  description?: string | null;
};
export type InstitutionNameDto = {
  id?: number;
  name?: string | null;
  description?: string | null;
  approvalStatus?: ApprovalStatus;
};
export type InstitutionNameLists = {
  approved?: InstitutionNameDto[] | null;
  submitted?: InstitutionNameDto[] | null;
  rejected?: InstitutionNameDto[] | null;
  draft?: InstitutionNameDto[] | null;
};
export type PaginatedInstitutionNameList = {
  items?: InstitutionNameDto[] | null;
  totalCount?: number;
};
export type RejectInstitutionNameCommand = {
  id?: number;
};
export type SubmitInstitutionNameCommand = {
  id?: number;
};
export type UpdateInstitutionNameCommand = {
  id?: number;
  name?: string | null;
  description?: string | null;
};
export type ActivateJobRoleCommand = {
  id?: number;
  comment?: string | null;
};
export type ActivateJobCommand = {
  id?: number;
};
export type JobCreationResponse = {
  jobId?: number;
  jobCountExceeded?: boolean;
  jobIds?: number[] | null;
};
export type AddJobCommand = {
  jobRoleId?: number;
  businessunitId?: number;
  requiredNumber?: number;
};
export type JobRoleBenefitDto = {
  id?: number;
  benefitId?: number;
  benefitName?: string | null;
  unitOfMeasurementName?: string | null;
  isUnitPriced?: boolean;
  benefitValueId?: number;
  value?: number;
  unitPrice?: number | null;
  approvalStatus?: ApprovalStatus;
  description?: string | null;
  remark?: string | null;
  latestUnitPrice?: BenefitUnitPriceDto;
};
export type JobRoleBenefitDtoRead = {
  id?: number;
  benefitId?: number;
  benefitName?: string | null;
  unitOfMeasurementName?: string | null;
  isUnitPriced?: boolean;
  benefitValueId?: number;
  value?: number;
  unitPrice?: number | null;
  calculatedBenefitAmount?: number | null;
  approvalStatus?: ApprovalStatus;
  description?: string | null;
  remark?: string | null;
  latestUnitPrice?: BenefitUnitPriceDto;
};
export type AddJobRoleCommand = {
  id?: number;
  roleName?: string | null;
  jobCatagoryId?: number;
  jobRoleCategoryId?: number;
  jobGradeId?: number;
  description?: string | null;
  statusRemark?: string | null;
  benefits?: JobRoleBenefitDto[] | null;
};
export type AddJobRoleCommandRead = {
  id?: number;
  roleName?: string | null;
  jobCatagoryId?: number;
  jobRoleCategoryId?: number;
  jobGradeId?: number;
  description?: string | null;
  statusRemark?: string | null;
  benefits?: JobRoleBenefitDtoRead[] | null;
};
export type JobDto = {
  id?: number;
  jobRoleId?: number;
  businessUnitId?: number;
  isVacant?: boolean;
  jobRole?: string | null;
  businessUnit?: string | null;
  vacant?: string | null;
  jobStatus?: JobStatus;
  approvalStatus?: ApprovalStatus;
  isLocked?: boolean;
  isJobCountExceed?: boolean;
  locked?: string | null;
  requiredNumber?: number | null;
};
export type JobRoleDto = {
  id?: number;
  roleName?: string | null;
  description?: string | null;
  jobCatagory?: string | null;
  jobGrade?: JobGradeRomanId;
  jobRoleCatagory?: string | null;
  approvalStatus?: ApprovalStatus;
  isActive?: ActivationEnum;
  benefits?: JobRoleBenefitDto[] | null;
};
export type JobRoleDtoRead = {
  id?: number;
  roleName?: string | null;
  description?: string | null;
  jobCatagory?: string | null;
  jobGrade?: JobGradeRomanId;
  jobRoleCatagory?: string | null;
  approvalStatus?: ApprovalStatus;
  isActive?: ActivationEnum;
  benefits?: JobRoleBenefitDtoRead[] | null;
};
export type JobRolesSearchResult = {
  items?: JobRoleDto[] | null;
  totalCount?: number;
};
export type JobRolesSearchResultRead = {
  items?: JobRoleDtoRead[] | null;
  totalCount?: number;
};
export type ApproveJobCommand = {
  id?: number;
  comment?: string | null;
};
export type ApproveJobRolesCommand = {
  id?: number;
  comment?: string | null;
};
export type JobRolesCountsByStatus = {
  approved?: number;
  approvalRequests?: number;
  rejected?: number;
  drafts?: number;
};
export type DeactivateJobRoleCommand = {
  id?: number;
  comment?: string | null;
};
export type DeactivateJobCommand = {
  id?: number;
};
export type JobSearchResult = {
  items?: JobDto[] | null;
  totalCount?: number;
};
export type JobSearchResultByBusinessUnitAndJobRole = {
  items?: JobDto[] | null;
  totalCount?: number | null;
};
export type JobCountsByStatus = {
  approved?: number;
  approvalRequests?: number;
  rejected?: number;
  drafts?: number;
};
export type RejectJobCommand = {
  id?: number;
  comment?: string | null;
};
export type RejectJobRolesCommand = {
  id?: number;
  comment?: string | null;
};
export type SubmitJobCommand = {
  id?: number;
  comment?: string | null;
};
export type SubmitJobRolesCommand = {
  id?: number;
  comment?: string | null;
};
export type JobUpdationResponse = {
  jobId?: number;
  isLocked?: boolean;
};
export type UpdateJobCommand = {
  jobId?: number;
  jobRoleId?: number;
  businessunitId?: number;
};
export type UpdateJobRoleCommand = {
  id?: number;
  roleName?: string | null;
  jobCatagoryId?: number;
  jobRoleCategoryId?: number;
  jobGradeId?: number;
  description?: string | null;
  benefits?: JobRoleBenefitDto[] | null;
};
export type UpdateJobRoleCommandRead = {
  id?: number;
  roleName?: string | null;
  jobCatagoryId?: number;
  jobRoleCategoryId?: number;
  jobGradeId?: number;
  description?: string | null;
  benefits?: JobRoleBenefitDtoRead[] | null;
};
export type CreateJobCategoryCommand = {
  id?: number;
  jobCategoryName?: string | null;
  description?: string | null;
  probationPeriodInDays?: number;
  isApproved?: boolean;
  isActive?: boolean;
  approvalStatus?: ApprovalStatus;
};
export type JobCategoryDto = {
  id?: number;
  jobCategoryName?: string | null;
  approvalStatus?: ApprovalStatus;
  probationPeriodInDays?: number;
  isActive?: boolean;
  lastModifiedAt?: string;
  createdAt?: string;
};
export type JobCategoryLists = {
  approved?: JobCategoryDto[] | null;
  submitted?: JobCategoryDto[] | null;
  rejected?: JobCategoryDto[] | null;
  draft?: JobCategoryDto[] | null;
};
export type JobCategorySearchResult = {
  items?: JobCategoryDto[] | null;
  totalCount?: number;
};
export type JobCategoryCountsByStatus = {
  approved?: number;
  approvalRequests?: number;
  rejected?: number;
  drafts?: number;
};
export type RejectJobCategoryCommand = {
  id?: number;
  comment?: string | null;
};
export type UpdateJobCategoryCommand = {
  id?: number;
  jobCategoryName?: string | null;
  probationPeriodInDays?: number;
  isApproved?: boolean;
  isActive?: boolean;
  approvalStatus?: ApprovalStatus;
};
export type AddJobGradeCommand = {
  jobGradeRomanId?: JobGradeRomanId;
  name?: string | null;
  baseSalary?: number;
  stepCoefficient?: number;
  ceilingSalary?: number | null;
  description?: string | null;
  approvalStatus?: ApprovalStatus;
};
export type ApproveJobGradeCommand = {
  id?: number;
  comment?: string | null;
};
export type JobGradesCountsByStatus = {
  approved?: number;
  approvalRequests?: number;
  rejected?: number;
  drafts?: number;
};
export type JobGradeStepDto = {
  stepNumber?: number;
  salaryAmount?: number;
};
export type JobGradeDto = {
  jobGradeId?: number;
  jobGradeRomanId?: JobGradeRomanId;
  name?: string | null;
  baseSalary?: number;
  stepCoefficient?: number;
  ceilingSalary?: number | null;
  description?: string | null;
  approvalStatus?: ApprovalStatus;
  jobGradeSteps?: JobGradeStepDto[] | null;
};
export type JobGradesSearchResult = {
  items?: JobGradeDto[] | null;
  totalCount?: number;
};
export type RejectJobGradeCommand = {
  id?: number;
  comment?: string | null;
};
export type SubmitJobGradeCommand = {
  id?: number;
  comment?: string | null;
};
export type UpdateJobGradeCommand = {
  jobGradeId?: number;
  jobGradeRomanId?: JobGradeRomanId;
  name?: string | null;
  baseSalary?: number;
  stepCoefficient?: number;
  ceilingSalary?: number | null;
  description?: string | null;
  statusRemark?: string | null;
};
export type ApproveJobRoleCatagoryCommand = {
  id?: number;
};
export type JobRoleCatagoryCountsByStatus = {
  approved?: number;
  submitted?: number;
  rejected?: number;
  draft?: number;
};
export type CreateJobRoleCatagoryCommand = {
  name?: string | null;
  description?: string | null;
};
export type JobRoleCatagoryDto = {
  id?: number;
  name?: string | null;
  description?: string | null;
  approvalStatus?: ApprovalStatus;
};
export type JobRoleCatagoryLists = {
  approved?: JobRoleCatagoryDto[] | null;
  submitted?: JobRoleCatagoryDto[] | null;
  rejected?: JobRoleCatagoryDto[] | null;
  draft?: JobRoleCatagoryDto[] | null;
};
export type PaginatedJobRoleCatagoryList = {
  items?: JobRoleCatagoryDto[] | null;
  totalCount?: number;
};
export type RejectJobRoleCatagoryCommand = {
  id?: number;
};
export type SubmitJobRoleCatagoryCommand = {
  id?: number;
};
export type UpdateJobRoleCatagoryCommand = {
  id?: number;
  name?: string | null;
  description?: string | null;
};
export type CreateJudgeAssignmentCommand = {
  caseId?: number | null;
  chilotId?: number | null;
  businessUnitId?: number | null;
};
export type JudgeAssignmentDto = {
  id?: number;
  judgeId?: string | null;
  judgeName?: string | null;
  caseId?: number | null;
  caseNumber?: string | null;
  chilotId?: number | null;
  chilotName?: string | null;
  businessUnitId?: number | null;
  businessUnitName?: string | null;
  assignedAt?: string;
  unassignedAt?: string | null;
  role?: string | null;
};
export type UpdateJudgeAssignmentCommand = {
  id?: number;
  caseId?: number | null;
  chilotId?: number | null;
  businessUnitId?: number | null;
  judgeId?: string | null;
  role?: string | null;
};
export type CreateJudgmentCommand = {
  caseId?: number;
  htmlContent?: string | null;
  pdfFilePath?: string | null;
  signedByUserId?: string | null;
  signedAt?: string | null;
  fileHash?: string | null;
  isPublished?: boolean;
  publishedAt?: string | null;
};
export type JudgmentDto = {
  id?: number;
  caseId?: number;
  caseNumber?: string | null;
  htmlContent?: string | null;
  pdfFilePath?: string | null;
  signedByUserId?: string | null;
  signedByName?: string | null;
  signedAt?: string | null;
  fileHash?: string | null;
  isPublished?: boolean;
  publishedAt?: string | null;
};
export type UpdateJudgmentCommand = {
  id?: number;
  htmlContent?: string | null;
  pdfFilePath?: string | null;
  signedByUserId?: string | null;
  signedAt?: string | null;
  fileHash?: string | null;
  isPublished?: boolean;
  publishedAt?: string | null;
};
export type CreateLanguageSkillCommand = {
  language?: LanguageEnum;
  speaking?: SkillLevelEnum;
  listening?: SkillLevelEnum;
  writing?: SkillLevelEnum;
  reading?: SkillLevelEnum;
  employeeId?: number;
};
export type DeleteLanguageSkillCommand = {
  id?: number;
};
export type LanguageSkillDto = {
  id?: number;
  language?: LanguageEnum;
  speaking?: SkillLevelEnum;
  listening?: SkillLevelEnum;
  writing?: SkillLevelEnum;
  reading?: SkillLevelEnum;
  employeeId?: number;
};
export type UpdateLanguageSkillCommand = {
  id?: number;
  language?: LanguageEnum;
  speaking?: SkillLevelEnum;
  listening?: SkillLevelEnum;
  writing?: SkillLevelEnum;
  reading?: SkillLevelEnum;
};
export type CreateLetterCommand = {
  id?: number;
  referenceNumber?: string | null;
  subject?: string | null;
  content?: string | null;
  letterType?: LetterType;
  status?: LetterStatus;
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
  senderId?: string | null;
  recipientId?: string | null;
  businessUnitId?: number;
};
export type ApproveLetterCommand = {
  id?: number;
};
export type CreateEditableLetterCommand = {
  referenceNumber?: string | null;
  subject?: string | null;
  content?: string | null;
  letterType?: LetterType;
  senderId?: string | null;
  recipientId?: string | null;
  businessUnitId?: number;
};
export type PaginatedLetterList = {
  items?: LetterDto[] | null;
  totalCount?: number;
};
export type PaginatedLetterListRead = {
  items?: LetterDtoRead[] | null;
  totalCount?: number;
};
export type RejectLetterCommand = {
  id?: number;
};
export type SubmitLetterCommand = {
  id?: number;
};
export type BranchGrade = {
  id?: number;
  grade?: string | null;
  staffLimit?: number;
  description?: string | null;
  remark?: string | null;
  approvalStatus?: ApprovalStatus;
};
export type LookupDto = {
  businessUnits?: BusinessUnitLists;
  businessUnitTypes?: BusinessUnitType[] | null;
  jobRoles?: JobRoleDto[] | null;
  jobCatagories?: JobCatagory[] | null;
  jobRoleCategories?: JobRoleCategory[] | null;
  jobGrades?: JobGrade[] | null;
  branchGrades?: BranchGrade[] | null;
  benefits?: BenefitDto[] | null;
  unitPricedBenefits?: BenefitDto[] | null;
  benefitUnitOfMeasurements?: BenefitUnitOfMeasurementDto[] | null;
};
export type LookupDtoRead = {
  businessUnits?: BusinessUnitLists;
  businessUnitTypes?: BusinessUnitType[] | null;
  jobRoles?: JobRoleDtoRead[] | null;
  jobCatagories?: JobCatagory[] | null;
  jobRoleCategories?: JobRoleCategory[] | null;
  jobGrades?: JobGrade[] | null;
  branchGrades?: BranchGrade[] | null;
  benefits?: BenefitDto[] | null;
  unitPricedBenefits?: BenefitDto[] | null;
  benefitUnitOfMeasurements?: BenefitUnitOfMeasurementDto[] | null;
};
<<<<<<< HEAD
export type ConversationDto = {
  chatPartnerId?: string | null;
  chatPartnerName?: string | null;
  lastMessage?: string | null;
  lastMessageTime?: string;
  unreadCount?: number;
};
export type ChatMessageDto = {
  id?: number;
  senderId?: string | null;
  receiverId?: string | null;
  content?: string | null;
  sentAt?: string;
  isRead?: boolean;
};
export type SendMessageCommand = {
  senderId?: string | null;
  receiverId?: string | null;
  content?: string | null;
};
export type CreateNotificationCommand = {
  userId?: string | null;
  title?: string | null;
  body?: string | null;
  caseId?: number | null;
  paymentId?: number | null;
  hearingId?: number | null;
  channel?: NotificationChannel;
};
export type NotificationDto = {
  id?: number;
  title?: string | null;
  body?: string | null;
  isRead?: boolean;
  sentAt?: string;
  channel?: NotificationChannel;
};
export type UpdateNotificationCommand = {
  id?: number;
  isRead?: boolean;
};
export type CreatePaymentCommand = {
  caseId?: number;
  amount?: number;
  gateway?: string | null;
  transactionId?: string | null;
  receiptFilePath?: string | null;
  processedById?: string | null;
  paidAt?: string | null;
  status?: PaymentStatus;
};
export type PaymentDto = {
  id?: number;
  caseId?: number;
  caseNumber?: string | null;
  amount?: number;
  gateway?: string | null;
  transactionId?: string | null;
  status?: string | null;
  receiptFilePath?: string | null;
  processedById?: string | null;
  processedByName?: string | null;
  paidAt?: string | null;
  createdAt?: string;
  modifiedAt?: string | null;
};
export type UpdatePaymentCommand = {
  id?: number;
  amount?: number;
  gateway?: string | null;
  transactionId?: string | null;
  receiptFilePath?: string | null;
  processedById?: string | null;
  paidAt?: string | null;
  status?: PaymentStatus;
=======
export type ApproveReemploymentCommand = {
  reemploymentId?: number;
  remark?: string | null;
  newEmployeeProfile?: CreateEmployeeProfileCommand;
};
export type ReemploymentType = 1 | 2;
export type CreateReemploymentCommand = {
  employeeId?: number;
  reemploymentType?: ReemploymentType;
  reemploymentDate?: string;
  reasonForReemployment?: string | null;
  remark?: string | null;
};
export type ReemploymentDto = {
  id?: number;
  employeeId?: number;
  employeeName?: string | null;
  employeeFirstName?: string | null;
  employeeMiddleName?: string | null;
  employeeLastName?: string | null;
  amharicFirstName?: string | null;
  amharicMiddleName?: string | null;
  amharicLastName?: string | null;
  birthDate?: string | null;
  employementDate?: string | null;
  gender?: Gender;
  martialStatus?: MartialStatus;
  businessUnitName?: string | null;
  jobRoleName?: string | null;
  businessUnitId?: number;
  jobId?: number;
  reemploymentType?: ReemploymentType;
  approvalStatus?: ApprovalStatus;
  reemploymentDate?: string;
  reasonForReemployment?: string | null;
  remark?: string | null;
};
export type ReemploymentCountsByStatus = {
  approved?: number;
  approvalRequests?: number;
  rejected?: number;
  drafts?: number;
};
export type ReemploymentSearchResult = {
  items?: ReemploymentDto[] | null;
  totalCount?: number;
};
export type RejectReemploymentCommand = {
  reemploymentId?: number;
  remark?: string | null;
};
export type SubmitReemploymentCommand = {
  reemploymentId?: number;
  remark?: string | null;
};
export type UpdateReemploymentCommand = {
  reemploymentId?: number;
  reemploymentDate?: string;
  reasonForReemployment?: string | null;
  remark?: string | null;
  reemploymentType?: ReemploymentType;
>>>>>>> origin/Solomon/v2
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
export type ApproveResignationCommand = {
  id?: number;
};
export type ResignationCountsByStatus = {
  approved?: number;
  submitted?: number;
  rejected?: number;
  draft?: number;
};
export type CreateResignationCommand = {
  employeeId?: number;
  salary?: number;
  workUnit?: string | null;
  resignationDate?: string;
  resignationType?: ResignationType;
  reasonForResignation?: string | null;
  finalSettlementDetails?: string | null;
  isActive?: boolean;
};
export type ResignationDto = {
  id?: number;
  employeeId?: number;
  employee?: Employee;
  salary?: number;
  workUnit?: string | null;
  resignationDate?: string;
  resignationType?: ResignationType;
  reasonForResignation?: string | null;
  finalSettlementDetails?: string | null;
  isActive?: boolean;
  employeeFileDocuments?: EmployeeFileDocument[] | null;
  approvalStatus?: ApprovalStatus;
};
export type ResignationDtoRead = {
  id?: number;
  employeeId?: number;
  employee?: EmployeeRead;
  salary?: number;
  workUnit?: string | null;
  resignationDate?: string;
  resignationType?: ResignationType;
  reasonForResignation?: string | null;
  finalSettlementDetails?: string | null;
  isActive?: boolean;
  employeeFileDocuments?: EmployeeFileDocumentRead[] | null;
  approvalStatus?: ApprovalStatus;
};
export type PaginatedResignationList = {
  items?: ResignationDto[] | null;
  totalCount?: number;
};
export type PaginatedResignationListRead = {
  items?: ResignationDtoRead[] | null;
  totalCount?: number;
};
export type RejectResignationCommand = {
  id?: number;
};
export type SubmitResignationCommand = {
  id?: number;
};
export type UpdateResignationCommand = {
  id?: number;
  employeeId?: number;
  salary?: number;
  workUnit?: string | null;
  resignationDate?: string;
  resignationType?: ResignationType;
  reasonForResignation?: string | null;
  finalSettlementDetails?: string | null;
  isActive?: boolean;
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
export type ApproveSuspensionCommand = {
  id?: number;
};
export type SuspensionCountsByStatus = {
  approved?: number;
  submitted?: number;
  rejected?: number;
  draft?: number;
};
export type CreateSuspensionCommand = {
  employeeId?: number;
  startDate?: string;
  endDate?: string | null;
  salary?: number;
  reason?: SuspensionReason;
  description?: string | null;
  conditionsForReinstatement?: string | null;
  isActive?: boolean;
};
export type SuspensionDto = {
  id?: number;
  employeeId?: number;
  employee?: Employee;
  startDate?: string;
  endDate?: string | null;
  salary?: number;
  reason?: SuspensionReason;
  description?: string | null;
  conditionsForReinstatement?: string | null;
  isActive?: boolean;
  employeeFileDocuments?: EmployeeFileDocument[] | null;
  approvalStatus?: ApprovalStatus;
};
export type SuspensionDtoRead = {
  id?: number;
  employeeId?: number;
  employee?: EmployeeRead;
  startDate?: string;
  endDate?: string | null;
  salary?: number;
  reason?: SuspensionReason;
  description?: string | null;
  conditionsForReinstatement?: string | null;
  isActive?: boolean;
  employeeFileDocuments?: EmployeeFileDocumentRead[] | null;
  approvalStatus?: ApprovalStatus;
};
export type PaginatedSuspensionList = {
  items?: SuspensionDto[] | null;
  totalCount?: number;
};
export type PaginatedSuspensionListRead = {
  items?: SuspensionDtoRead[] | null;
  totalCount?: number;
};
export type RejectSuspensionCommand = {
  id?: number;
};
export type SubmitSuspensionCommand = {
  id?: number;
};
export type UpdateSuspensionCommand = {
  id?: number;
  employeeId?: number;
  startDate?: string;
  endDate?: string | null;
  salary?: number;
  reason?: SuspensionReason;
  description?: string | null;
  conditionsForReinstatement?: string | null;
  isActive?: boolean;
};
export type ApproveBranchGradeCommand = {
  id?: number;
  remark?: string | null;
};
export type BranchGradeCountsByStatus = {
  approved?: number;
  approvalRequests?: number;
  rejected?: number;
  drafts?: number;
};
export type BranchGradeDto = {
  id?: number;
  grade?: string | null;
  staffLimit?: number;
  description?: string | null;
  remark?: string | null;
  approvalStatus?: ApprovalStatus;
};
export type BranchGradeSearchResult = {
  items?: BranchGradeDto[] | null;
  totalCount?: number;
};
export type RejectBranchGradeCommand = {
  id?: number;
  remark?: string | null;
};
export type SubmitBranchGradeCommand = {
  id?: number;
  remark?: string | null;
};
export type UpdateBranchGradeCommand = {
  id?: number;
  grade?: string | null;
  staffLimit?: number;
  description?: string | null;
};
export const {
  useAddBranchGradeMutation,
  useActivateUserMutation,
  useChangePasswordMutation,
  useDeactivateUserMutation,
  useForgotPasswordMutation,
  useLoginMutation,
  useLogoutMutation,
  useResetPasswordMutation,
  useVerificationCodeMutation,
  useApproveActingMutation,
  useGetActingCountPerStatusQuery,
  useLazyGetActingCountPerStatusQuery,
  useCreateActingMutation,
  useGetAllActiveActingQuery,
  useLazyGetAllActiveActingQuery,
  useGetPaginatedActingsQuery,
  useLazyGetPaginatedActingsQuery,
  useCreateReassignmentMutation,
  useRejectActingMutation,
  useSubmitActingMutation,
  useUpdateActingMutation,
  useCreateAddressMutation,
  useGetAddressByRequestIdQuery,
  useLazyGetAddressByRequestIdQuery,
  useGetAddressQueryByEntityTypeQuery,
  useLazyGetAddressQueryByEntityTypeQuery,
  useGetEmployeeFamilyAddressByIdQuery,
  useLazyGetEmployeeFamilyAddressByIdQuery,
  useGetGuaranterAddressQuery,
  useLazyGetGuaranterAddressQuery,
  useGetGuaranterWorkingFirmAddressQuery,
  useLazyGetGuaranterWorkingFirmAddressQuery,
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
<<<<<<< HEAD
  useCreateAppointmentMutation,
  useGetAllAppointmentsQuery,
  useLazyGetAllAppointmentsQuery,
  useGetAppointmentsByBusinessUnitIdQuery,
  useLazyGetAppointmentsByBusinessUnitIdQuery,
  useGetAppointmentsByCaseIdQuery,
  useLazyGetAppointmentsByCaseIdQuery,
  useGetAppointmentByIdQuery,
  useLazyGetAppointmentByIdQuery,
  useUpdateAppointmentMutation,
=======
  useGetAuditEmployeeDocumentFileByEmployeeIdQuery,
  useLazyGetAuditEmployeeDocumentFileByEmployeeIdQuery,
  useGetAuditEmployeeFileDocumentLogsQuery,
  useLazyGetAuditEmployeeFileDocumentLogsQuery,
>>>>>>> origin/Solomon/v2
  useApproveAwardMutation,
  useGetAwardCountPerStatusQuery,
  useLazyGetAwardCountPerStatusQuery,
  useCreateAwardMutation,
  useGetAllAwardQuery,
  useLazyGetAllAwardQuery,
  useGetAwardsForPaginationQuery,
  useLazyGetAwardsForPaginationQuery,
  useRejectAwardMutation,
  useSearchAllAwardsQuery,
  useLazySearchAllAwardsQuery,
  useSubmitAwardMutation,
  useUpdateAwardMutation,
  useAddBenefitMutation,
  useApproveBenefitMutation,
  useGetAllBenefitListQuery,
  useLazyGetAllBenefitListQuery,
  useGetAllUnitPricedBenefitlistQuery,
  useLazyGetAllUnitPricedBenefitlistQuery,
  useGetBenefitCountPerStatusQuery,
  useLazyGetBenefitCountPerStatusQuery,
  useGetBenefitListForPaginationQuery,
  useLazyGetBenefitListForPaginationQuery,
  useRejectBenefitMutation,
  useSubmitBenefitMutation,
  useUpdateBenefitMutation,
  useAddBenefitUnitOfMeasurementMutation,
  useApproveBenefitUnitOfMeasurementMutation,
  useGetAllBenefitUnitOfMeasurementListQuery,
  useLazyGetAllBenefitUnitOfMeasurementListQuery,
  useGetBenefitUnitOfMeasurementCountPerStatusQuery,
  useLazyGetBenefitUnitOfMeasurementCountPerStatusQuery,
  useGetBenefitUnitOfMeasurementListForPaginationQuery,
  useLazyGetBenefitUnitOfMeasurementListForPaginationQuery,
  useRejectBenefitUnitOfMeasurementMutation,
  useSubmitBenefitUnitOfMeasurementMutation,
  useUpdateBenefitUnitOfMeasurementMutation,
  useAddBenefitUnitPriceMutation,
  useApproveBenefitUnitPriceMutation,
  useGetAllBenefitUnitPricQuery,
  useLazyGetAllBenefitUnitPricQuery,
  useGetBenefitUnitPriceCountPerStatusQuery,
  useLazyGetBenefitUnitPriceCountPerStatusQuery,
  useGetBenefitUnitPriceListForPaginationQuery,
  useLazyGetBenefitUnitPriceListForPaginationQuery,
  useRejectBenefitUnitPriceMutation,
  useSubmitBenefitUnitPriceMutation,
  useUpdateBenefitUnitPriceMutation,
  useAddBenefitValueMutation,
  useApproveBenefitValueMutation,
  useGetAllBenefitValueQuery,
  useLazyGetAllBenefitValueQuery,
  useGetBenefitSetupListQuery,
  useLazyGetBenefitSetupListQuery,
  useGetBenefitValueByIdQuery,
  useLazyGetBenefitValueByIdQuery,
  useGetBenefitValueCountPerStatusQuery,
  useLazyGetBenefitValueCountPerStatusQuery,
  useGetBenefitValueListForPaginationQuery,
  useLazyGetBenefitValueListForPaginationQuery,
  useGetBenefitValuesListByBenefitIdQuery,
  useLazyGetBenefitValuesListByBenefitIdQuery,
  useRejectBenefitValueMutation,
  useSubmitBenefitValueMutation,
  useUpdateBenefitValueMutation,
  useActivateBusinessUnitMutation,
  useGetAllBusinessUnitsQuery,
  useLazyGetAllBusinessUnitsQuery,
  useGetAllBuisnessUnitListsQuery,
  useLazyGetAllBuisnessUnitListsQuery,
  useApproveBusinessUnitMutation,
  useGetBusinessUnitCountPerApprovalStatusQuery,
  useLazyGetBusinessUnitCountPerApprovalStatusQuery,
  useGetEmployeeCountPerApprovalStatusQuery,
  useLazyGetEmployeeCountPerApprovalStatusQuery,
  useCreateBusinessUnitMutation,
  useDeactivateBusinessUnitMutation,
  useRejectBusinessUnitMutation,
  useSearchAllBusinessUnitsQuery,
  useLazySearchAllBusinessUnitsQuery,
  useSearchBusinessUnitsQuery,
  useLazySearchBusinessUnitsQuery,
  useSubmitBusinessUnitMutation,
  useUpdateBusinessUnitMutation,
  useGetCaseByIdQuery,
  useLazyGetCaseByIdQuery,
  useGetCaseByBusinessUnitIdQuery,
  useLazyGetCaseByBusinessUnitIdQuery,
  useGetCaseInfoQuery,
  useLazyGetCaseInfoQuery,
  useGetCaseRecordVersionsQuery,
  useLazyGetCaseRecordVersionsQuery,
  useCreateCaseMutation,
  useGetAllCasesQuery,
  useLazyGetAllCasesQuery,
  useGetAllCasesByStatusQuery,
  useLazyGetAllCasesByStatusQuery,
  useGetAllCaseListsQuery,
  useLazyGetAllCaseListsQuery,
  useGetCaseCountPerApprovalStatusQuery,
  useLazyGetCaseCountPerApprovalStatusQuery,
  useUpdateCaseMutation,
  useCreateCaseTemplateMutation,
  useGetAllCaseTemplatesQuery,
  useLazyGetAllCaseTemplatesQuery,
  useGetCaseTemplateByIdQuery,
  useLazyGetCaseTemplateByIdQuery,
  useUpdateCaseTemplateMutation,
  useCreateCaseTimelineMutation,
  useGetAllCaseTimelinesQuery,
  useLazyGetAllCaseTimelinesQuery,
  useGetCaseTimelinesByCaseIdQuery,
  useLazyGetCaseTimelinesByCaseIdQuery,
  useGetCaseTimelineByIdQuery,
  useLazyGetCaseTimelineByIdQuery,
  useUpdateCaseTimelineMutation,
  useGetAllChilotQuery,
  useLazyGetAllChilotQuery,
  useGetChilotByBusinessUnitQuery,
  useLazyGetChilotByBusinessUnitQuery,
  useCreateChilotMutation,
  useUpdateChilotMutation,
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
  useGetAllApprovalItemsListQuery,
  useLazyGetAllApprovalItemsListQuery,
  useGetApprovalStatusSummaryQuery,
  useLazyGetApprovalStatusSummaryQuery,
  useGetApprovedActiveBusinessCountQuery,
  useLazyGetApprovedActiveBusinessCountQuery,
  useGetApprovedActiveEmployeeCountQuery,
  useLazyGetApprovedActiveEmployeeCountQuery,
  useGetApprovedActiveJobRoleCountQuery,
  useLazyGetApprovedActiveJobRoleCountQuery,
  useGetEmployeeDistributionByStatusQuery,
  useLazyGetEmployeeDistributionByStatusQuery,
  useGetEmployeeJobCategoryGroupCountQuery,
  useLazyGetEmployeeJobCategoryGroupCountQuery,
  useGetEmployeeRetentionRateQuery,
  useLazyGetEmployeeRetentionRateQuery,
  useGetEmployeeTurnoverRateQuery,
  useLazyGetEmployeeTurnoverRateQuery,
  useGetMonthlyEmployeeCountQuery,
  useLazyGetMonthlyEmployeeCountQuery,
  useGetNewEmployeesThisYearQuery,
  useLazyGetNewEmployeesThisYearQuery,
  useGetResignedEmployeesThisYearQuery,
  useLazyGetResignedEmployeesThisYearQuery,
  useGetVacantJobsCountQuery,
  useLazyGetVacantJobsCountQuery,
  useSearchAllLettersForDashboardQuery,
  useLazySearchAllLettersForDashboardQuery,
  useApproveDelegationMutation,
  useGetDelegationCountPerStatusQuery,
  useLazyGetDelegationCountPerStatusQuery,
  useCreateDelegationMutation,
  useGetAllDelegationQuery,
  useLazyGetAllDelegationQuery,
  useGetAllActiveDelegationQuery,
  useLazyGetAllActiveDelegationQuery,
  useGetPaginatedDelegationsQuery,
  useLazyGetPaginatedDelegationsQuery,
  useRejectDelegationMutation,
  useRemoveDelegationMutation,
  useSubmitDelegationMutation,
  useUpdateDelegationMutation,
  useCreateDocketEntryMutation,
  useGetAllDocketEntriesQuery,
  useLazyGetAllDocketEntriesQuery,
  useGetDocketEntriesByCaseIdQuery,
  useLazyGetDocketEntriesByCaseIdQuery,
  useGetDocketEntryByIdQuery,
  useLazyGetDocketEntryByIdQuery,
  useUpdateDocketEntryMutation,
  useGetApiDocumentsByIdQuery,
  useLazyGetApiDocumentsByIdQuery,
  useDownloadDocumentQuery,
  useLazyDownloadDocumentQuery,
  useDocumentRootPathQuery,
  useLazyDocumentRootPathQuery,
  useCreateEducationMutation,
  useGetEducationByIdQuery,
  useLazyGetEducationByIdQuery,
  useUpdateEducationMutation,
  useApproveEducationLevelMutation,
  useGetEducationLevelCountPerStatusQuery,
  useLazyGetEducationLevelCountPerStatusQuery,
  useCreateEducationLevelMutation,
  useGetAllEducationLevelQuery,
  useLazyGetAllEducationLevelQuery,
  useGetEducationLevelsForPaginationQuery,
  useLazyGetEducationLevelsForPaginationQuery,
  useRejectEducationLevelMutation,
  useSearchAllEducationLevelsQuery,
  useLazySearchAllEducationLevelsQuery,
  useSubmitEducationLevelMutation,
  useUpdateEducationLevelMutation,
  useActivateEmployeeFamilyMutation,
  useActivateEmployeeGuranteeMutation,
  useAddEmployeeExperienceMutation,
  useAddEmployeeChildrenMutation,
  useAddEmployeeGurantersMutation,
  useAllFamilyOfAllEmployeeQuery,
  useLazyAllFamilyOfAllEmployeeQuery,
  useDeActivateEmployeeFamilyMutation,
  useDeActivateEmployeeGuaranteeMutation,
  useGetFamilyQuery,
  useLazyGetFamilyQuery,
  useGetEmployeeExperienceByIdQuery,
  useLazyGetEmployeeExperienceByIdQuery,
  useGetEmployeeExperienceListOfEmployeeQuery,
  useLazyGetEmployeeExperienceListOfEmployeeQuery,
  useGetEmployeeGuaranterEmployeeQuery,
  useLazyGetEmployeeGuaranterEmployeeQuery,
  useGetEmployeeGurantersByIdQuery,
  useLazyGetEmployeeGurantersByIdQuery,
  useGetFamilyOfAnEmployeeQuery,
  useLazyGetFamilyOfAnEmployeeQuery,
  useUpdateEmployeeExperienceMutation,
  useUpdateEmployeeFamilyMutation,
  useUpdateEmployeeGurantersMutation,
  useDownloadEmployeeFileDocumentQuery,
  useLazyDownloadEmployeeFileDocumentQuery,
  useGetByIdQuery,
  useLazyGetByIdQuery,
  useGetEmployeeFileDocumentByEmployeeIdQuery,
  useLazyGetEmployeeFileDocumentByEmployeeIdQuery,
  useUpdateEmployeeFileDocumentMutation,
  useUploadEmployeeFileDocumentMutation,
  useGetEmployeeChangeLogQuery,
  useLazyGetEmployeeChangeLogQuery,
  useGetEmployeeByIdQuery,
  useLazyGetEmployeeByIdQuery,
  useAddEmployeePhotoMutation,
  useGetEmployeeByBusinessUnitIdQuery,
  useLazyGetEmployeeByBusinessUnitIdQuery,
  useGetEmployeeInfoQuery,
  useLazyGetEmployeeInfoQuery,
  useAddEmployeeNoteMutation,
  useGetEmployeeRecordVersionsQuery,
  useLazyGetEmployeeRecordVersionsQuery,
  useCreateEmployeeProfileMutation,
  useGetAllEmployeesQuery,
  useLazyGetAllEmployeesQuery,
  useGetAllEmployeesByStatusQuery,
  useLazyGetAllEmployeesByStatusQuery,
  useAllEmployeeApproveProbationMutation,
  useGetAllEmployeetListsQuery,
  useLazyGetAllEmployeetListsQuery,
  useApproveEmployeeMutation,
  useCreateEmployeeEmergencyContactMutation,
  useEmployeeIdCardApprovalApprovalMutation,
  useEmployeeIdCardApprovalRejectedMutation,
  useEmployeeIdCardGivenMutation,
  useEmployeeIdCardReplaceMutation,
  useEmployeeIdCardSubmitMutation,
  useEmployeeIdCardUpdateMutation,
  useEmployeeProbationApproveMutation,
  useEmployeeProbationTerminationMutation,
  useGetActiveEmployeeForIdManagementQuery,
  useLazyGetActiveEmployeeForIdManagementQuery,
  useGetAllEmployeeIdListQuery,
  useLazyGetAllEmployeeIdListQuery,
  useGetAllEmployeeOnProbationQuery,
  useLazyGetAllEmployeeOnProbationQuery,
  useGetAllEmployeesIdCardInfoQuery,
  useLazyGetAllEmployeesIdCardInfoQuery,
  useGetAllProbationForNotificationQuery,
  useLazyGetAllProbationForNotificationQuery,
  useGetEmployeeEmergencyContactsQuery,
  useLazyGetEmployeeEmergencyContactsQuery,
  useGetEmployeeIdCountPerApprovalStatusQuery,
  useLazyGetEmployeeIdCountPerApprovalStatusQuery,
  useGetProbationListQuery,
  useLazyGetProbationListQuery,
  useGetSingleEmployeeQuery,
  useLazyGetSingleEmployeeQuery,
  useProbationApprovalMutation,
  useGetProbationCountPerApprovalStatusQuery,
  useLazyGetProbationCountPerApprovalStatusQuery,
  useProbationSubmitMutation,
  useProbationTerminateMutation,
  useRejectEmployeeApprovalRequestMutation,
  useRejectedProbationActivateMutation,
  useRejectProbationApprovalMutation,
  useSubmitForApprovalMutation,
  useUpdateEmployeeMutation,
  useUpdateEmployeeEmergencyContactCommandMutation,
  useAddEmployeeDemotionMutation,
  useAddEmployeePromotionMutation,
  useAddEmployeeReClassificationMutation,
  useAddEmployeeSalaryIncrementMutation,
  useGetAllDemotionsQuery,
  useLazyGetAllDemotionsQuery,
  useGetAllPromotionsQuery,
  useLazyGetAllPromotionsQuery,
  useGetAllReClassificationsQuery,
  useLazyGetAllReClassificationsQuery,
  useApproveEmployeeDemotionMutation,
  useApproveEmployeePromotionMutation,
  useApproveEmployeeReClassificationMutation,
  useApproveSalaryIncrementMutation,
  useGetPromotionCountPerApprovalStatusQuery,
  useLazyGetPromotionCountPerApprovalStatusQuery,
  useGetAllSalaryIncrementListQuery,
  useLazyGetAllSalaryIncrementListQuery,
  useGetEmployeeDemotionByIdQuery,
  useLazyGetEmployeeDemotionByIdQuery,
  useGetEmployeeDemotionListQuery,
  useLazyGetEmployeeDemotionListQuery,
  useGetEmployeePromotionByIdQuery,
  useLazyGetEmployeePromotionByIdQuery,
  useGetEmployeePromotionListQuery,
  useLazyGetEmployeePromotionListQuery,
  useGetEmployeeReClassificationByIdQuery,
  useLazyGetEmployeeReClassificationByIdQuery,
  useGetEmployeeReClassificationListQuery,
  useLazyGetEmployeeReClassificationListQuery,
  useGetSalaryIncrementByIdQuery,
  useLazyGetSalaryIncrementByIdQuery,
  useGetSalaryIncrementListQuery,
  useLazyGetSalaryIncrementListQuery,
  useRejectEmployeeDemotionMutation,
  useRejectEmployeePromotionMutation,
  useRejectEmployeeReClassificationMutation,
  useRejectSalaryIncrementMutation,
  useSubmitEmployeeDemotionMutation,
  useSubmittEmployeePromotionMutation,
  useSubmitSalaryIncrementMutation,
  useSubmittEmployeeReClassificationMutation,
  useGetDemotionCountPerApprovalStatusQuery,
  useLazyGetDemotionCountPerApprovalStatusQuery,
  useUpdateEmployeeDemotionMutation,
  useUpdateEmployeePromotionMutation,
  useUpdateEmployeeReClassificationMutation,
  useUpdateSalaryIncrementMutation,
  useCreateTransferMutation,
  useApproveTransferMutation,
  useGetAllTransfersListQuery,
  useLazyGetAllTransfersListQuery,
  useGetEmployeeWithDetailsQuery,
  useLazyGetEmployeeWithDetailsQuery,
  useGetTransferCountPerStatusQuery,
  useLazyGetTransferCountPerStatusQuery,
  useGetTransferListForPaginationQuery,
  useLazyGetTransferListForPaginationQuery,
  useRejectTransferMutation,
  useSubmitTransferMutation,
  useUpdateTransferMutation,
  useApproveEmployeeWarningMutation,
  useGetEmployeeWarningCountPerStatusQuery,
  useLazyGetEmployeeWarningCountPerStatusQuery,
  useCreateEmployeeWarningMutation,
  useGetPaginatedEmployeeWarningsQuery,
  useLazyGetPaginatedEmployeeWarningsQuery,
  useRejectEmployeeWarningMutation,
  useSubmitEmployeeWarningMutation,
  useUpdateEmployeeWarningMutation,
  useApproveFieldOfStudyMutation,
  useGetFieldOfStudyCountPerStatusQuery,
  useLazyGetFieldOfStudyCountPerStatusQuery,
  useCreateFieldOfStudyMutation,
  useGetAllFieldOfStudyQuery,
  useLazyGetAllFieldOfStudyQuery,
  useGetFieldOfStudiesForPaginationQuery,
  useLazyGetFieldOfStudiesForPaginationQuery,
  useRejectFieldOfStudyMutation,
  useSearchAllFieldOfStudiesQuery,
  useLazySearchAllFieldOfStudiesQuery,
  useSubmitFieldOfStudyMutation,
  useUpdateFieldOfStudyMutation,
<<<<<<< HEAD
  useGetApiHealthQuery,
  useLazyGetApiHealthQuery,
  useCreateHearingMutation,
  useGetHearingByCaseIdQuery,
  useLazyGetHearingByCaseIdQuery,
  useUpdateHearingMutation,
=======
>>>>>>> origin/Solomon/v2
  useApproveInstitutionNameMutation,
  useGetInstitutionNameCountPerStatusQuery,
  useLazyGetInstitutionNameCountPerStatusQuery,
  useCreateInstitutionNameMutation,
  useGetAllInstitutionNameQuery,
  useLazyGetAllInstitutionNameQuery,
  useGetInstitutionNamesForPaginationQuery,
  useLazyGetInstitutionNamesForPaginationQuery,
  useRejectInstitutionNameMutation,
  useSearchAllInstitutionNamesQuery,
  useLazySearchAllInstitutionNamesQuery,
  useSubmitInstitutionNameMutation,
  useUpdateInstitutionNameMutation,
  useActivateJobRoleMutation,
  useActivateJobMutation,
  useAddJobMutation,
  useAddJobRoleMutation,
  useGetAllJobListQuery,
  useLazyGetAllJobListQuery,
  useGetAllJobRoleQuery,
  useLazyGetAllJobRoleQuery,
  useGetJobRolesListsQuery,
  useLazyGetJobRolesListsQuery,
  useApproveJobMutation,
  useApproveJobRoleMutation,
  useGetJobRolesCountPerApprovalStatusQuery,
  useLazyGetJobRolesCountPerApprovalStatusQuery,
  useDeactivateJobRoleMutation,
  useDeactivateJobMutation,
  useGetJobByBuIdQuery,
  useLazyGetJobByBuIdQuery,
  useGetJobForPaginationQuery,
  useLazyGetJobForPaginationQuery,
  useGetJobListByBusinessUnitAndJobRoleQuery,
  useLazyGetJobListByBusinessUnitAndJobRoleQuery,
  useGetJobRoleByIdQuery,
  useLazyGetJobRoleByIdQuery,
  useGetJobRoleforPromotionQuery,
  useLazyGetJobRoleforPromotionQuery,
  useGetJobCountPerStatusQuery,
  useLazyGetJobCountPerStatusQuery,
  useRejectJobMutation,
  useRejectJobRoleMutation,
  useSubmitJobMutation,
  useSubmitJobRolesMutation,
  useUpdateJobMutation,
  useUpdateJobRoleMutation,
  useActivateJobCategoryMutation,
  useApproveJobCatagoryMutation,
  useCreateJobCategoyMutation,
  useDeactivateJobCategoyMutation,
  useDeleteJobCategoryMutation,
  useGetAllJobCategoryQuery,
  useLazyGetAllJobCategoryQuery,
  useGetJobCategoriesListForPaginationQueryQuery,
  useLazyGetJobCategoriesListForPaginationQueryQuery,
  useGetJobCategoryByIdQuery,
  useLazyGetJobCategoryByIdQuery,
  useGetJobCategoryCountByApprovalStatusQuery,
  useLazyGetJobCategoryCountByApprovalStatusQuery,
  useGetJobCatagoryListQueryQuery,
  useLazyGetJobCatagoryListQueryQuery,
  useRejectJobCategoryMutation,
  useSubmitJobCategoryMutation,
  useUpdateJobCategoryMutation,
  useAddJobGradeMutation,
  useGetAllJobGradeQuery,
  useLazyGetAllJobGradeQuery,
  useApproveJobGradeMutation,
  useGetJobGradesCountPerApprovalStatusQuery,
  useLazyGetJobGradesCountPerApprovalStatusQuery,
  useGetJobGradeOfJobRoleQuery,
  useLazyGetJobGradeOfJobRoleQuery,
  useGetJobGradesListQuery,
  useLazyGetJobGradesListQuery,
  useGetSalaryOfEmployeeByRoleQuery,
  useLazyGetSalaryOfEmployeeByRoleQuery,
  useRejectJobGradeMutation,
  useSubmitJobGradeMutation,
  useUpdateJobGradeMutation,
  useApproveJobRoleCategoryMutation,
  useGetJobRoleCategoryCountPerStatusQuery,
  useLazyGetJobRoleCategoryCountPerStatusQuery,
  useCreateJobRoleCategoryMutation,
  useGetAllJobRoleCategoryQuery,
  useLazyGetAllJobRoleCategoryQuery,
  useGetJobRoleCategoriesForPaginationQuery,
  useLazyGetJobRoleCategoriesForPaginationQuery,
  useRejectJobRoleCategoryMutation,
  useSearchAllJobRoleCatagoriesQuery,
  useLazySearchAllJobRoleCatagoriesQuery,
  useSubmitJobRoleCategoryMutation,
  useUpdateJobRoleCategoryMutation,
  useCreateJudgeAssignmentMutation,
  useGetJudgeAssignmentsByCaseIdQuery,
  useLazyGetJudgeAssignmentsByCaseIdQuery,
  useUpdateJudgeAssignmentMutation,
  useCreateJudgmentMutation,
  useGetJudgmentsByCaseIdQuery,
  useLazyGetJudgmentsByCaseIdQuery,
  useUpdateJudgmentMutation,
  useCreateLanguageMutation,
  useDeleteLanguageSkillMutation,
  useGetLanguageSkillByIdQuery,
  useLazyGetLanguageSkillByIdQuery,
  useUpdateLanguageSkillMutation,
  useCreateLetterMutation,
  useUpdateLetterMutation,
  useAddLetterDocumentMutation,
  useApproveLetterMutation,
  useGetLetterCountPerStatusQuery,
  useLazyGetLetterCountPerStatusQuery,
  useCreateEditableLetterMutation,
  useGetLettersForPaginationQuery,
  useLazyGetLettersForPaginationQuery,
  useRejectLetterMutation,
  useSearchAllLettersQuery,
  useLazySearchAllLettersQuery,
  useSubmitLetterMutation,
  useGetAllLookupsQuery,
  useLazyGetAllLookupsQuery,
<<<<<<< HEAD
  useGetUserConversationsQuery,
  useLazyGetUserConversationsQuery,
  useMarkMessagesAsReadMutation,
  useGetMessagesQuery,
  useLazyGetMessagesQuery,
  useSendMessageMutation,
  useCreateNotificationMutation,
  useGetNotificationsByUserIdQuery,
  useLazyGetNotificationsByUserIdQuery,
  useUpdateNotificationMutation,
  useCreatePaymentMutation,
  useGetAllPaymentsQuery,
  useLazyGetAllPaymentsQuery,
  useGetPaymentsByBusinessUnitQuery,
  useLazyGetPaymentsByBusinessUnitQuery,
  useGetPaymentsByCaseIdQuery,
  useLazyGetPaymentsByCaseIdQuery,
  useGetByIdQuery,
  useLazyGetByIdQuery,
  useUpdatePaymentMutation,
=======
  useApproveReemploymentMutation,
  useCreateReemploymentMutation,
  useGetAllReemploymentsListQuery,
  useLazyGetAllReemploymentsListQuery,
  useGetReemploymentByIdQuery,
  useLazyGetReemploymentByIdQuery,
  useGetReemploymentCountPerStatusQuery,
  useLazyGetReemploymentCountPerStatusQuery,
  useGetReemploymentListForPaginationQuery,
  useLazyGetReemploymentListForPaginationQuery,
  useRejectReemploymentMutation,
  useSubmitReemploymentMutation,
  useUpdateReemploymentMutation,
>>>>>>> origin/Solomon/v2
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
  useApproveResignationMutation,
  useGetResignationCountPerStatusQuery,
  useLazyGetResignationCountPerStatusQuery,
  useCreateResignationMutation,
  useGetActiveResignationQuery,
  useLazyGetActiveResignationQuery,
  useGetPaginatedResignationsQuery,
  useLazyGetPaginatedResignationsQuery,
  useRejectResignationMutation,
  useSubmitResignationMutation,
  useUpdateResignationMutation,
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
  useApproveSuspensionMutation,
  useGetSuspensionCountPerStatusQuery,
  useLazyGetSuspensionCountPerStatusQuery,
  useCreateSuspensionMutation,
  useGetActiveSuspentionQuery,
  useLazyGetActiveSuspentionQuery,
  useGetPaginatedSuspensionsQuery,
  useLazyGetPaginatedSuspensionsQuery,
  useRejectSuspensionMutation,
  useSubmitSuspensionMutation,
  useUpdateSuspensionMutation,
  useAddUserPhotoMutation,
  useAddUserSignatureMutation,
  useCurrentUserInfoQuery,
  useLazyCurrentUserInfoQuery,
  useApproveBranchGradeMutation,
  useGetBranchGradeCountPerStatusQuery,
  useLazyGetBranchGradeCountPerStatusQuery,
  useGetAllBranchGradeListQuery,
  useLazyGetAllBranchGradeListQuery,
  useGetBranchGradeByDescriptionQuery,
  useLazyGetBranchGradeByDescriptionQuery,
  useGetBranchGradeForPaginationQuery,
  useLazyGetBranchGradeForPaginationQuery,
  useRejectBranchGradeMutation,
  useSubmitBranchGradeMutation,
  useUpdateBranchGradeMutation,
} = injectedRtkApi;
