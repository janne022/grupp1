using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Infrastructure;

namespace grupp1.Server.Features.Auth.Register;

[Route("api/auth")]
[ApiController]
public class RegisterController(IHandler<RegisterQuery, RegisterResponse> handler) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(
        [FromBody] RegisterQuery query,
        CancellationToken ct)
    {
        var identityResult = await handler.HandleAsync(query, ct);

        if (identityResult.Succeeded)
            return Created();

        var formatErrors = identityResult.errors
            .ToDictionary(e => e.Code, e => e.Description);

        return BadRequest(formatErrors);
    }
}