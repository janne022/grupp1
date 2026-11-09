using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Vicaria.Server.Features.AvailableTimes.Post;
using Vicaria.Server.Infrastructure;
using Model = Vicaria.Server.Domain.Models;


namespace Vicaria.Server.Tests.Features.AvailableTime.Post
{
    public class PostHandlerTests
    {
        private readonly VicariaDbContext _db;
        private readonly PostAvailableTimeHandler _handler;

        private static readonly DateTime startTime = new(2026, 11, 5, 8, 0, 0);
        private static readonly DateTime endTime = new(2026, 11, 5, 16, 0, 0);
        
        public PostHandlerTests()
        {
            _db = CreateInMemoryDbContext();
            _handler = new PostAvailableTimeHandler(_db, NullLogger<PostAvailableTimeHandler>.Instance);
        }

        private static VicariaDbContext CreateInMemoryDbContext()
        {
            DbContextOptions<VicariaDbContext> options = new DbContextOptionsBuilder<VicariaDbContext>()
                .UseInMemoryDatabase(Guid.CreateVersion7().ToString())
                .Options;

            return new VicariaDbContext(options);
        }


        [Fact]
        public async Task HandleAsync_WhenKindergartenDoesNotExist_ReturnsNotFound()
        {
            //Arrange
            var command = new PostAvailableTimeCommand
            {
                StartTime = startTime,
                EndTime = endTime,
                Kindergartens = [Guid.NewGuid()],
                UserId = Guid.NewGuid()
            };


            //Act
            PostAvailableTimeResponse response = await _handler.HandleAsync(command, default);


            //Assert
            Assert.Equal(PostAvailableTimeStatus.NotFound, response.Status);
            Assert.Empty(_db.AvailableTimes);

        }


        [Fact]
        public async Task HandleAsync_WhenRequestIsValid_CreatesAvailableTime()
        {

            //Arrange
            Model.Kindergarten mockKindergarten = new()
            {
                Id = Guid.NewGuid(),
                Name = "Solrosen",
                Managers = []
            };

            _db.Kindergartens.Add(mockKindergarten);
            await _db.SaveChangesAsync();

            Guid userId = Guid.NewGuid();

            var command = new PostAvailableTimeCommand
            {
                StartTime = startTime,
                EndTime = endTime,
                Kindergartens = [mockKindergarten.Id],
                UserId = userId
            };


            //Act
            PostAvailableTimeResponse response = await _handler.HandleAsync(command, default);


            //Assert
            Assert.Equal(PostAvailableTimeStatus.Ok, response.Status);
            Assert.Single(_db.AvailableTimes.Where(at => at.UserId == userId));
        }


        [Theory]
        [InlineData(8, 8)]
        [InlineData(16, 8)]
        public async Task HandleAsync_WhenEndTimeIsNotAfterStartTime_ReturnsBadRequest(int startHour, int endHour)
        {
            // Arrange
            Model.Kindergarten mockKindergarten = new()
            {
                Id = Guid.NewGuid(),
                Name = "Solrosen",
                Managers = []
            };

            _db.Kindergartens.Add(mockKindergarten);
            await _db.SaveChangesAsync();

            var command = new PostAvailableTimeCommand
            {
                StartTime = new DateTime(2026, 11, 5, startHour, 0, 0),
                EndTime = new DateTime(2026, 11, 5, endHour, 0, 0),
                Kindergartens = [mockKindergarten.Id],
                UserId = Guid.NewGuid()
            };

            // Act
            PostAvailableTimeResponse response = await _handler.HandleAsync(command, default);

            // Assert
            Assert.Equal(PostAvailableTimeStatus.BadRequest, response.Status);
            Assert.Empty(_db.AvailableTimes);
        }


        [Fact]
        public async Task HandleAsync_WhenOverlappingTimeForSameKindergarten_ReturnsConflict()
        {
            // Arrange
            Guid userId = Guid.NewGuid();

            Model.Kindergarten mockKindergarten = new()
            {
                Id = Guid.NewGuid(),
                Name = "Solrosen",
                Managers = []
            };

            _db.Kindergartens.Add(mockKindergarten);

            Model.AvailableTime existingTime = new()
            {
                Id = Guid.NewGuid(),
                StartTime = startTime,
                EndTime = endTime,
                Kindergartens = [new Model.KindergartenAvailableTime { KindergartenId = mockKindergarten.Id }],
                UserId = userId
            };

            _db.AvailableTimes.Add(existingTime);
            await _db.SaveChangesAsync();

            var command = new PostAvailableTimeCommand
            {
                StartTime = startTime.AddHours(4),
                EndTime = endTime.AddHours(4),
                Kindergartens = [mockKindergarten.Id],
                UserId = userId
            };

            // Act
            PostAvailableTimeResponse response = await _handler.HandleAsync(command, default);

            // Assert
            Assert.Equal(PostAvailableTimeStatus.Conflict, response.Status);
            Assert.Equal(1, await _db.AvailableTimes.CountAsync());
        }

    }
}
