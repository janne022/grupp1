namespace grupp1.Server.Features.Auth.ForgotPassword
{
    public record class ForgotPasswordCommand
    {
        public string Email { get; set; }
    }
}
