using CaffeeMenuWebAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace CaffeeMenuWebAPI.Data;

public sealed class CafeMenuDbContext(DbContextOptions<CafeMenuDbContext> options) : DbContext(options)
{
    public DbSet<MenuItem> MenuItems => Set<MenuItem>();

    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();

    public DbSet<AdminSession> AdminSessions => Set<AdminSession>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<MenuItem>(entity =>
        {
            entity.ToTable("MenuItems");
            entity.HasKey(item => item.Id);
            entity.Property(item => item.Title).HasMaxLength(120).IsRequired();
            entity.Property(item => item.Price).HasMaxLength(30).IsRequired();
            entity.Property(item => item.Category).HasMaxLength(50).IsRequired();
            entity.Property(item => item.Image).HasMaxLength(500).IsRequired();
        });

        modelBuilder.Entity<AdminUser>(entity =>
        {
            entity.ToTable("AdminUsers");
            entity.HasKey(user => user.Id);
            entity.HasIndex(user => user.Username).IsUnique();
            entity.Property(user => user.Username).HasMaxLength(80).IsRequired();
            entity.Property(user => user.PasswordHash).HasMaxLength(200).IsRequired();
            entity.Property(user => user.PasswordSalt).HasMaxLength(200).IsRequired();
            entity.Property(user => user.CreatedAtUtc).IsRequired();
        });

        modelBuilder.Entity<AdminSession>(entity =>
        {
            entity.ToTable("AdminSessions");
            entity.HasKey(session => session.Id);
            entity.HasIndex(session => session.TokenHash).IsUnique();
            entity.Property(session => session.TokenHash).HasMaxLength(200).IsRequired();
            entity.Property(session => session.CreatedAtUtc).IsRequired();
            entity.Property(session => session.ExpiresAtUtc).IsRequired();
            entity.HasOne(session => session.AdminUser)
                .WithMany()
                .HasForeignKey(session => session.AdminUserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
