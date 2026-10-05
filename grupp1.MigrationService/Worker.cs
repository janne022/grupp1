using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Infrastructure;

namespace grupp1.MigrationService;

public class Worker(IServiceProvider serviceProvider,
        IHostApplicationLifetime hostLifetime,
        ILogger<Worker> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation("Starting database migration...");

        try
        {
            using var scope = serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<VicariaDbContext>();

            await dbContext.Database.MigrateAsync(stoppingToken);

            logger.LogInformation("Migration successful.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while migrating the database.");
            Environment.ExitCode = 1;
        }
        finally
        {
            hostLifetime.StopApplication();
        }
    }
}
