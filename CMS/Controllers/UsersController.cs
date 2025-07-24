using CMS.Api.Dtos;
using CMS.API.Controllers;
using CMS.Application;
using CMS.Application.Features.UserAccount.Commands.Documents;
using CMS.Domain.Enum;
using CMS.Domain.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : BaseController<UsersController>
    {
        private readonly IIdentityService identityService;
        private readonly UserManager<HRUser> userManager;
        private readonly RoleManager<HRRole> roleManager;
        public UsersController(IIdentityService identityService,UserManager<HRUser> userManager,
            RoleManager<HRRole> roleManager) : base()
        {
            this.identityService = identityService;
            this.userManager = userManager;
            this.roleManager = roleManager;
        }

        // [Authorize]
        //[HttpGet("current")]
        //[ProducesResponseType(StatusCodes.Status200OK)]
        //public async Task<ActionResult<UserDto>> CurrentUserInfo()
        //{
        //    var currentUserId = CurrentUser?.Id;

        //    if (string.IsNullOrEmpty(currentUserId))
        //        return Unauthorized();

        //    var user = await userManager.Users
        //        .Include(u => u.Roles)
        //        .Include(u => u.UserDocuments.Where(d => d.IsDeleted != true))
        //        .FirstOrDefaultAsync(u => u.Id == currentUserId);

        //    if (user == null)
        //        return NotFound("User not found");

        //    // Roles
        //    var userRoles = await userManager.GetRolesAsync(user);

        //    // Permissions from role claims
        //    var permissions = new List<Permission>();
        //    foreach (var roleName in userRoles)
        //    {
        //        var role = await roleManager.FindByNameAsync(roleName);
        //        if (role != null)
        //        {
        //            var roleClaims = await roleManager.GetClaimsAsync(role);
        //            foreach (var claim in roleClaims)
        //            {
        //                permissions.Add(new Permission
        //                {
        //                    Name = claim.Value,
        //                    HasPermission = true
        //                });
        //            }
        //        }
        //    }

        //    // Get PhotoId from UserDocuments
        //    var photoId = user.UserDocuments
        //        .Where(d => d.DocumentType == DocumentType.UserPhoto && d.IsDeleted != true)
        //        .Select(d => d.DocumentId)
        //        .FirstOrDefault();
        //    var signature = user.UserDocuments
        //            .Where(d => d.DocumentType == DocumentType.UserSignature && d.IsDeleted != true)
        //            .Select(d => d.DocumentId)
        //             .FirstOrDefault();

        //    // Construct full document URL using base controller method
        //    var photoUrl = GetDocumentUrl(photoId);

        //    // Return DTO
        //    var userDto = new UserDto
        //    {
        //        Id = user.Id,
        //        Email = user.Email,
        //        FirstName = user.FirstName,
        //        MiddleName = user.MiddleName,
        //        LastName = user.LastName,
        //        BranchId = user.BranchId,
        //        Roles = userRoles.ToList(),
        //        Permissions = permissions,
        //        PhotoId = photoId, 
        //        PhotoUrl = photoUrl,
        //        SignatureId = signature

        //    };

        //    return Ok(userDto);
        //}


        [Authorize]
        [HttpGet("current")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<UserDto>> CurrentUserInfo()
        {
            var currentUserId = CurrentUser?.Id;

            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized();

            var user = await userManager.Users
                .Include(u => u.Roles)
                .Include(u => u.UserDocuments.Where(d => d.IsDeleted != true))
                .FirstOrDefaultAsync(u => u.Id == currentUserId);

            if (user == null)
                return NotFound("User not found");

            var userRoles = await userManager.GetRolesAsync(user);

            var permissions = new List<Permission>();
            foreach (var roleName in userRoles)
            {
                var role = await roleManager.FindByNameAsync(roleName);
                if (role != null)
                {
                    var roleClaims = await roleManager.GetClaimsAsync(role);
                    foreach (var claim in roleClaims)
                    {
                        permissions.Add(new Permission
                        {
                            Name = claim.Value,
                            HasPermission = true
                        });
                    }
                }
            }

            var photoId = user.UserDocuments
                .Where(d => d.DocumentType == DocumentType.UserPhoto && d.IsDeleted != true)
                .Select(d => d.DocumentId)
                .FirstOrDefault();

            var signature = user.UserDocuments
                .Where(d => d.DocumentType == DocumentType.UserSignature && d.IsDeleted != true)
                .Select(d => d.DocumentId)
                .FirstOrDefault();

            var photoUrl = GetDocumentUrl(photoId);

            var userDto = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                MiddleName = user.MiddleName,
                LastName = user.LastName,
                BranchId = user.BranchId,
                Roles = userRoles.ToList(),
                Permissions = permissions,
                PhotoId = photoId,
                PhotoUrl = photoUrl,
                SignatureId = signature
            };

            return Ok(userDto);
        }


        [HttpPost("{id}/add-photo", Name = "AddUserPhoto")]
        [ProducesResponseType(200)]
        public async Task<DocumentMetadataDto> AddUserPhoto(string id, [FromForm] UploadDocumentDto document)
        {
            var command = new AddUserPhotoCommand(id, document.File);
            var doc = await mediator.Send(command);

            return new DocumentMetadataDto(GetDocumentUrl(doc.Id));
        }
        [HttpPost("{id}/add-signature", Name = "AddUserSignature")]  
        [ProducesResponseType(200)]
        public async Task<DocumentMetadataDto> AddUserSignature(string id, [FromForm] UploadDocumentDto document)
        {
            var command = new AddUserSignatureCommand(id, document.File);
            var doc = await mediator.Send(command);

            return new DocumentMetadataDto(GetDocumentUrl(doc.Id));
        }


    }
}
