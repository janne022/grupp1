using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Domain.Models;
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

    public async Task<GetByIdResponse?> HandleAsync(GetByIdQuery query, CancellationToken cancellationToken = default)
    {
        Guid inputId = query.AvailableTimeId;
        Guid userId = query.UserId;

        AvailableTime? availableTime = await _dbContext.AvailableTimes
            .AsNoTracking()
            .Where(at => at.UserId == userId)
            .FirstOrDefaultAsync(at => at.Id == inputId);

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