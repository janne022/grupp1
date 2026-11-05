namespace Vicaria.Server.Features.Kindergarten.RemoveManagerFromKindergarten.DTOs;

public record class RemoveManagerFromKindergartenCommand(
    Guid UserId,
    Guid KindergartenId
);