using CMS.Api.Dtos;
using CMS.Api.Filters;
using CMS.Domain.User;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CMS.API.Controllers
{
    [ApiController]
    [ServiceFilter(typeof(ApiExceptionFilterAttribute))]
    [Authorize]
    public class BaseController<T> : ControllerBase where T : BaseController<T>
    {
        private IMediator? _mediator;
        private ILogger<T>? _logger;
        private UserDto? _currentUser;
        private UserManager<HRUser>? _userManager;
        private RoleManager<HRRole>? _roleManager;
        private IUserClaimsPrincipalFactory<HRUser>? _userClaimsPrincipalFactory;
        private HttpContextAccessor? _httpContextAccessor;
        private IAuthorizationService? _authorizationService;

        protected UserManager<HRUser> userManager => _userManager ??= HttpContext.RequestServices.GetService<UserManager<HRUser>>()!;
        protected RoleManager<HRRole> roleManager => _roleManager ??= HttpContext.RequestServices.GetService<RoleManager<HRRole>>()!;
        protected IUserClaimsPrincipalFactory<HRUser> userClaimsPrincipalFactory => _userClaimsPrincipalFactory ??= HttpContext.RequestServices.GetService<IUserClaimsPrincipalFactory<HRUser>>()!;
        protected IMediator mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>()!;
        protected ILogger<T> logger => _logger ??= HttpContext.RequestServices.GetService<ILogger<T>>()!;
        protected HttpContextAccessor httpContextAccessor => _httpContextAccessor ??= HttpContext.RequestServices.GetService<HttpContextAccessor>()!;
        protected IAuthorizationService authorizationService => _authorizationService ??= HttpContext.RequestServices.GetService<IAuthorizationService>()!;

        public static string ShortName => typeof(T).Name.Replace("Controller", "");

        protected string GetDocumentUrl(string documentId)
        {
            if (documentId == null) return null!;
            return Url.Action(nameof(DocumentsController.Get), DocumentsController.ShortName, new { Id = documentId })!;
        }

        public UserDto CurrentUser => _currentUser ??= GetCurrentUser();

        private UserDto GetCurrentUser()
        {
            if (httpContextAccessor.HttpContext?.User.Identity?.IsAuthenticated == true)
            {
                var claims = httpContextAccessor.HttpContext.User.Claims;
                return new UserDto
                {
                    Id = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value,
                    FirstName = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value,
                    MiddleName = claims.FirstOrDefault(c => c.Type == "middle_name")?.Value,
                    LastName = claims.FirstOrDefault(c => c.Type == ClaimTypes.Surname)?.Value,
                    Email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value,
                    BranchId = Convert.ToInt16(claims.FirstOrDefault(c => c.Type == "branch_Id")?.Value)
                };
            }
            return null!;
        }

        protected string GetDocumentRootPath()
        {
            return Url.Action(nameof(DocumentsController.Get), DocumentsController.ShortName, new { Id = string.Empty })!;
        }

        protected string GetCurrentUserId()
        {
            return httpContextAccessor.HttpContext?.User.Identity?.IsAuthenticated == true
                ? httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value
                : null!;
        }

        protected async Task<Permission> HasPolicy(string policyName)
        {
            try
            {
                var result = await authorizationService.AuthorizeAsync(User, policyName);
                return new Permission { Name = policyName, HasPermission = result.Succeeded };
            }
            catch
            {
                return new Permission { Name = policyName, HasPermission = false };
            }
        }
    }
}