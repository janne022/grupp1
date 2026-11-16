using ErrorOr;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Infrastructure;

namespace grupp1.Server.Features.Auth.ForgotPassword
{
    [Route("api/auth")]
    [ApiController]
    public class ForgotPasswordController(IHandler<ForgotPasswordCommand, ErrorOr<Success>> handler) : ControllerBase
    {
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPasswordAsync(ForgotPasswordCommand command, CancellationToken cancellationToken)
        {
            var result = await handler.HandleAsync(command, cancellationToken);

            if (result.IsError)
            {
                return BadRequest();
            }

            return Ok();
        }
    }
}
