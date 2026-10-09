using Vicaria.Server.Infrastructure;
using Microsoft.AspNetCore.Mvc; // To inherit from ControllerBase

namespace Vicaria.Server.Features.AvailableTime.GetById;

[Route("api/availabletime")]
[ApiController]
public class GetByIdsController : ControllerBase
{
    #region Fields

    private readonly IHandler<GetByIdQuery, GetByIdResponse?> _handler;
    private readonly ILogger<GetByIdsController> _logger;

    #endregion
    #region Constructors
    public GetByIdsController(GetByIdHandler handler, Logger<GetByIdsController> logger)
    {
        _handler = handler;
        _logger = logger;
    }

    #endregion
    #region Endpoints

    [HttpGet]
    [Route("getbytimeid")]
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