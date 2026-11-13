namespace Vicaria.Server.Features.Account.NameChange.DTOs;

public record class UserNamesChangeCommand
(
    Guid UserId,
    string? FirstName,
    string? LastName
);
