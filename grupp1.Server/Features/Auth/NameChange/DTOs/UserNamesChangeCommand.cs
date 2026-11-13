namespace Vicaria.Server.Features.Auth.NameChange.DTOs;

public record class UserNamesChangeCommand
(
    string? FirstName,
    string? LastName
);
