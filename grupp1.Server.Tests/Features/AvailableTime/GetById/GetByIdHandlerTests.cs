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

        GetByIdQuery query = new(Guid.Empty);

        // Act

        GetByIdResponse? result = await _handler.HandleAsync(query);

        // Assert

        Assert.Null(result);
    }

    [Fact]
    public async Task HandleAsync_WhenAvailableTimeExists_CreatesResponseWithCorrectMembers()
    {
        // Arrange

        var availableTimeMock = new Model.AvailableTime()
        {
            Id = Guid.Parse("01a13ea2-cc52-75ed-9a70-9992fba8f74c"),
            StartTime = new(),
            EndTime = new(),
            UserId = Guid.Empty,
            Substitute = new(),
            Kindergartens = []
        };

        var KindergartensMock = availableTimeMock.Kindergartens.Select(k => new KindergartenDto 
        (
            k.Kindergarten.Name,
            k.KindergartenId,
            k.Kindergarten.Location
        )).ToArray();

        var GetByIdResponseMock = new GetByIdResponse
        (
            Id: availableTimeMock.Id,
            StartTime: availableTimeMock.StartTime,
            EndTime: availableTimeMock.EndTime,
            Kindergartens: KindergartensMock
        );

        _db.AvailableTimes.Add(availableTimeMock);

        GetByIdQuery query = new(availableTimeMock.Id);

        // Act

        GetByIdResponse? result = await _handler.HandleAsync(query);

        // Assert

        Assert.NotNull(result);
        Assert.Equivalent(GetByIdResponseMock, result);
        Assert.Equal(GetByIdResponseMock, result);
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