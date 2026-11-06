using System.Runtime.CompilerServices;
using Bogus;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using NetTopologySuite.Geometries;
using Vicaria.Server.Domain.Models;

public static class SeedFakers
{
    public const string defaultTestPassword = "Abc123!!"; //nice
    private static string passwordHash =
        new PasswordHasher<User>().HashPassword(null!, defaultTestPassword);

    public static Faker<Kindergarten> CreateFakeKindergartens()
    {
        return new Faker<Kindergarten>("sv")
            .RuleFor(k => k.Id, _ => Guid.CreateVersion7())
            .RuleFor(k => k.Name, f => $"Förskolan {f.Name.LastName()}")
            .RuleFor(k => k.Location, f => new Point(
                f.Random.Double(17, 19),
                f.Random.Double(55, 65)
            ))
            .RuleFor(k => k.Managers, _ => []); //tom 
    }
    public static Faker<User> CreateFakeUsers()
    {
        return new Faker<User>("sv")//i couldnt login if i didnt have all these fucking fields
            .RuleFor(u => u.FirstName, f => f.Name.FirstName())
            .RuleFor(u => u.LastName, f => f.Name.LastName())
            .RuleFor(u => u.Email, (f, u) => f.Internet.Email(u.FirstName, u.LastName))
            .RuleFor(u => u.UserName, (f, u) => u.Email)
            .RuleFor(u => u.NormalizedUserName, (f, u) => u.Email!.ToUpperInvariant())
            .RuleFor(u => u.NormalizedEmail, (f, u) => u.Email!.ToUpperInvariant())
            .RuleFor(u => u.EmailConfirmed, _ => true)
            .RuleFor(u => u.SecurityStamp, _ => Guid.NewGuid().ToString())
            .RuleFor(u => u.PhoneNumber, f => f.Phone.PhoneNumber())
            .RuleFor(u => u.PasswordHash, _ => passwordHash);
    }
    public static User CreateKnownFakeUser(string firstName, string lastName, string email, string phoneNumber)
    {
        return new User
        {
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            UserName = email,
            NormalizedUserName = email.ToUpperInvariant(),
            NormalizedEmail = email.ToUpperInvariant(),
            EmailConfirmed = true,
            SecurityStamp = Guid.NewGuid().ToString(),
            PhoneNumber = phoneNumber,
            PasswordHash = passwordHash
        };
    }
    public static List<AvailableTime> CreateFakeAvailableTimes(
        Faker faker, List<User> substitutes, List<Kindergarten> kindergartens
    )
    {
        List<AvailableTime> newAvailableTimes = [];
        foreach (var substitute in substitutes)
        {
            var day = new DateTime(2026, 11, 1, 0, 0, 0, DateTimeKind.Utc);//first of november
            for (int i = 0; i < 60; i++)//ish 2 months of data
            {
                var start = day.AddHours(faker.Random.Int(6, 10)); //06:00 -10:00
                var end = start.AddHours(faker.Random.Int(7, 9));//7-9 hour shift
                var availableTimeId = Guid.CreateVersion7();

                newAvailableTimes.Add(new AvailableTime
                {
                    Id = availableTimeId,
                    UserId = substitute.Id,
                    StartTime = start,
                    EndTime = end,
                    Kindergartens = faker.PickRandom(kindergartens, faker.Random.Int(1, 3))
                        .Select(k => new KindergartenAvailableTime
                        {
                            KindergartenId = k.Id,
                            AvailableTimeId = availableTimeId
                        })
                        .ToHashSet()
                });

                day = day.AddDays(1);
            }
        }

        return newAvailableTimes;
    }
    public static List<DecidedTime> CreateFakeDecidedTimes(
        Faker faker, List<AvailableTime> availableTimes
    )
    {
        List<DecidedTime> newDecidedTimes = [];
        foreach (var availableTime in availableTimes)
        {
            if (!faker.Random.Bool(0.3f))
                continue;//only 1/3 gets booked.

            var kindergartenId = faker.PickRandom(availableTime.Kindergartens.ToList()).KindergartenId;

            newDecidedTimes.Add(new DecidedTime
            {
                Id = Guid.CreateVersion7(),
                UserId = availableTime.UserId,
                KindergartenId = kindergartenId,
                AvailableTimeId = availableTime.Id,
                StartTime = availableTime.StartTime,
                EndTime = availableTime.EndTime
            });
        }

        return newDecidedTimes;
    }
    public static List<PendingTime> CreateFakePendingTimes(
        Faker faker, Guid managerId, Guid kindergartenId,
        List<AvailableTime> availableTimes, List<DecidedTime> decidedTimes
    )
    {
        var bookedIds = decidedTimes.Select(d => d.AvailableTimeId).ToHashSet();
        var firstDay = new DateTime(2026, 11, 1, 0, 0, 0, DateTimeKind.Utc);//first of november

        List<PendingTime> newPendingTimes = [];
        var days = faker.PickRandom(Enumerable.Range(0, 60), faker.Random.Int(2, 5));//2-5 requests per manager and kindergarten

        foreach (var dayOffset in days)
        {
            var start = firstDay.AddDays(dayOffset).AddHours(faker.Random.Int(7, 9));//07:00  - 09:00
            var end = start.AddHours(faker.Random.Int(6, 8));
            var pendingTimeId = Guid.CreateVersion7();

            newPendingTimes.Add(new PendingTime
            {
                Id = pendingTimeId,
                IsBooked = false,
                KindergartenId = kindergartenId,
                ManagerId = managerId,
                StartTime = start,
                EndTime = end,
                AvailableSubs = availableTimes //subs who are free free the whole shift, offered this kindergarten and not already booked
                    .Where(a => !bookedIds.Contains(a.Id)//not already booked
                        && a.StartTime <= start
                        && a.EndTime >= end
                        && a.Kindergartens.Any(k => k.KindergartenId == kindergartenId))
                    .Select(a => new UserPendingTime
                    {
                        UserId = a.UserId,
                        PendingTimeId = pendingTimeId
                    })
                    .ToHashSet()
            });


        }

        return newPendingTimes;
    }
}