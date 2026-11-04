namespace Vicaria.Server.Features.AvailableTimes.Update.DTOs;

public record class KindergartenDto(
        Guid Id,
        string Name,
        double? Latitude,
        double? Longitude
    );