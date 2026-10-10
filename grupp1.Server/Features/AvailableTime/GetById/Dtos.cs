using NetTopologySuite.Geometries;

namespace Vicaria.Server.Features.AvailableTimes.GetById;

#region Requests

public record class GetByIdQuery(Guid AvailableTimeId);

#endregion
#region Responses

public record class GetByIdResponse(Guid Id, DateTime StartTime, DateTime EndTime, KindergartenDto[] Kindergartens);

#endregion
#region DTOs

public record class KindergartenDto(string Name, Guid Id, Point? Location);

#endregion