using ErrorOr;
using Microsoft.AspNetCore.Identity;
using Vicaria.Server.Domain.Models;
using Vicaria.Server.Infrastructure;
using Vicaria.Server.Infrastructure.Emails;

namespace Vicaria.Server.Features.Auth.ForgotPassword
{
    public class ForgotPasswordHandler(IConfiguration config, UserManager<User> userManager, IEmailService emailService, ILogger<ForgotPasswordHandler> logger) : IHandler<ForgotPasswordCommand, ErrorOr<Success>>
    {
        public async Task<ErrorOr<Success>> HandleAsync(ForgotPasswordCommand command, CancellationToken cancellationToken)
        {
            var user = await userManager.FindByEmailAsync(command.Email);

            if (user is not null)
            {
                string token = await userManager.GeneratePasswordResetTokenAsync(user);

                string baseUrl = config["Frontend:BaseUrl"]!;

                string link = $"{baseUrl}/reset-password?userId={user.Id}&token={token}";


                var email = new Email
                (
                    user,
                    "Återställ ditt lösenord",
                    new ForgotPasswordEmailTemplate(link)
                );

                var result = await emailService.SendEmailAsync(email);

                if (result.IsError)
                {
                    logger.LogError("Failed to send email: {Error}", result.FirstError.Description);
                }
            }

            return Result.Success;
        }
    }
}
