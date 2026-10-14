using Microsoft.AspNetCore.Mvc;

namespace Vicaria.Server.Features.DecidedTimes.GetById.DTOs;

public record class GetDecidedTimeByIdQuery(
    [FromRoute(Name = "id")]
    Guid DecidedTimeGuid
);