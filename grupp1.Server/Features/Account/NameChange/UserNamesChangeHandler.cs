using ErrorOr;
using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Features.Account.NameChange.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.Account.NameChange;

public class UserNamesChangeHandler(
    VicariaDbContext dbContext,
    ILogger<UserNamesChangeHandler> _logger
) : IHandler<UserNamesChangeCommand, ErrorOr<UserNamesChangeResponse>>
{
    const int MaxNameLength = 200; // Grabbed off User.cs

    public async Task<ErrorOr<UserNamesChangeResponse>> HandleAsync(
        UserNamesChangeCommand command,
        CancellationToken cancellationToken = default
    )
    {
        #region Name length checks
        if (command.FirstName is not null && command.FirstName.Length > MaxNameLength)
        {
            _logger.LogInformation(
                "User {UserId} attempted to rename themselves a first name too long",
                command.UserId
            );
            return Error.Validation(
                "User.FirstNameLengthTooLong",
                $"First names can not be more than {MaxNameLength} characters in length"
            );
        }

        if (command.LastName is not null && command.LastName.Length > MaxNameLength)
        {
            _logger.LogInformation(
                "User {UserId} attempted to rename themselves a last name too long",
                command.UserId
            );
            return Error.Validation(
                "User.LastNameLengthTooLong",
                $"Last names can not be more than {MaxNameLength} characters in length"
            );
        }
        #endregion

        #region User tests
        var user = await dbContext.Users.FirstOrDefaultAsync(
            user => user.Id == command.UserId,
            cancellationToken
        );

        if (user is null)
        {
            _logger.LogWarning(
                "User {UserId} found null in UserNamesChangeHandler",
                command.UserId
            );
            return Error.NotFound("User.NotFound", "The user could not be found");
        }
        #endregion

        #region Updating names
        if (!string.IsNullOrWhiteSpace(command.FirstName))
        {
            _logger.LogInformation("User {UserId} updates their first name", user.Id);
            user.FirstName = command.FirstName;
        }

        if (!string.IsNullOrWhiteSpace(command.LastName))
        {
            _logger.LogInformation("User {UserId} updates their last name", user.Id);
            user.LastName = command.LastName;
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("User {UserId} finished updating their name(s)", user.Id);
        #endregion

        return new UserNamesChangeResponse(true);
    }
}
