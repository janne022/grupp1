using Microsoft.EntityFrameworkCore;
using Moq;
using Vicaria.Server.Domain.Models;
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

        Model.User userMock = new()
        {
            Id = Guid.Parse("01a19ba1-50fe-7724-8b0f-8184172f7200"),
            FirstName = "Beren",
            LastName = "Erchamion",
            PhoneNumber = "202003"
        };

        Model.AvailableTime availableTimeMock = new()
        {
            Id = Guid.Parse("01a19ba1-50fe-7724-8b0f-84e13bc6f893"),
            StartTime = new(),
            EndTime = new(),
            UserId = userMock.Id,
            Substitute = userMock,
            Kindergartens = []
        };

        _db.Users.Add(userMock);
        _db.AvailableTimes.Add(availableTimeMock);
        await _db.SaveChangesAsync();

        GetByIdQuery query = new(availableTimeMock.Id, userMock.Id);

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

        GetByIdQuery query = new(Guid.Empty, Guid.Empty);

        // Act

        GetByIdResponse? result = await _handler.HandleAsync(query);

        // Assert

        Assert.Null(result);
    }

    [Fact]
    public async Task HandleAsync_WhenAvailableTimeExists_CreatesResponseWithCorrectMembers()
    {
        // Arrange

        Model.User userMock = new()
        {
            Id = Guid.Parse("01a19b9c-2e4c-776e-9fd7-16e9471c9399"),
            FirstName = "Lúthien",
            LastName = "Tinúviel",
            PhoneNumber = "070992"
        };

        Model.AvailableTime availableTimeMock = new()
        {
            Id = Guid.Parse("01a13ea2-cc52-75ed-9a70-9992fba8f74c"),
            StartTime = new(),
            EndTime = new(),
            UserId = userMock.Id,
            Substitute = userMock,
            Kindergartens = []
        };

        KindergartenDto[] KindergartensMock = [.. availableTimeMock.Kindergartens.Select(k => new KindergartenDto
        (
            k.Kindergarten.Name,
            k.KindergartenId,
            k.Kindergarten.Location
        ))];

        GetByIdResponse GetByIdResponseMock = new
        (
            Id: availableTimeMock.Id,
            StartTime: availableTimeMock.StartTime,
            EndTime: availableTimeMock.EndTime,
            Kindergartens: KindergartensMock
        );

        _db.Users.Add(userMock);
        _db.AvailableTimes.Add(availableTimeMock);
        await _db.SaveChangesAsync();


        GetByIdQuery query = new(availableTimeMock.Id, availableTimeMock.UserId);

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