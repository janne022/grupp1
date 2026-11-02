namespace Vicaria.Server.Features.RemoveManagerFromKindergarten.DTOs;

public record class RemoveManagerFromKindergartenCommand(
    Guid UserId,
    Guid KindergartenId
);