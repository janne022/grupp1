using grupp1.Server.Infrastructure;
using Vicaria.Server.Infrastructure; // To implement IHandler

namespace Vicaria.Server.Features.AvailableTime.GetById;

public class GetByIdHandler : IHandler<GetByIdQuery, GetByIdResponse>
{
    #region Fields

    private readonly ILogger<GetByIdHandler> _logger;
    private readonly VicariaDbContext _dbContext;

    #endregion


    #region Constructors

    public GetByIdHandler(Logger<GetByIdHandler> logger, VicariaDbContext dbContext)
    {
        _logger = logger;
        _dbContext = dbContext;
    }
    
    #endregion


    #region Methods

    public Task<GetByIdResponse> HandleAsync(GetByIdQuery request, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }
    #endregion
}