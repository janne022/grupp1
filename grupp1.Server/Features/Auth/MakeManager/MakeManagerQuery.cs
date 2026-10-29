using System.Security.Claims;

namespace Vicaria.Server.Features.Auth.MakeManager;

public record MakeManagerQuery(ClaimsPrincipal User);
