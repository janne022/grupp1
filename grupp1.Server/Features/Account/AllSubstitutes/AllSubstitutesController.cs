using ErrorOr;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Domain;
using Vicaria.Server.Features.Account.AllSubstitutes.DTOs;
using Vicaria.Server.Features.Account.NameChange.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.Account.AllSubstitutes;

[Authorize(Roles = VicariaUserRoles.Manager)]
[Route("api/account")]
[ApiController]

public class AllSubstitutes(IHandler<AllSubstitutesQuery, ErrorOr<AllSubstitutesResponse>> handler) : Controller
{

    [HttpGet("all")]
    public async Task<ActionResult<AllSubstitutesResponse>> GetAll(
        CancellationToken cancellationToken = default
    )
    {
        var query = new AllSubstitutesQuery();

        var result = await handler.HandleAsync(query, cancellationToken);

        return result.Match<ActionResult<AllSubstitutesResponse>>(
            value => Ok(value),
            error => this.ToProblem(error)
        );
    }
}