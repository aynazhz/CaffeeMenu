using CaffeeMenuWebAPI.Filters;
using CaffeeMenuWebAPI.Models;
using CaffeeMenuWebAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace CaffeeMenuWebAPI.Controllers;

[ApiController]
[Route("api/admin/auth")]
public sealed class AdminAuthController(AdminAuthService adminAuthService) : ControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<AdminLoginResponse>> Login(AdminLoginRequest request)
    {
        var response = await adminAuthService.LoginAsync(request.Username, request.Password);

        return response is null ? Unauthorized("Invalid username or password.") : Ok(response);
    }

    [HttpPost("logout")]
    [ServiceFilter(typeof(AdminAuthorizeFilter))]
    public async Task<IActionResult> Logout()
    {
        await adminAuthService.LogoutAsync(Request.Headers.Authorization.ToString());

        return NoContent();
    }

    [HttpGet("me")]
    [ServiceFilter(typeof(AdminAuthorizeFilter))]
    public IActionResult Me()
    {
        return Ok(new { authenticated = true });
    }
}
