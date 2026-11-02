using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Domain;
using Vicaria.Server.Features.PendingTime.Accept.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.PendingTime.Accept;

[Authorize(Roles = VicariaUserRoles.Substitute)]
[Route("api/pendingtime")]
[ApiController]
public class AcceptPendingTimeController(
    IHandler<AcceptPendingTimeCommand, AcceptPendingTimeResponse> handler
)
{

}
