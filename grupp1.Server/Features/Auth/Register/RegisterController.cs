using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Domain.Models;
using Vicaria.Server.Infrastructure;

namespace grupp1.Server.Features.Auth.Register;

[Route("api/auth")]
[ApiController]
public class RegisterController(
    IHandler<RegisterQuery, RegisterResponse> handler,
    SignInManager<User> signInManager
) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterQuery query, CancellationToken ct)
    {
        var identityResult = await handler.HandleAsync(query, ct);

        if (identityResult.Succeeded)
        {
            await signInManager.PasswordSignInAsync(
                query.Email,
                query.Password,
                isPersistent: true,
                lockoutOnFailure: false
            );
            return Created();
        }

        var formatErrors = identityResult.errors.ToDictionary(e => e.Code, e => e.Description);

        return BadRequest(formatErrors);
    }
}
