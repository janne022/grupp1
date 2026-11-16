using ErrorOr;
using Microsoft.AspNetCore.Identity;
using Vicaria.Server.Domain.Models;
using Vicaria.Server.Features.Auth.ForgotPassword;
using Vicaria.Server.Infrastructure;
using Vicaria.Server.Infrastructure.Emails;

namespace grupp1.Server.Features.Auth.ForgotPassword
{
    public class ForgotPasswordHandler(VicariaDbContext context, UserManager<User> userManager, IEmailService emailService, ILogger<ForgotPasswordHandler> logger) : IHandler<ForgotPasswordCommand, ErrorOr<Success>>
    {
        public async Task<ErrorOr<Success>> HandleAsync(ForgotPasswordCommand command, CancellationToken cancellationToken)
        {
            var user = await userManager.FindByEmailAsync(command.Email);

            if (user is not null)
            {
                string token = await userManager.GeneratePasswordResetTokenAsync(user);

                string baseUrl = "http://webfrontend-grupp1.dev.localhost:51653/";

                string link = $"{baseUrl}reset-password?userId={user.Id}&token={token}";


                var email = new Email
                (
                    user,
                    "Återställ ditt lösenord",
                    new ForgotPasswordEmailTemplate(link)
                );

                var result = await emailService.SendEmailAsync(email);
            }

            return Result.Success;
        }
    }
}
