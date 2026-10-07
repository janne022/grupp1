using Scalar.Aspire;

var builder = DistributedApplication.CreateBuilder(args);

var cache = builder.AddAzureManagedRedis("cache")
    .RunAsContainer();

var postgres = builder.AddAzurePostgresFlexibleServer("databaseServer")
    .RunAsContainer(db => db.WithLifetime(ContainerLifetime.Persistent)
    .WithImage("postgis/postgis")
    .WithDataVolume()
    .WithPgAdmin());

var database = postgres.AddDatabase("database");

var migrationService = builder.AddProject<Projects.grupp1_MigrationService>("migrationservice")
    .WithReference(database)
    .WaitFor(database);

var server = builder.AddProject<Projects.grupp1_Server>("server")
    .WithReference(cache)
    .WaitFor(cache)
    .WithHttpHealthCheck("/health")
    .WithExternalHttpEndpoints()
    .WithReference(database)
    .WaitFor(migrationService)
    .WaitFor(database);

var webfrontend = builder.AddViteApp("webfrontend", "../grupp1.Frontend")
    .WithReference(server)
    .WaitFor(server);

server.WithReference(webfrontend); // for CORS

var scalar = builder.AddScalarApiReference()
    .ExcludeFromManifest();

scalar.WithApiReference(server);

server.PublishWithContainerFiles(webfrontend, "wwwroot");

builder.Build().Run();
