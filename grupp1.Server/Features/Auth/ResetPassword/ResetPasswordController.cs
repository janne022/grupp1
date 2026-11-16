using ErrorOr;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.Auth.ResetPassword
{
    [Route("api/auth")]
    [ApiController]
    public class ResetPasswordController(IHandler<ResetPasswordCommand, ErrorOr<Success>> handler) : ControllerBase
    {
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPasswordAsync(ResetPasswordCommand command, CancellationToken cancellationToken)
        {
            var result = await handler.HandleAsync(command, cancellationToken);

            return result.Match<IActionResult>(
                value => Ok(),
                errors => this.ToProblem(errors)
                );
        }
    }
}
