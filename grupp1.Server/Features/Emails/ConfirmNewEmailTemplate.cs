using System.Net;
using Vicaria.Server.Infrastructure.Emails;

namespace Vicaria.Server.Features.Emails;

public class ConfirmNewEmailTemplate(string firstName, string link) : IEmailTemplate
{
    public string GetBody() =>
        "<p>Hej "
        + WebUtility.HtmlEncode(firstName)
        + "!</p>"
        + "<p>Länken nedan kommer bekräfta den här e-postadressen som din nya e-postadress hos Vicaria. Var god klicka på länken för att färdigställa ditt e-postadressbyte.</p>"
        + "<p><a href=\""
        + link
        + "\">Klicka här för att bekräfta din e-postadress</a></p>"
        + "<br><br>"
        + "<p>Ifall du inte har bett om ett byte av e-postadress hos Vicaria, bortse gärna ifrån detta mail.</p>";
}
