using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using NetTopologySuite.Geometries;
using Vicaria.Server.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Vicaria.Server.Domain;
using System.Security.Claims;

namespace Vicaria.Server.Features.Kindergarten.Manager.GetAll
{
    public sealed class GetAllKindergartensHandler(VicariaDbContext dbContext) : IHandler<GetAllKindergartensRequest, GetAllKindergartensResponse>
    {
        private readonly VicariaDbContext dbContext = dbContext;
        public async Task<GetAllKindergartensResponse> HandleAsync(GetAllKindergartensRequest request, CancellationToken cancellationToken)
        {
            // Fetch data from db
            var kindergartens = await dbContext.Kindergartens
                .Where(k => k.Managers.Any(m => m.UserId == request.ManagerId))
                .Select(k => new KindergartenDto(
                    k.Id,
                    k.Name,
                    k.Location != null ? k.Location.Y : null,
                    k.Location != null ? k.Location.X : null
                ))
                .ToListAsync(cancellationToken);

            return new GetAllKindergartensResponse(kindergartens);
        }
    }

    [ApiController]
    [Tags("Kindergarten")]
    [Authorize(Roles = VicariaUserRoles.Manager)]
    [Route("api/manager/kindergartens")]
    public sealed class GetAllKindergartensController(IHandler<GetAllKindergartensRequest, GetAllKindergartensResponse> handler) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<GetAllKindergartensResponse>> GetAllKindergartens(CancellationToken cancellationToken)
        {
            var managerId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)
             ?? throw new InvalidOperationException("User ID claim not found."));

            var request = new GetAllKindergartensRequest(managerId);
            var response = await handler.HandleAsync(request, cancellationToken);
            return Ok(response);
        }
    }

    public record GetAllKindergartensResponse(
        List<KindergartenDto> Kindergartens
    );

    public record GetAllKindergartensRequest(
        Guid ManagerId
    );

    public record KindergartenDto(
        Guid Id,
        string Name,
        double? Latitude,
        double? Longitude
    );
}