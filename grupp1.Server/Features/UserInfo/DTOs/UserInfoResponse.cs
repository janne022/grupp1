namespace Vicaria.Server.Features.UserInfo.DTOs;

public record UserInfoResponse
(
    Guid Id,
    string FirstName,
    string LastName,
    string? Email,
    IReadOnlyList<string> Roles
);
