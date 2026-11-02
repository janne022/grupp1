using ErrorOr;
using Microsoft.AspNetCore.Mvc;

namespace Vicaria.Server.Infrastructure;

public abstract class ApiControllerBase : ControllerBase
{
    protected ActionResult ToProblem(List<Error> errors)
    {
        var first = errors[0];
        var status = first.Type switch
        {
            ErrorType.Validation => StatusCodes.Status400BadRequest,
            ErrorType.Unauthorized => StatusCodes.Status401Unauthorized,
            ErrorType.Forbidden => StatusCodes.Status403Forbidden,
            ErrorType.NotFound => StatusCodes.Status404NotFound,
            ErrorType.Conflict => StatusCodes.Status409Conflict,
            _ => StatusCodes.Status500InternalServerError,
        };

        return Problem(statusCode: status, title: first.Code, detail: first.Description);
    }
}