using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Domain.Models;

namespace Vicaria.Server.Infrastructure;

public class VicariaDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
{
    #region constructors

    public VicariaDbContext(DbContextOptions<VicariaDbContext> options) : base(options) { }

    #endregion

    #region DbSets
    #endregion

    #region Configuration
    public DbSet<AvailableTime> AvailableTimes { get; set; }
    public DbSet<DecidedTime> DecidedTimes { get; set; }
    public DbSet<Kindergarten> Kindergartens { get; set; }
    public DbSet<KindergartenAvailableTime> KindergartenAvailableTimes { get; set; }
    public DbSet<UserKinderGarten> UserKinderGartens { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.HasPostgresExtension("postgis");

        builder.Entity<User>()
            .Property(u => u.Id)
            .ValueGeneratedNever();
    }

    #endregion
}
