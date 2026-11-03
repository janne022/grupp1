using Microsoft.AspNetCore.Authorization; // To use Authorize attribute
using Microsoft.AspNetCore.Mvc; // To use Controller attributes and inherit from ControllerBase

namespace Vicaria.Server.Features.DecidedTimes.Edit;

#region Controller

[ApiController]
[Authorize]
[Route("api/decidedtimes")]
public class EditDecidedTimeController : ControllerBase
{

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