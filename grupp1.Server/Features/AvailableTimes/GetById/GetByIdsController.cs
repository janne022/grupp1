using Vicaria.Server.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization; // To inherit from ControllerBase

namespace Vicaria.Server.Features.AvailableTimes.GetById;
[Route("api/availabletimes")]
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

    [HttpGet("{id}")]
    public async Task<ActionResult<GetByIdResponse>> GetById([FromRoute(Name = "id")] Guid id, CancellationToken ct)
    {
        GetByIdQuery request = new(id);

        _logger.LogInformation($"Starting to fetch AvailableTime by id with  ID: {request.AvailableTimeId}");

        var responseDto = await _handler.HandleAsync(request, ct);

        if (responseDto is null)
        {
            _logger.LogWarning($"No AvailableTime object could be found with ID: {request.AvailableTimeId}");

            return NotFound();
        }

        _logger.LogInformation($"AvailableTime object successfully fetched with ID: {request.AvailableTimeId}");

        return Ok(responseDto);
    }

    #endregion
}