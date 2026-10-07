using Vicaria.Server.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Vicaria.Server.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Vicaria.Server;

public class Program
{
    public static void Main(string[] args)
    {
        #region Build configuration

        var builder = WebApplication.CreateBuilder(args);

        var frontendOrigin = builder.Configuration["WEBFRONTEND_HTTP"] ?? "";
        builder.AddRedisClientBuilder("cache").WithOutputCache();

        builder.AddServiceDefaults();

        builder.Services.AddProblemDetails();
        builder.Services.AddOpenApi();

        builder.Services.AddControllers();
        builder.Services.AddAuthorization();
        builder.Services.AddAuthentication();
        builder.Services.AddHttpContextAccessor(); // Pre-setup to be able to access HTTP request/responses, e.g. see the cookies for current user

        builder.AddNpgsqlDbContext<VicariaDbContext>("database", configureDbContextOptions: options =>
        {
            options.UseNpgsql(npgsqlOptions =>
            {
                npgsqlOptions.UseNetTopologySuite();
            });
        });

        builder.Services.AddCors(options =>
        {
            options.AddPolicy(name: "Frontend", configurePolicy: p =>
            {
                p.WithOrigins(frontendOrigin)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
            });
        });

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
            .AddRoles<IdentityRole<Guid>>()
            .AddEntityFrameworkStores<VicariaDbContext>()
            .AddDefaultTokenProviders();

        builder.Services.ConfigureApplicationCookie(option =>
        {
            option.Cookie.SameSite = SameSiteMode.None;
            option.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        });

        // Bootleg wolverine, scans for all handlers and registers them as scoped services
        var handlers = typeof(Program).Assembly
        .GetTypes()
        .Where(t => t.IsClass && !t.IsAbstract && t.Name.EndsWith("Handler"));

        foreach (var handler in handlers)
        {
            foreach (var intrface in handler.GetInterfaces())
            {
                builder.Services.AddScoped(@interface, handler);
            }
        }

        var app = builder.Build();

        // Add health check endpoints
        app.MapDefaultEndpoints();

        #endregion
        #region Middleware setup
        app.UseExceptionHandler();

        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
            app.UseCors(policyName: "Frontend");
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
