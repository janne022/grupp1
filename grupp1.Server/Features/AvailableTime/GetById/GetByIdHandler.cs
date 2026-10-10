using Vicaria.Server.Infrastructure; // To implement IHandler

namespace Vicaria.Server.Features.AvailableTimes.GetById;

public class GetByIdHandler : IHandler<GetByIdQuery, GetByIdResponse?>
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

    public async Task<GetByIdResponse?> HandleAsync(GetByIdQuery request, CancellationToken cancellationToken = default)
    {
        Guid inputId = request.AvailableTimeId;

        var availableTime = await _dbContext.AvailableTimes.FindAsync(inputId);

        if (availableTime is null)
        {
            return null;
        }

        return new GetByIdResponse
        (
            Id: availableTime.Id,
            StartTime: availableTime.StartTime,
            EndTime: availableTime.EndTime,
            Kindergartens: [.. availableTime.Kindergartens.Select(k => new KindergartenDto
            (
                k.Kindergarten.Name,
                k.Kindergarten.Id,
                k.Kindergarten.Location
            ))]
        );
    }
    
    #endregion
}