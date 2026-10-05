using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Vicaria.Server.Domain.Models;

public class User : IdentityUser<Guid>
{
    public User()
    {
        Id = Guid.CreateVersion7();
        SecurityStamp = Guid.NewGuid().ToString();
    }
    [MaxLength(200)]
    public string FirstName { get; set; } = null!;
    [MaxLength(200)]
    public string LastName { get; set; } = null!;
    public ICollection<UserKinderGarten> Kindergartens { get; set; } = [];
    public ICollection<AvailableTime> AvailableTimes { get; set; } = [];
    public ICollection<DecidedTime> DecidedTimes { get; set; } = [];
}