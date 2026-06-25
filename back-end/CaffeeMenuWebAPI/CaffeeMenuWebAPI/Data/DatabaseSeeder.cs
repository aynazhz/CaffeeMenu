using CaffeeMenuWebAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace CaffeeMenuWebAPI.Data;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<CafeMenuDbContext>();

        await dbContext.Database.EnsureCreatedAsync();

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
}
