using Microsoft.AspNetCore.Mvc;

namespace Vicaria.Server.Features.DecidedTimes.GetById.DTOs;

public record class GetDecidedTimeByIdQuery(
    Guid DecidedTimeGuid,
    Guid UserId
);