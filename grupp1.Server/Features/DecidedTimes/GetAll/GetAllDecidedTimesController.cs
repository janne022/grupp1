using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Features.DecidedTimes.GetAll.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.DecidedTimes.GetAll
{
    // TODO: Add Authorization tag when authorisation is up.
    [Route("api/decidedtime")]
    [Authorize]
    [ApiController]
    public class GetAllDecidedTimesController(
        IHandler<GetAllDecidedTimesQuery, GetAllDecidedTimesResponse> handler
    ) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<GetAllDecidedTimesResponse>> GetAll(CancellationToken ct)
        {
            var query = new GetAllDecidedTimesQuery();

            var response = await handler.HandleAsync(query, ct);

            return Ok(response);
        }
    }
}
