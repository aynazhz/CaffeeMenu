using System.Security.Cryptography;
using System.Text;
using CaffeeMenuWebAPI.Data;
using CaffeeMenuWebAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace CaffeeMenuWebAPI.Services;

public sealed class AdminAuthService(CafeMenuDbContext dbContext, IConfiguration configuration)
{
    public async Task<AdminLoginResponse?> LoginAsync(string username, string password)
    {
        var normalizedUsername = username.Trim().ToLowerInvariant();
        var admin = await dbContext.AdminUsers.FirstOrDefaultAsync(user => user.Username.ToLower() == normalizedUsername);

        if (admin is null || !PasswordHasher.VerifyPassword(password, admin.PasswordHash, admin.PasswordSalt))
        {
            return null;
        }

        var token = CreateToken();
        var expiresAtUtc = DateTime.UtcNow.AddHours(GetSessionHours());

        dbContext.AdminSessions.Add(new AdminSession
        {
            AdminUserId = admin.Id,
            TokenHash = HashToken(token),
            CreatedAtUtc = DateTime.UtcNow,
            ExpiresAtUtc = expiresAtUtc
        });

        await dbContext.SaveChangesAsync();

        return new AdminLoginResponse
        {
            Token = token,
            ExpiresAtUtc = expiresAtUtc,
            Username = admin.Username
        };
    }

    public async Task<bool> IsTokenValidAsync(string? authorizationHeader)
    {
        var token = ExtractBearerToken(authorizationHeader);

        if (string.IsNullOrWhiteSpace(token))
        {
            return false;
        }

        var tokenHash = HashToken(token);
        var now = DateTime.UtcNow;

        return await dbContext.AdminSessions.AnyAsync(session =>
            session.TokenHash == tokenHash &&
            session.RevokedAtUtc == null &&
            session.ExpiresAtUtc > now);
    }

    public async Task LogoutAsync(string? authorizationHeader)
    {
        var token = ExtractBearerToken(authorizationHeader);

        if (string.IsNullOrWhiteSpace(token))
        {
            return;
        }

        var tokenHash = HashToken(token);
        var session = await dbContext.AdminSessions.FirstOrDefaultAsync(currentSession =>
            currentSession.TokenHash == tokenHash &&
            currentSession.RevokedAtUtc == null);

        if (session is null)
        {
            return;
        }

        session.RevokedAtUtc = DateTime.UtcNow;
        await dbContext.SaveChangesAsync();
    }

    private int GetSessionHours()
    {
        return configuration.GetValue("Admin:SessionHours", 8);
    }

    private static string CreateToken()
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(48));
    }

    private static string HashToken(string token)
    {
        var hash = SHA256.HashData(Encoding.UTF8.GetBytes(token));

        return Convert.ToBase64String(hash);
    }

    private static string? ExtractBearerToken(string? authorizationHeader)
    {
        const string prefix = "Bearer ";

        if (string.IsNullOrWhiteSpace(authorizationHeader) ||
            !authorizationHeader.StartsWith(prefix, StringComparison.OrdinalIgnoreCase))
        {
            return null;
        }

        return authorizationHeader[prefix.Length..].Trim();
    }
}
