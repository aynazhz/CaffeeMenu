using CaffeeMenuWebAPI.Data;
using CaffeeMenuWebAPI.Filters;
using CaffeeMenuWebAPI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

namespace CaffeeMenuWebAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Logging.ClearProviders();
            builder.Logging.AddConsole();

            var connectionString = builder.Configuration.GetConnectionString("CafeMenuDatabase")
                ?? throw new InvalidOperationException("Connection string 'CafeMenuDatabase' was not found.");

            builder.Services.AddDbContext<CafeMenuDbContext>(options =>
                options.UseSqlServer(connectionString, sqlServerOptions =>
                    sqlServerOptions.EnableRetryOnFailure()));
            builder.Services.AddScoped<AdminAuthService>();
            builder.Services.AddScoped<AdminAuthorizeFilter>();

            builder.Services.AddControllers();
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("Frontend", policy =>
                {
                    policy
                        .WithOrigins(
                            "http://localhost:5173",
                            "https://localhost:5173",
                            "http://127.0.0.1:5173",
                            "http://localhost:5174",
                            "http://127.0.0.1:5174")
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            DatabaseSeeder.SeedAsync(app.Services).GetAwaiter().GetResult();

            var uploadRoot = Path.Combine(app.Environment.ContentRootPath, "wwwroot", "uploads");
            Directory.CreateDirectory(uploadRoot);

            app.UseCors("Frontend");
            app.UseStaticFiles();
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(uploadRoot),
                RequestPath = "/uploads"
            });
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
