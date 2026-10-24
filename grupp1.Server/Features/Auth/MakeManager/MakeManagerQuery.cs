using System.Security.Claims;

namespace grupp1.Server.Features.Auth.MakeManager;

public record MakeManagerQuery(ClaimsPrincipal User);
