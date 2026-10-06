using Microsoft.EntityFrameworkCore;

namespace Vicaria.Server.Domain.Models;

[PrimaryKey(nameof(KindergartenId), nameof(AvailableTimeId))]
public class KindergartenAvailableTime
{
    public Guid KindergartenId { get; set; }
    public Kindergarten Kindergarten { get; set; } = null!;
    public Guid AvailableTimeId { get; set; }
    public AvailableTime AvailableTime { get; set; } = null!;
}