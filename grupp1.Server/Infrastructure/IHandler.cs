using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace grupp1.Server.Infrastructure
{
    public interface IHandler<in TRequest, TResponse>
    {
        Task<TResponse> HandleAsync(TRequest request, CancellationToken cancellationToken = default);
    }
}