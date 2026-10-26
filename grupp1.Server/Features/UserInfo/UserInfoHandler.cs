using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Vicaria.Server.Domain.Models;
using Vicaria.Server.Features.UserInfo.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.UserInfo;

public class UserInfoHandler(
    ILogger<UserInfoHandler> _logger,
    UserManager<User> userManager
) : IHandler<UserInfoQuery, UserInfoResponse?>
{

public async Task<UserInfoResponse?> HandleAsync(UserInfoQuery query, CancellationToken ct = default)
    {
        var user = await userManager.FindByIdAsync(query.UserId.ToString());

        if (user is null)
        {
            _logger.LogWarning("User {id} was found null in UserInfoHandler", query.UserId);
            return null;
        }

        if (user.PhoneNumber is null)
        {
            _logger.LogWarning("User {id} was found without phone number in UserInfoHandler", query.UserId);
            return null;
        }

        var roles = await userManager.GetRolesAsync(user);

        var response = new UserInfoResponse(
            user.Id,
            user.FirstName,
            user.LastName,
            user.Email,
            roles.ToList(),
            user.PhoneNumber
        );

        return response;
    }
}
