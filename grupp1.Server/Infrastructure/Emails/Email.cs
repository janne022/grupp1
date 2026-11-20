using Vicaria.Server.Domain.Models;

namespace Vicaria.Server.Infrastructure.Emails
{
    public class Email(User to, string subject, IEmailTemplate emailTemplate, string? sendAddress = null)
    {
        public User To { get; } = to;
        public string Subject { get; } = subject;
        public IEmailTemplate EmailTemplate { get; } = emailTemplate;
        public string? SendAddress { get; } = sendAddress ?? to.Email;

        // The difference between SendAddress and the To is that To refers to who
        // the email is sent to. SendAddress is where the email will actually go.
        // In 99% of cases, these are the same. But as noted when working on changing
        // a user's email, a user may need to receive an email to an address which
        // isn't the one they have on file (which would send the confirmation mail
        // for mynewemail@example.com to myoldemail@example.com)
    }
}
