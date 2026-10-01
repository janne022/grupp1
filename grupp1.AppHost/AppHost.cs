using Scalar.Aspire;

var builder = DistributedApplication.CreateBuilder(args);
builder.Eventing.Subscribe<ResourceEndpointsAllocatedEvent>((@event, ct) =>
{
    foreach (var ep in @event.Resource.Annotations.OfType<EndpointAnnotation>())
    {
        if (ep.AllocatedEndpoint is { Address: "localhost" } alloc)
        {
            ep.AllocatedEndpoint = new AllocatedEndpoint(ep, "127.0.0.1", alloc.Port, alloc.BindingMode, alloc.TargetPortExpression, alloc.NetworkID);
        }
    }
    return Task.CompletedTask;
});
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

var webfrontend = builder.AddViteApp("webfrontend", "../grupp1.Frontend")
    .WithReference(server)
    .WaitFor(server);

var scalar = builder.AddScalarApiReference()
    .ExcludeFromManifest();

scalar.WithApiReference(server);

server.PublishWithContainerFiles(webfrontend, "wwwroot");

builder.Build().Run();
