using Vicaria.Server.Domain.Models;
using Vicaria.Server.Features.Emails;
using Vicaria.Server.Infrastructure.Emails;

namespace Vicaria.Server.Tests.Features.Emails
{
    public class EmailTests
    {
        private const string EmailAddress = "tester@example.com";
        private const string NewEmailAddress = "testerNew@example.com";

        private static User CreateUser() => new() { Email = EmailAddress };

        private static readonly IEmailTemplate EmailTemplate = new ConfirmNewEmailTemplate(
            "FirstName",
            "https://example.com"
        );

        [Fact]
        public void SendAddress_WhenNoAddressIsSupplied_IsUsersOwnEmail()
        {
            // Arrange
            var recipient = CreateUser();

            // Act
            var email = new Email(recipient, "Title field", EmailTemplate, sendAddress: null);

            // Assert
            Assert.Equal(EmailAddress, email.SendAddress);
        }

        [Fact]
        public void SendAddress_WhenSeparateAddressIsSupplied_IsTheSuppliedEmail()
        {
            // Arrange
            var recipient = CreateUser();

            // Act
            var email = new Email(
                recipient,
                "Title Field",
                EmailTemplate,
                sendAddress: NewEmailAddress
            );

            // Assert
            Assert.Equal(NewEmailAddress, email.SendAddress); // The manually set SendAddress, ie the new email they're changing to
            Assert.Equal(EmailAddress, email.To.Email); // The user's original email is intact
        }
    }
}
