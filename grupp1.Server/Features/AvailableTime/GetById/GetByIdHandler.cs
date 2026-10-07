using grupp1.Server.Infrastructure;
using Vicaria.Server.Infrastructure; // To implement IHandler

namespace Vicaria.Server.Features.AvailableTime.GetById;

public class GetByIdHandler : IHandler<GetByIdQuery?, GetByIdResponse?>
{
    #region Fields

    private readonly VicariaDbContext _dbContext;

    #endregion
    #region Constructors

    public GetByIdHandler(VicariaDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    #endregion
    #region Methods

    public async Task<GetByIdResponse?> HandleAsync(GetByIdQuery? request, CancellationToken cancellationToken = default)
    {
        Guid inputId = request?.AvailableTimeId ?? Guid.Empty;

        var availableTime = await _dbContext.AvailableTimes.FindAsync(inputId);

        if (availableTime is null)
        {
            return null;
        }

        return new GetByIdResponse
        (
            StartTime: availableTime.StartTime,
            EndTime: availableTime.EndTime,
            Kindergartens: [.. availableTime.Kindergartens]
        );
    }
    #endregion
}