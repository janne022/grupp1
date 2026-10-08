using Microsoft.EntityFrameworkCore;
using Moq;
using Moq.EntityFrameworkCore;
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