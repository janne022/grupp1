namespace Vicaria.Server.Features.RemoveManagerFromKindergarten.DTOs;

public enum ErrorType { NotFound, Conflict }

public record Error(ErrorType Type, string Message);

public record RemoveManagerFromKindergartenResult(Error? Error)
{
    public bool Succeeded => Error == null;

    public static RemoveManagerFromKindergartenResult Success() => new((Error?)null);
    public static RemoveManagerFromKindergartenResult Failure(ErrorType type, string message) => new(new Error(type, message));
}