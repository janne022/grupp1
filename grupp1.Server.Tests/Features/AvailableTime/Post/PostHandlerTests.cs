using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;
using Vicaria.Server.Domain.Models;
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

        //Det som måste finnas:
        //1. StartTime
        //2. EndTime
        //3. Kindergarten
        //4. User (sub)

        //Det som ska skickas in:
        //1. StartTime
        //2. EndTime
        //3. Kindergarten

        //Det som skickas tillbaka:
        //1. Guid Id
        //2. string ErrorMessage
        //3. PostAvailableTimeStatus Status

        [Fact]
        public async Task HandleAsync_WhenKindergartenIsNull_ReturnsBadRequest()
        {
            //Arrange

            var command = new PostAvailableTimeCommand
            {
                StartTime = startTime,
                EndTime = endTime,
                Kindergartens = null,
                UserId = new Guid()
            };


            //Act
            PostAvailableTimeResponse response = await _handler.HandleAsync(command, default);


            //Assert
            Assert.Equal(PostAvailableTimeStatus.BadRequest, response.Status);
            
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

            Guid userId = new Guid();

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


    }
}
