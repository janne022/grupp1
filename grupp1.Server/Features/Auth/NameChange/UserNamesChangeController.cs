using System.Security.Claims;
using ErrorOr;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Domain.Models;
using Vicaria.Server.Features.Auth.NameChange.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.Auth.UserNamesChange
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class UserNamesChangeController(
        IHandler<UserNamesChangeQuery, ErrorOr<UserNamesChangeResponse>> handler
    ) : ControllerBase
    {
        [HttpPatch]
        public async Task<ErrorOr<UserNamesChangeResponse>> UpdateNames(
            UserNamesChangeQuery query,
            ClaimsPrincipal claims,
            UserManager<UserNamesChangeController> userManager,
            CancellationToken cancellationToken = default
        )
        {
            if (query.FirstName is null && query.LastName is null)
            {
                return BadRequest();
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId is null)
            {
                return Unauthorized();
            }
        }
    }
}
