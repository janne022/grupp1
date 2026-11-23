using Microsoft.AspNetCore.Identity;
using Vicaria.Server.Domain.Models;
using Vicaria.Server.Infrastructure.Emails;

namespace Vicaria.Server.Features.Emails;

public class IdentityEmailMapper(
    IServiceScopeFactory scopeFactory,
    ILogger<IdentityEmailMapper> logger
) : IEmailSender<User>
{
    // This mapper allows for the Identity endpoints to use Vicaria's EmailService.
    public Task SendConfirmationLinkAsync(User user, string email, string confirmationLink) =>
        SendAsync(
            new Email(
                user,
                "Bekräfta din e-postadress",
                new ConfirmNewEmailTemplate(user.FirstName, confirmationLink),
                sendAddress: email
            ),
            user
        );

    public Task SendPasswordResetLinkAsync(User user, string email, string resetLink)
    {
        logger.LogWarning(
            "User {userId} tried to use the Identity endpoint API to send a password reset link",
            user.Id
        );
        return Task.CompletedTask;
    }

    public Task SendPasswordResetCodeAsync(User user, string email, string resetLink)
    {
        logger.LogWarning(
            "User {userId} tried to use the Identity endpoint API to send a password reset code",
            user.Id
        );
        return Task.CompletedTask;
    }

    private async Task SendAsync(Email message, User user)
    {
        using var scope = scopeFactory.CreateScope();
        var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

        var result = await emailService.SendEmailAsync(message);
        if (result.IsError)
        {
            logger.LogWarning(
                "Identity email to user {UserId} failed to send. Error code: {ErrorCode}",
                user.Id,
                result.FirstError.Code
            );
        }
    }
}
