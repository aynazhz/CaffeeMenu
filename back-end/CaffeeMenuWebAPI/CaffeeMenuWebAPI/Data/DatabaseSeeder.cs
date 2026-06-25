using CaffeeMenuWebAPI.Models;
using CaffeeMenuWebAPI.Services;
using Microsoft.EntityFrameworkCore;

namespace CaffeeMenuWebAPI.Data;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<CafeMenuDbContext>();
        var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();

        await dbContext.Database.EnsureCreatedAsync();
        await EnsureAdminSchemaAsync(dbContext);
        await SeedAdminAsync(dbContext, configuration);

        if (await dbContext.MenuItems.AnyAsync())
        {
            return;
        }

        dbContext.MenuItems.AddRange(
            new MenuItem
            {
                Title = "\u0627\u0633\u067e\u0631\u0633\u0648",
                Price = "80,000",
                Category = "coffee",
                Image = "https://images.unsplash.com/photo-1511920170033-f8396924c348"
            },
            new MenuItem
            {
                Title = "\u0644\u0627\u062a\u0647",
                Price = "120,000",
                Category = "coffee",
                Image = "https://images.unsplash.com/photo-1509042239860-f550ce710b93"
            },
            new MenuItem
            {
                Title = "\u0686\u06cc\u0632\u06a9\u06cc\u06a9",
                Price = "150,000",
                Category = "dessert",
                Image = "https://images.unsplash.com/photo-1505253213348-8171d0f1f9c0"
            },
            new MenuItem
            {
                Title = "\u0645\u0648\u0647\u06cc\u062a\u0648",
                Price = "110,000",
                Category = "drink",
                Image = "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd"
            });

        await dbContext.SaveChangesAsync();
    }

    private static async Task EnsureAdminSchemaAsync(CafeMenuDbContext dbContext)
    {
        await dbContext.Database.ExecuteSqlRawAsync("""
            IF OBJECT_ID(N'[AdminUsers]', N'U') IS NULL
            BEGIN
                CREATE TABLE [AdminUsers] (
                    [Id] int NOT NULL IDENTITY,
                    [Username] nvarchar(80) NOT NULL,
                    [PasswordHash] nvarchar(200) NOT NULL,
                    [PasswordSalt] nvarchar(200) NOT NULL,
                    [CreatedAtUtc] datetime2 NOT NULL,
                    CONSTRAINT [PK_AdminUsers] PRIMARY KEY ([Id])
                );

                CREATE UNIQUE INDEX [IX_AdminUsers_Username] ON [AdminUsers] ([Username]);
            END;
            """);

        await dbContext.Database.ExecuteSqlRawAsync("""
            IF OBJECT_ID(N'[AdminSessions]', N'U') IS NULL
            BEGIN
                CREATE TABLE [AdminSessions] (
                    [Id] int NOT NULL IDENTITY,
                    [AdminUserId] int NOT NULL,
                    [TokenHash] nvarchar(200) NOT NULL,
                    [CreatedAtUtc] datetime2 NOT NULL,
                    [ExpiresAtUtc] datetime2 NOT NULL,
                    [RevokedAtUtc] datetime2 NULL,
                    CONSTRAINT [PK_AdminSessions] PRIMARY KEY ([Id]),
                    CONSTRAINT [FK_AdminSessions_AdminUsers_AdminUserId] FOREIGN KEY ([AdminUserId]) REFERENCES [AdminUsers] ([Id]) ON DELETE CASCADE
                );

                CREATE UNIQUE INDEX [IX_AdminSessions_TokenHash] ON [AdminSessions] ([TokenHash]);
                CREATE INDEX [IX_AdminSessions_AdminUserId] ON [AdminSessions] ([AdminUserId]);
            END;
            """);
    }

    private static async Task SeedAdminAsync(CafeMenuDbContext dbContext, IConfiguration configuration)
    {
        var username = configuration["Admin:Username"] ?? "admin";
        var password = configuration["Admin:Password"] ?? "admin123";
        var normalizedUsername = username.Trim().ToLowerInvariant();

        if (await dbContext.AdminUsers.AnyAsync(user => user.Username.ToLower() == normalizedUsername))
        {
            return;
        }

        var (hash, salt) = PasswordHasher.HashPassword(password);

        dbContext.AdminUsers.Add(new AdminUser
        {
            Username = username.Trim(),
            PasswordHash = hash,
            PasswordSalt = salt,
            CreatedAtUtc = DateTime.UtcNow
        });

        await dbContext.SaveChangesAsync();
    }
}
