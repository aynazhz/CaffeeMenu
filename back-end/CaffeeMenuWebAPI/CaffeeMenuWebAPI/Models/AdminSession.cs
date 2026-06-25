namespace CaffeeMenuWebAPI.Models;

public sealed class AdminSession
{
    public int Id { get; set; }

    public int AdminUserId { get; set; }

    public AdminUser? AdminUser { get; set; }

    public string TokenHash { get; set; } = string.Empty;

    public DateTime CreatedAtUtc { get; set; }

    public DateTime ExpiresAtUtc { get; set; }

    public DateTime? RevokedAtUtc { get; set; }
}
