using Vicaria.Server.Infrastructure.Emails;

namespace Vicaria.Server.Features.Auth.ForgotPassword
{
    public class ForgotPasswordEmailTemplate(string resetLink) : IEmailTemplate
    {
        public string GetBody()
        {
            return $"""
                <p>Hej!</p> 
                <a href="{resetLink}">Klicka här för att välja ett nytt lösenord</a> 
                """;
        }
    }
}
