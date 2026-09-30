using System;
using Microsoft.EntityFrameworkCore;

namespace grupp1.Server.Infrastructure;

public class Context : DbContext
{
    public Context(DbContextOptions<Context> options) : base(options)
    {

    }
}
