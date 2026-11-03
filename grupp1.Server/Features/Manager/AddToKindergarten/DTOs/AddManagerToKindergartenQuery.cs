namespace Vicaria.Server.Features.AddManagerToKindergarten.DTOs;

public enum ErrorType { NotFound, Conflict }

public record Error(ErrorType Type, string Message);

public record AddManagerToKindergartenResult(Error? Error)
{
    public bool Succeeded => Error == null;

    public static AddManagerToKindergartenResult Success() => new((Error?)null);
    public static AddManagerToKindergartenResult Failure(ErrorType type, string message) => new(new Error(type, message));
}