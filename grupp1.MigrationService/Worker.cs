using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using Vicaria.Server.Domain.Models;
using Vicaria.Server.Infrastructure;

namespace grupp1.MigrationService
{
    public class Worker : BackgroundService
    {
        private readonly IServiceProvider serviceProvider;
        private readonly IHostApplicationLifetime hostLifetime;
        private readonly ILogger<Worker> logger;

        public Worker(IServiceProvider serviceProvider,
                IHostApplicationLifetime hostLifetime,
                ILogger<Worker> logger)
        {
            this.serviceProvider = serviceProvider;
            this.hostLifetime = hostLifetime;
            this.logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            logger.LogInformation("Starting database migration...");

            try
            {
                using var scope = serviceProvider.CreateScope();
                var dbContext = scope.ServiceProvider.GetRequiredService<VicariaDbContext>();

                var executionStrategy = dbContext.Database.CreateExecutionStrategy();

                await executionStrategy.ExecuteAsync(async () =>
                {
                    // Enable PostGIS extension if it is not already enabled
                    await dbContext.Database.ExecuteSqlRawAsync("CREATE EXTENSION IF NOT EXISTS postgis;", cancellationToken: stoppingToken);

                    // Apply migrations
                    await dbContext.Database.MigrateAsync(stoppingToken);

                    // Seed data
                    await SeedDataAsync(dbContext, stoppingToken);
                });

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

        private static async Task SeedDataAsync(
    VicariaDbContext dbContext, CancellationToken cancellationToken)
        {
            // Seed initial data for Kindergartens, new data can be added here as needed

            List<Kindergarten> kindergartens = new List<Kindergarten>
            {
                new Kindergarten { Name = "Solrosen", Location = new Point(39.0292426, 125.6597113) { SRID = 4326 } },
                new Kindergarten { Name = "Korven", Location = new Point(18.0763706, 59.2919783) { SRID = 4326 } },
                new Kindergarten { Name = "Chas Academy", Location = new Point(18.0788231, 59.293051) { SRID = 4326 } }
            };

            var existingKindergartens = (await dbContext.Kindergartens.Select(k => k.Name)
            .ToListAsync(cancellationToken))
            .ToHashSet();

            var newKindergartens = kindergartens
            .Where(k => !existingKindergartens
            .Contains(k.Name)).ToList();

            var strategy = dbContext.Database.CreateExecutionStrategy();
            await strategy.ExecuteAsync(async () =>
            {
                // Seed the database
                await using var transaction = await dbContext.Database
                    .BeginTransactionAsync(cancellationToken);
                await dbContext.Kindergartens.AddRangeAsync(newKindergartens, cancellationToken);
                await dbContext.SaveChangesAsync(cancellationToken);
                await transaction.CommitAsync(cancellationToken);
            });
        }
    }
}
