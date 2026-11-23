using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Vicaria.Server.Domain.Models;
using Vicaria.Server.Features.Kindergarten.AddManagerToKindergarten;
using Vicaria.Server.Features.Kindergarten.AddManagerToKindergarten.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Tests.Kindergarten.AddManagerTokindergarten;

public class AddManagerToKindergartenTests
{
    private readonly VicariaDbContext _dbContext;
    private readonly AddManagerToKindergartenHandler _handler;

    public AddManagerToKindergartenTests()
    {
        _dbContext = CreateInMemoryDbContext();
        _handler = new AddManagerToKindergartenHandler(_dbContext, NullLogger<AddManagerToKindergartenHandler>.Instance);
    }

    private static VicariaDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<VicariaDbContext>()
            .UseInMemoryDatabase(Guid.CreateVersion7().ToString())
            .Options;

        var db = new VicariaDbContext(options);
        db.Database.EnsureCreated(); //for roles
        return db;
    }

    [Fact]
    public async Task HandleAsync_ManagerDoesNotHaveKindergarten_ReturnsOk()
    {
        User userMock = new()
        {
            Id = Guid.CreateVersion7(),
            FirstName = "Johnny",
            LastName = "Larsson",
            PhoneNumber = "12039190281028"
        };

        Domain.Models.Kindergarten mockKindergarten = new()
        {
            Id = Guid.CreateVersion7(),
            Name = "Korven",
        };

        _dbContext.Users.Add(userMock);
        _dbContext.UserRoles.Add(new IdentityUserRole<Guid>
        {
            UserId = userMock.Id,
            RoleId = Guid.Parse("03dbc570-7db4-4dcc-a50e-017f41dd9804")
        });
        _dbContext.Kindergartens.Add(mockKindergarten);

        await _dbContext.SaveChangesAsync();

        AddManagerToKindergartenCommand command = new(UserId: userMock.Id, mockKindergarten.Id);

        var result = await _handler.HandleAsync(command);

        Assert.False(result.IsError);

        var kindergarten = await _dbContext.Kindergartens
            .Include(k => k.Managers)
            .SingleAsync(k => k.Id == mockKindergarten.Id);

        Assert.Contains(kindergarten.Managers, m => m.UserId == userMock.Id);
    }
    [Fact]
    public async Task HandleAsync_ManagerAlreadyApartOfKindergarten_ReturnsConflict()
    {
        User userMock = new()
        {
            Id = Guid.CreateVersion7(),
            FirstName = "Johnny",
            LastName = "Larsson",
            PhoneNumber = "12039190281028"
        };

        Domain.Models.Kindergarten mockKindergarten = new()
        {
            Id = Guid.CreateVersion7(),
            Name = "Korven",
        };

        _dbContext.Users.Add(userMock);
        _dbContext.UserRoles.Add(new IdentityUserRole<Guid>
        {
            UserId = userMock.Id,
            RoleId = Guid.Parse("03dbc570-7db4-4dcc-a50e-017f41dd9804")
        });
        _dbContext.Kindergartens.Add(mockKindergarten);
        _dbContext.UserKinderGartens.Add(new UserKinderGarten
        {
            UserId = userMock.Id,
            KindergartenId = mockKindergarten.Id
        });

        await _dbContext.SaveChangesAsync();

        AddManagerToKindergartenCommand command = new(UserId: userMock.Id, mockKindergarten.Id);

        var result = await _handler.HandleAsync(command);

        Assert.True(result.IsError);
        Assert.Equivalent("Kindergarten.AlreadyManaged", result.FirstError.Code);

    }
}