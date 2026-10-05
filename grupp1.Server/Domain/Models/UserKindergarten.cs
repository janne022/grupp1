using Microsoft.EntityFrameworkCore;

namespace Vicaria.Server.Domain.Models;

[PrimaryKey(nameof(UserId), nameof(KindergartenId))]
public class UserKinderGarten
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public Guid KindergartenId { get; set; }
    public Kindergarten Kindergarten { get; set; } = null!;
}