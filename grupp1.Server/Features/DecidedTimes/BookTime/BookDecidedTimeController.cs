

using Vicaria.Server.Features.DecidedTimes.BookTime.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Vicaria.Server.Features.DecidedTimes.Book.DTOs;
using Vicaria.Server.Infrastructure;
using Vicaria.Server.Domain;

namespace Vicaria.Server.Features.DecidedTimes.Book;

[Route("api/decided-times")]
[Authorize(Roles = VicariaUserRoles.Manager)]
[ApiController]
[Tags("DecidedTimes")]
public class BookDecidedTimeController(
    IHandler<BookDecidedTimeCommand, BookDecidedTimeResponse> handler) : Controller
{
    [HttpPost]
    public async Task<ActionResult<BookDecidedTimeResponse>> BookTime(
        [FromBody] BookDecidedTimeQuery query,
        CancellationToken cancellationToken = default
    )
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userId, out var managerId))
        {
            return Unauthorized();
        }

        var command = new BookDecidedTimeCommand
        {
            AvailableTimeGuid = query.AvailableTimeGuid,
            StartTime = query.StartTime,
            EndTime = query.EndTime,
            KindergartenId = query.KindergartenId,
            ManagerId = managerId
        };

        var createdResult = await handler.HandleAsync(command, cancellationToken);

        return Created($"/api/decided-times/{createdResult.Id}", createdResult);
    }
}