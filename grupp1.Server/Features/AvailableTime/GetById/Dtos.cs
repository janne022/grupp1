using NetTopologySuite.Geometries;
using Vicaria.Server.Domain.Models; // To use KindergartenAvailableTime type

namespace Vicaria.Server.Features.AvailableTime.GetById;

#region Requests

public record class GetByIdQuery(Guid AvailableTimeId);

#endregion
#region Responses

public record class GetByIdResponse(DateTime StartTime, DateTime EndTime, KindergartenDto[] Kindergartens);

#endregion
#region DTOs
public record class KindergartenDto(string Name, Guid Id, Point? Location);
#endregion