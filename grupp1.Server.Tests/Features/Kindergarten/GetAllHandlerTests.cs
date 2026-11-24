using Microsoft.EntityFrameworkCore;
using Moq;
using Vicaria.Server.Domain.Models;
using Vicaria.Server.Features.AvailableTimes.GetById;
using Vicaria.Server.Features.Kindergarten.GetAll;
using Vicaria.Server.Infrastructure;
using Model = Vicaria.Server.Domain.Models;

namespace Vicaria.Server.Tests.KindergartenTests.GetAll;

public class GetAllHandlerTests
{
    private readonly VicariaDbContext _db;
    private readonly GetAllKindergartensHandler _handler;

    public GetAllHandlerTests()
    {
        _db = CreateInMemoryDbContext();
        _handler = new GetAllKindergartensHandler(_db);
    }

    [Fact]
    public async Task HandleAsync_WhenKindergartensExist_ReturnsResponse()
    {
        // Arrange

        Model.Kindergarten kindergartensMock = new()
        {
            Id = Guid.NewGuid(),
            Name = "Test Kindergarten",
            Location = new NetTopologySuite.Geometries.Point(10, 20) { SRID = 4326 }
        };

        _db.Kindergartens.Add(kindergartensMock);

        await _db.SaveChangesAsync();

        GetAllKindergartensRequest query = new();

        // Act

        GetAllKindergartensResponse? result = await _handler.HandleAsync(query, CancellationToken.None);

        // Assert

        Assert.NotNull(result);
        Assert.IsType<GetAllKindergartensResponse>(result);
        Assert.Single(result.Kindergartens);
        Assert.Equal("Test Kindergarten", result.Kindergartens.First().Name);

    }

    private static VicariaDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<VicariaDbContext>()
            .UseInMemoryDatabase(Guid.CreateVersion7().ToString())
            .Options;

        return new VicariaDbContext(options);
    }
}