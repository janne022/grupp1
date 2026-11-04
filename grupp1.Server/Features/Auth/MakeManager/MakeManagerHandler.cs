using Microsoft.AspNetCore.Identity;
using Vicaria.Server.Domain;
using Vicaria.Server.Domain.Models;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.Auth.MakeManager;

public class MakeManagerHandler(
    UserManager<User> userManager,
    ILogger<MakeManagerHandler> _logger
) : IHandler<MakeManagerQuery, MakeManagerResponse>
{
    public async Task<MakeManagerResponse> HandleAsync(
        MakeManagerQuery request,
        CancellationToken cancellationToken = default)
    {
        var user = await userManager.GetUserAsync(request.User);
        if (user == null)
        {
            _logger.LogWarning("Could not find the logged in user");
            return new MakeManagerResponse(false, "User was not found");
        }

        if (await userManager.IsInRoleAsync(user, VicariaUserRoles.Manager))
        {
            return new MakeManagerResponse(true, "User is already a Manager");
        }

        var roleResult = await userManager.AddToRoleAsync(user, VicariaUserRoles.Manager);
        if (!roleResult.Succeeded)
        {
            _logger.LogWarning("Failed to add Manager role to user: {UserId}", user.Id);
            return new MakeManagerResponse(false, "Failed to add Manager role");
        }

        _logger.LogInformation("Added Manager role to user: {UserId}", user.Id);
        return new MakeManagerResponse(true, "User is now a Manager");
    }
}
