using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Features.UserInfo.DTOs;
using Vicaria.Server.Infrastructure;

namespace grupp1.Server.Features.UserInfo
{
    [Route("api/userinfo")]
    [Authorize]
    [ApiController]
    public class UserInfoController(IHandler<UserInfoQuery, UserInfoResponse?> handler,
    ILogger<UserInfoController> _logger)
        : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<UserInfoResponse?>> UserInfo(CancellationToken ct)
        {
            var userClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            bool isGuid = Guid.TryParse(userClaim, out var userId);
            if (isGuid == false)
            {
                _logger.LogWarning("userClaim {claim} was not a guid in UserInfoController", userClaim);
                return Unauthorized();
            }

            var response = await handler.HandleAsync(new UserInfoQuery(userId), ct);
            if (response is null)
            {
                _logger.LogWarning("response for {userId} was null in UserInfoController", userId);
                return Unauthorized();
            }

            return Ok(response);
        }
    }
}
