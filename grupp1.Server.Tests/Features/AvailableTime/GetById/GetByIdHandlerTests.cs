using Moq;
using Vicaria.Server.Features.AvailableTime.GetById;
using Vicaria.Server.Infrastructure;
using Model = Vicaria.Server.Domain.Models;

namespace Vicaria.Server.Tests.AvailableTime.GetById;

public class GetByIdHandlerTests
{
    [Fact]
    public async Task HandleAsync_WhenAvailableTimeExists_ReturnsResponse()
    {
        // Arrange

        var availableTimeMock = new Model.AvailableTime()
        {
            Id = Guid.Empty,
            StartTime = new(),
            EndTime = new(),
            UserId = Guid.Empty,
            Substitute = new(),
            Kindergartens = []
        };

        var dbContextMock = new Mock<VicariaDbContext>();

        dbContextMock.Setup(context => context.AvailableTimes.FindAsync(availableTimeMock.Id))
            .ReturnsAsync(availableTimeMock);

        var handlerMock = new GetByIdHandler(dbContextMock.Object);
        
        // Act

        // Assert
    }

    [Fact]
    public async Task HandleAsync_WhenAvailableTimeDoesNotExist_ReturnsNull()
    {
        // Arrange

        // Act

        // Assert
    }

    [Fact]
    public async Task HandleAsync_WhenAvailablteTimeExists_CreatesResponseWithCorrectMembers()
    {
        // Arrange

        // Act

        // Assert
    }
}