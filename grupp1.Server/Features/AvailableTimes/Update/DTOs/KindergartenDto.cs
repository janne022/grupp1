namespace Vicaria.Server.Features.AvailableTimes.Update.DTOs;

public record class UpdateAvailableTimeKindergartenDTO(
        Guid Id,
        string Name,
        double? Latitude,
        double? Longitude
    );