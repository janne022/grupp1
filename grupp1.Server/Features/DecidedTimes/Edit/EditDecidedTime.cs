using Microsoft.AspNetCore.Authorization; // To use Authorize attribute
using Microsoft.AspNetCore.Mvc; // To use Controller attributes and inherit from ControllerBase
using Vicaria.Server.Infrastructure; // To use IHandler interface

namespace Vicaria.Server.Features.DecidedTimes.Edit;

#region Controller

[ApiController]
[Authorize]
[Route("api/decidedtimes")]
public sealed class EditDecidedTimeController : ControllerBase
{
    #region Fields
    private readonly IHandler<EditDecidedTimeCommand, EditDecidedTimeResponse> _handler;

    #endregion
    #region Constructor

    public EditDecidedTimeController(IHandler<EditDecidedTimeCommand, EditDecidedTimeResponse> handler)
    {
        _handler = handler;
    }

    #endregion
    #region Endpoint
    #endregion
}

#endregion
#region Handler

public class EditDecidedTimeHandler
{

}

#endregion
#region DTOs

public record class EditDecidedTimeRequest
{

}

public record class EditDecidedTimeCommand
{

}

public record class EditDecidedTimeResponse
{

}

#endregion