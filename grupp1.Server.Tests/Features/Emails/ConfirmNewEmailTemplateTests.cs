using Vicaria.Server.Features.Emails;

namespace Vicaria.Server.Tests.Features.Emails
{
    public class ConfirmNewEmailTemplateTests
    {
        const string UserFirstName = "<htmlCodeInsertion>";
        const string LinkedUrl = "https://example.com";

        // This test ensures there is protection against against inserting HTML into a
        // FirstName field, such as a user claiming their name to
        // be '<a href="somereallybadsite?whichdoes=badstuff">Click here</a>'. This attack
        // should be protected against by encoding special characters into proper html.
        [Fact]
        public void GetBody_WhenSuppliedFirstNameContainsHtml_FirstNameIsHtmlEncoded()
        {
            // Arrange
            var template = new ConfirmNewEmailTemplate(UserFirstName, LinkedUrl);

            // Act
            var body = template.GetBody();

            // Assert
            Assert.DoesNotContain(UserFirstName, body);
            Assert.Contains("&lt;htmlCodeInsertion&gt;", body);
        }

        [Fact]
        public void GetBody_WhenLinkIsSupplied_LinkExistsInBody()
        {
            // Arrange
            var template = new ConfirmNewEmailTemplate(UserFirstName, LinkedUrl);

            // Act
            var body = template.GetBody();

            // Assert
            Assert.Contains(LinkedUrl, body);
        }
    }
}
