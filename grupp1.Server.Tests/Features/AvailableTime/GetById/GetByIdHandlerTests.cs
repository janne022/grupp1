using Microsoft.EntityFrameworkCore;
using Moq;
using Vicaria.Server.Features.AvailableTimes.GetById;
using Vicaria.Server.Infrastructure;
using Model = Vicaria.Server.Domain.Models;

namespace Vicaria.Server.Tests.AvailableTime.GetById;

public class GetByIdHandlerTests
{
    #region Fields

    private readonly VicariaDbContext _db;
    private readonly GetByIdHandler _handler;

    #endregion
    #region Constructors

    public GetByIdHandlerTests()
    {
        _db = CreateInMemoryDbContext();
        _handler = new GetByIdHandler(_db);
    }

    #endregion
    #region Tests

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

        _db.AvailableTimes.Add(availableTimeMock);

        GetByIdQuery query = new(availableTimeMock.Id);

        // Act

        GetByIdResponse? result = await _handler.HandleAsync(query);

        // Assert

        Assert.NotNull(result);
        Assert.IsType<GetByIdResponse>(result);

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

    #endregion
    #region Helper methods

    private static VicariaDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<VicariaDbContext>()
            .UseInMemoryDatabase(Guid.CreateVersion7().ToString())
            .Options;

        return new VicariaDbContext(options);
    }

    #endregion
}