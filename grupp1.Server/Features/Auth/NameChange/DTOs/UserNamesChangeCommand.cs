namespace Vicaria.Server.Features.Auth.NameChange.DTOs;

public record class UserNamesChangeCommand
(
    Guid UserId,
    string? FirstName,
    string? LastName
);
