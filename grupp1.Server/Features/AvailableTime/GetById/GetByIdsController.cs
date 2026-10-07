using grupp1.Server.Infrastructure;
using Microsoft.AspNetCore.Mvc; // To inherit from ControllerBase

namespace Vicaria.Server.Features.AvailableTime.GetById;

[Route("api/availabletime")]
[ApiController]
public class GetByIdsController : ControllerBase
{
    #region Fields
    private readonly IHandler<GetByIdQuery, GetByIdResponse> _handler;

    #endregion


    #region Constructors
    public GetByIdsController(GetByIdHandler handler)
    {
        _handler = handler;
    }

    #endregion


    #region Endpoint

    [HttpGet]
    [Route("getbyid")] // TODO: iterate over route... not super happy about it naming wise
    public async Task<ActionResult<GetByIdResponse>> GetById([FromBody] GetByIdQuery request, CancellationToken ct)
    {
        throw new NotImplementedException();
    }

    #endregion
}