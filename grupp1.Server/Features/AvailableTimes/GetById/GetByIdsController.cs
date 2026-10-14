using Vicaria.Server.Infrastructure;
using Microsoft.AspNetCore.Mvc; // To inherit from ControllerBase

namespace Vicaria.Server.Features.AvailableTimes.GetById;

[Route("api/availabletimes")]
[ApiController]
public class GetAvailableTimeByIdsController : ControllerBase
{
    #region Fields

    private readonly IHandler<GetByIdQuery, GetByIdResponse?> _handler;
    private readonly ILogger<GetAvailableTimeByIdsController> _logger;

    #endregion
    #region Constructors
    public GetByIdsController(IHandler<GetByIdQuery, GetByIdResponse?> handler, ILogger<GetByIdsController> logger)
    {
        _handler = handler;
        _logger = logger;
    }

    #endregion
    #region Endpoints

    [HttpGet]
    [Route("byid")]
    public async Task<ActionResult<GetByIdResponse>> GetById([FromBody] GetByIdQuery request, CancellationToken ct)
    {

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