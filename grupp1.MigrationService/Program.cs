using grupp1.MigrationService;

var builder = Host.CreateApplicationBuilder(args);

builder.AddNpgsqlDbContext<Vica>("serverdb");

builder.Services.AddHostedService<Worker>();

var host = builder.Build();
host.Run();
