using ErrorOr;
using Microsoft.AspNetCore.Identity;
using Vicaria.Server.Domain.Models;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.Auth.ResetPassword
{
    public class ResetPasswordHandler(UserManager<User> userManager, ILogger<ResetPasswordHandler> logger) : IHandler<ResetPasswordCommand, ErrorOr<Success>>
    {
        public async Task<ErrorOr<Success>> HandleAsync(ResetPasswordCommand command, CancellationToken cancellationToken)
        {

            var user = await userManager.FindByIdAsync(command.UserId.ToString());

            if (user is null)
            {
                logger.LogWarning("user {userId} is null", command.UserId);
                return Error.Validation("Auth.LinkNotValid", "Länken är ogiltig eller har gått ut.");
            }

            var result = await userManager.ResetPasswordAsync(user, command.Token, command.NewPassword);

            if (!result.Succeeded)
            {
                logger.LogWarning("Password reset failed for {UserId}: {Codes}",
                    user.Id, string.Join(", ", result.Errors.Select(e => e.Code)));
                return Error.Validation("Auth.LinkNotValid", "Länken är ogiltig eller har gått ut.");
            }

            await userManager.SetLockoutEndDateAsync(user, null);
            await userManager.ResetAccessFailedCountAsync(user);

            return Result.Success;
        }
    }
}
