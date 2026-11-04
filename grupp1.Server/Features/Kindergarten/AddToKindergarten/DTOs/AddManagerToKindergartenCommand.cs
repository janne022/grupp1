namespace Vicaria.Server.Features.Kindergarten.AddManagerToKindergarten.DTOs;
public record class AddManagerToKindergartenCommand(
    Guid UserId,
    Guid KindergartenId
);