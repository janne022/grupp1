namespace Vicaria.Server.Features.Account.NameChange.DTOs;

public record class UserNamesChangeQuery
(
    string? NewFirstName,
    string? NewLastName
);
