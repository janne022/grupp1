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
    #endregion
}