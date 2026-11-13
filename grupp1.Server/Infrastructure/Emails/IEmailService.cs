using ErrorOr;

namespace Vicaria.Server.Infrastructure.Emails
{
    public interface IEmailService
    {
        Task<ErrorOr<Success>> SendEmailAsync(Email email);
    }
}
