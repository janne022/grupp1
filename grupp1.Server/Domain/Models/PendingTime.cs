using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vicaria.Server.Domain.Models;

public class PendingTime
{
    public Guid Id { get; set; }
    public bool IsBooked { get; set; }
    public Guid KindergartenId { get; set; }
    public Kindergarten Kindergarten { get; set; } = null!;
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public HashSet<UserPendingTime> Users { get; set; } = null!;
}