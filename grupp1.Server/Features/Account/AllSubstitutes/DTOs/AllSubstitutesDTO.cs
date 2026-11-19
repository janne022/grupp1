namespace Vicaria.Server.Features.Account.NameChange.DTOs;
public record class AllSubstitutesDTO(
    Guid SubstituteId,
    string FirstName,
    string LastName,
    string PhoneNumber,
    string Email
);