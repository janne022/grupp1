using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Vicaria.Server.Domain.Models;
using Vicaria.Server.Features.PendingTimes.Delete;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Tests.PendingTimeTests.DeletePendingTime
{
    public class DeletePendingTimeHandlerTests
    {
        private readonly VicariaDbContext _db;
        private readonly DeletePendingTimeHandler _handler;

        public DeletePendingTimeHandlerTests()
        {
            var options = new DbContextOptionsBuilder<VicariaDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _db = new VicariaDbContext(options);

            var loggerMock = new Mock<ILogger<DeletePendingTimeHandler>>();
            _handler = new DeletePendingTimeHandler(loggerMock.Object, _db);
        }

        [Fact]
        public async Task HandleAsync_ShouldDeletePendingTime_WhenPendingTimeExists()
        {
            // Arrange
            var pendingTime = new PendingTime
            {
                Id = Guid.NewGuid(),
                ManagerId = Guid.NewGuid(),
                StartTime = DateTime.UtcNow,
                EndTime = DateTime.UtcNow.AddHours(1)
            };

            _db.PendingTimes.Add(pendingTime);
            await _db.SaveChangesAsync();

            var command = new DeletePendingTimeCommand(pendingTime.Id, pendingTime.ManagerId);

            // Act
            var result = await _handler.HandleAsync(command);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.Equal(0, await _db.PendingTimes.CountAsync());
        }

        [Fact]
        public async Task HandleAsync_ShouldFail_WhenPendingTimeDoesNotExist()
        {
            // Arrange
            var command = new DeletePendingTimeCommand(Guid.NewGuid(), Guid.NewGuid());

            // Act
            var result = await _handler.HandleAsync(command);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal(0, await _db.PendingTimes.CountAsync());
        }
    }
}