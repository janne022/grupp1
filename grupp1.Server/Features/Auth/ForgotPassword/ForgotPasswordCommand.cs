namespace Vicaria.Server.Features.Auth.ForgotPassword
{
    public record class ForgotPasswordCommand
    {
        public required string Email { get; set; }
    }
}
