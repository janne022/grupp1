namespace Vicaria.Server.Features.Auth.ResetPassword
{
    public record class ResetPasswordCommand
        (
            Guid UserId,
            string Token,
            string NewPassword
        );
    
}
