using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace grupp1.Server.Features.AvailableTimes.Update
{
    [Route("api/availabletimes")]
    [ApiController]
    public class UpdateAvailableTimeController : ControllerBase
    {
        [HttpPut("updatetime")]
        public async Task<ActionResult<UpdateAvailableTimeResponse>> Update(CancellationToken ct)
        {
            
        }
    }
}
