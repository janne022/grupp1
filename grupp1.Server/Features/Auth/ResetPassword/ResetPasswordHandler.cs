using ErrorOr;
using Microsoft.AspNetCore.Identity;
using Vicaria.Server.Domain.Models;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.Auth.ResetPassword
{
    public class ResetPasswordHandler(VicariaDbContext context, UserManager<User> userManager, ILogger<ResetPasswordHandler> logger) : IHandler<ResetPasswordCommand, ErrorOr<Success>>
    {
        public async Task<ErrorOr<Success>> HandleAsync(ResetPasswordCommand command, CancellationToken cancellationToken)
        {

            var user = await userManager.FindByIdAsync(command.UserId.ToString());

            if(user is null)
            {
                return Error.Failure(description: "Länken är ogiltig eller har gått ut");
            }

            var result = await userManager.ResetPasswordAsync(user, command.Token, command.NewPassword);

            if (!result.Succeeded)
            {
                return Error.Failure(description: "Något fel har inträffat");
            }

            return Result.Success;
        }
    }
}
