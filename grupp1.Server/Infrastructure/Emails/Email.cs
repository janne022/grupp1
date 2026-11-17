using Vicaria.Server.Domain.Models;
using Vicaria.Server.Infrastructure.Emails;

namespace Vicaria.Server.Infrastructure.Emails
{
    public class Email(User to, string subject, IEmailTemplate emailTemplate)
    {
        public User To { get; } = to;
        public string Subject { get; } = subject;
        public IEmailTemplate EmailTemplate { get; } = emailTemplate;
    }
}
