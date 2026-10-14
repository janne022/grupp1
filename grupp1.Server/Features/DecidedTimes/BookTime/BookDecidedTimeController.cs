

using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Features.DecidedTimes.Book.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.DecidedTimes.Book;

[Route("api/decidedtime")]
[ApiController]
public class BookDecidedTimeController(
    IHandler<BookDecidedTimeQuery, BookDecidedTimeResponse> handler) : Controller
{
    [HttpPost("book")]
    public async Task<ActionResult<BookDecidedTimeResponse>> BookTime(
        [FromBody] BookDecidedTimeQuery query,
        CancellationToken cancellationToken
    )
    {
        var createdResult = await handler.HandleAsync(query, cancellationToken);

        return Created("", createdResult); //TODO: add get api path here when we have it
    }
}