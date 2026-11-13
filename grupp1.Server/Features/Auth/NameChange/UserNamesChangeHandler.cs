using ErrorOr;
using Vicaria.Server.Features.Auth.NameChange.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.Auth.NameChange;

public class UserNamesChangeHandler(
    VicariaDbContext dbContext,
    ILogger<UserNamesChangeHandler> _logger
) : IHandler<UserNamesChangeCommand, UserNamesChangeResponse>
{
    public async Task<UserNamesChangeResponse> HandleAsync(
        UserNamesChangeCommand query,
        CancellationToken cancellationToken = default
    )
    {
        
    }
}