using System.Runtime.CompilerServices;
using Bogus;
using Bogus.DataSets;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using Vicaria.Server.Domain;
using Vicaria.Server.Domain.Models;
using Vicaria.Server.Infrastructure;

namespace Vicaria.MigrationService
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
                    logger.LogInformation("Starting to seed data");
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

        private async Task SeedDataAsync(VicariaDbContext dbContext, CancellationToken cancellationToken)
        {
            if (await dbContext.Users.AnyAsync())
            {
                logger.LogInformation("Database already seeded");
                return;
            }

            int randomSeed = 696969;
            int generateKindergartens = 10;

            Randomizer.Seed = new Random(randomSeed);
            var faker = new Faker("sv");

            var roleIds = await dbContext.Roles
                .ToDictionaryAsync(r => r.Name!, r => r.Id, cancellationToken);


            List<Kindergarten> kindergartens =
            [
                new() { Id = Guid.CreateVersion7(), Name = "Korven", Location = new Point(18.0763706, 59.2919783), Managers = [] },
                new() { Id = Guid.CreateVersion7(), Name = "Chas Academy", Location = new Point(18.0788231, 59.293051), Managers = [] },
                new() { Id = Guid.CreateVersion7(), Name = "Solrosen", Location = new Point(39.0292426, 125.6597113), Managers = [] },
                .. SeedFakers.CreateFakeKindergartens().Generate(generateKindergartens),
            ];

            //manuellt skapade
            var testManager = SeedFakers.CreateKnownFakeUser("Test", "Manager", "m.m@m.se", faker.Phone.PhoneNumber());
            var testSubstitute = SeedFakers.CreateKnownFakeUser("Test", "Vikarie", "s.s@s.se", faker.Phone.PhoneNumber());

            List<User> managers = [];
            managers.Add(testManager);
            managers.AddRange(SeedFakers.CreateFakeUsers().Generate(kindergartens.Count));


            List<User> substitutes = [];
            substitutes.Add(testSubstitute);
            substitutes.AddRange(SeedFakers.CreateFakeUsers().Generate(generateKindergartens));


            var managerRoles = managers
                .Select(u => new IdentityUserRole<Guid>
                {
                    UserId = u.Id,
                    RoleId = roleIds[VicariaUserRoles.Manager]
                })
                .ToList();

            var substituteRoles = substitutes
                .Select(u => new IdentityUserRole<Guid>
                {
                    UserId = u.Id,
                    RoleId = roleIds[VicariaUserRoles.Substitute]
                })
                .ToList();

            var generatedManagerKindergartens = kindergartens
                .Select((k, i) => new UserKinderGarten
                {
                    UserId = managers[i + 1].Id,
                    KindergartenId = k.Id
                })
                .ToList();

            string[] testKindergartenNames = ["Korven", "Chas Academy", "Solrosen"];

            var testManagerKindergartens = kindergartens //spefifikt för korven, chas academy and solrosen
                .Where(k => testKindergartenNames.Contains(k.Name))
                .Select(k => new UserKinderGarten
                {
                    UserId = testManager.Id,
                    KindergartenId = k.Id
                })
                .ToList();


            var availableTimes = SeedFakers.CreateFakeAvailableTimes(faker, substitutes, kindergartens);

            var decidedTimes = SeedFakers.CreateFakeDecidedTimes(faker, availableTimes);

            var pendingTimes = generatedManagerKindergartens
                .Concat(testManagerKindergartens)
                .SelectMany(uk => SeedFakers.CreateFakePendingTimes(
                    faker, uk.UserId, uk.KindergartenId, availableTimes, decidedTimes))
                .ToList();


            await using var transaction = await dbContext.Database //cus fuck it
                .BeginTransactionAsync(cancellationToken);

            dbContext.Kindergartens.AddRange(kindergartens);
            dbContext.Users.AddRange(managers);
            dbContext.Users.AddRange(substitutes);
            dbContext.UserRoles.AddRange(managerRoles);
            dbContext.UserRoles.AddRange(substituteRoles);
            dbContext.UserKinderGartens.AddRange(generatedManagerKindergartens);
            dbContext.UserKinderGartens.AddRange(testManagerKindergartens);
            dbContext.AvailableTimes.AddRange(availableTimes);
            dbContext.DecidedTimes.AddRange(decidedTimes);
            dbContext.PendingTimes.AddRange(pendingTimes);

            await dbContext.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);


        }
    }
}
