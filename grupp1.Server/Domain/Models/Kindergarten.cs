using System.Drawing;

namespace Vicaria.Server.Domain.Models;

public class Kindergarten
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public Point Location { get; set; } /// FIXA POSTGIS
    public ICollection<UserKinderGarten> Managers { get; set; } = [];
    public ICollection<DecidedTime> DecidedTimes { get; set; } = [];
    public ICollection<KindergartenAvailableTime> KindergartenAvailableTimes { get; set; } = [];
}