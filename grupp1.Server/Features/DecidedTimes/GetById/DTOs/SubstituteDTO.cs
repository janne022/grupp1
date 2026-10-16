namespace Vicaria.Server.Features.DecidedTimes.GetById.DTOs;

public record class SubstituteDTO(
    Guid Id,
    string FirstName,
    string LastName
);