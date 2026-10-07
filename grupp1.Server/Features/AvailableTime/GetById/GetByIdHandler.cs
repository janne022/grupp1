using grupp1.Server.Infrastructure; // To implement IHandler

namespace Vicaria.Server.Features.AvailableTime.GetById;

public class GetByIdHandler : IHandler<GetByIdQuery, GetByIdResponse>
{
    public Task<GetByIdResponse> HandleAsync(GetByIdQuery request, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }
}