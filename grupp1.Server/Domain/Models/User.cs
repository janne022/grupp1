using Microsoft.AspNetCore.Identity;

namespace Vicaria.Server.Domain.Models;

public class User : IdentityUser
{
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public ICollection<UserKinderGarten> Kindergartens { get; set; } = [];
    public ICollection<AvailableTime> AvailableTimes { get; set; } = [];
    public ICollection<DecidedTime> DecidedTimes { get; set; } = [];
}