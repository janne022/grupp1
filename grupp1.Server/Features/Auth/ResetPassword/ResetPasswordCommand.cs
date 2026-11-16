namespace Vicaria.Server.Features.Auth.ResetPassword
{
    public record class ResetPasswordCommand
        (
            string UserId,
            string Token,
            string NewPassword
        );
    
}
