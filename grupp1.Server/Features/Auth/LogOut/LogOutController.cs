using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Domain.Models;

namespace Vicaria.Server.Features.Auth.LogOut
{
    [Route("api/auth/logout")]
    [Authorize]
    [ApiController]
    public class LogOutController(SignInManager<User> signInManager) : ControllerBase
    {
        [HttpPost]
        public async Task<ActionResult> LogOut()
        {
            await signInManager.SignOutAsync();
            return Ok();
        }
    }
}

