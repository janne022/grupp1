namespace Vicaria.Server.Features.AvailableTimes.GetByManager;

public record class GetAllAvailableTimeByManagerResponse(
    AvailableTimesByKindergartenDTO[] AvailableTimesByKindergarten
);
