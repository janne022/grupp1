using System.Security.Claims;
using ErrorOr;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Features.Account.NameChange.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.Account.NameChange
{
    [Route("api/account/names")]
    [Authorize]
    [ApiController]
    public class UserNamesChangeController(
        IHandler<UserNamesChangeCommand, ErrorOr<Success>> handler
    ) : ControllerBase
    {
        [HttpPatch]
        public async Task<ActionResult> UpdateNames(
            [FromBody] UserNamesChangeQuery query,
            CancellationToken cancellationToken = default
        )
        {
            #region Input checks
            if (
                string.IsNullOrWhiteSpace(query.NewFirstName)
                && string.IsNullOrWhiteSpace(query.NewLastName)
            )
            {
                return BadRequest();
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId is null || !Guid.TryParse(userId, out var userGuidId))
            {
                return Unauthorized();
            }
            #endregion

            #region Setup
            var command = new UserNamesChangeCommand(
                userGuidId,
                query.NewFirstName,
                query.NewLastName
            );

            var response = await handler.HandleAsync(command, cancellationToken);
            #endregion

            return response.Match<ActionResult>(
                _ => NoContent(),
                errors => this.ToProblem(errors)
            );
        }
    }
}
