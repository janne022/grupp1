namespace Vicaria.Server.Features.Kindergarten.AddManagerFromKindergarten.DTOs;
public record class AddManagerToKindergartenCommand(
    Guid UserId,
    Guid KindergartenId
);