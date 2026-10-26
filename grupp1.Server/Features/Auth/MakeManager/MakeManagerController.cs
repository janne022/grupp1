using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Infrastructure;

namespace grupp1.Server.Features.Auth.MakeManager;

[Route("api/auth")]
[ApiController]
[Authorize]
public class MakeManagerController(
    IHandler<MakeManagerQuery, MakeManagerResponse> handler,
    IWebHostEnvironment environment) : ControllerBase
{
    [HttpPost("make-manager")]
    public async Task<IActionResult> MakeManager(CancellationToken ct)
    {
        if (!environment.IsDevelopment())
            return NotFound();

        var result = await handler.HandleAsync(new MakeManagerQuery(User), ct);

        if (result.Succeeded)
            return Ok(result);

        return BadRequest(result);
    }
}
