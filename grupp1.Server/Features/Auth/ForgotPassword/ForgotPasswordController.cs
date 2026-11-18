using ErrorOr;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.Auth.ForgotPassword
{
    [Route("api/auth")]
    [ApiController]
    public class ForgotPasswordController(IHandler<ForgotPasswordCommand, ErrorOr<Success>> handler) : ControllerBase
    {
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPasswordAsync(ForgotPasswordCommand command, CancellationToken cancellationToken)
        {
            var result = await handler.HandleAsync(command, cancellationToken);

            return result.Match<IActionResult>(
                value => Ok(),
                errors => this.ToProblem(errors)
                );
        }
    }
}
