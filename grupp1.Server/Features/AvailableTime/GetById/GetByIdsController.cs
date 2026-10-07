using System.Reflection.Metadata.Ecma335;
using grupp1.Server.Infrastructure;
using Microsoft.AspNetCore.Mvc; // To inherit from ControllerBase

namespace Vicaria.Server.Features.AvailableTime.GetById;

[Route("api/availabletime")]
[ApiController]
public class GetByIdsController : ControllerBase
{
    #region Fields
    private readonly IHandler<GetByIdQuery, GetByIdResponse> _handler;
    private readonly ILogger<GetByIdsController> _logger;

    #endregion


    #region Constructors
    public GetByIdsController(GetByIdHandler handler, Logger<GetByIdsController> logger)
    {
        _handler = handler;
        _logger = logger;
    }

    #endregion


    #region Endpoint

    [HttpGet]
    [Route("getbyid")] // TODO: iterate over route... not super happy about it naming wise
    public async Task<ActionResult<GetByIdResponse>> GetById([FromBody] GetByIdQuery request, CancellationToken ct)
    {
        if (request is null)
        {
            return BadRequest();
        }

        try
        {
            var responseDto = await _handler.HandleAsync(request, ct);

            return responseDto is null ? NotFound() : Ok(responseDto);
        }
        catch (Exception ex)
        {
            _logger.LogError
            (
                exception: ex,
                message: $"{ex.GetType} got thrown with message: {ex.Message}"
            );

            throw ex;
        }
    }

    #endregion
}