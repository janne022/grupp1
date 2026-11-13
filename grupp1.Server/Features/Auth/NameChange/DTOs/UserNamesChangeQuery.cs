namespace Vicaria.Server.Features.Auth.NameChange.DTOs;

public record class UserNamesChangeQuery
(
    string? NewFirstName,
    string? NewLastName
);
