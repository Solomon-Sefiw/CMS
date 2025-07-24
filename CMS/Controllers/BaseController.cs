
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
        private ILogger<T> _logger;
        private UserDto? _currentUser;
        private UserManager<HRUser> _userManager;
        private RoleManager<HRRole> _roleManager;
        private IUserClaimsPrincipalFactory<HRUser> _userClaimsPrincipalFactory;
        private HttpContextAccessor _httpContextAccessor;
        private IAuthorizationService? _authorizationService;
        private UserManager<HRUser> userManager => _userManager ??=
            HttpContext.RequestServices.GetService<UserManager<HRUser>>();

        private RoleManager<HRRole> roleManager => _roleManager ??=
           HttpContext.RequestServices.GetService<RoleManager<HRRole>>();

        private IUserClaimsPrincipalFactory<HRUser> userClaimsPrincipalFactory => _userClaimsPrincipalFactory ??=
            HttpContext.RequestServices.GetService<IUserClaimsPrincipalFactory<HRUser>>();
        protected IMediator mediator => _mediator ??=
             HttpContext.RequestServices.GetService<IMediator>();
        protected ILogger<T> logger => _logger ??=
            HttpContext.RequestServices.GetService<ILogger<T>>();
        public static string ShortName => typeof(T).Name.Replace("Controller", "");
        protected HttpContextAccessor httpContextAccessor => _httpContextAccessor ??=
       HttpContext.RequestServices.GetService<HttpContextAccessor>();

        protected IAuthorizationService authorizationService => _authorizationService ??=
           HttpContext.RequestServices.GetService<IAuthorizationService>();
        //protected string GetDocumentUrl(string documentId)
        //{
        //    if (documentId == null) return null;

        //    return Url.Action(
        //        action: nameof(DocumentsController.Get),
        //        controller: DocumentsController.ShortName,
        //        values: new { Id = documentId.ToString() });
        //}
        protected string GetDocumentUrl(string documentId)
        {
            if (string.IsNullOrEmpty(documentId)) return null;

            var request = HttpContext.Request;
            var baseUrl = $"{request.Scheme}://{request.Host}";

            return $"{baseUrl}/api/documents/{documentId}";
        }

        public UserDto CurrentUser => _currentUser ??= GetCurrentUser();
        private UserDto GetCurrentUser()
        {
            if (httpContextAccessor.HttpContext.User.Identity.IsAuthenticated)
            {
                var claims = httpContextAccessor.HttpContext.User.Claims;
                if (claims != null)
                {
                    return new UserDto
                    {
                        Id = claims?.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value,
                        FirstName = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value,
                        MiddleName = claims?.FirstOrDefault(c => c.Type == "middle_name")?.Value,
                        LastName = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Surname)?.Value,
                        Email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value,
                        BranchId = Convert.ToInt16(claims?.FirstOrDefault(c => c.Type == "branch_Id")?.Value),
                    };
                }
            }
            return null;
        }
        protected string GetDocumentRootPath()
        {
            return Url.Action(
                action: nameof(DocumentsController.Get),
                controller: DocumentsController.ShortName,
                values: new { Id = string.Empty });
        }
        protected string GetCurrentUserId()
        {
            if (httpContextAccessor.HttpContext.User.Identity.IsAuthenticated)
            {
                var claims = httpContextAccessor.HttpContext.User.Claims;

                return claims?.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            }
            return null;
        }

        private async Task<Permission> HasPolicy(string policyName)
        {
            try
            {
                var result = await authorizationService.AuthorizeAsync(User, policyName);
                var claims = new Permission { Name = policyName, HasPermission = result.Succeeded };
                return claims;
            }
            catch (Exception)
            {
                return new Permission { Name = policyName, HasPermission = false };
            }
        }



    }



}
