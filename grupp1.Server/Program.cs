using Vicaria.Server.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Vicaria.Server.Domain.Models;

namespace Vicaria.Server;

public class Program
{
    public static void Main(string[] args)
    {
        #region Build configuration

        var builder = WebApplication.CreateBuilder(args);

        builder.AddRedisClientBuilder("cache").WithOutputCache();

        builder.AddServiceDefaults();

        builder.Services.AddProblemDetails();
        builder.Services.AddOpenApi();

        builder.Services.AddControllers();
        builder.Services.AddAuthorization();
        builder.Services.AddAuthentication();
        builder.Services.AddHttpContextAccessor(); // Pre-setup to be able to access HTTP request/responses, e.g. see the cookies for current user

        builder.AddNpgsqlDbContext<VicariaDbContext>("database");

        // TODO: add CORS config here

        builder.Services
            .AddIdentityApiEndpoints<User>(options =>
            {
                options.User.RequireUniqueEmail = true;

                options.Password.RequiredLength = 8;
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireNonAlphanumeric = true;

                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(10);
                options.Lockout.MaxFailedAccessAttempts = 3;
            })
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<VicariaDbContext>()
            .AddDefaultTokenProviders();

        var app = builder.Build();

        #endregion
        #region Middleware setup
        app.UseExceptionHandler();

        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
        }

        var api = app.MapGroup("/api");

        app.UseAuthentication();
        app.UseAuthorization();
        api.MapIdentityApi<User>();

        app.MapControllers();
        app.Run();

        #endregion
    }
}
