namespace Vicaria.Server.Features.Auth.NameChange.DTOs;

public record class UserNamesChangeQuery
(
    string? FirstName,
    string? LastName
);
