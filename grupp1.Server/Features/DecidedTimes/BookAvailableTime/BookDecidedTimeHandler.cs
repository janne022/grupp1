using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Domain.Models;
using Vicaria.Server.Features.DecidedTimes.Book.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.DecidedTimes.Book;

public class BookDecidedTimeHandler(
    VicariaDbContext dbContext,
    ILogger<BookDecidedTimeController> _logger
) : IHandler<BookDecidedTimeQuery, BookDecidedTimeResponse>
{
    public async Task<BookDecidedTimeResponse> HandleAsync(
        BookDecidedTimeQuery query,
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation($"Starting to Create booked time. ID: {query.AvailableTimeGuid}");

        var availableTime = await dbContext.AvailableTimes
            .Include(at => at.Substitute)
            .Include(at => at.Kindergartens
                .Where(k => k.KindergartenId == query.KindergartenId))
            .ThenInclude(k => k.Kindergarten)
            .SingleOrDefaultAsync(at => at.Id == query.AvailableTimeGuid);
        if (availableTime == null)
        {
            _logger.LogWarning($"Availabletime id:{query.AvailableTimeGuid} not found");
            throw new KeyNotFoundException($"Available time {query.AvailableTimeGuid} was not found.");
        }

        var kindergarten = availableTime.Kindergartens.Single().Kindergarten; //little ugly but its a collection so idfk

        DecidedTime createdDecidedTime = new()
        {
            Id = Guid.CreateVersion7(),
            StartTime = availableTime.StartTime,
            EndTime = availableTime.EndTime,
            UserId = availableTime.UserId,
            KindergartenId = query.KindergartenId
        };

        BookDecidedTimeResponse response = new(
            Id: createdDecidedTime.Id,
            StartTime: createdDecidedTime.StartTime,
            EndTime: createdDecidedTime.EndTime,

            SubstituteInfo: new SubstituteDTO(
                Id: createdDecidedTime.UserId,
                FirstName: availableTime.Substitute.FirstName,
                LastName: availableTime.Substitute.LastName
            ),
            KindergartenInfo: new KindergartenDTO(
                Id: createdDecidedTime.KindergartenId,
                Name: kindergarten.Name,
                Location: kindergarten.Location
            )
        );

        dbContext.Remove(availableTime);
        await dbContext.AddAsync(createdDecidedTime);
        await dbContext.SaveChangesAsync();
        
        _logger.LogInformation($"Successfully created booked time. ID: {query.AvailableTimeGuid}");
        return response;
    }
}