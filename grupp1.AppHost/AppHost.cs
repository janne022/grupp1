#pragma warning disable ASPIREPROCESSCOMMAND001
using System.Diagnostics;
using Microsoft.Extensions.Logging;
using Scalar.Aspire;

var builder = DistributedApplication.CreateBuilder(args);

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

var webfrontend = builder.AddViteApp("webfrontend", "../grupp1.Frontend")
    .WithReference(server)
    .WithCommand(
        name: "orval",
        displayName: "Generate API Client",
        executeCommand: async context =>
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

            var outputTask = process.StandardOutput.ReadToEndAsync(
                context.CancellationToken);
            var errorTask = process.StandardError.ReadToEndAsync(
                context.CancellationToken);

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
        })
    .WaitFor(server);

server.WithReference(webfrontend); // for CORS

var scalar = builder.AddScalarApiReference()
    .ExcludeFromManifest();

scalar.WithApiReference(server);

server.PublishWithContainerFiles(webfrontend, "wwwroot");

builder.Build().Run();
