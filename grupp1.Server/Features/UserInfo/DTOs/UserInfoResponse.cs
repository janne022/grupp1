namespace Vicaria.Server.Features.UserInfo.DTOs;

public record class UserInfoResponse
(
    Guid Id,
    string FirstName,
    string LastName,
    string? Email,
    IReadOnlyList<string> Roles,
    string? PhoneNumber
);
// PhoneNumber is nullable since it is nullable on IdentityUser,
// but it should never end up null due to registration requiring
// phone numbers as of PR #137.
// (ie this squelches compiler complaints)
