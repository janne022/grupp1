using MailKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using ErrorOr;
using Vicaria.Server.Infrastructure.Emails;

namespace Vicaria.Server.Features.Emails
{
    public class EmailService(IConfiguration config, ILogger<EmailService> logger) : IEmailService
    {
        private ILogger<EmailService> _logger = logger;
        private IConfiguration _config = config;

        public async Task<ErrorOr<Success>> SendEmailAsync(Email email)
        {
            if (String.IsNullOrEmpty(email.To.Email))
            {
                _logger.LogError("Recipient email was null or empty in SendEmailAsync");
                return Error.Validation("Email.MissingRecipient", "Recipient's email address was missing");
            }

            string? uriString = _config["SMTP_URI"] ?? _config["MAILPIT_URI"];
            if (string.IsNullOrWhiteSpace(uriString))
            {
                _logger.LogError("SMTP_URI / MAILPIT_URI was null in SendEmailAsync");
                return Error.Unexpected("Email.MissingUri", "Email URI could not be resolved");
            }

            var uri = new Uri(uriString);
            var fromAddress =
                _config["SMTP_FROM_ADDRESS"]
                ?? _config["EMAIL_FROM_ADDRESS"]
                ?? "no-reply@vicaria.com";
            var fromName = _config["SMTP_FROM_NAME"] ?? _config["EMAIL_FROM_NAME"] ?? "Vicaria";

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(fromName, fromAddress));
            message.To.Add(new MailboxAddress("", email.To.Email));
            message.Subject = email.Subject;
            message.Body = new TextPart("html") { Text = email.EmailTemplate.GetBody() };

            SecureSocketOptions socketOptions = DetermineSecureSocketOptions(uri);

            using var client = new SmtpClient();

            try
            {
                await client.ConnectAsync(uri.Host, uri.Port, socketOptions);

                string? smtpUsername = _config["SMTP_USERNAME"];
                string? smtpPassword = _config["SMTP_PASSWORD"];

                if (!string.IsNullOrWhiteSpace(smtpUsername) && !string.IsNullOrWhiteSpace(smtpPassword))
                {
                    await client.AuthenticateAsync(
                        smtpUsername,
                        smtpPassword
                    );
                }

                await client.SendAsync(message);
                _logger.LogInformation(
                    "Mail was sent to {mail receiver} via {host}:{port}",
                    email.To.Email,
                    uri.Host,
                    uri.Port
                );
                await client.DisconnectAsync(true);

                return Result.Success;
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Failed to send email to {mailReceiver} via {host}:{port}",
                    email.To.Email,
                    uri.Host,
                    uri.Port
                );

                return Error.Failure("Email.CouldNotBeSent", "Sending email through SMTP server failed");
            }
        }

        private static SecureSocketOptions DetermineSecureSocketOptions(Uri uri)
        {
            if (uri.Scheme.Equals("smtps", StringComparison.OrdinalIgnoreCase) || uri.Port == 465)
            {
                return SecureSocketOptions.SslOnConnect;
            }

            if (
                uri.Host.Equals("localhost", StringComparison.OrdinalIgnoreCase)
                || uri.Host.Equals("127.0.0.1", StringComparison.OrdinalIgnoreCase)
                || uri.Host.Equals("::1", StringComparison.OrdinalIgnoreCase)
            )
            {
                return SecureSocketOptions.None;
            }

            return SecureSocketOptions.StartTlsWhenAvailable;
        }
    }
}
