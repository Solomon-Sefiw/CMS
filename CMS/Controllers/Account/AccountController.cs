using CMS.Api.Dtos;
using CMS.API.Controllers;
using CMS.Application;
using CMS.Application.Security;
using CMS.Domain.Enum;
using CMS.Domain.User;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security.Claims;
using Claim = System.Security.Claims.Claim;

namespace CMS.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountController : BaseController<AccountController>
{
    private readonly UserManager<HRUser> _userManager;
    private readonly SignInManager<HRUser> _signInManager;
    private readonly RoleManager<HRRole> _roleManager;
    private readonly IConfiguration _configuration;

    public AccountController(
        UserManager<HRUser> userManager,
        SignInManager<HRUser> signInManager,
        RoleManager<HRRole> roleManager,
        IConfiguration configuration) : base()
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _roleManager = roleManager;
        _configuration = configuration;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<LoginRes>> Login([FromBody] LoginDto loginDto)
    {
        var user = await _userManager.FindByEmailAsync(loginDto.Email);

        if (user == null)
        {
            logger.LogWarning("Login attempt failed - User not found for email: {Email}", loginDto.Email);
            return BadRequest("Invalid login attempt");
        }

        if (user.IsDeactivated || IsLockedOut(user))
        {
            logger.LogWarning("Login attempt failed - User {Email} is deactivated or locked out", loginDto.Email);
            return BadRequest(new LoginRes(false, false, true));
        }

        var result = await _signInManager.PasswordSignInAsync(
            loginDto.Email,
            loginDto.Password,
            isPersistent: false,
            lockoutOnFailure: true);

        if (result.RequiresTwoFactor)
        {
            logger.LogInformation("2FA required for user {Email}", loginDto.Email);

            // Clear any existing session and prepare for 2FA
            await _signInManager.SignOutAsync();
            await _userManager.UpdateSecurityStampAsync(user);

            // Generate token
            var token = await _userManager.GenerateTwoFactorTokenAsync(user, "Email");
            logger.LogDebug("Generated 2FA token for {Email}: {Token}", user.Email, token);

            // Store 2FA context in a cookie
            var principal = await StoreTwoFactorInfo(user.Id, TokenOptions.DefaultEmailProvider);
            await HttpContext.SignInAsync(IdentityConstants.TwoFactorUserIdScheme, principal);

            // Send email with token
            await mediator.Send(new CreateEmailNotificationCommand()
            {
                Notification = new EmailNotification()
                {
                    ToEmail = user.Email,
                    ToName = $"{user.FirstName} {user.MiddleName} {user.LastName}",
                    EmailType = EmailTypeEnum.AuthenticationCode,
                    Subject = "Sign in Verification Code",
                    Model = new
                    {
                        Name = $"{user.FirstName} {user.MiddleName} {user.LastName}",
                        Code = token
                    }
                }
            });

            return BadRequest(new LoginRes(false, true, false));
        }

        if (!result.Succeeded)
        {
            if (result.IsLockedOut)
            {
                logger.LogWarning("User {Email} is locked out", loginDto.Email);
                return BadRequest(new LoginRes(false, false, true));
            }

            logger.LogWarning("Login failed for user {Email}", loginDto.Email);
            return BadRequest(new LoginRes(false));
        }

        await SignInAsync(user);
        logger.LogInformation("User {Email} logged in successfully", loginDto.Email);
        return Ok(new LoginRes(true));
    }

    [AllowAnonymous]
    [HttpPost("verification-code")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<LoginRes>> VerificationCode([FromBody] VerificationCode verificationCode)
    {
        logger.LogInformation("Verification code attempt with code: {Code}", verificationCode?.Code);

        if (string.IsNullOrWhiteSpace(verificationCode?.Code))
        {
            logger.LogWarning("Empty verification code received");
            return BadRequest("Verification code is required");
        }

        // Retrieve the verification info from the 2FA cookie
        var twoFactorInfo = await HttpContext.AuthenticateAsync(IdentityConstants.TwoFactorUserIdScheme);
        if (!twoFactorInfo.Succeeded || twoFactorInfo.Principal == null)
        {
            logger.LogWarning("No valid two-factor authentication context found");
            return BadRequest("Invalid verification attempt");
        }

        var userId = twoFactorInfo.Principal.FindFirstValue(ClaimTypes.Name);
        var provider = twoFactorInfo.Principal.FindFirstValue("Provider");

        if (string.IsNullOrEmpty(userId))
        {
            logger.LogWarning("User ID not found in two-factor cookie");
            return BadRequest("Invalid verification attempt");
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            logger.LogWarning("User not found for ID: {UserId}", userId);
            return BadRequest("Invalid verification attempt");
        }

        logger.LogInformation("Attempting verification for user: {UserId} ({Email})",
            user.Id, user.Email);

        // Verify the code
        var result = await _signInManager.TwoFactorSignInAsync(
            provider ?? TokenOptions.DefaultEmailProvider,
            verificationCode.Code,
            isPersistent: false,
            rememberClient: false);

        logger.LogInformation("TwoFactorSignInAsync result - Succeeded: {Succeeded}, IsLockedOut: {IsLockedOut}",
            result.Succeeded, result.IsLockedOut);

        if (result.Succeeded)
        {
            logger.LogInformation("2FA successful for user {UserId}", user.Id);
            //await SignInAsync(user);

            //// Clear the two-factor cookie after successful login
            //await HttpContext.SignOutAsync(IdentityConstants.TwoFactorUserIdScheme);

            return Ok(new LoginRes(true));
        }

        if (result.IsLockedOut)
        {
            logger.LogWarning("User {UserId} is locked out after failed 2FA attempt", user.Id);
            return BadRequest(new LoginRes(false, false, true));
        }

        logger.LogWarning("2FA failed for user {UserId}", user.Id);
        return BadRequest(new LoginRes(false, true, false));
    }

    [HttpPost("logout")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        logger.LogInformation("User logged out");
        return Ok();
    }

    [AllowAnonymous]
    [HttpPost("forgot-password")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordPayload payload)
    {
        if (string.IsNullOrWhiteSpace(payload.email?.Trim()))
            return BadRequest("Email is required");

        var email = payload.email.Trim();
        var user = await _userManager.FindByEmailAsync(email);

        if (user == null || IsLockedOut(user))
            return BadRequest();

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var encodedToken = WebUtility.UrlEncode(token);

        var clientAppUrl = new UriBuilder(_configuration["AppUrl"])
        {
            Path = "forgot-password",
            Query = $"token={encodedToken}&email={WebUtility.UrlEncode(user.Email)}"
        };

        await mediator.Send(new CreateEmailNotificationCommand()
        {
            Notification = new EmailNotification()
            {
                ToEmail = user.Email,
                ToName = $"{user.FirstName} {user.MiddleName} {user.LastName}",
                EmailType = EmailTypeEnum.ForgotPassword,
                Subject = "Forgot Password",
                Model = new
                {
                    Name = $"{user.FirstName} {user.MiddleName} {user.LastName}",
                    Url = clientAppUrl.Uri.AbsoluteUri
                }
            }
        });

        return Ok();
    }

    [HttpPost("reset-password")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordPayload payload)
    {
        var email = payload.Email?.Trim();
        var token = payload.Token?.Trim();

        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(token))
            return BadRequest("Invalid request");

        var user = await _userManager.FindByEmailAsync(email);
        if (user == null || IsLockedOut(user))
            return BadRequest("Invalid request");

        var result = await _userManager.ResetPasswordAsync(user, token, payload.Password);
        if (!result.Succeeded)
        {
            var errors = result.Errors.ToDictionary(e => e.Code, e => e.Description);
            return BadRequest(errors);
        }

        return Ok();
    }

    [HttpPost("change-password")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordPayload payload)
    {
        var currentUserId = GetCurrentUserId();
        if (string.IsNullOrWhiteSpace(currentUserId))
            return BadRequest("Error occurred");

        var user = await _userManager.FindByIdAsync(currentUserId);
        if (user == null)
            return BadRequest("Error occurred");

        var result = await _userManager.ChangePasswordAsync(user, payload.CurrentPassword, payload.NewPassword);
        if (!result.Succeeded)
        {
            var errors = result.Errors.ToDictionary(e => e.Code, e => e.Description);
            return BadRequest(errors);
        }

        await mediator.Send(new CreateEmailNotificationCommand()
        {
            Notification = new EmailNotification()
            {
                ToEmail = user.Email,
                ToName = $"{user.FirstName} {user.MiddleName} {user.LastName}",
                EmailType = EmailTypeEnum.PasswordChanged,
                Subject = "Your password was changed",
                Model = new { Name = $"{user.FirstName} {user.MiddleName} {user.LastName}" }
            }
        });

        return Ok();
    }

    [HttpPost("deactivate-user")]
    [Authorize(Policy = AuthPolicy.User.canDisableUser)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeactivateUser([FromBody] UserEmail payload)
    {
        if (string.IsNullOrWhiteSpace(payload.Email))
            return BadRequest("Email is required");

        var user = await _userManager.FindByEmailAsync(payload.Email);
        if (user == null)
            return BadRequest("User not found");

        user.IsDeactivated = true;
        user.LockoutEnd = DateTimeOffset.MaxValue;
        await _userManager.UpdateAsync(user);

        return Ok();
    }

    [HttpPost("activate-user")]
    [Authorize(Policy = AuthPolicy.User.canEnableUser)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ActivateUser([FromBody] UserEmail payload)
    {
        if (string.IsNullOrWhiteSpace(payload.Email))
            return BadRequest("Email is required");

        var user = await _userManager.FindByEmailAsync(payload.Email);
        if (user == null)
            return BadRequest("User not found");

        user.IsDeactivated = false;
        user.LockoutEnd = null;
        await _userManager.UpdateAsync(user);

        return Ok();
    }

    private async Task SignInAsync(HRUser user)
    {
        var claims = (await _userManager.GetClaimsAsync(user))?.ToList();
        var roles = await _userManager.GetRolesAsync(user);

        foreach (var roleName in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, roleName));
            var role = await _roleManager.FindByNameAsync(roleName);
            if (role != null)
                claims.AddRange(await _roleManager.GetClaimsAsync(role));
        }

        var authProperties = new AuthenticationProperties
        {
            AllowRefresh = true,
            IsPersistent = true,
            IssuedUtc = DateTimeOffset.UtcNow,
            ExpiresUtc = DateTimeOffset.UtcNow.AddHours(8)
        };

        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            new ClaimsPrincipal(GetClaimIdentity(user, claims ?? new List<Claim>())),
            authProperties);

        logger.LogInformation("User {Email} logged in successfully", user.Email);
    }

    private ClaimsIdentity GetClaimIdentity(HRUser user, List<Claim> userClaims)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Name, user.FirstName ?? ""),
            new Claim("middle_name", user.MiddleName ?? ""),
            new Claim(ClaimTypes.Surname, user.LastName ?? ""),
            new Claim(ClaimTypes.Email, user.Email ?? ""),
            new Claim("branch_Id", user.BranchId.ToString())
        };

        if (userClaims?.Count > 0)
        {
            claims.AddRange(userClaims);
        }

        return new ClaimsIdentity(
            claims,
            CookieAuthenticationDefaults.AuthenticationScheme,
            ClaimTypes.Name,
            ClaimTypes.Role);
    }

    private async Task<ClaimsPrincipal> StoreTwoFactorInfo(string userId, string provider)
    {
        var identity = new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.Name, userId),
            new Claim("Provider", provider)
        }, IdentityConstants.TwoFactorUserIdScheme);

        return new ClaimsPrincipal(identity);
    }

    private bool IsLockedOut(HRUser user) =>
        user.IsDeactivated || (user.LockoutEnd != null && user.LockoutEnd >= DateTimeOffset.UtcNow);
}