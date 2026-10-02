using System;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace grupp1.Server.Infrastructure;

public class VicariaDbContext : IdentityDbContext
{
    #region constructors
    public VicariaDbContext(DbContextOptions<VicariaDbContext> options) : base(options){}

    #endregion

    #region DbSets
    #endregion

    #region Configuration
    #endregion
}
