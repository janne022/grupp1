using Vicaria.Server.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims; // To inherit from ControllerBase

namespace Vicaria.Server.Features.AvailableTimes.GetById;
[Route("api/available-times")]
[Authorize]
[ApiController]
public class GetAvailableTimeByIdsController : ControllerBase
{
    #region Fields

    private readonly IHandler<GetByIdQuery, GetByIdResponse?> _handler;
    private readonly ILogger<GetAvailableTimeByIdsController> _logger;

    #endregion
    #region Constructors
    public GetAvailableTimeByIdsController(IHandler<GetByIdQuery, GetByIdResponse?> handler, ILogger<GetAvailableTimeByIdsController> logger)
    {
        _handler = handler;
        _logger = logger;
    }

    #endregion
    #region Endpoints

    [HttpGet("{availableTimeId}")]
    public async Task<ActionResult<GetByIdResponse>> GetById([FromRoute(Name = "availableTimeId")] Guid atId, CancellationToken ct)
    {
        string? stringUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(stringUserId, out var guidUserId))
        {
            _logger.LogWarning($"Could not find user with ID {stringUserId} - ID was not a GUID.");
            return Unauthorized();
        }

        GetByIdQuery query = new(atId, guidUserId);
        _logger.LogInformation($"Starting to fetch AvailableTime by id with  ID: {query.AvailableTimeId} and user ID: {query.UserId}.");

        GetByIdResponse? responseDto = await _handler.HandleAsync(query, ct);

        if (responseDto is null)
        {
            _logger.LogWarning($"No AvailableTime object could be found with ID: {query.AvailableTimeId}.");
            return NotFound();
        }

        _logger.LogInformation($"AvailableTime object successfully fetched with ID: {query.AvailableTimeId} for user {query.UserId}.");
        return Ok(responseDto);
    }

    #endregion
}