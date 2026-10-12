using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Vicaria.Server.Infrastructure
{
    public interface IHandler<in TRequest, TResponse>
    {
        Task<TResponse> HandleAsync(TRequest request, CancellationToken cancellationToken = default);
    }
}