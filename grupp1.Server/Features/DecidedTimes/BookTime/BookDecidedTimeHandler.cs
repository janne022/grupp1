using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Domain.Models;
using Vicaria.Server.Features.DecidedTimes.Book.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.DecidedTimes.Book;

public class BookDecidedTimeHandler(
    VicariaDbContext dbContext,
    ILogger<BookDecidedTimeHandler> _logger
) : IHandler<BookDecidedTimeQuery, BookDecidedTimeResponse>
{
    public async Task<BookDecidedTimeResponse> HandleAsync(
        BookDecidedTimeQuery query,
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Starting to Create booked time. ID: {query.AvailableTimeGuid}", query.AvailableTimeGuid);

        var availableTime = await dbContext.AvailableTimes
            .Include(at => at.Substitute)
            .Include(at => at.Kindergartens
                .Where(k => k.KindergartenId == query.KindergartenId))
            .ThenInclude(k => k.Kindergarten)
            .SingleOrDefaultAsync(at => at.Id == query.AvailableTimeGuid);
        if (availableTime == null)
        {
            _logger.LogWarning("Could not find Availabletime id:{AvailableTimeGuid}", query.AvailableTimeGuid);
            throw new KeyNotFoundException($"Available time {query.AvailableTimeGuid} was not found.");
        }

        if (availableTime.Kindergartens.Single().Kindergarten == null)
        {
            _logger.LogWarning("Could not fimd Kindergarten id:{KindergartenId}", query.AvailableTimeGuid);
            throw new KeyNotFoundException($"Kindergarten id:{query.KindergartenId} was not found.");
        }

        DecidedTime createdDecidedTime = new()
        {
            Id = Guid.CreateVersion7(),
            StartTime = availableTime.StartTime,
            EndTime = availableTime.EndTime,
            UserId = availableTime.UserId,
            KindergartenId = query.KindergartenId,
            AvailableTimeId = query.AvailableTimeGuid
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
                Name: availableTime.Kindergartens.Single().Kindergarten.Name, //very ugly
                Location: availableTime.Kindergartens.Single().Kindergarten.Location
            )
        );

        await dbContext.AddAsync(createdDecidedTime);
        await dbContext.SaveChangesAsync();

        _logger.LogInformation("Successfully created booked time. ID: {AvailableTimeGuid}", query.AvailableTimeGuid);
        return response;
    }
}