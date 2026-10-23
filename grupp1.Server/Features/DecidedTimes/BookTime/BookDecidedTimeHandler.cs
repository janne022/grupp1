using grupp1.Server.Features.DecidedTimes.BookTime.DTOs;
using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Domain.Models;
using Vicaria.Server.Features.DecidedTimes.Book.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.DecidedTimes.Book;

public class BookDecidedTimeHandler(
    VicariaDbContext dbContext,
    ILogger<BookDecidedTimeHandler> _logger
) : IHandler<BookDecidedTimeCommand, BookDecidedTimeResponse>
{
    public async Task<BookDecidedTimeResponse> HandleAsync(
        BookDecidedTimeCommand command,
        CancellationToken cancellationToken = default)
    {
        //TODO: Consider replacing Exceptions with StatusEnums that we can handle in the controller
        //TODO: Add a time-validation for the DecidedTime (StartTime cannot be bigger than EndTime etc.)
        //TODO: Check for overlapping bookings to prevent double-booking

        _logger.LogInformation("Starting to Create booked time. ID: {command.AvailableTimeGuid}", command.AvailableTimeGuid);

        var hasAccess = await dbContext.Kindergartens.AnyAsync(k => k.Id == command.KindergartenId && k.Managers.Any(m => m.UserId == command.ManagerId), cancellationToken);

        if (!hasAccess)
        {
            _logger.LogWarning("Manager {ManagerId} does not have access to Kindergarten {KindergartenId}", command.ManagerId, command.KindergartenId);
            throw new KeyNotFoundException("Kindergarten not found");
        }


        var availableTime = await dbContext.AvailableTimes
            .Include(at => at.Substitute)
            .Include(at => at.Kindergartens
                .Where(k => k.KindergartenId == command.KindergartenId))
            .ThenInclude(k => k.Kindergarten)
            .SingleOrDefaultAsync(at => at.Id == command.AvailableTimeGuid);
        if (availableTime == null)
        {
            _logger.LogWarning("Could not find Availabletime id:{AvailableTimeGuid}", command.AvailableTimeGuid);
            throw new KeyNotFoundException($"Available time {command.AvailableTimeGuid} was not found.");
        }

        if (availableTime.Kindergartens.Single().Kindergarten == null)
        {
            _logger.LogWarning("Could not fimd Kindergarten id:{KindergartenId}", command.AvailableTimeGuid);
            throw new KeyNotFoundException($"Kindergarten id:{command.KindergartenId} was not found.");
        }

        var kindergartenInfo = await dbContext.Kindergartens.Where(k => k.Id == command.KindergartenId).Select(k => new KindergartenDTO
        (
            k.Id,
            k.Name,
            k.Location != null ? k.Location.Y : null,
            k.Location != null ? k.Location.X : null)).SingleOrDefaultAsync(cancellationToken);

        if(kindergartenInfo is null)
        {
            _logger.LogWarning("Could not fimd Kindergarten id:{KindergartenId}", command.AvailableTimeGuid);
            throw new KeyNotFoundException($"Kindergarten {command.KindergartenId} was not found");
        }


        DecidedTime createdDecidedTime = new()
        {
            Id = Guid.CreateVersion7(),
            StartTime = command.StartTime,
            EndTime = command.EndTime,
            UserId = availableTime.UserId,
            KindergartenId = command.KindergartenId,
            AvailableTimeId = command.AvailableTimeGuid
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
            KindergartenInfo: kindergartenInfo
            
        );

        await dbContext.AddAsync(createdDecidedTime);
        await dbContext.SaveChangesAsync();

        _logger.LogInformation("Successfully created booked time. ID: {AvailableTimeGuid}", command.AvailableTimeGuid);
        return response;
    }
}