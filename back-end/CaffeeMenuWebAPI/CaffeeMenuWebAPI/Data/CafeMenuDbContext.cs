using CaffeeMenuWebAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace CaffeeMenuWebAPI.Data;

public sealed class CafeMenuDbContext(DbContextOptions<CafeMenuDbContext> options) : DbContext(options)
{
    public DbSet<MenuItem> MenuItems => Set<MenuItem>();

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
    }
}
