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
            .RuleFor(k => k.Name, f => f.Name.LastName())
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
                var start = day.AddHours(faker.Random.Int(6, 8)); //06:00 -08:00
                var end = start.AddHours(faker.Random.Int(10, 12));//available for many hours. the shifts themselves wont be this long
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
    public static List<PendingTime> CreateFakePendingTimes(
    Faker faker, Guid managerId, Guid kindergartenId, List<AvailableTime> availableTimes)
    {
        var filteredAvailableTimes = availableTimes
            .Where(a => a.Kindergartens.Any(k => k.KindergartenId == kindergartenId))
            .ToList();

        List<PendingTime> newPendingTimes = [];

        if (filteredAvailableTimes.Count == 0)
            return newPendingTimes;

        var requestCount = faker.Random.Int(8, 14);

        foreach (var availableTime in faker.PickRandom(filteredAvailableTimes, Math.Min(requestCount, filteredAvailableTimes.Count)))
        {
            var start = availableTime.StartTime.AddHours(faker.Random.Int(0, 1));
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
                AvailableSubs = availableTimes
                    .Where(a => a.StartTime <= start
                        && a.EndTime >= end
                        && a.Kindergartens.Any(k => k.KindergartenId == kindergartenId))
                    .Select(a => a.UserId)
                    .Distinct()//<-- thanks god
                    .Select(userId => new UserPendingTime { UserId = userId, PendingTimeId = pendingTimeId })
                    .ToHashSet()
            });
        }

        return newPendingTimes;
    }
    public static List<DecidedTime> CreateFakeDecidedTimes(
        Faker faker,
        List<PendingTime> pendingTimes,
        List<User> substitutes,
        int minPerSub = 3,
        int maxPerSub = 6
    )
    {
        var target = substitutes.ToDictionary(s => s.Id, _ => faker.Random.Int(minPerSub, maxPerSub));
        var bookedCount = substitutes.ToDictionary(s => s.Id, _ => 0);
        var busyDays = new HashSet<(Guid SubId, DateOnly Day)>(); // no double booking same day

        List<DecidedTime> newDecidedTimes = [];

        foreach (var pendingTime in faker.Random.Shuffle(pendingTimes).ToList())
        {
            var day = DateOnly.FromDateTime(pendingTime.StartTime);

            var candidates = pendingTime.AvailableSubs
                .Select(s => s.UserId)
                .Where(id => target.ContainsKey(id)
                    && bookedCount[id] < target[id]
                    && !busyDays.Contains((id, day)))
                .ToList();

            if (candidates.Count == 0)
                continue;

            var lowest = candidates.Min(id => bookedCount[id]);//to make all users have times
            var subId = faker.PickRandom(candidates.Where(id => bookedCount[id] == lowest).ToList());

            bookedCount[subId]++;
            busyDays.Add((subId, day));
            pendingTime.IsBooked = true;

            newDecidedTimes.Add(new DecidedTime
            {
                Id = Guid.CreateVersion7(),
                SubstituteId = subId,
                ManagerId = pendingTime.ManagerId,
                KindergartenId = pendingTime.KindergartenId,
                PendingTimeId = pendingTime.Id,
                StartTime = pendingTime.StartTime,
                EndTime = pendingTime.EndTime
            });
        }

        return newDecidedTimes;
    }
}