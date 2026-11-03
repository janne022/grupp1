using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Domain;
using Vicaria.Server.Domain.Models;

namespace Vicaria.Server.Infrastructure;

public class VicariaDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
{
    #region constructors

    public VicariaDbContext(DbContextOptions<VicariaDbContext> options)
        : base(options) { }

    #endregion

    #region DbSets
    #endregion

    #region Configuration
    public DbSet<PendingTime> PendingTimes { get; set; }
    public DbSet<AvailableTime> AvailableTimes { get; set; }
    public DbSet<DecidedTime> DecidedTimes { get; set; }
    public DbSet<Kindergarten> Kindergartens { get; set; }
    public DbSet<KindergartenAvailableTime> KindergartenAvailableTimes { get; set; }
    public DbSet<UserKinderGarten> UserKinderGartens { get; set; }
    public DbSet<UserPendingTime> UserPendingTimes { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.HasPostgresExtension("postgis");

        builder.Entity<User>().Property(u => u.Id).ValueGeneratedNever();
        builder.Entity<User>().Property(u => u.PhoneNumber).IsRequired();

        builder
            .Entity<IdentityRole<Guid>>()
            .HasData(
                new IdentityRole<Guid>
                {
                    Id = Guid.Parse("4afc3864-9194-4417-80df-e4d78a161e71"),
                    Name = VicariaUserRoles.Substitute,
                    NormalizedName = "SUBSTITUTE",
                    ConcurrencyStamp = "SubstituteRole",
                },
                new IdentityRole<Guid>
                {
                    Id = Guid.Parse("03dbc570-7db4-4dcc-a50e-017f41dd9804"),
                    Name = VicariaUserRoles.Manager,
                    NormalizedName = "MANAGER",
                    ConcurrencyStamp = "ManagerRole",
                }
            );
    }

    #endregion
}
