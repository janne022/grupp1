using grupp1.MigrationService;
using Vicaria.Server.Infrastructure;

var builder = Host.CreateApplicationBuilder(args);

builder.Services.AddLogging();
builder.AddNpgsqlDbContext<VicariaDbContext>("database");

builder.Services.AddHostedService<Worker>();

var host = builder.Build();
host.Run();
