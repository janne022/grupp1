using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using NetTopologySuite.Geometries;
using Vicaria.Server.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Vicaria.Server.Features.Kindergarten.GetAll
{
    public sealed class GetAllKindergartensHandler(VicariaDbContext dbContext) : IHandler<GetAllKindergartensRequest, GetAllKindergartensResponse>
    {
        private readonly VicariaDbContext dbContext = dbContext;
        public async Task<GetAllKindergartensResponse> HandleAsync(GetAllKindergartensRequest request, CancellationToken cancellationToken)
        {
            // Fetch data from db
            var kindergartens = await dbContext.Kindergartens
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
    [Route("api/kindergartens")]
    public sealed class GetAllKindergartensController(IHandler<GetAllKindergartensRequest, GetAllKindergartensResponse> handler) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<GetAllKindergartensResponse>> GetAllKindergartens(CancellationToken cancellationToken)
        {
            var request = new GetAllKindergartensRequest();
            var response = await handler.HandleAsync(request, cancellationToken);
            return Ok(response);
        }
    }

    public record GetAllKindergartensResponse(
        List<KindergartenDto> Kindergartens
    );

    public record GetAllKindergartensRequest(
    // Empty for interface
    );

    public record KindergartenDto(
        Guid Id,
        string Name,
        double? Latitude,
        double? Longitude
    );
}