using grupp1.MigrationService;
using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Infrastructure;

var builder = Host.CreateApplicationBuilder(args);

builder.Services.AddLogging();

builder.AddNpgsqlDbContext<VicariaDbContext>("database", configureDbContextOptions: options =>
{
    options.UseNpgsql(npgsqlOptions =>
    {
        npgsqlOptions.UseNetTopologySuite();
    });
});

builder.Services.AddHostedService<Worker>();

var host = builder.Build();
host.Run();
