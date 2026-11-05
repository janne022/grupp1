namespace Vicaria.Server.Features.GetByManager.DTOs;

public record class UserInfoResponse
(
    Guid Id,
    string FirstName,
    string LastName,
    string? Email,
    IReadOnlyList<string> Roles,
    string PhoneNumber
);