
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Features.DecidedTimes.GetById.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.DecidedTimes.GetById;

[Route("api/decidedtime")]
[ApiController]
public class GetDecidedTimeByIdController(
    IHandler<GetDecidedTimeByIdQuery, GetDecidedTimeByIdResponse> handler
) : Controller
{
    [HttpGet("{Id:guid}")]
    public async Task<ActionResult<GetDecidedTimeByIdResponse>> GetById(
    [FromRoute] GetDecidedTimeByIdQuery query,
    CancellationToken cancellationToken = default)
    {
        var result = await handler.HandleAsync(query, cancellationToken);
        return Ok(result);
    }
}