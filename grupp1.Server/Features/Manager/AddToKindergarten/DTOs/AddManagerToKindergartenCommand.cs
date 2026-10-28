namespace Vicaria.Server.Features.AddManagerToKindergarten.DTOs;
public record class AddManagerToKindergartenCommand(
    Guid UserId,
    Guid KindergartenId
);