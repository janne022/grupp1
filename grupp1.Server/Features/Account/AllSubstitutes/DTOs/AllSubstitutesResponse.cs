using Vicaria.Server.Features.Account.NameChange.DTOs;

namespace Vicaria.Server.Features.Account.AllSubstitutes.DTOs;

public record class AllSubstitutesResponse(
    List<AllSubstitutesDTO> AllSubstitutes
);