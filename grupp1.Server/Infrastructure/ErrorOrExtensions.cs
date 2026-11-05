using ErrorOr;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
namespace Vicaria.Server.Infrastructure;

public static class ErrorOrExtensions
{
    public static ActionResult ToProblem(this ControllerBase controller, List<Error> errors)
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

        return controller.Problem(statusCode: status, title: first.Code, detail: first.Description);
    }
}