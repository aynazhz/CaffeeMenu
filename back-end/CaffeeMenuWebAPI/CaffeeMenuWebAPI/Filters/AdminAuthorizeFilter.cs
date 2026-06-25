using CaffeeMenuWebAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace CaffeeMenuWebAPI.Filters;

public sealed class AdminAuthorizeFilter(AdminAuthService adminAuthService) : IAsyncAuthorizationFilter
{
    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var authorizationHeader = context.HttpContext.Request.Headers.Authorization.ToString();
        var isValid = await adminAuthService.IsTokenValidAsync(authorizationHeader);

        if (!isValid)
        {
            context.Result = new UnauthorizedObjectResult("Admin login is required.");
        }
    }
}
