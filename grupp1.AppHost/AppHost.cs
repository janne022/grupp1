var builder = DistributedApplication.CreateBuilder(args);

var cache = builder.AddRedis("cache");

var postgres = builder.AddAzurePostgresFlexibleServer("databaseServer")
    .RunAsContainer(db => db.WithLifetime(ContainerLifetime.Persistent)
    .WithDataVolume()
    .WithPgAdmin());

var database = postgres.AddDatabase("database");

var server = builder.AddProject<Projects.grupp1_Server>("server")
    .WithReference(cache)
    .WaitFor(cache)
    .WithHttpHealthCheck("/health")
    .WithExternalHttpEndpoints()
    .WithReference(database)
    .WaitFor(database);

var webfrontend = builder.AddViteApp("webfrontend", "../frontend")
    .WithReference(server)
    .WaitFor(server);

server.PublishWithContainerFiles(webfrontend, "wwwroot");

builder.Build().Run();
