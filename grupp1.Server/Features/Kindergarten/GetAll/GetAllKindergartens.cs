using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using grupp1.Server.Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace grupp1.Server.Features.Kindergarten.GetAll
{
    public sealed class GetAllKindergartensHandler : IHandler<GetAllKindergartensRequest, GetAllKindergartensResponse>
    {

    }

    [ApiController]
    [Route("api/kindergartens")]
    public sealed class GetAllKindergartensController()
    {
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            
        }
    }

    public class GetAllKindergartensResponse
    {
    }

    public class GetAllKindergartensRequest
    {
    }
}