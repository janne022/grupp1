#pragma warning disable ASPIREPROCESSCOMMAND001
#pragma warning disable ASPIREPROCESSCOMMAND001 // to let us use AsExpress()
#pragma warning disable ASPIREACAEXPRESS001 // to let us use AsExpress()
using System.Diagnostics;
using Microsoft.Extensions.Logging;
using Scalar.Aspire;

var builder = DistributedApplication.CreateBuilder(args);

builder.AddAzureContainerAppEnvironment("vicaria-env").AsExpress();

var frontendDirectory = Path.GetFullPath(
    Path.Combine(builder.AppHostDirectory, "../grupp1.Frontend")
);

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

var webfrontend = builder.AddViteApp("webfrontend", "../grupp1.Frontend");

server.PublishWithContainerFiles(webfrontend, "wwwroot");

if (builder.ExecutionContext.IsRunMode)
{
    webfrontend
        .WithReference(server)
        .WithEnvironment("VITE_API_BASE_URL", server.GetEndpoint("https"))
        .WaitFor(server)
        .WithCommand(
            name: "orval",
            displayName: "Generate API Client",
            executeCommand: context => RunOrvalAsync(context, frontendDirectory));

    var mailpit = builder.AddMailPit("mailpit").ExcludeFromManifest();

    server
        .WithReference(webfrontend) // for CORS
        .WithEnvironment(
            "FRONTEND_PORT",
            webfrontend.GetEndpoint("http").Property(EndpointProperty.Port))
            .WithReference(mailpit)
    ;

    builder.AddScalarApiReference()
        .WithApiReference(server);


}

builder.Build().Run();

// Helper method for Orval
static async Task<ExecuteCommandResult> RunOrvalAsync(
    ExecuteCommandContext context, string frontendDirectory)
{
    var isWindows = OperatingSystem.IsWindows();

    var startInfo = new ProcessStartInfo
    {
        FileName = isWindows ? "cmd.exe" : "npm",
        WorkingDirectory = frontendDirectory,
        UseShellExecute = false,
        RedirectStandardOutput = true,
        RedirectStandardError = true
    };

    if (isWindows)
    {
        startInfo.ArgumentList.Add("/d");
        startInfo.ArgumentList.Add("/c");
        startInfo.ArgumentList.Add("npm");
    }

    startInfo.ArgumentList.Add("run");
    startInfo.ArgumentList.Add("generate:api");

    using var process = Process.Start(startInfo)!;

    var outputTask = process.StandardOutput.ReadToEndAsync(context.CancellationToken);
    var errorTask = process.StandardError.ReadToEndAsync(context.CancellationToken);

    try
    {
        await process.WaitForExitAsync(context.CancellationToken);
    }
    catch (OperationCanceledException)
    {
        if (!process.HasExited)
            process.Kill(entireProcessTree: true);

        return CommandResults.Failure("Orval generation cancelled.");
    }

    var output = await outputTask;
    var error = await errorTask;

    if (!string.IsNullOrWhiteSpace(output))
        context.Logger.LogInformation("{Output}", output);

    if (!string.IsNullOrWhiteSpace(error))
        context.Logger.LogWarning("{Error}", error);

    return process.ExitCode == 0
        ? CommandResults.Success("API client generated successfully.")
        : CommandResults.Failure("Orval generation failed.");
}