using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using StackExchange.Redis;
using Vicaria.Server.Domain;
using Vicaria.Server.Domain.Models;
using Vicaria.Server.Infrastructure;

namespace grupp1.Server.Features.Auth.Register;

public class RegisterHandler(
    UserManager<User> userManager,
    ILogger<RegisterHandler> _logger
) : IHandler<RegisterQuery, RegisterResponse>
{
    public async Task<RegisterResponse> HandleAsync(
        RegisterQuery request,
        CancellationToken cancellationToken = default)
    {
        if (request.Role != VicariaUserRoles.Manager && request.Role != VicariaUserRoles.Substitute)
        {
            _logger.LogWarning("Failed to determine user Role: {Role}", request.Role);
            return RegisterResponse.Failure([new IdentityError
            {
                Code = "InvalidRole",
                Description = "Role must be either Manager or Substitute"
            }]);
        }

        var user = new User
        {
            UserName = request.Email,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = request.PhoneNumber
        };

        var createResult = await userManager.CreateAsync(user, request.Password);
        if (!createResult.Succeeded)
        {
            _logger.LogWarning("Failed to register user: {Errors}", createResult.Errors.ToList().ToString());
            return RegisterResponse.Failure(createResult.Errors);
        }

        var roleResult = await userManager.AddToRoleAsync(user, request.Role);
        if (!roleResult.Succeeded)
        {
            await userManager.DeleteAsync(user);
            _logger.LogWarning("Failed to register user role: {Errors}", createResult.Errors.ToList().ToString());
        }


        return RegisterResponse.Success();

    }
}